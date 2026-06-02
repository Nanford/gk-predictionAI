import { prisma } from "../db/client.js";

export const getQuota = async (userId: number) => {
  const quota = await prisma.userAiQuota.findUniqueOrThrow({ where: { userId } });
  return {
    available: quota.available,
    reserved: quota.reserved,
    consumed: quota.consumed
  };
};

export const reserveQuota = async (userId: number, predictionId: number): Promise<string> =>
  prisma.$transaction(async (tx) => {
    const changed = await tx.userAiQuota.updateMany({
      where: { userId, available: { gte: 1 } },
      data: { available: { decrement: 1 }, reserved: { increment: 1 } }
    });
    if (changed.count !== 1) {
      throw new Error("AI quota is exhausted");
    }
    const ledger = await tx.aiUsageLedger.create({
      data: { userId, predictionId, type: "reserve", amount: -1, note: "AI explanation reserved" }
    });
    return String(ledger.id);
  });

export const consumeQuota = async (userId: number, reservationId: string): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    const reservation = await tx.aiUsageLedger.findFirstOrThrow({
      where: { id: Number(reservationId), userId, type: "reserve" }
    });
    await tx.userAiQuota.update({
      where: { userId },
      data: { reserved: { decrement: 1 }, consumed: { increment: 1 } }
    });
    await tx.aiUsageLedger.create({
      data: {
        userId,
        predictionId: reservation.predictionId,
        type: "consume",
        amount: -1,
        note: `Consumed reservation ${reservation.id}`
      }
    });
  });
};

export const releaseQuota = async (userId: number, reservationId: string): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    const reservation = await tx.aiUsageLedger.findFirstOrThrow({
      where: { id: Number(reservationId), userId, type: "reserve" }
    });
    await tx.userAiQuota.update({
      where: { userId },
      data: { reserved: { decrement: 1 }, available: { increment: 1 } }
    });
    await tx.aiUsageLedger.create({
      data: {
        userId,
        predictionId: reservation.predictionId,
        type: "release",
        amount: 1,
        note: `Released reservation ${reservation.id}`
      }
    });
  });
};

export const topUpQuota = async (userId: number, amount: number) =>
  prisma.$transaction(async (tx) => {
    const quota = await tx.userAiQuota.update({
      where: { userId },
      data: { available: { increment: amount } }
    });
    await tx.aiUsageLedger.create({
      data: { userId, type: "topup", amount, note: "Development quota top-up" }
    });
    return { available: quota.available, reserved: quota.reserved, consumed: quota.consumed };
  });
