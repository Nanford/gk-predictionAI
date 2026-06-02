import { describe, expect, it } from "vitest";
import { parseUniversityCsv } from "../src/importers/university-csv.js";

describe("parseUniversityCsv", () => {
  it("normalizes the national university code CSV exported from the legacy workbook", async () => {
    const rows = await parseUniversityCsv(
      [
        "code,name,authority,province_name,city,education_level,remark",
        "4144010561,华南理工大学,教育部,广东省,广州市,本科,",
        "4144010590,深圳大学,广东省,广东省,深圳市,本科,"
      ].join("\n")
    );

    expect(rows).toEqual([
      {
        code: "4144010561",
        name: "华南理工大学",
        authority: "教育部",
        city: "广州市",
        provinceName: "广东省",
        educationLevel: "本科"
      },
      {
        code: "4144010590",
        name: "深圳大学",
        authority: "广东省",
        city: "深圳市",
        provinceName: "广东省",
        educationLevel: "本科"
      }
    ]);
  });

  it("rejects rows without a university code", async () => {
    await expect(
      parseUniversityCsv("code,name,authority,province_name,city,education_level,remark\n,华南理工大学,教育部,广东省,广州市,本科,")
    ).rejects.toThrow("University code is required");
  });
});
