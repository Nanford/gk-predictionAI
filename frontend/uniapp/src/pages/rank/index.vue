<template>
  <PageShell title="位次确认" back-url="/pages/home/index" current="none">
    <view class="page">
      <view>
        <view class="eyebrow">
          <AppIcon name="rank" size="xs" />
          <text>位次确认</text>
        </view>
        <text class="page-title">确认你的参考位次</text>
        <text class="hero-subtitle">位次比单年分数更适合用于跨年度比较。当前正式预测以你填写的全省位次为准。</text>
      </view>

      <view class="rank-hero card">
        <view class="rank-hero-icon"><AppIcon name="target" size="lg" /></view>
        <text class="muted">{{ subjectLabel }} · 广东省</text>
        <text class="rank-number">#{{ rankText }}</text>
        <text class="muted">全省参考位次</text>
        <view v-if="score" class="score-badge">{{ score }} 分</view>
      </view>

      <view class="card">
        <view class="info-grid">
          <view class="info-cell"><text class="muted">高考年份</text><text class="value">2026</text></view>
          <view class="info-cell"><text class="muted">省份</text><text class="value">广东</text></view>
          <view class="info-cell"><text class="muted">科目类型</text><text class="value">{{ subjectLabel }}</text></view>
          <view class="info-cell"><text class="muted">换算状态</text><text class="value">手工位次</text></view>
        </view>
      </view>

      <view class="notice">2026 年官方一分一段表导入前，系统不会使用 2025 年数据强行换算。正式填报前请再次核对省教育考试院公告。</view>
      <DisclaimerBar compact />

      <view class="bottom-action">
        <button class="button button-ghost" @click="goHome">
          <AppIcon name="back" size="sm" />
          <text>重新填写</text>
        </button>
        <button class="button button-primary" @click="openResults">
          <text>查看院校推荐</text>
          <AppIcon name="arrowRight" size="sm" />
        </button>
      </view>
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import AppIcon from "../../components/AppIcon.vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PageShell from "../../components/PageShell.vue";
import type { SubjectType } from "../../types/prediction";
import { normalizeRouteQuery } from "../../utils/route-query";

const rank = ref(0);
const score = ref("");
const subjectType = ref<SubjectType>("physics");
const subjectLabel = computed(() => (subjectType.value === "history" ? "历史类" : "物理类"));
const rankText = computed(() => rank.value.toLocaleString("zh-CN"));

onLoad((query) => {
  const normalized = normalizeRouteQuery(query ?? {});
  rank.value = Number(normalized.rank ?? 0);
  score.value = String(normalized.score ?? "");
  subjectType.value = normalized.subjectType === "history" ? "history" : "physics";
});

const goHome = () => uni.reLaunch({ url: "/pages/home/index" });
const openResults = () => {
  uni.navigateTo({
    url: `/pages/results/index?rank=${rank.value}&score=${score.value}&subjectType=${subjectType.value}`
  });
};
</script>

<style scoped>
.rank-hero {
  position: relative;
  overflow: hidden;
  color: #fff;
  background:
    radial-gradient(circle at 88% 16%, rgba(255, 255, 255, 0.24), transparent 7rem),
    linear-gradient(135deg, #1288f1, #10b8aa);
  box-shadow: 0 24px 54px rgba(18, 136, 241, 0.24);
}

.rank-hero .muted {
  color: rgba(255, 255, 255, 0.78);
}

.rank-number {
  display: block;
  margin-top: 16px;
  font-size: 58px;
  font-weight: 950;
  letter-spacing: -0.08em;
}

.rank-hero-icon {
  position: absolute;
  top: 18px;
  right: 18px;
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.2);
}

.score-badge {
  position: absolute;
  right: 18px;
  bottom: 20px;
  padding: 7px 10px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 12px;
  font-weight: 800;
}
</style>
