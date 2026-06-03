<template>
  <PageShell title="AI 使用费用" back-url="/pages/quota/index" current="none">
    <view class="page">
      <view class="page-heading">
        <view class="eyebrow">
          <AppIcon name="wallet" size="xs" />
          <text>只为 AI 分析能力付费</text>
        </view>
        <text class="page-title">AI 使用费用说明</text>
        <text class="hero-subtitle">购买的是 AI 辅助分析服务，不是录取保证，不提供保录或代填志愿。</text>
      </view>

      <view class="package-list">
        <button
          v-for="item in packages"
          :key="item.amount"
          class="card package-card"
          :class="{ active: selected === item.amount }"
          :disabled="item.amount === 0"
          @click="selected = item.amount"
        >
          <view class="package-icon"><AppIcon :name="item.icon" size="sm" /></view>
          <view class="package-main">
            <text class="title">{{ item.name }}</text>
            <text class="meta">{{ item.note }}</text>
          </view>
          <view class="price-box">
            <text class="price">{{ item.price }}</text>
            <text class="meta">{{ item.amount ? `${item.amount} 次` : "体验" }}</text>
          </view>
          <view v-if="selected === item.amount" class="selected-dot"><AppIcon name="check" size="xs" /></view>
        </button>
      </view>

      <view class="card">
        <view class="section-head">
          <view class="section-title-row">
            <view class="icon-chip"><AppIcon name="shield" size="sm" /></view>
            <text class="section-title">服务边界</text>
          </view>
          <text class="muted">支付前确认</text>
        </view>
        <view class="reason-list">
          <view><AppIcon name="check" size="xs" /><text>用于院校预测解释、专业预测解释和志愿单梯度诊断。</text></view>
          <view><AppIcon name="warning" size="xs" /><text>不提供保录、不代填志愿、不承诺最终录取结果。</text></view>
          <view><AppIcon name="check" size="xs" /><text>异常未生成有效结果时，额度不扣除或自动退回。</text></view>
        </view>
      </view>

      <view v-if="paymentNotice" class="success-notice">
        <AppIcon name="check" size="sm" />
        <text>{{ paymentNotice }}</text>
      </view>
      <DisclaimerBar compact />

      <view class="bottom-action">
        <button class="button button-primary" :disabled="loading" @click="buyQuota">
          <text>{{ loading ? "正在模拟到账..." : `模拟确认支付 · ${selected} 次` }}</text>
          <AppIcon v-if="!loading" name="arrowRight" size="sm" />
        </button>
      </view>
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppIcon from "../../components/AppIcon.vue";
import type { IconName } from "../../components/icon-registry";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PageShell from "../../components/PageShell.vue";
import { api } from "../../services/api";

const selected = ref(30);
const loading = ref(false);
const paymentNotice = ref("");
const packages: ReadonlyArray<{ amount: number; name: string; price: string; note: string; icon: IconName }> = [
  { amount: 0, name: "免费体验", price: "¥0", note: "匿名进入后自动发放体验额度", icon: "spark" },
  { amount: 30, name: "轻量 AI 使用包", price: "¥9.9", note: "适合对比少量目标院校", icon: "coin" },
  { amount: 100, name: "标准 AI 使用包", price: "¥29.9", note: "适合完整规划志愿单", icon: "wallet" }
];

const buyQuota = async () => {
  loading.value = true;
  try {
    await api.authenticatedRequest("/dev/quota/top-up", {
      method: "POST",
      data: { amount: selected.value }
    });
    paymentNotice.value = `模拟到账成功，已增加 ${selected.value} 次 AI 使用额度。`;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.page-heading,
.reason-list {
  display: grid;
  gap: 10px;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.package-list {
  display: grid;
  gap: 12px;
}

.package-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 92px;
  text-align: left;
}

.package-card.active {
  border-color: rgba(18, 136, 241, 0.5);
  background: linear-gradient(135deg, #f8fbff, #f0fffb);
  box-shadow: 0 18px 42px rgba(18, 136, 241, 0.16);
}

.package-icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 17px;
  background: linear-gradient(145deg, #e9f5ff, #e7fbf6);
}

.package-main {
  display: grid;
  flex: 1;
  gap: 4px;
}

.price {
  color: #f97316;
  font-size: 22px;
  font-weight: 950;
}

.price-box {
  display: grid;
  justify-items: end;
}

.selected-dot {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 999px;
  background: #e7fbf6;
}

.reason-list view {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #5c6878;
  font-size: 12px;
  line-height: 1.8;
}

.success-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 18px;
  color: #047d76;
  background: #e7fbf6;
  font-size: 12px;
  font-weight: 950;
}
</style>
