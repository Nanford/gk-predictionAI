import type { IconName } from "./icon-registry";

export type ShellTab = "home" | "volunteers" | "quota" | "profile";

export interface BottomNavItem {
  key: ShellTab;
  label: string;
  icon: IconName;
  path: string;
}

export const bottomNavItems: ReadonlyArray<BottomNavItem> = [
  { key: "home", label: "首页", icon: "home", path: "/pages/home/index" },
  { key: "volunteers", label: "志愿单", icon: "list", path: "/pages/volunteers/index" },
  { key: "quota", label: "额度", icon: "wallet", path: "/pages/quota/index" },
  { key: "profile", label: "我的", icon: "user", path: "/pages/profile/index" }
];
