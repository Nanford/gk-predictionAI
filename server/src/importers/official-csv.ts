import { parse } from "csv-parse/sync";

type SubjectType = "physics" | "history";
type VerificationStatus = "draft" | "verified" | "rejected";

const verificationStatuses = new Set<VerificationStatus>(["draft", "verified", "rejected"]);
const subjectTypes = new Set<SubjectType>(["physics", "history"]);

const required = (label: string, value: string | undefined): string => {
  const normalized = value?.trim();
  if (!normalized) throw new Error(`${label} is required`);
  return normalized;
};

const integer = (label: string, value: string | undefined): number => {
  const normalized = required(label, value);
  const parsed = Number(normalized);
  if (!Number.isInteger(parsed)) throw new Error(`${label} must be an integer`);
  return parsed;
};

const optionalInteger = (label: string, value: string | undefined): number | null => {
  if (!value?.trim()) return null;
  return integer(label, value);
};

const verification = (value: string | undefined): VerificationStatus => {
  const normalized = required("verification", value) as VerificationStatus;
  if (!verificationStatuses.has(normalized)) throw new Error("Unsupported verification status");
  return normalized;
};

const subjectType = (value: string | undefined): SubjectType => {
  const normalized = required("subject_type", value) as SubjectType;
  if (!subjectTypes.has(normalized)) throw new Error("Unsupported subject type");
  return normalized;
};

export interface ScoreRankCsvRow {
  provinceCode: string;
  year: number;
  subjectType: SubjectType;
  score: number;
  sameScoreCount: number;
  cumulativeRank: number;
  sourceUrl: string;
  verification: VerificationStatus;
}

export interface AdmissionHistoryCsvRow {
  provinceCode: string;
  universityCode: string;
  groupCode: string;
  majorCode: string | null;
  year: number;
  batch: string;
  subjectType: SubjectType;
  minScore: number | null;
  minRank: number | null;
  avgScore: number | null;
  avgRank: number | null;
  maxScore: number | null;
  planCount: number | null;
  sourceUrl: string;
  verification: VerificationStatus;
  isDemo: boolean;
}

type CsvRecord = Record<string, string | undefined>;

const records = (content: string): CsvRecord[] =>
  parse(content, { bom: true, columns: true, skip_empty_lines: true, trim: true }) as CsvRecord[];

export const parseScoreRankCsv = async (content: string): Promise<ScoreRankCsvRow[]> =>
  records(content).map((row) => ({
    provinceCode: required("province_code", row.province_code),
    year: integer("year", row.year),
    subjectType: subjectType(row.subject_type),
    score: integer("score", row.score),
    sameScoreCount: integer("same_score_count", row.same_score_count),
    cumulativeRank: integer("cumulative_rank", row.cumulative_rank),
    sourceUrl: required("source_url", row.source_url),
    verification: verification(row.verification)
  }));

export const parseAdmissionHistoryCsv = async (
  content: string
): Promise<AdmissionHistoryCsvRow[]> =>
  records(content).map((row) => ({
    provinceCode: required("province_code", row.province_code),
    universityCode: required("university_code", row.university_code),
    groupCode: required("group_code", row.group_code),
    majorCode: row.major_code?.trim() || null,
    year: integer("year", row.year),
    batch: required("batch", row.batch),
    subjectType: subjectType(row.subject_type),
    minScore: optionalInteger("min_score", row.min_score),
    minRank: optionalInteger("min_rank", row.min_rank),
    avgScore: optionalInteger("avg_score", row.avg_score),
    avgRank: optionalInteger("avg_rank", row.avg_rank),
    maxScore: optionalInteger("max_score", row.max_score),
    planCount: optionalInteger("plan_count", row.plan_count),
    sourceUrl: required("source_url", row.source_url),
    verification: verification(row.verification),
    isDemo: (row.is_demo?.trim() || "false").toLowerCase() === "true"
  }));
