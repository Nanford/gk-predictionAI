<template>
  <view class="app-shell">
    <view class="topbar">
      <button v-if="backUrl" class="round-action" @click="goBack">
        <AppIcon name="back" size="sm" />
      </button>
      <view v-else class="brand" @click="openHome">
        <view class="brand-mark">
          <AppIcon name="school" size="sm" />
        </view>
        <view class="brand-copy">
          <text class="brand-title">晨光志愿</text>
          <text class="brand-subtitle">广东首版</text>
        </view>
      </view>
      <text v-if="backUrl" class="route-title">{{ title }}</text>
      <button class="quota-pill" @click="openQuota">
        <AppIcon name="coin" size="xs" />
        <text>AI 额度</text>
      </button>
    </view>

    <slot />

    <BottomNav :current="current" />
  </view>
</template>

<script setup lang="ts">
import AppIcon from "./AppIcon.vue";
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
