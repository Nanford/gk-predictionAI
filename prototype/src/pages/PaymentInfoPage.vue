<script setup lang="ts">
import { ref } from 'vue'
import DisclaimerBar from '../components/DisclaimerBar.vue'
import { usePredictionStore } from '../stores/prediction'

const store = usePredictionStore()
const selected = ref(30)

const packages = [
  { amount: 0, name: '免费体验', price: '¥0', note: '首次了解产品价值' },
  { amount: 30, name: '轻量 AI 使用包', price: '¥9.9', note: '适合对比少量目标院校' },
  { amount: 100, name: '标准 AI 使用包', price: '¥29.9', note: '适合完整规划志愿单' },
]
</script>

<template>
  <main class="page page-narrow">
    <section>
      <span class="eyebrow">只为 AI 分析能力付费</span>
      <h1 class="page-title">AI 使用费用说明</h1>
      <p class="page-subtitle">购买的是 AI 辅助分析服务，不是录取保证。</p>
    </section>

    <section class="package-list">
      <button
        v-for="item in packages"
        :key="item.amount"
        class="package-card card"
        :class="{ active: selected === item.amount }"
        :disabled="item.amount === 0"
        @click="selected = item.amount"
      >
        <span>{{ item.name }}</span>
        <strong>{{ item.price }}</strong>
        <p>{{ item.amount ? `${item.amount} 次 AI 使用额度` : '注册后自动发放体验额度' }}</p>
        <small>{{ item.note }}</small>
      </button>
    </section>

    <section class="card card-pad">
      <div class="section-head"><h2>服务边界</h2><span>支付前请确认</span></div>
      <ul>
        <li>用于院校预测解释、专业预测解释和志愿单梯度诊断。</li>
        <li>不提供保录、不代填志愿、不承诺最终录取结果。</li>
        <li>异常未生成有效结果时，额度不扣除或自动退回。</li>
      </ul>
    </section>

    <section class="agreement card card-pad">
      <p>确认支付表示已阅读并同意：</p>
      <div class="agreement-links">
        <a href="#">《用户协议》</a>
        <a href="#">《隐私政策》</a>
        <a href="#">《AI 使用说明》</a>
        <a href="#">《预测结果免责声明》</a>
      </div>
    </section>

    <p v-if="store.paymentNotice" class="success-notice">{{ store.paymentNotice }}</p>
    <DisclaimerBar />

    <div class="bottom-action">
      <button
        class="primary-btn wide-btn"
        :disabled="store.paymentLoading"
        @click="store.buyQuota(selected)"
      >
        {{ store.paymentLoading ? '正在模拟到账...' : `模拟确认支付 · ${selected} 次` }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.package-list {
  display: grid;
  gap: 10px;
}

.package-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 8px;
  padding: 14px;
  color: #1f2937;
  text-align: left;
}

.package-card.active {
  border-color: rgba(47, 128, 237, 0.5);
  background: linear-gradient(135deg, #f8fbff, #f0fffb);
  box-shadow: 0 10px 26px rgba(47, 128, 237, 0.12);
}

.package-card span {
  font-size: 14px;
  font-weight: 800;
}

.package-card strong {
  grid-row: span 2;
  align-self: center;
  color: #f97316;
  font-size: 21px;
}

.package-card p,
.package-card small {
  margin: 0;
  color: #7b8798;
  font-size: 11px;
}

ul {
  display: grid;
  gap: 8px;
  margin: 13px 0 0;
  padding-left: 18px;
  color: #5c6878;
  font-size: 12px;
  line-height: 1.8;
}

.agreement p {
  margin: 0;
  color: #7b8798;
  font-size: 11px;
}

.agreement-links {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 11px;
  margin-top: 9px;
}

.agreement-links a {
  color: #185fbe;
  font-size: 11px;
  text-decoration: none;
}

.success-notice {
  margin: 0;
  border-radius: 13px;
  padding: 11px;
  color: #087f75;
  background: #e8fff8;
  font-size: 12px;
  font-weight: 800;
  text-align: center;
}
</style>
