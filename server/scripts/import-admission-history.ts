import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prisma } from "../src/db/client.js";
import { parseAdmissionHistoryCsv } from "../src/importers/official-csv.js";

const filename = resolve(process.argv[2] ?? "../data/import/admission-history.csv");
const content = await readFile(filename, "utf8");
const rows = await parseAdmissionHistoryCsv(content);
const checksum = createHash("sha256").update(content).digest("hex");

try {
  const existing = await prisma.importBatch.findUnique({ where: { checksum } });
  if (existing?.status === "completed") {
    console.log(`Admission history CSV was already imported: ${existing.importedRows} rows.`);
    process.exit(0);
  }
  const batch = await prisma.importBatch.upsert({
    where: { checksum },
    update: { status: "running" },
    create: { kind: "admission_history_csv", filename, checksum, status: "running" }
  });
  for (const row of rows) {
    const province = await prisma.province.findUniqueOrThrow({ where: { code: row.provinceCode } });
    const university = await prisma.university.findUniqueOrThrow({ where: { code: row.universityCode } });
    const source = await prisma.dataSource.upsert({
      where: { url: row.sourceUrl },
      update: {},
      create: {
        name: `${row.year} 年本科批投档数据`,
        url: row.sourceUrl,
        publisher: "广东省教育考试院",
        verification: row.verification
      }
    });
    const group = await prisma.universityGroup.upsert({
      where: {
        universityId_code_subjectType: {
          universityId: university.id,
          code: row.groupCode,
          subjectType: row.subjectType
        }
      },
      update: {},
      create: {
        universityId: university.id,
        code: row.groupCode,
        name: `专业组 ${row.groupCode}`,
        subjectType: row.subjectType
      }
    });
    const major = row.majorCode
      ? await prisma.major.findUniqueOrThrow({ where: { code: row.majorCode } })
      : null;
    const match = {
      provinceId: province.id,
      universityId: university.id,
      groupId: group.id,
      majorId: major?.id ?? null,
      year: row.year,
      batch: row.batch,
      subjectType: row.subjectType
    };
    const current = await prisma.admissionHistory.findFirst({ where: match });
    const data = {
      ...match,
      minScore: row.minScore,
      minRank: row.minRank,
      avgScore: row.avgScore,
      avgRank: row.avgRank,
      maxScore: row.maxScore,
      planCount: row.planCount,
      sourceId: source.id,
      verification: row.verification,
      isDemo: row.isDemo,
      importBatchId: batch.id
    };
    if (current) {
      await prisma.admissionHistory.update({ where: { id: current.id }, data });
    } else {
      await prisma.admissionHistory.create({ data });
    }
  }
  await prisma.importBatch.update({
    where: { id: batch.id },
    data: { status: "completed", importedRows: rows.length, completedAt: new Date() }
  });
  console.log(`Imported ${rows.length} admission-history rows.`);
} finally {
  await prisma.$disconnect();
}
