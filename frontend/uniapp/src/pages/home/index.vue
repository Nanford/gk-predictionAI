<template>
  <PageShell current="home">
    <view class="page">
      <view class="hero home-hero">
        <view class="eyebrow">
          <AppIcon name="shield" size="xs" />
          <text>公开数据 · AI 辅助解释</text>
        </view>
        <text class="hero-title">
          用历年位次
          <text class="hero-title-em">看清志愿风险</text>
        </text>
        <text class="hero-subtitle">输入广东考生位次，查看院校概率参考、专业风险和志愿梯度诊断。概率由规则计算，AI 只负责解释依据。</text>
        <view class="hero-steps">
          <text>01 填条件</text>
          <text>02 看概率</text>
          <text>03 查依据</text>
        </view>
        <view class="hero-metric-card">
          <text class="hero-metric-label">首版范围</text>
          <text class="hero-metric-value">广东本科批</text>
        </view>
      </view>

      <view class="card form-card">
        <view class="section-head">
          <view>
            <text class="section-title">开始预测</text>
            <text class="meta">先用位次进入，2026 一分一段发布后可自动换算。</text>
          </view>
          <view class="version-badge">广东首版</view>
        </view>

        <view class="grid-two">
          <view class="field">
            <view class="field-label-row">
              <view class="field-icon"><AppIcon name="calendar" size="sm" /></view>
              <text class="field-label">高考年份</text>
            </view>
            <view class="picker">2026 年</view>
          </view>
          <view class="field">
            <view class="field-label-row">
              <view class="field-icon"><AppIcon name="map" size="sm" /></view>
              <text class="field-label">所在省份</text>
            </view>
            <view class="picker">广东省</view>
          </view>
        </view>

        <view class="field">
          <view class="field-label-row">
            <view class="field-icon"><AppIcon name="layers" size="sm" /></view>
            <text class="field-label">报考类型</text>
          </view>
          <picker :range="subjectLabels" :value="subjectIndex" @change="changeSubject">
            <view class="picker">{{ subjectLabels[subjectIndex] }}</view>
          </picker>
        </view>

        <view class="field">
          <view class="field-label-row">
            <view class="field-icon"><AppIcon name="score" size="sm" /></view>
            <text class="field-label">高考分数</text>
          </view>
          <input v-model="score" class="input score-input" type="number" placeholder="可选，例如 620" />
        </view>

        <view class="field">
          <view class="field-label-row">
            <view class="field-icon"><AppIcon name="rank" size="sm" /></view>
            <text class="field-label">全省位次</text>
          </view>
          <input v-model="rank" class="input" type="number" placeholder="2026 分数段发布前请填写位次" />
        </view>

        <view class="notice">
          <AppIcon name="warning" size="sm" />
          <text>2026 年一分一段表尚未导入时，不跨年强行估算位次。只输入分数时会先提示补充位次。</text>
        </view>

        <button class="button button-primary primary-wide" @click="startPrediction">
          <text>开始 AI 志愿预测</text>
          <AppIcon name="arrowRight" size="sm" />
        </button>
      </view>

      <view class="trust-grid">
        <view class="trust-cell">
          <view class="icon-chip"><AppIcon name="trend" size="sm" /></view>
          <text class="value">近 3 年</text>
          <text class="muted">位次趋势对比</text>
        </view>
        <view class="trust-cell">
          <view class="icon-chip"><AppIcon name="school" size="sm" /></view>
          <text class="value">双方向</text>
          <text class="muted">院校 + 专业</text>
        </view>
        <view class="trust-cell">
          <view class="icon-chip"><AppIcon name="doc" size="sm" /></view>
          <text class="value">可追溯</text>
          <text class="muted">来源与依据</text>
        </view>
      </view>
      <DisclaimerBar />
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppIcon from "../../components/AppIcon.vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PageShell from "../../components/PageShell.vue";

const subjectLabels = ["物理类", "历史类"];
const subjectIndex = ref(0);
const score = ref("");
const rank = ref("");

const changeSubject = (event: { detail: { value: string } }) => {
  subjectIndex.value = Number(event.detail.value);
};

const startPrediction = () => {
  if (!rank.value) {
    uni.showToast({ title: "请先填写全省位次", icon: "none" });
    return;
  }
  const subjectType = subjectIndex.value === 0 ? "physics" : "history";
  uni.navigateTo({
    url: `/pages/rank/index?rank=${rank.value}&score=${score.value}&subjectType=${subjectType}`
  });
};
</script>

<style scoped>
.home-hero {
  padding-bottom: 26px;
}

.hero-metric-card {
  z-index: 1;
  display: grid;
  gap: 3px;
  width: 116px;
  margin-top: 16px;
  margin-left: auto;
  padding: 13px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 14px 32px rgba(14, 102, 183, 0.1);
}

.hero-metric-label {
  color: #7b8ba0;
  font-size: 10px;
  font-weight: 900;
}

.hero-metric-value {
  color: #075ec5;
  font-size: 15px;
  font-weight: 950;
}

.version-badge {
  padding: 7px 10px;
  border-radius: 999px;
  color: #047d76;
  background: #e7fbf6;
  font-size: 11px;
  font-weight: 950;
  white-space: nowrap;
}

.score-input {
  color: #1288f1;
  font-size: 24px;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.trust-cell {
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 14px 8px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.7);
  text-align: center;
  box-shadow: 0 10px 28px rgba(25, 49, 78, 0.06);
}

.trust-cell .value {
  color: #172435;
  font-size: 14px;
  font-weight: 950;
}
</style>
