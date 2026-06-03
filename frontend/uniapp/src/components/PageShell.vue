<template>
  <view class="app-shell">
    <view class="topbar">
      <button v-if="backUrl" class="round-action" @click="goBack">‹</button>
      <view v-else class="brand" @click="openHome">
        <text class="brand-mark">志</text>
        <text>晨光志愿</text>
      </view>
      <text v-if="backUrl" class="route-title">{{ title }}</text>
      <button class="quota-pill" @click="openQuota">AI 额度</button>
    </view>

    <slot />

    <BottomNav :current="current" />
  </view>
</template>

<script setup lang="ts">
import BottomNav from "./BottomNav.vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    backUrl?: string;
    current?: "home" | "volunteers" | "quota" | "profile" | "none";
  }>(),
  { title: "晨光志愿", current: "none" }
);

const openHome = () => uni.reLaunch({ url: "/pages/home/index" });
const openQuota = () => uni.navigateTo({ url: "/pages/quota/index" });
const goBack = () => {
  if (props.backUrl) {
    uni.navigateTo({ url: props.backUrl });
  } else {
    uni.navigateBack();
  }
};
</script>
