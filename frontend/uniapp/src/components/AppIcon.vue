<template>
  <image class="app-icon" :class="`app-icon--${size}`" :src="iconPath(name)" mode="aspectFit" />
</template>

<script setup lang="ts">
import { iconPath, type IconName } from "./icon-registry";

withDefaults(
  defineProps<{
    name: IconName;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
  }>(),
  { size: "md" }
);
</script>

<style scoped>
.app-icon {
  display: block;
  flex: 0 0 auto;
}

.app-icon--xs {
  width: 14px;
  height: 14px;
}

.app-icon--sm {
  width: 18px;
  height: 18px;
}

.app-icon--md {
  width: 22px;
  height: 22px;
}

.app-icon--lg {
  width: 28px;
  height: 28px;
}

.app-icon--xl {
  width: 36px;
  height: 36px;
}
</style>
