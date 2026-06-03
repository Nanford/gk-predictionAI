import { describe, expect, it } from "vitest";
import { bottomNavItems } from "./bottom-nav-items";

describe("bottom nav items", () => {
  it("uses explicit icons that match each tab meaning", () => {
    expect(bottomNavItems).toEqual([
      expect.objectContaining({ key: "home", label: "首页", icon: "home" }),
      expect.objectContaining({ key: "volunteers", label: "志愿单", icon: "list" }),
      expect.objectContaining({ key: "quota", label: "额度", icon: "wallet" }),
      expect.objectContaining({ key: "profile", label: "我的", icon: "user" })
    ]);
  });
});
