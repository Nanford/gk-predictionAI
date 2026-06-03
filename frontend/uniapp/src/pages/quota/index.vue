<template>
  <PageShell title="AI 使用额度" current="quota">
    <view class="page">
      <view class="quota-hero card">
        <text>当前可用额度</text>
        <text class="quota-number">{{ quota.available }}<text class="quota-unit"> 次</text></text>
        <text>已使用 {{ quota.consumed }} 次 · 处理中 {{ quota.reserved }} 次</text>
      </view>

      <view class="card">
        <view class="section-head"><text class="section-title">哪些操作消耗额度？</text><text class="muted">按次扣除</text></view>
        <view class="quota-rule">
          <view><text class="title">消耗额度</text><text class="meta">新的院校 AI 解读、专业 AI 解读、志愿单深度分析。</text></view>
          <view><text class="title">不消耗额度</text><text class="meta">查看基础信息、历史数据、已有结果、数据来源和志愿单。</text></view>
        </view>
      </view>

      <view class="notice">AI 调用失败、超时或未生成有效结果时，不扣除额度或自动退回。重复查看同一结果不重复扣费。</view>
      <button class="button button-primary primary-wide" @click="openPayment">查看 AI 使用费用说明</button>
      <button class="button button-light primary-wide" @click="topUp">开发环境模拟充值 +30</button>
      <DisclaimerBar compact />
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { reactive } from "vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PageShell from "../../components/PageShell.vue";
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

const openPayment = () => uni.navigateTo({ url: "/pages/payment/index" });
</script>

<style scoped>
.quota-hero {
  color: #fff;
  background: linear-gradient(135deg, #2f80ed, #20bfa9);
}

.quota-hero text {
  display: block;
  color: rgba(255, 255, 255, 0.76);
  font-size: 12px;
}

.quota-number {
  margin: 14px 0 8px;
  color: #fff !important;
  font-size: 58px !important;
  font-weight: 900;
  letter-spacing: -0.08em;
}

.quota-unit {
  display: inline !important;
  color: rgba(255, 255, 255, 0.86) !important;
  font-size: 20px !important;
}

.quota-rule {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.quota-rule view {
  display: grid;
  gap: 5px;
  padding: 11px;
  border-radius: 14px;
  background: #f8fbff;
}
</style>
