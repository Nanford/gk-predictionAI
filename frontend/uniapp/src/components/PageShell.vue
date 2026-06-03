<template>
  <view class="app-shell">
    <view class="topbar">
      <view class="topbar-left">
        <button v-if="backUrl" class="round-action" @click="goBack">
          <AppIcon name="back" size="sm" />
        </button>
        <view v-else class="brand" @click="openHome">
          <view class="brand-mark">
            <AppIcon name="school" size="sm" />
          </view>
          <view class="brand-copy">
            <text class="brand-title">高考志愿助手</text>
          </view>
        </view>
      </view>
      <text class="route-title">{{ backUrl ? title : "" }}</text>
      <view class="topbar-right"></view>
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
  { title: "高考志愿助手", current: "none" }
);

const openHome = () => uni.reLaunch({ url: "/pages/home/index" });
const goBack = () => {
  if (props.backUrl) {
    uni.navigateTo({ url: props.backUrl });
  } else {
    uni.navigateBack();
  }
};
</script>
