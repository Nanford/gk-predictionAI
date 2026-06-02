<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import DisclaimerBar from '../components/DisclaimerBar.vue'
import { provinces } from '../data/demo'
import { usePredictionStore } from '../stores/prediction'

const store = usePredictionStore()
const router = useRouter()
const unavailable = ref(false)
const optionalSubjects = ['化学', '生物', '政治', '地理']
const provinceSupported = computed(() => store.candidate.province === '广东省')

function toggleSubject(subject: string) {
  const selected = store.candidate.subjects
  const index = selected.indexOf(subject)
  if (index >= 0) selected.splice(index, 1)
  else selected.push(subject)
}

async function beginPrediction() {
  unavailable.value = !provinceSupported.value
  if (unavailable.value) return
  await store.confirmRank()
  await router.push('/rank')
}
</script>

<template>
  <main class="page home-page">
    <section class="hero">
      <div class="hero-orb orb-a"></div>
      <div class="hero-orb orb-b"></div>
      <span class="eyebrow">公开数据 · AI 辅助解释</span>
      <h1>用历年数据，<br /><em>看清志愿选择</em></h1>
      <p>输入分数、位次和选科条件，获取院校概率参考与专业风险提示。</p>
      <div class="hero-steps">
        <span><b>01</b> 输入条件</span>
        <span><b>02</b> 查看概率</span>
        <span><b>03</b> 理解风险</span>
      </div>
    </section>

    <section class="card card-pad form-card">
      <div class="section-head">
        <h2>开始预测</h2>
        <span>广东完整演示</span>
      </div>
      <div class="form-grid">
        <div class="double-grid">
          <div class="field">
            <label>高考年份</label>
            <select v-model.number="store.candidate.year">
              <option :value="2026">2026 年</option>
            </select>
          </div>
          <div class="field">
            <label>所在省份</label>
            <select v-model="store.candidate.province" @change="unavailable = false">
              <option v-for="province in provinces" :key="province">{{ province }}</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label>报考类型</label>
          <select v-model="store.candidate.category">
            <option>普通类物理</option>
          </select>
        </div>
        <div class="field">
          <label>再选科目</label>
          <div class="chip-row">
            <button
              v-for="subject in optionalSubjects"
              :key="subject"
              type="button"
              class="chip"
              :class="{ active: store.candidate.subjects.includes(subject) }"
              @click="toggleSubject(subject)"
            >
              {{ subject }}
            </button>
          </div>
        </div>
        <div class="field">
          <label>高考分数</label>
          <div class="score-input">
            <input v-model.number="store.candidate.score" type="number" min="0" max="750" />
            <span>/ 750 分</span>
          </div>
        </div>
      </div>
      <button class="primary-btn wide-btn" @click="beginPrediction">
        开始 AI 志愿预测
        <span>→</span>
      </button>
      <p v-if="unavailable" class="province-notice">
        该省份的院校专业组规则与历年数据正在接入。当前可切换广东省查看完整产品演示。
      </p>
      <DisclaimerBar />
    </section>

    <section class="trust-grid">
      <article>
        <strong>近 3 年</strong>
        <span>录取位次趋势</span>
      </article>
      <article>
        <strong>双方向</strong>
        <span>院校 + 专业预测</span>
      </article>
      <article>
        <strong>可解释</strong>
        <span>每项概率有依据</span>
      </article>
    </section>
  </main>
</template>

<style scoped>
.home-page {
  max-width: 760px;
  margin: 0 auto;
}

.hero {
  position: relative;
  overflow: hidden;
  min-height: 252px;
  border-radius: 0 0 30px 30px;
  padding: 24px 18px 22px;
  background:
    linear-gradient(135deg, rgba(234, 243, 255, 0.98), rgba(255, 255, 255, 0.94) 55%, rgba(232, 255, 248, 0.9));
  box-shadow: 0 18px 48px rgba(47, 128, 237, 0.1);
}

.hero h1 {
  position: relative;
  margin: 20px 0 10px;
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: clamp(34px, 10vw, 48px);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1.18;
}

.hero em {
  color: #1768c9;
  font-style: normal;
}

.hero p {
  position: relative;
  max-width: 460px;
  margin: 0;
  color: #607086;
  font-size: 13px;
  line-height: 1.85;
}

.hero-steps {
  position: relative;
  display: flex;
  gap: 13px;
  margin-top: 20px;
  color: #607086;
  font-size: 11px;
}

.hero-steps span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.hero-steps b {
  color: #2f80ed;
  font-size: 10px;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(1px);
}

.orb-a {
  right: -68px;
  top: -48px;
  width: 188px;
  height: 188px;
  background: rgba(32, 191, 169, 0.13);
}

.orb-b {
  right: 74px;
  bottom: -64px;
  width: 126px;
  height: 126px;
  background: rgba(255, 181, 71, 0.18);
}

.form-card {
  display: grid;
  gap: 16px;
  margin-top: -28px;
}

.double-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.score-input {
  display: flex;
  align-items: center;
  border: 1px solid #e5eef8;
  border-radius: 14px;
  background: #fbfdff;
}

.score-input input {
  border: 0;
  color: #2f80ed;
  background: transparent;
  font-size: 27px;
  font-weight: 800;
}

.score-input span {
  padding-right: 12px;
  color: #7b8798;
  white-space: nowrap;
  font-size: 12px;
}

.province-notice {
  margin: 0;
  border-radius: 13px;
  padding: 10px;
  color: #9a6512;
  background: #fff7e8;
  font-size: 12px;
  line-height: 1.7;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.trust-grid article {
  display: grid;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 15px;
  color: #607086;
  background: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.trust-grid strong {
  color: #1768c9;
  font-size: 15px;
}

.trust-grid span {
  font-size: 10px;
}
</style>
