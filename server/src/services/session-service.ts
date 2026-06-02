import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../db/client.js";

const SESSION_DAYS = 30;

const hashToken = (token: string): string => createHash("sha256").update(token).digest("hex");

export const createAnonymousSession = async (defaultQuota: number) => {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const user = await prisma.user.create({
    data: {
      quota: { create: { available: defaultQuota } },
      sessions: { create: { tokenHash: hashToken(token), expiresAt } },
      ledger: {
        create: {
          type: "grant",
          amount: defaultQuota,
          note: "Anonymous session initial quota"
        }
      }
    },
    include: { quota: true }
  });

  return { token, expiresAt, quota: user.quota! };
};

export const findUserBySessionToken = async (token: string | undefined) => {
  if (!token) return null;
  const session = await prisma.anonymousSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { include: { quota: true } } }
  });
  if (!session || session.expiresAt.getTime() <= Date.now()) return null;
  return session.user;
};
