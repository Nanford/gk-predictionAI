<template>
  <text class="risk-tag" :class="tone">{{ label }}</text>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ label: string }>();
const tone = computed(() => {
  if (props.label === "保底") return "risk-safe";
  if (props.label.includes("稳妥")) return "risk-steady";
  if (props.label === "数据不足") return "risk-muted";
  return "risk-sprint";
});
</script>
