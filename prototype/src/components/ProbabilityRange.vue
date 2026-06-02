<script setup lang="ts">
defineProps<{ probability: number; low: number; high: number; compact?: boolean }>()
</script>

<template>
  <div class="probability" :class="{ compact }">
    <strong>{{ probability }}<small>%</small></strong>
    <span>{{ low }}% - {{ high }}%</span>
  </div>
</template>

<style scoped>
.probability {
  display: grid;
  justify-items: end;
  min-width: 82px;
}

strong {
  color: #2f80ed;
  font-size: 30px;
  letter-spacing: -0.08em;
  line-height: 1;
}

small {
  margin-left: 2px;
  font-size: 16px;
}

span {
  margin-top: 5px;
  color: #7b8798;
  font-size: 10px;
}

.compact strong {
  font-size: 25px;
}
</style>
