import { afterAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

const app = await buildApp({
  nodeEnv: "test",
  deepseekApiKey: "",
  enableDevQuotaTopup: true
});

afterAll(async () => {
  await app.close();
});

const createSession = async () => {
  const response = await app.inject({ method: "POST", url: "/api/session" });
  expect(response.statusCode).toBe(201);
  return response.json<{ token: string; quota: { available: number } }>();
};

describe("public platform API", () => {
  it("creates an anonymous session with configurable free quota", async () => {
    const session = await createSession();

    expect(session.token).toHaveLength(64);
    expect(session.quota.available).toBe(3);
  });

  it("lists the Guangdong province configuration", async () => {
    const response = await app.inject({ method: "GET", url: "/api/provinces" });

    expect(response.statusCode).toBe(200);
    expect(response.json<Array<{ code: string; name: string }>>()).toContainEqual(
      expect.objectContaining({ code: "44", name: "广东省" })
    );
  });

  it("searches development universities and returns the minimum-threshold group reference", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/universities/search?provinceCode=44&subjectType=physics&rank=12000"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json<{ items: Array<{ name: string; scope: string }> }>().items).toContainEqual(
      expect.objectContaining({
        name: "华南理工大学",
        scope: "university-min-threshold"
      })
    );
  });

  it("returns a template AI explanation without consuming quota when DeepSeek key is missing", async () => {
    const session = await createSession();
    const searchResponse = await app.inject({
      method: "GET",
      url: "/api/universities/search?provinceCode=44&subjectType=physics&rank=12000"
    });
    const university = searchResponse
      .json<{ items: Array<{ id: number; name: string }> }>()
      .items.find((item) => item.name === "华南理工大学")!;

    const predictionPayload = {
      year: 2026,
      provinceCode: "44",
      subjectType: "physics",
      rank: 12000,
      universityId: university.id
    };
    const predictionResponse = await app.inject({
      method: "POST",
      url: "/api/predictions/university",
      headers: { "x-session-token": session.token },
      payload: predictionPayload
    });
    expect(predictionResponse.statusCode).toBe(201);
    const prediction = predictionResponse.json<{ id: number }>();

    const explanationResponse = await app.inject({
      method: "POST",
      url: `/api/predictions/${prediction.id}/ai-explanation`,
      headers: { "x-session-token": session.token }
    });
    const quotaResponse = await app.inject({
      method: "GET",
      url: "/api/quota",
      headers: { "x-session-token": session.token }
    });

    expect(explanationResponse.statusCode).toBe(200);
    expect(explanationResponse.json()).toEqual(
      expect.objectContaining({ generatedBy: "template", quotaCharged: false })
    );
    expect(quotaResponse.json<{ available: number }>().available).toBe(3);

    const repeatedPredictionResponse = await app.inject({
      method: "POST",
      url: "/api/predictions/university",
      headers: { "x-session-token": session.token },
      payload: predictionPayload
    });
    expect(repeatedPredictionResponse.json<{ id: number }>().id).toBe(prediction.id);
  });

  it("allows development quota top-up when the feature flag is enabled", async () => {
    const session = await createSession();
    const response = await app.inject({
      method: "POST",
      url: "/api/dev/quota/top-up",
      headers: { "x-session-token": session.token },
      payload: { amount: 30 }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json<{ available: number }>().available).toBe(33);
  });

  it("returns university groups and creates a major-level prediction", async () => {
    const session = await createSession();
    const searchResponse = await app.inject({
      method: "GET",
      url: "/api/universities/search?provinceCode=44&subjectType=physics&rank=12000"
    });
    const university = searchResponse
      .json<{ items: Array<{ id: number; name: string }> }>()
      .items.find((item) => item.name === "华南理工大学")!;
    const detailResponse = await app.inject({
      method: "GET",
      url: `/api/universities/${university.id}?subjectType=physics`
    });
    const detail = detailResponse.json<{
      groups: Array<{ id: number; history: unknown[]; majors: Array<{ id: number; name: string }> }>;
    }>();
    const major = detail.groups[0].majors.find((item) => item.name === "计算机科学与技术")!;

    const predictionResponse = await app.inject({
      method: "POST",
      url: "/api/predictions/major",
      headers: { "x-session-token": session.token },
      payload: {
        year: 2026,
        provinceCode: "44",
        subjectType: "physics",
        rank: 12000,
        universityId: university.id,
        groupId: detail.groups[0].id,
        majorId: major.id
      }
    });

    expect(detailResponse.statusCode).toBe(200);
    expect(detail.groups.every((group) => group.history.length > 0)).toBe(true);
    expect(predictionResponse.statusCode).toBe(201);
    expect(predictionResponse.json()).toEqual(expect.objectContaining({ scope: "major" }));
  });

  it("adds a prediction to the volunteer list and returns a gradient diagnosis", async () => {
    const session = await createSession();
    const searchResponse = await app.inject({
      method: "GET",
      url: "/api/universities/search?provinceCode=44&subjectType=physics&rank=12000"
    });
    const university = searchResponse.json<{ items: Array<{ id: number }> }>().items[0];
    const predictionResponse = await app.inject({
      method: "POST",
      url: "/api/predictions/university",
      headers: { "x-session-token": session.token },
      payload: {
        year: 2026,
        provinceCode: "44",
        subjectType: "physics",
        rank: 12000,
        universityId: university.id
      }
    });
    const prediction = predictionResponse.json<{ id: number }>();

    const addResponse = await app.inject({
      method: "POST",
      url: "/api/volunteers/items",
      headers: { "x-session-token": session.token },
      payload: { predictionId: prediction.id }
    });
    const diagnosisResponse = await app.inject({
      method: "GET",
      url: "/api/volunteers/diagnosis",
      headers: { "x-session-token": session.token }
    });

    expect(addResponse.statusCode).toBe(201);
    expect(diagnosisResponse.statusCode).toBe(200);
    expect(diagnosisResponse.json()).toEqual(
      expect.objectContaining({ total: 1, suggestion: expect.any(String) })
    );
  });
});

describe("production route guards", () => {
  it("does not register the development top-up endpoint in production", async () => {
    const productionApp = await buildApp({
      nodeEnv: "production",
      deepseekApiKey: "",
      enableDevQuotaTopup: true
    });
    const response = await productionApp.inject({
      method: "POST",
      url: "/api/dev/quota/top-up",
      payload: { amount: 30 }
    });
    await productionApp.close();

    expect(response.statusCode).toBe(404);
  });
});
