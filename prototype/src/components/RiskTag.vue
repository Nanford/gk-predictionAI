<script setup lang="ts">
import { computed } from 'vue'
import type { RiskLabel } from '../types/prediction'

const props = defineProps<{ label: RiskLabel }>()

const tone = computed(() => {
  if (props.label === '保底') return 'base'
  if (props.label === '稳妥') return 'safe'
  if (props.label === '稳妥偏冲') return 'mixed'
  if (props.label === '不可报考') return 'blocked'
  if (props.label === '数据不足') return 'muted'
  return 'rush'
})
</script>

<template>
  <span class="risk-tag" :class="tone">{{ label }}</span>
</template>

<style scoped>
.risk-tag {
  display: inline-flex;
  align-items: center;
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}
.safe { color: #087f75; background: #e8fff8; }
.base { color: #185fbe; background: #eaf3ff; }
.mixed { color: #8a5a13; background: #fff7e8; }
.rush { color: #b45309; background: #fff3df; }
.blocked { color: #c2410c; background: #fff2e8; }
.muted { color: #64748b; background: #f1f5f9; }
</style>
