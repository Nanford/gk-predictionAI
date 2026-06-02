<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ConfidenceBadge from '../components/ConfidenceBadge.vue'
import DisclaimerBar from '../components/DisclaimerBar.vue'
import RiskTag from '../components/RiskTag.vue'
import { isSubjectEligible } from '../domain/prediction'
import { usePredictionStore } from '../stores/prediction'
import type { Major } from '../types/prediction'

const route = useRoute()
const store = usePredictionStore()
const groups = computed(() => store.selectedUniversity.groups)

onMounted(() => store.selectUniversity(String(route.params.id)))

function eligible(major: Major) {
  return isSubjectEligible(store.candidate.subjects, major.requiredSubjects)
}
</script>

<template>
  <main class="page page-narrow">
    <section>
      <span class="eyebrow">院校与专业分开判断</span>
      <h1 class="page-title">{{ store.selectedUniversity.name }}专业预测</h1>
      <p class="page-subtitle">专业竞争强度可能高于院校整体，加入志愿前需要核对专业组选科要求。</p>
    </section>

    <section v-for="group in groups" :key="group.id" class="group-card card card-pad">
      <div class="section-head">
        <div>
          <h2>{{ group.name }}</h2>
          <p>选科要求：{{ group.requiredSubjects.join(' + ') }}</p>
        </div>
        <span>{{ group.majors.length }} 个专业</span>
      </div>
      <div class="major-list">
        <article v-for="major in group.majors" :key="major.id" class="major-item">
          <div class="major-head">
            <div>
              <h3>{{ major.name }}</h3>
              <p>代码 {{ major.code }} · 计划 {{ major.planCount }} 人</p>
            </div>
            <strong>{{ major.probabilityLow }}% - {{ major.probabilityHigh }}%</strong>
          </div>
          <div class="chip-row">
            <RiskTag :label="eligible(major) ? major.riskLabel : '不可报考'" />
            <ConfidenceBadge :level="major.confidence" />
          </div>
          <p class="rank">{{ major.minRankSummary }}</p>
          <p v-if="major.note" class="minor-note">{{ major.note }}</p>
          <p v-if="!eligible(major)" class="blocked-note">
            当前选科不符合专业组要求，请核对官方招生目录。
          </p>
          <button
            class="secondary-btn wide-btn"
            :disabled="!eligible(major)"
            @click="store.addMajor(major, group.name)"
          >
            {{ eligible(major) ? '+ 加入志愿单' : '选科不符合要求' }}
          </button>
        </article>
      </div>
    </section>

    <section v-if="groups.length === 0" class="notice">
      当前院校专业组演示数据尚未接入，请返回院校列表查看华南理工大学完整演示。
    </section>

    <DisclaimerBar />
  </main>
</template>

<style scoped>
.group-card {
  display: grid;
  gap: 12px;
}

.section-head p,
.major-head p,
.rank,
.minor-note,
.blocked-note {
  margin: 5px 0 0;
  color: #7b8798;
  font-size: 11px;
  line-height: 1.7;
}

.major-list {
  display: grid;
  gap: 10px;
}

.major-item {
  display: grid;
  gap: 10px;
  padding: 13px;
  border: 1px solid #e5eef8;
  border-radius: 15px;
  background: #fbfdff;
}

.major-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

h3 {
  margin: 0;
  font-size: 15px;
}

.major-head strong {
  color: #2f80ed;
  white-space: nowrap;
  font-size: 16px;
}

.minor-note {
  color: #9a6512;
}

.blocked-note {
  color: #c2410c;
}

.major-item button {
  min-height: 38px;
  font-size: 12px;
}
</style>
