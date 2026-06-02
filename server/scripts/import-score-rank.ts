import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prisma } from "../src/db/client.js";
import { parseScoreRankCsv } from "../src/importers/official-csv.js";

const filename = resolve(process.argv[2] ?? "../data/import/score-rank-segments.csv");
const content = await readFile(filename, "utf8");
const rows = await parseScoreRankCsv(content);
const checksum = createHash("sha256").update(content).digest("hex");

try {
  const existing = await prisma.importBatch.findUnique({ where: { checksum } });
  if (existing?.status === "completed") {
    console.log(`Score-rank CSV was already imported: ${existing.importedRows} rows.`);
    process.exit(0);
  }
  const batch = await prisma.importBatch.upsert({
    where: { checksum },
    update: { status: "running" },
    create: { kind: "score_rank_csv", filename, checksum, status: "running" }
  });
  for (const row of rows) {
    const province = await prisma.province.findUniqueOrThrow({ where: { code: row.provinceCode } });
    const source = await prisma.dataSource.upsert({
      where: { url: row.sourceUrl },
      update: {},
      create: {
        name: `${row.year} 年一分一段表`,
        url: row.sourceUrl,
        publisher: "广东省教育考试院",
        verification: row.verification
      }
    });
    await prisma.scoreRankSegment.upsert({
      where: {
        provinceId_year_subjectType_score: {
          provinceId: province.id,
          year: row.year,
          subjectType: row.subjectType,
          score: row.score
        }
      },
      update: {
        sameScoreCount: row.sameScoreCount,
        cumulativeRank: row.cumulativeRank,
        sourceId: source.id,
        verification: row.verification,
        importBatchId: batch.id
      },
      create: {
        provinceId: province.id,
        year: row.year,
        subjectType: row.subjectType,
        score: row.score,
        sameScoreCount: row.sameScoreCount,
        cumulativeRank: row.cumulativeRank,
        sourceId: source.id,
        verification: row.verification,
        importBatchId: batch.id
      }
    });
  }
  await prisma.importBatch.update({
    where: { id: batch.id },
    data: { status: "completed", importedRows: rows.length, completedAt: new Date() }
  });
  console.log(`Imported ${rows.length} score-rank rows.`);
} finally {
  await prisma.$disconnect();
}
