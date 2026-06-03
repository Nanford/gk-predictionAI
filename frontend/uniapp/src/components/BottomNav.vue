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
import type { IconName } from "./icon-registry";

type ShellTab = "home" | "volunteers" | "quota" | "profile";

defineProps<{ current?: ShellTab | "none" }>();

const items: ReadonlyArray<{ key: ShellTab; label: string; icon: IconName; path: string }> = [
  { key: "home", label: "首页", icon: "home", path: "/pages/home/index" },
  { key: "volunteers", label: "志愿单", icon: "list", path: "/pages/volunteers/index" },
  { key: "quota", label: "额度", icon: "spark", path: "/pages/quota/index" },
  { key: "profile", label: "我的", icon: "user", path: "/pages/profile/index" }
];

const go = (url: string) => {
  uni.reLaunch({ url });
};
</script>
