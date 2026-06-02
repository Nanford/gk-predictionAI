import { describe, expect, it } from "vitest";
import { normalizeRouteQuery } from "../src/utils/route-query.js";

describe("normalizeRouteQuery", () => {
  it("keeps standard UniApp navigation query values", () => {
    expect(
      normalizeRouteQuery({ rank: "12000", score: "", subjectType: "physics" })
    ).toEqual({ rank: "12000", score: "", subjectType: "physics" });
  });

  it("recovers hash-route parameters collapsed into the first value during direct H5 access", () => {
    expect(
      normalizeRouteQuery({ rank: "12000&score=&subjectType=physics" })
    ).toEqual({ rank: "12000", score: "", subjectType: "physics" });
  });
});
