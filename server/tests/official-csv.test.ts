import { describe, expect, it } from "vitest";
import { parseAdmissionHistoryCsv, parseScoreRankCsv } from "../src/importers/official-csv.js";

describe("parseScoreRankCsv", () => {
  it("parses verified score-rank rows with their official source", async () => {
    const rows = await parseScoreRankCsv(
      [
        "province_code,year,subject_type,score,same_score_count,cumulative_rank,source_url,verification",
        "44,2025,physics,620,321,14800,https://eea.gd.gov.cn/source,verified"
      ].join("\n")
    );

    expect(rows[0]).toEqual({
      provinceCode: "44",
      year: 2025,
      subjectType: "physics",
      score: 620,
      sameScoreCount: 321,
      cumulativeRank: 14800,
      sourceUrl: "https://eea.gd.gov.cn/source",
      verification: "verified"
    });
  });
});

describe("parseAdmissionHistoryCsv", () => {
  it("keeps group and optional major identifiers for auditable history imports", async () => {
    const rows = await parseAdmissionHistoryCsv(
      [
        "province_code,university_code,group_code,major_code,year,batch,subject_type,min_score,min_rank,avg_score,avg_rank,max_score,plan_count,source_url,verification,is_demo",
        "44,4144010561,201,CS,2025,本科批,physics,620,9200,630,7600,648,105,https://eea.gd.gov.cn/source,verified,false"
      ].join("\n")
    );

    expect(rows[0]).toEqual(
      expect.objectContaining({
        universityCode: "4144010561",
        groupCode: "201",
        majorCode: "CS",
        minRank: 9200,
        verification: "verified",
        isDemo: false
      })
    );
  });

  it("rejects unsupported verification values", async () => {
    await expect(
      parseAdmissionHistoryCsv(
        [
          "province_code,university_code,group_code,major_code,year,batch,subject_type,min_score,min_rank,avg_score,avg_rank,max_score,plan_count,source_url,verification,is_demo",
          "44,4144010561,201,,2025,本科批,physics,620,9200,,,,105,https://eea.gd.gov.cn/source,approved,false"
        ].join("\n")
      )
    ).rejects.toThrow("Unsupported verification status");
  });
});
