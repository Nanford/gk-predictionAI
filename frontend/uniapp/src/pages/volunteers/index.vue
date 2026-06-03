<template>
  <PageShell title="志愿单" current="volunteers">
    <view class="page">
      <view class="page-heading">
        <view class="eyebrow">
          <AppIcon name="target" size="xs" />
          <text>志愿梯度诊断</text>
        </view>
        <text class="page-title">我的志愿单</text>
        <text class="hero-subtitle">志愿单重点检查冲刺、稳妥和保底结构，不只是普通收藏夹。</text>
      </view>

      <view v-if="diagnosis" class="stats-grid">
        <view class="stat-cell">
          <view class="stat-icon"><AppIcon name="list" size="sm" /></view>
          <text class="value">{{ diagnosis.total }}</text>
          <text class="muted">当前志愿</text>
        </view>
        <view class="stat-cell">
          <view class="stat-icon"><AppIcon name="spark" size="sm" /></view>
          <text class="value">{{ diagnosis.sprint }}</text>
          <text class="muted">冲刺</text>
        </view>
        <view class="stat-cell">
          <view class="stat-icon"><AppIcon name="shield" size="sm" /></view>
          <text class="value">{{ diagnosis.stable }}</text>
          <text class="muted">稳妥</text>
        </view>
        <view class="stat-cell">
          <view class="stat-icon"><AppIcon name="check" size="sm" /></view>
          <text class="value">{{ diagnosis.fallback }}</text>
          <text class="muted">保底</text>
        </view>
      </view>

      <view v-if="diagnosis" class="card diagnosis">
        <view class="section-head">
          <view class="section-title-row">
            <view class="icon-chip"><AppIcon name="trend" size="sm" /></view>
            <text class="section-title">梯度诊断</text>
          </view>
          <text class="muted">规则计算</text>
        </view>
        <text class="diagnosis-copy">{{ diagnosis.suggestion }}</text>
      </view>

      <view class="volunteer-list">
        <view v-for="item in list.items" :key="item.id" class="card volunteer-item">
          <view class="volunteer-accent"></view>
          <view class="volunteer-main">
            <text class="title">{{ item.university.name }}</text>
            <text class="meta">{{ item.riskLabel }} · 参考概率 {{ item.probability ?? "--" }}%</text>
          </view>
          <button class="remove-button" @click="remove(item.id)">
            <AppIcon name="trash" size="sm" />
          </button>
        </view>
      </view>

      <view v-if="list.items.length === 0" class="empty card">
        <view class="empty-icon"><AppIcon name="list" size="xl" /></view>
        <text>还没有加入志愿。从院校推荐中加入目标院校，再回来查看梯度诊断。</text>
        <button class="button button-primary primary-wide" @click="openHome">去预测</button>
      </view>
      <DisclaimerBar compact />
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
import AppIcon from "../../components/AppIcon.vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PageShell from "../../components/PageShell.vue";
import { api } from "../../services/api";

interface VolunteerItem {
  id: number;
  probability: number | null;
  riskLabel: string;
  university: { name: string };
}

const list = reactive<{ items: VolunteerItem[] }>({ items: [] });
const diagnosis = ref<{
  total: number;
  sprint: number;
  stable: number;
  fallback: number;
  insufficient: number;
  suggestion: string;
}>();

const load = async () => {
  const [volunteers, result] = await Promise.all([
    api.authenticatedRequest<{ items: VolunteerItem[] }>("/volunteers"),
    api.authenticatedRequest<typeof diagnosis.value>("/volunteers/diagnosis")
  ]);
  list.items = volunteers.items;
  diagnosis.value = result;
};

onShow(load);

const remove = async (id: number) => {
  await api.authenticatedRequest(`/volunteers/items/${id}`, { method: "DELETE" });
  await load();
};

const openHome = () => uni.reLaunch({ url: "/pages/home/index" });
</script>

<style scoped>
.page-heading {
  display: grid;
  gap: 2px;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.diagnosis {
  overflow: hidden;
  border-color: rgba(245, 166, 35, 0.18);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 250, 241, 0.96));
}

.diagnosis::after {
  position: absolute;
  right: -44px;
  bottom: -54px;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: rgba(245, 166, 35, 0.1);
  content: "";
}

.diagnosis-copy {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 12px;
  color: #8a5a13;
  font-size: 13px;
  line-height: 1.8;
}

.volunteer-list {
  display: grid;
  gap: 12px;
}

.volunteer-item {
  display: flex;
  align-items: center;
  gap: 13px;
  min-height: 88px;
  overflow: hidden;
}

.volunteer-accent {
  width: 5px;
  height: 52px;
  border-radius: 999px;
  background: linear-gradient(180deg, #1288f1, #10b8aa);
}

.volunteer-main {
  display: grid;
  flex: 1;
  gap: 5px;
}

.remove-button {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 17px;
  background: #e9f5ff;
}

.empty-icon {
  display: grid;
  width: 66px;
  height: 66px;
  place-items: center;
  border-radius: 24px;
  background: #e9f5ff;
}
</style>
