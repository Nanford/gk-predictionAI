<template>
  <PageShell title="我的" current="profile">
    <view class="page">
      <view class="profile-hero card">
        <view class="avatar">考</view>
        <view>
          <text class="section-title">考生用户</text>
          <text class="meta">广东省 · 2026 高考志愿辅助参考</text>
        </view>
        <button class="quota-link" @click="openQuota">额度</button>
      </view>

      <view class="profile-list card">
        <button v-for="item in sections" :key="item.name" @click="go(item.path)">
          <view>
            <text class="title">{{ item.name }}</text>
            <text class="meta">{{ item.note }}</text>
          </view>
          <text class="arrow">›</text>
        </button>
      </view>

      <view class="notice">分数、位次、志愿单和录取结果属于需要谨慎处理的信息。系统默认不公开敏感信息，不向第三方营销机构提供用户数据。</view>
      <DisclaimerBar compact />
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PageShell from "../../components/PageShell.vue";

const sections = [
  { name: "AI 使用额度", note: "查看额度余额和扣减说明", path: "/pages/quota/index" },
  { name: "志愿单", note: "查看冲稳保结构诊断", path: "/pages/volunteers/index" },
  { name: "AI 使用费用", note: "服务范围、边界和模拟充值", path: "/pages/payment/index" },
  { name: "用户协议", note: "服务说明、隐私政策和免责声明", path: "" }
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
  gap: 12px;
}

.avatar {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 18px 18px 18px 6px;
  color: #fff;
  background: linear-gradient(135deg, #2f80ed, #20bfa9);
  font-family: "STKaiti", "KaiTi", serif;
  font-size: 25px;
}

.quota-link {
  margin-left: auto;
  padding: 7px 10px;
  border-radius: 99px;
  color: #087f75;
  background: #e8fff8;
  font-size: 11px;
  font-weight: 800;
}

.profile-list {
  overflow: hidden;
  padding: 0;
}

.profile-list button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px;
  border-bottom: 1px solid #edf3f9;
  text-align: left;
}

.profile-list button:last-child {
  border-bottom: 0;
}

.arrow {
  color: #9ca3af;
  font-size: 24px;
}
</style>
