<template>
  <PageShell current="home">
    <view class="page">
      <view class="hero">
        <view class="hero-orb orb-a"></view>
        <view class="hero-orb orb-b"></view>
        <text class="eyebrow">公开数据 · AI 辅助解释</text>
        <text class="hero-title">用历年数据，<text class="hero-title-em">看清志愿选择</text></text>
        <text class="hero-subtitle">输入广东省考生位次，查看院校概率参考、专业风险和志愿梯度诊断。</text>
        <view class="hero-steps">
          <text>01 输入条件</text>
          <text>02 查看概率</text>
          <text>03 理解风险</text>
        </view>
      </view>

      <view class="card form-card">
        <view class="section-head">
          <text class="section-title">开始预测</text>
          <text class="muted">广东首版</text>
        </view>
        <view class="grid-two">
          <view class="field">
            <text class="field-label">高考年份</text>
            <view class="picker">2026 年</view>
          </view>
          <view class="field">
            <text class="field-label">所在省份</text>
            <view class="picker">广东省</view>
          </view>
        </view>
        <view class="field">
          <text class="field-label">报考类型</text>
          <picker :range="subjectLabels" :value="subjectIndex" @change="changeSubject">
            <view class="picker">{{ subjectLabels[subjectIndex] }}</view>
          </picker>
        </view>
        <view class="field">
          <text class="field-label">高考分数</text>
          <input v-model="score" class="input score-input" type="number" placeholder="可选，例如 620" />
        </view>
        <view class="field">
          <text class="field-label">全省位次</text>
          <input v-model="rank" class="input" type="number" placeholder="2026 分数段发布前请填写位次" />
        </view>
        <view class="notice">2026 年一分一段表尚未导入时，不跨年强行估算位次。只输入分数时会先提示补充位次。</view>
        <button class="button button-primary primary-wide" @click="startPrediction">开始 AI 志愿预测</button>
      </view>

      <view class="trust-grid">
        <view class="trust-cell"><text class="value">近 3 年</text><text class="muted">位次趋势</text></view>
        <view class="trust-cell"><text class="value">双方向</text><text class="muted">院校 + 专业</text></view>
        <view class="trust-cell"><text class="value">可解释</text><text class="muted">依据可追溯</text></view>
      </view>
      <DisclaimerBar />
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
.score-input {
  color: #2f80ed;
  font-size: 24px;
  font-weight: 800;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.trust-cell {
  display: grid;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.72);
  text-align: center;
}
</style>
