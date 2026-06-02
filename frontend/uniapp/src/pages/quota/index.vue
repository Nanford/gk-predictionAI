<template>
  <view class="page">
    <view class="hero">
      <text class="hero-title">AI 使用额度</text>
      <text class="hero-subtitle">额度仅用于生成新的 AI 风险解读。查看已有结果和模板回退不扣额度。</text>
    </view>
    <view class="card">
      <text class="label">当前可用额度</text>
      <text class="probability">{{ quota.available }}</text>
      <text class="meta">已使用 {{ quota.consumed }} 次 · 处理中 {{ quota.reserved }} 次</text>
      <button class="button button-light primary-wide" @click="topUp">开发环境模拟充值 +30</button>
    </view>
    <DisclaimerBar compact />
  </view>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { reactive } from "vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import { api } from "../../services/api";

const quota = reactive({ available: 0, consumed: 0, reserved: 0 });

const load = async () => Object.assign(quota, await api.authenticatedRequest<typeof quota>("/quota"));
onShow(load);

const topUp = async () => {
  Object.assign(
    quota,
    await api.authenticatedRequest<typeof quota>("/dev/quota/top-up", {
      method: "POST",
      data: { amount: 30 }
    })
  );
};
</script>
