export interface AppConfig {
  nodeEnv: string;
  apiHost: string;
  apiPort: number;
  webOrigin: string;
  deepseekApiBaseUrl: string;
  deepseekApiKey: string;
  deepseekModel: string;
  defaultFreeAiQuota: number;
  enableDevQuotaTopup: boolean;
}

export const loadConfig = (overrides: Partial<AppConfig> = {}): AppConfig => ({
  nodeEnv: overrides.nodeEnv ?? process.env.NODE_ENV ?? "development",
  apiHost: overrides.apiHost ?? process.env.API_HOST ?? "127.0.0.1",
  apiPort: overrides.apiPort ?? Number(process.env.API_PORT ?? 3000),
  webOrigin: overrides.webOrigin ?? process.env.WEB_ORIGIN ?? "http://127.0.0.1:5174",
  deepseekApiBaseUrl:
    overrides.deepseekApiBaseUrl ?? process.env.DEEPSEEK_API_BASE_URL ?? "https://api.deepseek.com",
  deepseekApiKey: overrides.deepseekApiKey ?? process.env.DEEPSEEK_API_KEY ?? "",
  deepseekModel: overrides.deepseekModel ?? process.env.DEEPSEEK_MODEL ?? "deepseek-v4-pro",
  defaultFreeAiQuota:
    overrides.defaultFreeAiQuota ?? Number(process.env.DEFAULT_FREE_AI_QUOTA ?? 3),
  enableDevQuotaTopup:
    overrides.enableDevQuotaTopup ??
    (process.env.ENABLE_DEV_QUOTA_TOPUP ?? "false").toLowerCase() === "true"
});
