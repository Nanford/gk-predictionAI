import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prisma } from "../src/db/client.js";
import { parseUniversityCsv } from "../src/importers/university-csv.js";

const filename = resolve(process.argv[2] ?? "../data/import/universities.csv");
const content = await readFile(filename, "utf8");
const rows = await parseUniversityCsv(content);
const checksum = createHash("sha256").update(content).digest("hex");

try {
  const existingBatch = await prisma.importBatch.findUnique({ where: { checksum } });
  if (existingBatch?.status === "completed") {
    console.log(`University CSV was already imported: ${existingBatch.importedRows} rows.`);
    process.exit(0);
  }

  const batch = await prisma.importBatch.upsert({
    where: { checksum },
    update: { status: "running" },
    create: {
      kind: "university_csv",
      filename,
      checksum,
      status: "running"
    }
  });

  for (const row of rows) {
    await prisma.university.upsert({
      where: { code: row.code },
      update: row,
      create: row
    });
  }

  await prisma.importBatch.update({
    where: { id: batch.id },
    data: {
      status: "completed",
      importedRows: rows.length,
      completedAt: new Date()
    }
  });
  console.log(`Imported ${rows.length} universities from ${filename}.`);
} finally {
  await prisma.$disconnect();
}
