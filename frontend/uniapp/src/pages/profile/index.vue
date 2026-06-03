<template>
  <PageShell title="我的" current="profile">
    <view class="page">
      <view class="profile-hero card">
        <view class="avatar">
          <AppIcon name="user" size="lg" />
        </view>
        <view class="profile-copy">
          <text class="section-title">考生用户</text>
          <text class="meta">广东省 · 2026 高考志愿辅助参考</text>
        </view>
        <button class="quota-link" @click="openQuota">
          <AppIcon name="coin" size="xs" />
          <text>额度</text>
        </button>
      </view>

      <view class="profile-list card">
        <button v-for="item in sections" :key="item.name" class="profile-row" @click="go(item.path)">
          <view class="row-icon"><AppIcon :name="item.icon" size="sm" /></view>
          <view class="profile-row-main">
            <text class="title">{{ item.name }}</text>
            <text class="meta">{{ item.note }}</text>
          </view>
          <text class="arrow">›</text>
        </button>
      </view>

      <view class="notice">
        <AppIcon name="warning" size="sm" />
        <text>分数、位次、志愿单和录取结果属于需要谨慎处理的信息。系统默认不公开敏感信息，不向第三方营销机构提供用户数据。</text>
      </view>
      <DisclaimerBar compact />
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import AppIcon from "../../components/AppIcon.vue";
import type { IconName } from "../../components/icon-registry";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PageShell from "../../components/PageShell.vue";

const sections: ReadonlyArray<{ name: string; note: string; path: string; icon: IconName }> = [
  { name: "AI 使用额度", note: "查看额度余额和扣减说明", path: "/pages/quota/index", icon: "wallet" },
  { name: "志愿单", note: "查看冲稳保结构诊断", path: "/pages/volunteers/index", icon: "list" },
  { name: "AI 使用费用", note: "服务范围、边界和模拟充值", path: "/pages/payment/index", icon: "coin" },
  { name: "用户协议", note: "服务说明、隐私政策和免责声明", path: "", icon: "doc" }
];

const go = (url: string) => {
  if (url) uni.navigateTo({ url });
};

const openQuota = () => uni.navigateTo({ url: "/pages/quota/index" });
</script>

<style scoped>
.profile-hero {
  display: flex;
  align-items: center;
  gap: 13px;
  min-height: 110px;
}

.avatar {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 21px 21px 21px 8px;
  background: linear-gradient(145deg, #e9f5ff, #e7fbf6);
  box-shadow: inset 0 0 0 1px rgba(18, 136, 241, 0.08);
}

.profile-copy {
  display: grid;
  flex: 1;
  gap: 4px;
}

.quota-link {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 10px;
  border-radius: 99px;
  color: #047d76;
  background: #e7fbf6;
  font-size: 11px;
  font-weight: 950;
}

.profile-list {
  overflow: hidden;
  padding: 0;
}

.profile-row {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid rgba(213, 229, 243, 0.72);
  text-align: left;
}

.profile-row:last-child {
  border-bottom: 0;
}

.profile-row-main {
  display: grid;
  flex: 1;
  gap: 4px;
}

.arrow {
  color: #95a2b1;
  font-size: 25px;
  font-weight: 300;
}
</style>
