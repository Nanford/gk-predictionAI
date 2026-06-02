export type PredictionScope = "university-min-threshold" | "group" | "major";
export type SubjectType = "physics" | "history";
export type ConfidenceLevel = "高" | "中高" | "中" | "低" | "数据不足";

export interface HistoricalRank {
  year: number;
  minRank: number | null;
}

export interface PredictionEngineInput {
  rank: number;
  scope: PredictionScope;
  history: HistoricalRank[];
  planChangeRate?: number;
}

export interface PredictionEngineResult {
  probability: number | null;
  probabilityLow: number | null;
  probabilityHigh: number | null;
  riskLabel: string;
  confidenceLevel: ConfidenceLevel;
  scope: PredictionScope;
  warnings: string[];
}

interface GroupMinimumRank {
  id: number;
  code: string;
  subjectType: SubjectType;
  minRank: number;
}

const YEAR_WEIGHTS = new Map([
  [2025, 0.5],
  [2024, 0.3],
  [2023, 0.2]
]);

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const riskLabelForProbability = (probability: number): string => {
  if (probability >= 90) return "保底";
  if (probability >= 75) return "稳妥";
  if (probability >= 60) return "稳妥偏冲";
  if (probability >= 40) return "冲刺";
  if (probability >= 20) return "高风险冲刺";
  return "不建议作为主要志愿";
};

const confidenceForSamples = (sampleCount: number): ConfidenceLevel => {
  if (sampleCount >= 4) return "高";
  if (sampleCount === 3) return "中高";
  if (sampleCount === 2) return "中";
  return "数据不足";
};

const intervalWidth = (ranks: number[]): number => {
  const average = ranks.reduce((sum, value) => sum + value, 0) / ranks.length;
  const variance =
    ranks.reduce((sum, value) => sum + (value - average) ** 2, 0) / ranks.length;
  const volatilityRatio = average === 0 ? 0 : Math.sqrt(variance) / average;
  return clamp(Math.round(7 + volatilityRatio * 40), 7, 20);
};

export const calculatePrediction = (input: PredictionEngineInput): PredictionEngineResult => {
  const availableHistory = input.history.filter(
    (item): item is { year: number; minRank: number } =>
      typeof item.minRank === "number" && item.minRank > 0
  );

  if (availableHistory.length < 2) {
    return {
      probability: null,
      probabilityLow: null,
      probabilityHigh: null,
      riskLabel: "数据不足",
      confidenceLevel: "数据不足",
      scope: input.scope,
      warnings: ["可核验历史位次少于 2 年，暂不提供概率百分比。"]
    };
  }

  const weightedScores = availableHistory.map((item) => {
    const weight = YEAR_WEIGHTS.get(item.year) ?? 0.1;
    const score = 100 / (1 + Math.exp((input.rank / item.minRank - 1) * 12));
    return { score, weight };
  });
  const totalWeight = weightedScores.reduce((sum, item) => sum + item.weight, 0);
  const baseProbability =
    weightedScores.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight;
  const planAdjustment = clamp((input.planChangeRate ?? 0) * 30, -6, 6);
  const probability = clamp(Math.round(baseProbability + planAdjustment), 5, 95);
  const width = intervalWidth(availableHistory.map((item) => item.minRank));

  return {
    probability,
    probabilityLow: clamp(probability - width, 0, 100),
    probabilityHigh: clamp(probability + width, 0, 100),
    riskLabel: riskLabelForProbability(probability),
    confidenceLevel: confidenceForSamples(availableHistory.length),
    scope: input.scope,
    warnings: []
  };
};

export const chooseRepresentativeGroup = (
  groups: GroupMinimumRank[],
  subjectType: SubjectType
): GroupMinimumRank | undefined =>
  groups
    .filter((group) => group.subjectType === subjectType)
    .sort((left, right) => right.minRank - left.minRank)[0];
