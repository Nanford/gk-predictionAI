export const iconNames = [
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
  "search",
  "warning",
  "check",
  "target"
] as const;

export type IconName = (typeof iconNames)[number];

export const iconPath = (name: IconName) => `/static/icons/${name}.svg`;
