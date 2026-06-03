import { describe, expect, it } from "vitest";
import pagesConfig from "../src/pages.json";

describe("UniApp first usable version pages", () => {
  it("registers all first-version user-facing pages", () => {
    const paths = pagesConfig.pages.map((page) => page.path);

    expect(paths).toEqual([
      "pages/home/index",
      "pages/rank/index",
      "pages/results/index",
      "pages/university/index",
      "pages/major/index",
      "pages/ai/index",
      "pages/volunteers/index",
      "pages/quota/index",
      "pages/payment/index",
      "pages/profile/index"
    ]);
  });
});
