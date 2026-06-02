<script setup lang="ts">
import type { University } from '../types/prediction'
import ConfidenceBadge from './ConfidenceBadge.vue'
import ProbabilityRange from './ProbabilityRange.vue'
import RiskTag from './RiskTag.vue'

defineProps<{ university: University; saved?: boolean }>()
defineEmits<{ view: [id: string]; save: [id: string] }>()
</script>

<template>
  <article class="university-card card">
    <div class="school-head">
      <div>
        <h3>{{ university.name }}</h3>
        <p>{{ university.city }} · {{ university.tags.slice(0, 3).join(' · ') }}</p>
      </div>
      <ProbabilityRange
        compact
        :probability="university.probability"
        :low="university.probabilityLow"
        :high="university.probabilityHigh"
      />
    </div>
    <div class="tag-line">
      <RiskTag :label="university.riskLabel" />
      <ConfidenceBadge :level="university.confidence" />
      <span class="group-count">{{ university.groupCount }} 个专业组</span>
    </div>
    <p class="summary">{{ university.minRankSummary }}</p>
    <div class="card-actions">
      <button class="secondary-btn" @click="$emit('view', university.id)">查看详情</button>
      <button class="ghost-btn" :class="{ saved }" @click="$emit('save', university.id)">
        {{ saved ? '已加入' : '+ 志愿单' }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.university-card {
  display: grid;
  gap: 12px;
  padding: 15px;
}

.school-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 10px;
}

h3,
p {
  margin: 0;
}

h3 {
  font-size: 17px;
  letter-spacing: -0.03em;
}

.school-head p,
.summary {
  color: #7b8798;
  font-size: 11px;
  line-height: 1.7;
}

.tag-line,
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.group-count {
  display: inline-flex;
  align-items: center;
  color: #7b8798;
  font-size: 11px;
}

.summary {
  padding-top: 10px;
  border-top: 1px dashed #e5eef8;
}

.card-actions > * {
  flex: 1;
  min-height: 38px;
  font-size: 12px;
}

.saved {
  color: #087f75;
  background: #e8fff8;
}
</style>
