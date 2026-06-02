<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfidenceBadge from '../components/ConfidenceBadge.vue'
import DisclaimerBar from '../components/DisclaimerBar.vue'
import ProbabilityRange from '../components/ProbabilityRange.vue'
import RiskTag from '../components/RiskTag.vue'
import TrendChart from '../components/TrendChart.vue'
import { usePredictionStore } from '../stores/prediction'

const route = useRoute()
const router = useRouter()
const store = usePredictionStore()

onMounted(() => store.selectUniversity(String(route.params.id)))
</script>

<template>
  <main class="page detail-page">
    <section class="detail-hero card">
      <div class="school-line">
        <div>
          <span class="eyebrow">广东省 · 普通类物理</span>
          <h1>{{ store.selectedUniversity.name }}</h1>
          <p>{{ store.selectedUniversity.city }} · {{ store.selectedUniversity.tags.join(' · ') }}</p>
        </div>
        <ProbabilityRange
          :probability="store.selectedUniversity.probability"
          :low="store.selectedUniversity.probabilityLow"
          :high="store.selectedUniversity.probabilityHigh"
        />
      </div>
      <div class="chip-row">
        <RiskTag :label="store.selectedUniversity.riskLabel" />
        <ConfidenceBadge :level="store.selectedUniversity.confidence" />
      </div>
      <p class="intro">{{ store.selectedUniversity.intro }}</p>
    </section>

    <div class="page-grid">
      <div class="content-stack">
        <TrendChart :history="store.selectedUniversity.history" />
        <section class="card card-pad">
          <div class="section-head">
            <h2>关键依据</h2>
            <span>结构化数据</span>
          </div>
          <ul class="reason-list">
            <li>{{ store.selectedUniversity.minRankSummary }}</li>
            <li>{{ store.selectedUniversity.planChange }}</li>
            <li>当前参考位次约 {{ store.candidate.rank.toLocaleString() }} 名，需要结合专业组继续判断。</li>
          </ul>
        </section>
      </div>
      <div class="content-stack">
        <section class="card card-pad">
          <div class="section-head">
            <h2>招生计划变化</h2>
            <span>近三年</span>
          </div>
          <div class="plan-list">
            <div v-for="item in store.selectedUniversity.history" :key="item.year">
              <span>{{ item.year }}</span>
              <strong>{{ item.planCount }} 人</strong>
            </div>
          </div>
        </section>
        <section class="card card-pad">
          <div class="section-head">
            <h2>数据来源</h2>
            <span>正式上线前需校验</span>
          </div>
          <a
            v-for="source in store.selectedUniversity.sourceItems"
            :key="source.name"
            class="source"
            :href="source.url"
            target="_blank"
          >
            <b>{{ source.name }}</b>
            <span>{{ source.updatedAt }}</span>
          </a>
        </section>
      </div>
    </div>

    <DisclaimerBar />

    <div class="bottom-action">
      <button class="ghost-btn" @click="store.addUniversity(store.selectedUniversity.id)">
        {{ store.hasUniversity(store.selectedUniversity.id) ? '已加入志愿单' : '+ 志愿单' }}
      </button>
      <button class="primary-btn" @click="router.push(`/universities/${store.selectedUniversity.id}/majors`)">
        查看专业预测
      </button>
    </div>
  </main>
</template>

<style scoped>
.detail-page {
  max-width: 980px;
  margin: 0 auto;
}

.detail-hero {
  display: grid;
  gap: 14px;
  padding: 18px;
  background: linear-gradient(135deg, #ffffff, #f3fbff 56%, #f0fffb);
}

.school-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

h1 {
  margin: 16px 0 4px;
  font-size: 25px;
  letter-spacing: -0.04em;
}

p {
  margin: 0;
}

.school-line p,
.intro {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.8;
}

.content-stack {
  display: grid;
  gap: 14px;
}

.reason-list {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.reason-list li {
  position: relative;
  padding-left: 16px;
  color: #5c6878;
  font-size: 12px;
  line-height: 1.75;
}

.reason-list li::before {
  position: absolute;
  top: 8px;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #20bfa9;
  content: '';
}

.plan-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 13px;
}

.plan-list div {
  display: grid;
  gap: 5px;
  border-radius: 13px;
  padding: 10px;
  background: #f8fbff;
}

.plan-list span,
.source span {
  color: #7b8798;
  font-size: 10px;
}

.plan-list strong {
  color: #185fbe;
  font-size: 14px;
}

.source {
  display: grid;
  gap: 4px;
  margin-top: 12px;
  color: #185fbe;
  text-decoration: none;
  font-size: 12px;
}
</style>
