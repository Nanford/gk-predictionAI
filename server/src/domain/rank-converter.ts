type VerificationStatus = "draft" | "verified" | "rejected";

interface ScoreSegment {
  score: number;
  cumulativeRank: number;
  verification: VerificationStatus;
}

interface RankConversionInput {
  year: number;
  score: number;
  segments: ScoreSegment[];
}

interface RankConversionResult {
  rank: number | null;
  estimated: false;
  warning?: string;
}

export const convertScoreToRank = (input: RankConversionInput): RankConversionResult => {
  const segment = input.segments.find(
    (item) => item.score === input.score && item.verification === "verified"
  );
  if (segment) {
    return { rank: segment.cumulativeRank, estimated: false };
  }

  if (input.year === 2026) {
    return {
      rank: null,
      estimated: false,
      warning: "2026 年分数段表尚未导入，请补充全省位次后再生成正式概率。"
    };
  }

  return {
    rank: null,
    estimated: false,
    warning: "当前分数缺少已核验的一分一段数据，请补充全省位次。"
  };
};
