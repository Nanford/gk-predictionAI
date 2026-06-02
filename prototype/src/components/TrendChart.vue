<script setup lang="ts">
import { computed } from 'vue'
import type { HistoryPoint } from '../types/prediction'

const props = defineProps<{ history: HistoryPoint[] }>()

const points = computed(() => {
  const ranks = props.history.map((item) => item.minRank)
  const min = Math.min(...ranks)
  const max = Math.max(...ranks)
  return props.history.map((item) => {
    const ratio = max === min ? 0.5 : (max - item.minRank) / (max - min)
    return { ...item, height: 44 + ratio * 42 }
  })
})
</script>

<template>
  <div class="trend-card">
    <div class="chart-head">
      <div>
        <strong>近三年最低位次</strong>
        <span>位次越靠前，竞争越激烈</span>
      </div>
      <b>演示数据</b>
    </div>
    <div class="bars">
      <div v-for="point in points" :key="point.year" class="bar-item">
        <span>#{{ point.minRank.toLocaleString() }}</span>
        <div class="bar-track">
          <i :style="{ height: `${point.height}%` }"></i>
        </div>
        <small>{{ point.year }}</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trend-card {
  padding: 16px;
  border: 1px solid #e5eef8;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff, #f8fbff);
}

.chart-head,
.chart-head div {
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

.chart-head div {
  flex-direction: column;
}

.chart-head strong {
  font-size: 15px;
}

.chart-head span,
.chart-head b {
  color: #7b8798;
  font-size: 10px;
}

.bars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  height: 154px;
  margin-top: 14px;
}

.bar-item {
  display: grid;
  grid-template-rows: 20px 1fr 18px;
  gap: 5px;
  align-items: end;
  justify-items: center;
}

.bar-item span,
.bar-item small {
  color: #6b7280;
  font-size: 10px;
}

.bar-track {
  position: relative;
  width: 32px;
  height: 100%;
  overflow: hidden;
  border-radius: 10px 10px 4px 4px;
  background: #eaf3ff;
}

.bar-track i {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 10px 10px 4px 4px;
  background: linear-gradient(180deg, #20bfa9, #2f80ed);
}
</style>
