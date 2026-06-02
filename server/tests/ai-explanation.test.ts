import { describe, expect, it } from "vitest";
import { createExplanationService } from "../src/services/ai-explanation.js";

const context = {
  predictionId: 1,
  universityName: "华南理工大学",
  probability: 72,
  probabilityLow: 65,
  probabilityHigh: 79,
  riskLabel: "稳妥偏冲",
  confidenceLevel: "中高",
  history: [
    { year: 2025, minRank: 10000 },
    { year: 2024, minRank: 9600 },
    { year: 2023, minRank: 9200 }
  ],
  sourceItems: [{ name: "广东省教育考试院", year: 2025, url: "https://eea.gd.gov.cn/" }]
};

describe("createExplanationService", () => {
  it("returns a template explanation without charging quota when the API key is absent", async () => {
    let charges = 0;
    const service = createExplanationService({
      apiKey: "",
      reserveQuota: async () => {
        charges += 1;
        return "reservation";
      },
      consumeQuota: async () => undefined,
      releaseQuota: async () => undefined
    });

    const result = await service.explain(context);

    expect(result.generatedBy).toBe("template");
    expect(result.quotaCharged).toBe(false);
    expect(charges).toBe(0);
  });

  it("charges one quota only after DeepSeek returns valid JSON", async () => {
    const events: string[] = [];
    const service = createExplanationService({
      apiKey: "configured-key",
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    summary: "当前位次具备一定机会。",
                    reasoning: ["近三年位次处于可报区间。"],
                    riskWarning: ["仍需核对招生章程。"],
                    nextActions: ["查看专业组要求。"],
                    disclaimer: "预测结果仅供辅助参考，不代表最终录取结果。"
                  })
                }
              }
            ]
          }),
          { status: 200 }
        ),
      reserveQuota: async () => {
        events.push("reserve");
        return "reservation";
      },
      consumeQuota: async () => {
        events.push("consume");
      },
      releaseQuota: async () => {
        events.push("release");
      }
    });

    const result = await service.explain(context);

    expect(result.generatedBy).toBe("deepseek");
    expect(result.quotaCharged).toBe(true);
    expect(events).toEqual(["reserve", "consume"]);
  });

  it("releases the reservation and falls back to a template on invalid JSON", async () => {
    const events: string[] = [];
    const service = createExplanationService({
      apiKey: "configured-key",
      fetchImpl: async () =>
        new Response(JSON.stringify({ choices: [{ message: { content: "not-json" } }] }), {
          status: 200
        }),
      reserveQuota: async () => {
        events.push("reserve");
        return "reservation";
      },
      consumeQuota: async () => {
        events.push("consume");
      },
      releaseQuota: async () => {
        events.push("release");
      }
    });

    const result = await service.explain(context);

    expect(result.generatedBy).toBe("template");
    expect(result.quotaCharged).toBe(false);
    expect(events).toEqual(["reserve", "release"]);
  });
});
