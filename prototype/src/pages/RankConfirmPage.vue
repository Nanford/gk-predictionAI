<script setup lang="ts">
import { useRouter } from 'vue-router'
import DisclaimerBar from '../components/DisclaimerBar.vue'
import { usePredictionStore } from '../stores/prediction'

const store = usePredictionStore()
const router = useRouter()
</script>

<template>
  <main class="page page-narrow">
    <section>
      <span class="eyebrow">位次换算完成</span>
      <h1 class="page-title">确认你的参考位次</h1>
      <p class="page-subtitle">位次比单年分数更适合用于跨年度比较。</p>
    </section>

    <section class="rank-hero card">
      <span>{{ store.candidate.province }} · {{ store.candidate.category }}</span>
      <strong>#{{ store.candidate.rank.toLocaleString() }}</strong>
      <p>全省参考位次</p>
      <div class="score-badge">{{ store.candidate.score }} 分</div>
    </section>

    <section class="card card-pad">
      <div class="info-grid">
        <div class="info-cell"><span>高考年份</span><strong>{{ store.candidate.year }}</strong></div>
        <div class="info-cell"><span>本科批次线</span><strong>已超过</strong></div>
        <div class="info-cell"><span>选科组合</span><strong>{{ store.candidate.subjects.join(' + ') }}</strong></div>
        <div class="info-cell"><span>换算依据</span><strong>一分一段表</strong></div>
      </div>
    </section>

    <section class="notice">
      原型中的分数、位次和院校数据用于演示交互。正式上线前需要接入广东省教育考试院公开数据并完成校验。
    </section>

    <DisclaimerBar />

    <div class="bottom-action">
      <button class="primary-btn wide-btn" @click="router.push('/universities')">查看院校推荐</button>
    </div>
  </main>
</template>

<style scoped>
.rank-hero {
  position: relative;
  overflow: hidden;
  padding: 24px 18px;
  color: white;
  background: linear-gradient(135deg, #2f80ed, #20bfa9);
}

.rank-hero span,
.rank-hero p {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
}

.rank-hero strong {
  display: block;
  margin-top: 18px;
  font-size: 54px;
  letter-spacing: -0.08em;
}

.score-badge {
  position: absolute;
  right: 18px;
  bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 99px;
  padding: 7px 10px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 12px;
  font-weight: 800;
}
</style>
