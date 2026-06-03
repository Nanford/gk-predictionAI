import { describe, expect, it } from "vitest";
import { createExplanationService } from "../src/services/ai-explanation.js";

const context = {
  predictionId: 1,
  universityName: "华南理工大学",
  rank: 9000,
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

  it("accepts DeepSeek string fields by normalizing them into arrays", async () => {
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
                    summary: "Candidate rank has a narrow margin.",
                    reasoning: "The current rank is close to the historical minimum rank.",
                    riskWarning: "Do not treat this as an admission promise.",
                    nextActions: "Check official admission plans and subject requirements.",
                    disclaimer: "Reference only."
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
    expect(result.reasoning).toEqual(["The current rank is close to the historical minimum rank."]);
    expect(result.riskWarning).toEqual(["Do not treat this as an admission promise."]);
    expect(result.nextActions).toEqual(["Check official admission plans and subject requirements."]);
    expect(events).toEqual(["reserve", "consume"]);
  });

  it("sends candidate rank and explicit array schema to DeepSeek", async () => {
    let requestBody: { messages: Array<{ role: string; content: string }> } | undefined;
    const service = createExplanationService({
      apiKey: "configured-key",
      fetchImpl: async (_url, init) => {
        requestBody = JSON.parse(String(init?.body));
        return new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    summary: "ok",
                    reasoning: ["ok"],
                    riskWarning: ["ok"],
                    nextActions: ["ok"],
                    disclaimer: "ok"
                  })
                }
              }
            ]
          }),
          { status: 200 }
        );
      },
      reserveQuota: async () => "reservation",
      consumeQuota: async () => undefined,
      releaseQuota: async () => undefined
    });

    await service.explain(context);

    const userPayload = JSON.parse(requestBody!.messages[1].content) as { rank: number };
    expect(userPayload.rank).toBe(9000);
    expect(requestBody!.messages[0].content).toContain("string[]");
  });

  it("softens deterministic admission wording from DeepSeek output", async () => {
    const service = createExplanationService({
      apiKey: "configured-key",
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    summary: "该考生几乎不可能被录取。",
                    reasoning: ["如果填报该校，必然滑档。"],
                    riskWarning: ["不能作为主要志愿。"],
                    nextActions: ["一定要放弃该院校。"],
                    disclaimer: "Reference only."
                  })
                }
              }
            ]
          }),
          { status: 200 }
        ),
      reserveQuota: async () => "reservation",
      consumeQuota: async () => undefined,
      releaseQuota: async () => undefined
    });

    const result = await service.explain(context);
    const combined = [
      result.summary,
      ...result.reasoning,
      ...result.riskWarning,
      ...result.nextActions
    ].join(" ");

    expect(combined).not.toContain("几乎不可能");
    expect(combined).not.toContain("必然");
    expect(combined).not.toContain("不能作为主要志愿");
    expect(combined).not.toContain("一定要");
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
