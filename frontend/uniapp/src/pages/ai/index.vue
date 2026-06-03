<template>
  <PageShell title="AI 分析" current="none">
    <view class="page">
      <view v-if="loading" class="analysis-loading card">
        <text class="loading-dot"></text>
        <text class="section-title">正在整理风险依据</text>
        <text class="meta">基础概率已经生成，AI 正在补充原因说明和官方资料核对清单。</text>
      </view>

      <view v-else-if="explanation" class="content-stack">
        <view class="result-hero">
          <view class="school-head">
            <view>
              <text class="school-name">AI 辅助分析</text>
              <text class="school-meta">生成方式：{{ explanation.generatedBy === "deepseek" ? "DeepSeek AI" : "规则模板回退" }}</text>
            </view>
            <text class="tag safe">{{ explanation.quotaCharged ? "消耗 1 次" : "未扣额度" }}</text>
          </view>
          <view class="result-num">
            <view>
              <text class="summary-title">{{ explanation.summary }}</text>
              <text class="school-meta">AI 只解释已计算的结构化概率，不修改概率。</text>
            </view>
          </view>
        </view>

        <view class="ai-card">
          <text class="section-title">关键依据</text>
          <view class="reason-list">
            <view v-for="(item, index) in explanation.reasoning" :key="item" class="reason">
              <text class="reason-index">{{ index + 1 }}</text>
              <text>{{ item }}</text>
            </view>
          </view>
        </view>

        <view class="ai-card warning-card">
          <text class="section-title">风险提示</text>
          <view class="reason-list">
            <view v-for="(item, index) in explanation.riskWarning" :key="item" class="reason">
              <text class="reason-index">{{ index + 1 }}</text>
              <text>{{ item }}</text>
            </view>
          </view>
        </view>

        <view class="card pay-card">
          <view class="school-head">
            <view>
              <text class="school-name">下一步建议</text>
              <text class="school-meta">结合官方招生计划继续核对</text>
            </view>
          </view>
          <view class="reason-list">
            <view v-for="(item, index) in explanation.nextActions" :key="item" class="reason">
              <text class="reason-index">{{ index + 1 }}</text>
              <text>{{ item }}</text>
            </view>
          </view>
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
.reason-list {
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

.result-hero {
  padding: 17px;
  border: 1px solid #e5eef8;
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(32, 191, 169, 0.2), transparent 38%),
    linear-gradient(135deg, #ffffff, #f7fcff);
  box-shadow: 0 12px 28px rgba(47, 128, 237, 0.1);
}

.school-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.school-name,
.school-meta,
.summary-title {
  display: block;
}

.school-name {
  color: #1f2937;
  font-size: 16px;
  font-weight: 900;
}

.school-meta {
  margin-top: 6px;
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.6;
}

.summary-title {
  margin-top: 12px;
  color: #1f2937;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.55;
}

.ai-card {
  padding: 14px;
  border: 1px solid transparent;
  border-radius: 20px;
  background:
    linear-gradient(#fff, #fff) padding-box,
    linear-gradient(135deg, rgba(47, 128, 237, 0.45), rgba(32, 191, 169, 0.38)) border-box;
}

.warning-card {
  background:
    linear-gradient(#fff, #fff) padding-box,
    linear-gradient(135deg, rgba(255, 181, 71, 0.42), rgba(255, 143, 61, 0.22)) border-box;
}

.reason {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-radius: 14px;
  color: #6b7280;
  background: #f8fbff;
  font-size: 12px;
  line-height: 1.5;
}

.reason-index {
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  flex: 0 0 18px;
  border-radius: 50%;
  color: #047857;
  background: #e8fff8;
  font-size: 11px;
  font-weight: 900;
}

.pay-card {
  border-color: rgba(255, 181, 71, 0.28);
  background: linear-gradient(135deg, #fff7e8, #ffffff);
}

.tag.safe {
  color: #047857;
  background: #e8fff8;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
