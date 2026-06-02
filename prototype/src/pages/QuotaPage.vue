<script setup lang="ts">
import { RouterLink } from 'vue-router'
import DisclaimerBar from '../components/DisclaimerBar.vue'
import { usePredictionStore } from '../stores/prediction'

const store = usePredictionStore()
</script>

<template>
  <main class="page page-narrow">
    <section class="quota-hero card">
      <span>当前可用额度</span>
      <strong>{{ store.availableQuota }}<small> 次</small></strong>
      <p>免费额度 {{ store.freeQuota }} 次 · 已购额度 {{ store.paidQuota }} 次</p>
    </section>

    <section class="card card-pad">
      <div class="section-head"><h2>哪些操作消耗额度？</h2><span>按次扣除</span></div>
      <div class="quota-rule">
        <div><b>消耗额度</b><span>新的院校 AI 分析、专业 AI 分析、志愿单梯度诊断</span></div>
        <div><b>不消耗额度</b><span>查看基础信息、历史数据、已有结果、数据来源和志愿单</span></div>
      </div>
    </section>

    <section class="notice">
      AI 调用失败、超时或未生成有效结果时，不扣除额度或自动退回。重复查看同一结果不重复扣费。
    </section>

    <RouterLink class="primary-btn wide-btn link-btn" to="/payment">查看 AI 使用费用说明</RouterLink>
    <DisclaimerBar />
  </main>
</template>

<style scoped>
.quota-hero {
  padding: 20px;
  color: white;
  background: linear-gradient(135deg, #2f80ed, #20bfa9);
}

.quota-hero span,
.quota-hero p {
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
  font-size: 12px;
}

.quota-hero strong {
  display: block;
  margin: 14px 0 8px;
  font-size: 56px;
  letter-spacing: -0.08em;
}

.quota-hero small {
  font-size: 20px;
}

.quota-rule {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.quota-rule div {
  display: grid;
  gap: 5px;
  border-radius: 14px;
  padding: 11px;
  background: #f8fbff;
}

.quota-rule b {
  color: #185fbe;
  font-size: 13px;
}

.quota-rule span {
  color: #6b7280;
  font-size: 11px;
  line-height: 1.8;
}

.link-btn {
  text-decoration: none;
  font-size: 13px;
}
</style>
