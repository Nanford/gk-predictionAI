<template>
  <view class="page">
    <view class="hero">
      <text class="hero-title">AI 高考志愿预测辅助参考</text>
      <text class="hero-subtitle">输入广东省考生位次，基于历年公开录取数据查看院校录取概率参考、风险等级和历史依据。</text>
    </view>

    <view class="card">
      <text class="section-title">开始预测</text>
      <view class="grid-two">
        <view class="field">
          <text class="label">省份</text>
          <view class="picker">广东省</view>
        </view>
        <view class="field">
          <text class="label">高考年份</text>
          <view class="picker">2026</view>
        </view>
      </view>
      <view class="field">
        <text class="label">科目类型</text>
        <picker :range="subjectLabels" :value="subjectIndex" @change="changeSubject">
          <view class="picker">{{ subjectLabels[subjectIndex] }}</view>
        </picker>
      </view>
      <view class="field">
        <text class="label">高考分数（可选）</text>
        <input v-model="score" class="input" type="number" placeholder="例如：620" />
      </view>
      <view class="field">
        <text class="label">全省位次</text>
        <input v-model="rank" class="input" type="number" placeholder="2026 分数段发布前请手工填写位次" />
      </view>
      <text class="warning">2026 年一分一段表发布前，不跨年强行估算位次。</text>
      <button class="button button-primary primary-wide" @click="startPrediction">查看院校预测</button>
    </view>
    <DisclaimerBar />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";

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
    url: `/pages/results/index?rank=${rank.value}&score=${score.value}&subjectType=${subjectType}`
  });
};
</script>
