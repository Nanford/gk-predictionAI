import { describe, expect, it } from "vitest";
import { convertScoreToRank } from "../src/domain/rank-converter.js";

describe("convertScoreToRank", () => {
  it("returns the verified cumulative rank for a score segment", () => {
    expect(
      convertScoreToRank({
        year: 2025,
        score: 620,
        segments: [{ score: 620, cumulativeRank: 14800, verification: "verified" }]
      })
    ).toEqual({ rank: 14800, estimated: false });
  });

  it("requires a manually supplied rank when current-year segments are not available", () => {
    expect(convertScoreToRank({ year: 2026, score: 620, segments: [] })).toEqual({
      rank: null,
      estimated: false,
      warning: "2026 年分数段表尚未导入，请补充全省位次后再生成正式概率。"
    });
  });

  it("ignores score segments that have not been verified", () => {
    expect(
      convertScoreToRank({
        year: 2025,
        score: 620,
        segments: [{ score: 620, cumulativeRank: 14800, verification: "draft" }]
      })
    ).toEqual({
      rank: null,
      estimated: false,
      warning: "当前分数缺少已核验的一分一段数据，请补充全省位次。"
    });
  });
});
