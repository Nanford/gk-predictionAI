import { prisma } from "../db/client.js";

const categoryFor = (riskLabel: string): "sprint" | "stable" | "fallback" | "insufficient" => {
  if (riskLabel === "数据不足") return "insufficient";
  if (riskLabel === "保底") return "fallback";
  if (riskLabel.includes("稳妥")) return "stable";
  return "sprint";
};

const findOrCreateList = async (userId: number, predictionId?: number) => {
  const existing = await prisma.volunteerList.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  if (existing) return existing;
  if (!predictionId) return null;
  const prediction = await prisma.predictionRecord.findFirstOrThrow({
    where: { id: predictionId, userId }
  });
  return prisma.volunteerList.create({
    data: {
      userId,
      provinceId: prediction.provinceId,
      year: prediction.year,
      subjectType: prediction.subjectType,
      score: prediction.score,
      rank: prediction.rank
    }
  });
};

export const getVolunteerList = async (userId: number) => {
  const list = await findOrCreateList(userId);
  if (!list) return { id: null, items: [] };
  const items = await prisma.volunteerItem.findMany({
    where: { listId: list.id },
    include: { university: true, group: true, major: true },
    orderBy: { sortOrder: "asc" }
  });
  return { id: list.id, items };
};

export const addVolunteerItem = async (userId: number, predictionId: number) => {
  const prediction = await prisma.predictionRecord.findFirstOrThrow({
    where: { id: predictionId, userId }
  });
  const list = await findOrCreateList(userId, predictionId);
  if (!list) throw new Error("Volunteer list could not be created");
  const existing = await prisma.volunteerItem.findFirst({
    where: {
      listId: list.id,
      universityId: prediction.universityId,
      groupId: prediction.groupId,
      majorId: prediction.majorId
    }
  });
  if (existing) return existing;
  const count = await prisma.volunteerItem.count({ where: { listId: list.id } });
  return prisma.volunteerItem.create({
    data: {
      listId: list.id,
      universityId: prediction.universityId,
      groupId: prediction.groupId,
      majorId: prediction.majorId,
      probability: prediction.probability,
      riskLabel: prediction.riskLabel,
      sortOrder: count + 1
    }
  });
};

export const removeVolunteerItem = async (userId: number, itemId: number) => {
  const item = await prisma.volunteerItem.findFirstOrThrow({
    where: { id: itemId, list: { userId } }
  });
  await prisma.volunteerItem.delete({ where: { id: item.id } });
};

export const diagnoseVolunteerList = async (userId: number) => {
  const list = await getVolunteerList(userId);
  const counts = { sprint: 0, stable: 0, fallback: 0, insufficient: 0 };
  for (const item of list.items) {
    counts[categoryFor(item.riskLabel)] += 1;
  }
  const suggestion =
    counts.fallback === 0
      ? "当前志愿单缺少保底志愿，建议补充录取参考概率更高的院校。"
      : counts.sprint > counts.stable + counts.fallback
        ? "当前冲刺志愿占比较高，建议增加稳妥和保底志愿。"
        : "当前梯度结构可作为初步参考，请继续核对官方招生计划。";
  return { total: list.items.length, ...counts, suggestion };
};
