import { describe, expect, it } from "vitest";
import { iconNames, iconPath } from "./icon-registry";

describe("icon registry", () => {
  it("registers the interface icons used by the mobile shell", () => {
    expect(iconNames).toEqual(
      expect.arrayContaining([
        "home",
        "list",
        "spark",
        "user",
        "coin",
        "back",
        "calendar",
        "map",
        "layers",
        "score",
        "rank",
        "school",
        "shield",
        "trend",
        "trash",
        "wallet",
        "doc",
        "arrowRight",
      ])
    );
  });

  it("returns uniapp static icon paths", () => {
    expect(iconPath("home")).toBe("/static/icons/home.svg");
    expect(iconPath("arrowRight")).toBe("/static/icons/arrowRight.svg");
  });
});
