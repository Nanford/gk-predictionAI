<template>
  <view class="bottom-nav">
    <button
      v-for="item in items"
      :key="item.key"
      class="bottom-nav-item"
      :class="{ active: current === item.key }"
      @click="go(item.path)"
    >
      <text class="bottom-nav-icon">{{ item.icon }}</text>
      <text>{{ item.label }}</text>
    </button>
  </view>
</template>

<script setup lang="ts">
defineProps<{ current?: "home" | "volunteers" | "quota" | "profile" | "none" }>();

const items = [
  { key: "home", label: "首页", icon: "⌂", path: "/pages/home/index" },
  { key: "volunteers", label: "志愿单", icon: "▤", path: "/pages/volunteers/index" },
  { key: "quota", label: "额度", icon: "✦", path: "/pages/quota/index" },
  { key: "profile", label: "我的", icon: "●", path: "/pages/profile/index" }
] as const;

const go = (url: string) => {
  uni.reLaunch({ url });
};
</script>
