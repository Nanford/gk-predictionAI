<template>
  <view class="bottom-nav">
    <button
      v-for="item in items"
      :key="item.key"
      class="bottom-nav-item"
      :class="{ active: current === item.key }"
      @click="go(item.path)"
    >
      <view class="bottom-nav-icon">
        <AppIcon :name="item.icon" size="sm" />
      </view>
      <text>{{ item.label }}</text>
    </button>
  </view>
</template>

<script setup lang="ts">
import AppIcon from "./AppIcon.vue";
import { bottomNavItems, type ShellTab } from "./bottom-nav-items";

defineProps<{ current?: ShellTab | "none" }>();

const items = bottomNavItems;

const go = (url: string) => {
  uni.reLaunch({ url });
};
</script>
