<template>
  <PageShell title="AI 解读" current="none">
    <view class="page">
      <view>
        <text class="eyebrow">DeepSeek 结构化解释</text>
        <text class="page-title">AI 辅助分析</text>
        <text class="hero-subtitle">AI 只解释已经计算完成的结构化概率，不会修改概率，也不替代最终志愿决策。</text>
      </view>

      <view v-if="loading" class="analysis-loading card">
        <text class="loading-dot"></text>
        <text class="section-title">正在整理风险依据</text>
        <text class="meta">基础概率已经生成，AI 正在补充原因说明和官方资料核对清单。</text>
      </view>

      <view v-else-if="explanation" class="content-stack">
        <view class="summary-card card">
          <text class="meta">生成方式：{{ explanation.generatedBy === "deepseek" ? "DeepSeek AI" : "规则模板回退" }}</text>
          <text class="summary-title">{{ explanation.summary }}</text>
          <text class="meta">{{ explanation.quotaCharged ? "本次消耗 1 次 AI 使用额度" : "本次未扣除 AI 使用额度" }}</text>
        </view>

        <view class="card analysis-section">
          <view class="section-head"><text class="section-title">关键依据</text><text class="muted">结构化数据</text></view>
          <text v-for="item in explanation.reasoning" :key="item" class="meta">· {{ item }}</text>
        </view>

        <view class="card analysis-section warning-card">
          <view class="section-head"><text class="section-title">风险提示</text><text class="muted">仍需人工核对</text></view>
          <text v-for="item in explanation.riskWarning" :key="item" class="warning">· {{ item }}</text>
        </view>

        <view class="card analysis-section">
          <view class="section-head"><text class="section-title">下一步建议</text><text class="muted">降低填报风险</text></view>
          <text v-for="item in explanation.nextActions" :key="item" class="meta">· {{ item }}</text>
        </view>
      </view>

      <view v-else class="card empty">
        <text>点击按钮生成 AI 风险解读。</text>
        <button class="button button-primary primary-wide" @click="generate">生成 AI 解读</button>
      </view>

      <button class="button button-light primary-wide" @click="openQuota">查看 AI 使用额度</button>
      <DisclaimerBar compact />
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PageShell from "../../components/PageShell.vue";
import { api } from "../../services/api";
import { normalizeRouteQuery } from "../../utils/route-query";

interface Explanation {
  summary: string;
  reasoning: string[];
  riskWarning: string[];
  nextActions: string[];
  generatedBy: "deepseek" | "template";
  quotaCharged: boolean;
}

const predictionId = ref(0);
const explanation = ref<Explanation>();
const loading = ref(false);

onLoad((query) => {
  predictionId.value = Number(normalizeRouteQuery(query ?? {}).predictionId ?? 0);
});

const generate = async () => {
  loading.value = true;
  try {
    explanation.value = await api.authenticatedRequest<Explanation>(
      `/predictions/${predictionId.value}/ai-explanation`,
      { method: "POST" }
    );
  } catch (error) {
    uni.showToast({ title: String(error), icon: "none" });
  } finally {
    loading.value = false;
  }
};

const openQuota = () => uni.navigateTo({ url: "/pages/quota/index" });
</script>

<style scoped>
.content-stack,
.analysis-section {
  display: grid;
  gap: 12px;
}

.analysis-loading {
  display: grid;
  justify-items: center;
  gap: 10px;
  min-height: 210px;
  place-content: center;
  text-align: center;
}

.loading-dot {
  width: 18px;
  height: 18px;
  border: 3px solid #eaf3ff;
  border-top-color: #2f80ed;
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}

.summary-card {
  color: #fff;
  background: linear-gradient(135deg, #2f80ed, #20bfa9);
}

.summary-card .meta {
  color: rgba(255, 255, 255, 0.76);
}

.summary-title {
  display: block;
  margin: 12px 0;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.7;
}

.warning-card {
  border-color: rgba(255, 181, 71, 0.26);
  background: #fffdf8;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
