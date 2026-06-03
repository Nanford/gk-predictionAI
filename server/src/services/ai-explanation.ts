interface ExplanationContext {
  predictionId: number;
  universityName: string;
  rank: number;
  probability: number | null;
  probabilityLow: number | null;
  probabilityHigh: number | null;
  riskLabel: string;
  confidenceLevel: string;
  history: Array<{ year: number; minRank: number | null }>;
  sourceItems: Array<{ name: string; year: number; url: string }>;
}

interface ExplanationContent {
  summary: string;
  reasoning: string[];
  riskWarning: string[];
  nextActions: string[];
  disclaimer: string;
}

export interface ExplanationResult extends ExplanationContent {
  generatedBy: "deepseek" | "template";
  quotaCharged: boolean;
}

interface ExplanationServiceDependencies {
  apiKey: string;
  apiBaseUrl?: string;
  model?: string;
  fetchImpl?: typeof fetch;
  reserveQuota: (predictionId: number) => Promise<string>;
  consumeQuota: (reservationId: string) => Promise<void>;
  releaseQuota: (reservationId: string) => Promise<void>;
}

const DISCLAIMER = "预测结果仅供辅助参考，不代表最终录取结果。";

const templateExplanation = (context: ExplanationContext): ExplanationResult => ({
  summary:
    context.probability === null
      ? `${context.universityName} 当前可核验数据不足，暂不提供概率百分比。`
      : `${context.universityName} 当前参考概率为 ${context.probability}%，志愿定位为${context.riskLabel}。`,
  reasoning: [
    `本次判断基于 ${context.history.length} 年已入库历史位次数据。`,
    "基础概率由位次差异、年度权重和招生计划变化规则计算。"
  ],
  riskWarning: ["请核对省教育考试院公告、高校招生章程和专业组选科要求。"],
  nextActions: ["查看专业组明细，并补充稳妥和保底志愿。"],
  disclaimer: DISCLAIMER,
  generatedBy: "template",
  quotaCharged: false
});

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const normalizeStringArray = (value: unknown, fieldName: string): string[] => {
  if (isStringArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  throw new Error(`DeepSeek response field ${fieldName} must be a string or string array`);
};

const softenDeterministicWording = (value: string): string =>
  value
    .replace(/几乎不可能被录取/g, "录取机会较低")
    .replace(/不可能被录取/g, "录取机会较低")
    .replace(/必然滑档/g, "滑档风险较高")
    .replace(/必然/g, "可能")
    .replace(/不能作为主要志愿/g, "不建议作为主要志愿")
    .replace(/一定要/g, "建议");

const softenItems = (items: string[]): string[] => items.map((item) => softenDeterministicWording(item));

const parseContent = (value: string): ExplanationContent => {
  const parsed = JSON.parse(value) as Record<string, unknown>;
  if (
    typeof parsed.summary !== "string" ||
    typeof parsed.disclaimer !== "string"
  ) {
    throw new Error("DeepSeek response did not match the required explanation shape");
  }
  return {
    summary: softenDeterministicWording(parsed.summary),
    reasoning: softenItems(normalizeStringArray(parsed.reasoning, "reasoning")),
    riskWarning: softenItems(normalizeStringArray(parsed.riskWarning, "riskWarning")),
    nextActions: softenItems(normalizeStringArray(parsed.nextActions, "nextActions")),
    disclaimer: softenDeterministicWording(parsed.disclaimer)
  };
};

export const createExplanationService = (dependencies: ExplanationServiceDependencies) => {
  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const apiBaseUrl = dependencies.apiBaseUrl ?? "https://api.deepseek.com";
  const model = dependencies.model ?? "deepseek-v4-pro";

  return {
    explain: async (context: ExplanationContext): Promise<ExplanationResult> => {
      if (!dependencies.apiKey.trim()) {
        return templateExplanation(context);
      }

      const reservationId = await dependencies.reserveQuota(context.predictionId);
      try {
        const response = await fetchImpl(`${apiBaseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${dependencies.apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content:
                  "你是高考志愿辅助分析助手。只能使用输入数据，不得承诺录取结果。不得使用“必录、保录、一定、必然、几乎不可能被录取”等确定性措辞。输出 JSON，字段必须为 summary、reasoning、riskWarning、nextActions、disclaimer。其中 reasoning、riskWarning、nextActions 必须是 string[]，即使只有一条也必须用数组。"
              },
              {
                role: "user",
                content: JSON.stringify(context)
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`DeepSeek request failed with ${response.status}`);
        }

        const payload = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const content = payload.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error("DeepSeek response did not contain explanation content");
        }
        const explanation = parseContent(content);
        await dependencies.consumeQuota(reservationId);
        return { ...explanation, generatedBy: "deepseek", quotaCharged: true };
      } catch {
        await dependencies.releaseQuota(reservationId);
        return templateExplanation(context);
      }
    }
  };
};
