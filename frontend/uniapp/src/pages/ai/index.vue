<template>
  <view class="page">
    <view class="hero">
      <text class="hero-title">AI 风险解读</text>
      <text class="hero-subtitle">AI 只解释已经计算完成的结构化概率，不会修改概率，也不替代最终志愿决策。</text>
    </view>
    <view class="card">
      <button v-if="!explanation" class="button button-primary primary-wide" @click="generate">生成 AI 解读</button>
      <template v-else>
        <text class="section-title">{{ explanation.summary }}</text>
        <text class="meta">生成方式：{{ explanation.generatedBy === "deepseek" ? "DeepSeek AI" : "规则模板回退" }}</text>
        <text v-for="item in explanation.reasoning" :key="item" class="meta">· {{ item }}</text>
        <text v-for="item in explanation.riskWarning" :key="item" class="warning">· {{ item }}</text>
      </template>
    </view>
    <button class="button button-light primary-wide" @click="openQuota">查看 AI 使用额度</button>
    <DisclaimerBar compact />
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
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

onLoad((query) => {
  predictionId.value = Number(normalizeRouteQuery(query ?? {}).predictionId ?? 0);
});

const generate = async () => {
  explanation.value = await api.authenticatedRequest<Explanation>(
    `/predictions/${predictionId.value}/ai-explanation`,
    { method: "POST" }
  );
};

const openQuota = () => uni.navigateTo({ url: "/pages/quota/index" });
</script>
