<script setup lang="ts">
import type { ConfidenceLevel } from '../types/prediction'

defineProps<{ level: ConfidenceLevel }>()
</script>

<template>
  <span class="confidence">可信度 {{ level }}</span>
</template>

<style scoped>
.confidence {
  display: inline-flex;
  align-items: center;
  padding: 5px 8px;
  border-radius: 999px;
  color: #4b647e;
  background: #f1f6fb;
  font-size: 11px;
  font-weight: 700;
}
</style>
