import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, SubjectType, VerificationStatus } from "../src/generated/prisma/client.js";

const url = new URL(process.env.DATABASE_URL ?? "");
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, "")
  })
});

const DISCLAIMER =
  "本系统基于公开历史录取数据、位次变化、招生计划变化和 AI 分析模型生成预测结果，仅作为高考志愿填报辅助参考。最终填报请以所在省教育考试院、高校招生章程、官方招生计划和本人实际决策为准。";

const universities = [
  { code: "4144010558", name: "中山大学", city: "广州市", tags: ["985", "211", "双一流"], baseRank: 7800 },
  { code: "4144010559", name: "暨南大学", city: "广州市", tags: ["211", "双一流"], baseRank: 16800 },
  { code: "4144010561", name: "华南理工大学", city: "广州市", tags: ["985", "211", "双一流"], baseRank: 10200 },
  { code: "4144010574", name: "华南师范大学", city: "广州市", tags: ["211", "双一流"], baseRank: 24500 },
  { code: "4144010590", name: "深圳大学", city: "深圳市", tags: ["综合类"], baseRank: 27800 },
  { code: "4144011845", name: "广东工业大学", city: "广州市", tags: ["理工类"], baseRank: 40500 }
];

const majorTemplates = [
  { code: "CS", name: "计算机科学与技术", rankFactor: 0.72 },
  { code: "EE", name: "电气工程及其自动化", rankFactor: 0.86 },
  { code: "BA", name: "工商管理", rankFactor: 1.08 }
];

const groupHistory = (baseRank: number) => [
  { year: 2023, minRank: Math.round(baseRank * 0.94), minScore: 612, planCount: 95 },
  { year: 2024, minRank: Math.round(baseRank * 0.98), minScore: 615, planCount: 100 },
  { year: 2025, minRank: baseRank, minScore: 618, planCount: 105 }
];

const upsertHistory = async (data: {
  provinceId: number;
  universityId: number;
  groupId: number | null;
  majorId: number | null;
  year: number;
  batch: string;
  subjectType: SubjectType;
  minScore: number;
  minRank: number;
  planCount: number;
  sourceId: number;
}) => {
  const where = {
    provinceId: data.provinceId,
    universityId: data.universityId,
    groupId: data.groupId,
    majorId: data.majorId,
    year: data.year,
    batch: data.batch,
    subjectType: data.subjectType
  };
  const existing = await prisma.admissionHistory.findFirst({ where });
  const record = {
    ...data,
    verification: VerificationStatus.draft,
    isDemo: true
  };
  return existing
    ? prisma.admissionHistory.update({ where: { id: existing.id }, data: record })
    : prisma.admissionHistory.create({ data: record });
};

try {
  const province = await prisma.province.upsert({
    where: { code: "44" },
    update: {},
    create: {
      code: "44",
      name: "广东省",
      examMode: "3+1+2",
      scoreTotal: 750
    }
  });
  await prisma.provinceRule.upsert({
    where: { provinceId_year_batch: { provinceId: province.id, year: 2026, batch: "本科批" } },
    update: { ruleSummary: DISCLAIMER },
    create: {
      provinceId: province.id,
      year: 2026,
      batch: "本科批",
      ruleSummary: DISCLAIMER
    }
  });
  const source = await prisma.dataSource.upsert({
    where: { url: "demo://guangdong-six-universities" },
    update: {},
    create: {
      name: "广东六校开发验证样例",
      url: "demo://guangdong-six-universities",
      publisher: "本地开发种子",
      verification: VerificationStatus.draft
    }
  });

  for (const universityInput of universities) {
    const university = await prisma.university.upsert({
      where: { code: universityInput.code },
      update: { levelTags: universityInput.tags, officialUrl: "https://eea.gd.gov.cn/" },
      create: {
        code: universityInput.code,
        name: universityInput.name,
        authority: "公开高校名单",
        provinceName: "广东省",
        city: universityInput.city,
        educationLevel: "本科",
        levelTags: universityInput.tags,
        officialUrl: "https://eea.gd.gov.cn/"
      }
    });
    const group = await prisma.universityGroup.upsert({
      where: {
        universityId_code_subjectType: {
          universityId: university.id,
          code: "201",
          subjectType: SubjectType.physics
        }
      },
      update: {},
      create: {
        universityId: university.id,
        code: "201",
        name: "物理类专业组 201",
        subjectType: SubjectType.physics,
        subjectRequirements: "首选物理"
      }
    });

    for (const history of groupHistory(universityInput.baseRank)) {
      await upsertHistory({
        provinceId: province.id,
        universityId: university.id,
        groupId: group.id,
        majorId: null,
        batch: "本科批",
        subjectType: SubjectType.physics,
        sourceId: source.id,
        ...history
      });
    }

    for (const majorTemplate of majorTemplates) {
      const major = await prisma.major.upsert({
        where: { code: majorTemplate.code },
        update: {},
        create: {
          code: majorTemplate.code,
          name: majorTemplate.name,
          category: "开发验证专业"
        }
      });
      await prisma.groupMajor.upsert({
        where: { groupId_majorId: { groupId: group.id, majorId: major.id } },
        update: {},
        create: { groupId: group.id, majorId: major.id }
      });
      for (const history of groupHistory(Math.round(universityInput.baseRank * majorTemplate.rankFactor))) {
        await upsertHistory({
          provinceId: province.id,
          universityId: university.id,
          groupId: group.id,
          majorId: major.id,
          batch: "本科批",
          subjectType: SubjectType.physics,
          sourceId: source.id,
          ...history
        });
      }
    }
  }

  console.log("Seeded Guangdong province rules and six-university development records.");
} finally {
  await prisma.$disconnect();
}
