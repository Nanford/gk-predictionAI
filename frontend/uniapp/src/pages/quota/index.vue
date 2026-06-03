<template>
  <PageShell title="AI 使用额度" current="quota">
    <view class="page">
      <view class="quota-hero card">
        <view class="quota-glow"></view>
        <view class="section-head">
          <view>
            <text class="quota-label">当前可用额度</text>
            <text class="quota-number">{{ quota.available }}<text class="quota-unit"> 次</text></text>
          </view>
          <view class="quota-icon"><AppIcon name="wallet" size="lg" /></view>
        </view>
        <text class="quota-sub">已使用 {{ quota.consumed }} 次 · 处理中 {{ quota.reserved }} 次</text>
      </view>

      <view class="card">
        <view class="section-head">
          <view class="section-title-row">
            <view class="icon-chip"><AppIcon name="coin" size="sm" /></view>
            <text class="section-title">哪些操作消耗额度？</text>
          </view>
          <text class="muted">按次扣除</text>
        </view>
        <view class="quota-rule">
          <view class="rule-card">
            <view class="row-icon"><AppIcon name="spark" size="sm" /></view>
            <view>
              <text class="title">消耗额度</text>
              <text class="meta">新的院校 AI 解读、专业 AI 解读、志愿单深度分析。</text>
            </view>
          </view>
          <view class="rule-card">
            <view class="row-icon"><AppIcon name="check" size="sm" /></view>
            <view>
              <text class="title">不消耗额度</text>
              <text class="meta">查看基础信息、历史数据、已有结果、数据来源和志愿单。</text>
            </view>
          </view>
        </view>
      </view>

      <view class="notice">
        <AppIcon name="warning" size="sm" />
        <text>AI 调用失败、超时或未生成有效结果时，不扣除额度或自动退回。重复查看同一结果不重复扣费。</text>
      </view>
      <button class="button button-primary primary-wide" @click="openPayment">
        <text>查看 AI 使用费用说明</text>
        <AppIcon name="arrowRight" size="sm" />
      </button>
      <button class="button button-light primary-wide" @click="topUp">
        <AppIcon name="coin" size="sm" />
        <text>开发环境模拟充值 +30</text>
      </button>
      <DisclaimerBar compact />
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { reactive } from "vue";
import AppIcon from "../../components/AppIcon.vue";
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
.section-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quota-hero {
  overflow: hidden;
  color: #fff;
  background:
    radial-gradient(circle at 90% 16%, rgba(255, 255, 255, 0.26), transparent 7rem),
    linear-gradient(135deg, #1288f1, #10b8aa);
  box-shadow: 0 24px 54px rgba(18, 136, 241, 0.26);
}

.quota-glow {
  position: absolute;
  right: -58px;
  bottom: -70px;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
}

.quota-label,
.quota-sub {
  display: block;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  font-weight: 800;
}

.quota-number {
  display: block;
  margin: 13px 0 8px;
  color: #fff;
  font-size: 68px;
  font-weight: 950;
  letter-spacing: -0.1em;
}

.quota-unit {
  display: inline;
  color: rgba(255, 255, 255, 0.88);
  font-size: 21px;
  letter-spacing: 0;
}

.quota-icon {
  display: grid;
  width: 62px;
  height: 62px;
  place-items: center;
  border-radius: 23px;
  background: rgba(255, 255, 255, 0.22);
}

.quota-rule {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.rule-card {
  display: flex;
  gap: 12px;
  padding: 13px;
  border-radius: 20px;
  background: rgba(248, 251, 255, 0.92);
}
</style>
