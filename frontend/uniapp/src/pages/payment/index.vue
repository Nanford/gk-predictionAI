<template>
  <PageShell title="AI 使用费用" back-url="/pages/quota/index" current="none">
    <view class="page">
      <view>
        <text class="eyebrow">只为 AI 分析能力付费</text>
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
          <view>
            <text class="title">{{ item.name }}</text>
            <text class="meta">{{ item.note }}</text>
          </view>
          <view class="price-box">
            <text class="price">{{ item.price }}</text>
            <text class="meta">{{ item.amount ? `${item.amount} 次` : "体验" }}</text>
          </view>
        </button>
      </view>

      <view class="card">
        <view class="section-head"><text class="section-title">服务边界</text><text class="muted">支付前确认</text></view>
        <view class="reason-list">
          <text>· 用于院校预测解释、专业预测解释和志愿单梯度诊断。</text>
          <text>· 不提供保录、不代填志愿、不承诺最终录取结果。</text>
          <text>· 异常未生成有效结果时，额度不扣除或自动退回。</text>
        </view>
      </view>

      <view v-if="paymentNotice" class="success-notice">{{ paymentNotice }}</view>
      <DisclaimerBar compact />

      <view class="bottom-action">
        <button class="button button-primary" :disabled="loading" @click="buyQuota">
          {{ loading ? "正在模拟到账..." : `模拟确认支付 · ${selected} 次` }}
        </button>
      </view>
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PageShell from "../../components/PageShell.vue";
import { api } from "../../services/api";

const selected = ref(30);
const loading = ref(false);
const paymentNotice = ref("");
const packages = [
  { amount: 0, name: "免费体验", price: "¥0", note: "匿名进入后自动发放体验额度" },
  { amount: 30, name: "轻量 AI 使用包", price: "¥9.9", note: "适合对比少量目标院校" },
  { amount: 100, name: "标准 AI 使用包", price: "¥29.9", note: "适合完整规划志愿单" }
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
.page-title {
  display: block;
  margin-top: 12px;
  font-size: 25px;
  font-weight: 900;
}

.package-list,
.reason-list {
  display: grid;
  gap: 10px;
}

.package-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
}

.package-card.active {
  border-color: rgba(47, 128, 237, 0.5);
  background: linear-gradient(135deg, #f8fbff, #f0fffb);
  box-shadow: 0 10px 26px rgba(47, 128, 237, 0.12);
}

.price {
  color: #f97316;
  font-size: 21px;
  font-weight: 900;
}

.price-box {
  display: grid;
  justify-items: end;
}

.reason-list text {
  color: #5c6878;
  font-size: 12px;
  line-height: 1.8;
}

.success-notice {
  padding: 11px;
  border-radius: 13px;
  color: #087f75;
  background: #e8fff8;
  font-size: 12px;
  font-weight: 800;
  text-align: center;
}
</style>
