import "dotenv/config";
import cors from "@fastify/cors";
import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import { prisma } from "./db/client.js";
import { convertScoreToRank } from "./domain/rank-converter.js";
import { Prisma, SubjectType } from "./generated/prisma/client.js";
import { loadConfig, type AppConfig } from "./config/env.js";
import { createExplanationService } from "./services/ai-explanation.js";
import { getQuota, releaseQuota, reserveQuota, consumeQuota, topUpQuota } from "./services/quota-service.js";
import { createAnonymousSession, findUserBySessionToken } from "./services/session-service.js";
import {
  createMajorPrediction,
  createUniversityPrediction,
  getUniversityDetail,
  getPredictionExplanationContext,
  searchUniversities
} from "./services/prediction-service.js";
import {
  addVolunteerItem,
  diagnoseVolunteerList,
  getVolunteerList,
  removeVolunteerItem
} from "./services/volunteer-service.js";

interface PredictionBody {
  year: number;
  provinceCode: string;
  subjectType: SubjectType;
  score?: number;
  rank: number;
  universityId: number;
  groupId?: number;
  majorId?: number;
}

const tokenFrom = (request: FastifyRequest): string | undefined => {
  const header = request.headers["x-session-token"];
  return typeof header === "string" ? header : undefined;
};

const requireUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = await findUserBySessionToken(tokenFrom(request));
  if (!user) {
    await reply.code(401).send({ message: "Valid X-Session-Token header is required" });
    return null;
  }
  return user;
};

export const buildApp = async (overrides: Partial<AppConfig> = {}) => {
  const config = loadConfig(overrides);
  const app = Fastify({ logger: false });
  await app.register(cors, { origin: config.webOrigin });

  app.get("/api/health", async () => ({ status: "ok" }));

  app.post("/api/session", async (_request, reply) => {
    const session = await createAnonymousSession(config.defaultFreeAiQuota);
    return reply.code(201).send(session);
  });

  app.get("/api/provinces", async () =>
    prisma.province.findMany({ select: { code: true, name: true, examMode: true, scoreTotal: true } })
  );

  app.post<{ Body: { provinceCode: string; year: number; subjectType: SubjectType; score: number } }>(
    "/api/rank/convert",
    async (request) => {
      const province = await prisma.province.findUniqueOrThrow({ where: { code: request.body.provinceCode } });
      const segments = await prisma.scoreRankSegment.findMany({
        where: {
          provinceId: province.id,
          year: request.body.year,
          subjectType: request.body.subjectType
        }
      });
      return convertScoreToRank({
        year: request.body.year,
        score: request.body.score,
        segments
      });
    }
  );

  app.get<{ Querystring: { provinceCode: string; subjectType: SubjectType; rank: string } }>(
    "/api/universities/search",
    async (request) => ({
      items: await searchUniversities(request.query.subjectType, Number(request.query.rank))
    })
  );

  app.get<{ Params: { id: string }; Querystring: { subjectType: SubjectType } }>(
    "/api/universities/:id",
    async (request) => getUniversityDetail(Number(request.params.id), request.query.subjectType)
  );

  app.post<{ Body: PredictionBody }>("/api/predictions/university", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    const prediction = await createUniversityPrediction({ ...request.body, userId: user.id });
    return reply.code(201).send(prediction);
  });

  app.post<{ Body: PredictionBody }>("/api/predictions/major", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    const prediction = await createMajorPrediction({ ...request.body, userId: user.id });
    return reply.code(201).send(prediction);
  });

  app.post<{ Params: { id: string } }>("/api/predictions/:id/ai-explanation", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    const { prediction, context } = await getPredictionExplanationContext(Number(request.params.id), user.id);
    if (prediction.explanation) {
      return {
        ...(prediction.explanation as Record<string, unknown>),
        generatedBy: prediction.explanationSource,
        quotaCharged: false,
        cached: true
      };
    }
    const service = createExplanationService({
      apiKey: config.deepseekApiKey,
      apiBaseUrl: config.deepseekApiBaseUrl,
      model: config.deepseekModel,
      reserveQuota: (predictionId) => reserveQuota(user.id, predictionId),
      consumeQuota: (reservationId) => consumeQuota(user.id, reservationId),
      releaseQuota: (reservationId) => releaseQuota(user.id, reservationId)
    });
    const explanation = await service.explain(context);
    await prisma.predictionRecord.update({
      where: { id: prediction.id },
      data: {
        explanation: explanation as unknown as Prisma.InputJsonObject,
        explanationSource: explanation.generatedBy
      }
    });
    return explanation;
  });

  app.get("/api/quota", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    return getQuota(user.id);
  });

  app.get("/api/volunteers", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    return getVolunteerList(user.id);
  });

  app.post<{ Body: { predictionId: number } }>("/api/volunteers/items", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    const item = await addVolunteerItem(user.id, request.body.predictionId);
    return reply.code(201).send(item);
  });

  app.delete<{ Params: { id: string } }>("/api/volunteers/items/:id", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    await removeVolunteerItem(user.id, Number(request.params.id));
    return reply.code(204).send();
  });

  app.get("/api/volunteers/diagnosis", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    return diagnoseVolunteerList(user.id);
  });

  if (config.nodeEnv !== "production" && config.enableDevQuotaTopup) {
    app.post<{ Body: { amount: number } }>("/api/dev/quota/top-up", async (request, reply) => {
      const user = await requireUser(request, reply);
      if (!user) return;
      if (!Number.isInteger(request.body.amount) || request.body.amount <= 0 || request.body.amount > 1000) {
        return reply.code(400).send({ message: "amount must be an integer from 1 to 1000" });
      }
      return topUpQuota(user.id, request.body.amount);
    });
  }

  return app;
};
