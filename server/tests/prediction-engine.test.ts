import { describe, expect, it } from "vitest";
import {
  calculatePrediction,
  chooseRepresentativeGroup,
  riskLabelForProbability
} from "../src/domain/prediction-engine.js";

describe("calculatePrediction", () => {
  it("calculates a weighted probability from verified historical ranks and plan change", () => {
    const result = calculatePrediction({
      rank: 9000,
      scope: "group",
      planChangeRate: 0.05,
      history: [
        { year: 2025, minRank: 10000 },
        { year: 2024, minRank: 9600 },
        { year: 2023, minRank: 9200 }
      ]
    });

    expect(result.probability).toBe(72);
    expect(result.probabilityLow).toBeLessThan(result.probability!);
    expect(result.probabilityHigh).toBeGreaterThan(result.probability!);
    expect(result.confidenceLevel).toBe("中高");
    expect(result.riskLabel).toBe("稳妥偏冲");
  });

  it("returns data-insufficient instead of a fake percentage with fewer than two rank samples", () => {
    const result = calculatePrediction({
      rank: 9000,
      scope: "major",
      history: [{ year: 2025, minRank: 10000 }]
    });

    expect(result.probability).toBeNull();
    expect(result.probabilityLow).toBeNull();
    expect(result.probabilityHigh).toBeNull();
    expect(result.confidenceLevel).toBe("数据不足");
    expect(result.riskLabel).toBe("数据不足");
  });
});

describe("riskLabelForProbability", () => {
  it.each([
    [95, "保底"],
    [80, "稳妥"],
    [65, "稳妥偏冲"],
    [50, "冲刺"],
    [30, "高风险冲刺"],
    [15, "不建议作为主要志愿"]
  ])("maps %i to %s", (probability, label) => {
    expect(riskLabelForProbability(probability)).toBe(label);
  });
});

describe("chooseRepresentativeGroup", () => {
  it("uses the easiest eligible group as the university minimum-threshold reference", () => {
    const group = chooseRepresentativeGroup(
      [
        { id: 1, code: "201", subjectType: "physics", minRank: 7500 },
        { id: 2, code: "202", subjectType: "physics", minRank: 10500 },
        { id: 3, code: "203", subjectType: "history", minRank: 1300 }
      ],
      "physics"
    );

    expect(group?.id).toBe(2);
  });

  it("returns undefined when no group matches the selected subject type", () => {
    const group = chooseRepresentativeGroup(
      [{ id: 3, code: "203", subjectType: "history", minRank: 1300 }],
      "physics"
    );

    expect(group).toBeUndefined();
  });
});
