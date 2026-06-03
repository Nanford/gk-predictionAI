import { createHash } from "node:crypto";
import { Prisma, SubjectType } from "../generated/prisma/client.js";
import { prisma } from "../db/client.js";
import {
  calculatePrediction,
  chooseRepresentativeGroup,
  type PredictionScope
} from "../domain/prediction-engine.js";

const DISCLAIMER =
  "本系统基于公开历史录取数据、位次变化、招生计划变化和 AI 分析模型生成预测结果，仅作为高考志愿填报辅助参考。最终填报请以所在省教育考试院、高校招生章程、官方招生计划和本人实际决策为准。";

const includeDemos = process.env.NODE_ENV !== "production";
const eligibleHistoryWhere: Prisma.AdmissionHistoryWhereInput = includeDemos
  ? { OR: [{ verification: "verified" }, { isDemo: true }] }
  : { verification: "verified", isDemo: false };

const planChangeRate = (history: Array<{ year: number; planCount: number | null }>): number => {
  const latest = [...history].sort((left, right) => right.year - left.year);
  const current = latest[0]?.planCount;
  const previous = latest[1]?.planCount;
  return current && previous ? (current - previous) / previous : 0;
};

const sourceItems = (
  history: Array<{ year: number; source: { name: string; url: string }; isDemo: boolean }>
) =>
  [...new Map(history.map((item) => [`${item.source.url}:${item.year}`, {
    name: item.source.name,
    year: item.year,
    url: item.source.url
  }])).values()];

const formatPrediction = (
  scope: PredictionScope,
  history: Array<{
    year: number;
    minScore: number | null;
    minRank: number | null;
    avgScore: number | null;
    avgRank: number | null;
    planCount: number | null;
    isDemo: boolean;
    source: { name: string; url: string };
  }>,
  rank: number
) => {
  const result = calculatePrediction({
    rank,
    scope,
    history,
    planChangeRate: planChangeRate(history)
  });
  const warnings = [...result.warnings];
  if (history.some((item) => item.isDemo)) {
    warnings.push("当前展示开发验证样例，正式使用前请导入并审核公开数据。");
  }
  return {
    ...result,
    history: [...history].sort((left, right) => right.year - left.year),
    sourceItems: sourceItems(history),
    warnings,
    disclaimer: DISCLAIMER
  };
};

export const searchUniversities = async (subjectType: SubjectType, rank: number) => {
  const universities = await prisma.university.findMany({
    where: { provinceName: "广东省", groups: { some: { subjectType } } },
    include: {
      groups: {
        where: {
          subjectType,
          admissionHistory: { some: { ...eligibleHistoryWhere, majorId: null } }
        },
        include: {
          admissionHistory: {
            where: { ...eligibleHistoryWhere, majorId: null },
            include: { source: true }
          }
        }
      }
    },
    orderBy: { name: "asc" }
  });

  return universities.flatMap((university) => {
    const candidates = university.groups.flatMap((group) => {
      const latest = [...group.admissionHistory].sort((left, right) => right.year - left.year)[0];
      return latest?.minRank
        ? [{ id: group.id, code: group.code, subjectType, minRank: latest.minRank }]
        : [];
    });
    const representative = chooseRepresentativeGroup(candidates, subjectType);
    const group = university.groups.find((item) => item.id === representative?.id);
    if (!group) return [];
    return [{
      id: university.id,
      code: university.code,
      name: university.name,
      city: university.city,
      levelTags: university.levelTags,
      representativeGroup: { id: group.id, code: group.code, name: group.name },
      ...formatPrediction("university-min-threshold", group.admissionHistory, rank)
    }];
  });
};

export const getUniversityDetail = async (universityId: number, subjectType: SubjectType) => {
  const university = await prisma.university.findUniqueOrThrow({
    where: { id: universityId },
    include: {
      groups: {
        where: {
          subjectType,
          admissionHistory: { some: { ...eligibleHistoryWhere, majorId: null } }
        },
        include: {
          admissionHistory: {
            where: { ...eligibleHistoryWhere, majorId: null },
            include: { source: true }
          },
          groupMajors: {
            include: {
              major: true
            }
          }
        }
      }
    }
  });

  return {
    id: university.id,
    code: university.code,
    name: university.name,
    city: university.city,
    levelTags: university.levelTags,
    officialUrl: university.officialUrl,
    groups: university.groups.map((group) => ({
      id: group.id,
      code: group.code,
      name: group.name,
      subjectRequirements: group.subjectRequirements,
      history: group.admissionHistory,
      majors: group.groupMajors.map(({ major }) => ({
        id: major.id,
        code: major.code,
        name: major.name,
        category: major.category
      }))
    })),
    disclaimer: DISCLAIMER
  };
};

interface CreatePredictionInput {
  userId: number;
  year: number;
  provinceCode: string;
  subjectType: SubjectType;
  score?: number;
  rank: number;
  universityId: number;
  groupId?: number;
  majorId?: number;
}

export const createUniversityPrediction = async (input: CreatePredictionInput) => {
  const university = await prisma.university.findUniqueOrThrow({
    where: { id: input.universityId },
    include: {
      groups: {
        where: { subjectType: input.subjectType },
        include: {
          admissionHistory: {
            where: { ...eligibleHistoryWhere, majorId: null },
            include: { source: true }
          }
        }
      }
    }
  });
  const candidates = university.groups.flatMap((group) => {
    const latest = [...group.admissionHistory].sort((left, right) => right.year - left.year)[0];
    return latest?.minRank
      ? [{ id: group.id, code: group.code, subjectType: input.subjectType, minRank: latest.minRank }]
      : [];
  });
  const representative = chooseRepresentativeGroup(candidates, input.subjectType);
  const group = university.groups.find((item) => item.id === representative?.id);
  if (!group) throw new Error("No eligible university group with verified history");
  return persistPrediction(input, "university-min-threshold", university.name, group.id, undefined, group.admissionHistory);
};

export const createMajorPrediction = async (input: CreatePredictionInput) => {
  if (!input.groupId || !input.majorId) throw new Error("groupId and majorId are required");
  const university = await prisma.university.findUniqueOrThrow({ where: { id: input.universityId } });
  const history = await prisma.admissionHistory.findMany({
    where: {
      ...eligibleHistoryWhere,
      universityId: input.universityId,
      groupId: input.groupId,
      majorId: input.majorId,
      subjectType: input.subjectType
    },
    include: { source: true }
  });
  return persistPrediction(input, "major", university.name, input.groupId, input.majorId, history);
};

const persistPrediction = async (
  input: CreatePredictionInput,
  scope: PredictionScope,
  universityName: string,
  groupId: number,
  majorId: number | undefined,
  history: Array<{
    year: number;
    minScore: number | null;
    minRank: number | null;
    avgScore: number | null;
    avgRank: number | null;
    planCount: number | null;
    isDemo: boolean;
    source: { name: string; url: string };
  }>
) => {
  const province = await prisma.province.findUniqueOrThrow({ where: { code: input.provinceCode } });
  const formatted = formatPrediction(scope, history, input.rank);
  const contextHash = createHash("sha256")
    .update(JSON.stringify({ ...input, scope, groupId, majorId, probability: formatted.probability }))
    .digest("hex");
  const existing = await prisma.predictionRecord.findFirst({
    where: { userId: input.userId, contextHash },
    orderBy: { createdAt: "desc" }
  });
  if (existing) {
    return { id: existing.id, universityName, groupId, majorId, reused: true, ...formatted };
  }
  const record = await prisma.predictionRecord.create({
    data: {
      userId: input.userId,
      provinceId: province.id,
      universityId: input.universityId,
      groupId,
      majorId,
      year: input.year,
      subjectType: input.subjectType,
      score: input.score,
      rank: input.rank,
      scope: scope === "university-min-threshold" ? "university_min_threshold" : scope,
      probability: formatted.probability,
      probabilityLow: formatted.probabilityLow,
      probabilityHigh: formatted.probabilityHigh,
      riskLabel: formatted.riskLabel,
      confidenceLevel: formatted.confidenceLevel,
      contextHash
    }
  });
  return { id: record.id, universityName, groupId, majorId, ...formatted };
};

export const getPredictionExplanationContext = async (predictionId: number, userId: number) => {
  const prediction = await prisma.predictionRecord.findFirstOrThrow({
    where: { id: predictionId, userId },
    include: { university: true }
  });
  const history = await prisma.admissionHistory.findMany({
    where: {
      ...eligibleHistoryWhere,
      universityId: prediction.universityId,
      groupId: prediction.groupId,
      majorId: prediction.majorId
    },
    include: { source: true }
  });
  return {
    prediction,
    context: {
      predictionId,
      universityName: prediction.university.name,
      rank: prediction.rank,
      probability: prediction.probability,
      probabilityLow: prediction.probabilityLow,
      probabilityHigh: prediction.probabilityHigh,
      riskLabel: prediction.riskLabel,
      confidenceLevel: prediction.confidenceLevel,
      history: history.map((item) => ({ year: item.year, minRank: item.minRank })),
      sourceItems: sourceItems(history)
    }
  };
};
