<template>
  <PageShell title="志愿单" current="volunteers">
    <view class="page">
      <view>
        <text class="eyebrow">志愿梯度诊断</text>
        <text class="page-title">我的志愿单</text>
        <text class="hero-subtitle">志愿单不是普通收藏夹，重点是检查冲刺、稳妥和保底结构。</text>
      </view>

      <view v-if="diagnosis" class="stats-grid">
        <view class="stat-cell"><text class="value">{{ diagnosis.total }}</text><text class="muted">当前志愿</text></view>
        <view class="stat-cell"><text class="value">{{ diagnosis.sprint }}</text><text class="muted">冲刺</text></view>
        <view class="stat-cell"><text class="value">{{ diagnosis.stable }}</text><text class="muted">稳妥</text></view>
        <view class="stat-cell"><text class="value">{{ diagnosis.fallback }}</text><text class="muted">保底</text></view>
      </view>

      <view v-if="diagnosis" class="card diagnosis">
        <view class="section-head"><text class="section-title">梯度诊断</text><text class="muted">规则计算</text></view>
        <text class="warning">{{ diagnosis.suggestion }}</text>
      </view>

      <view v-for="item in list.items" :key="item.id" class="card volunteer-item">
        <view>
          <text class="title">{{ item.university.name }}</text>
          <text class="meta">{{ item.riskLabel }} · 参考概率 {{ item.probability ?? "--" }}%</text>
        </view>
        <button class="button button-light" @click="remove(item.id)">移除</button>
      </view>

      <view v-if="list.items.length === 0" class="empty card">
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
.diagnosis {
  border-color: rgba(255, 181, 71, 0.22);
  background: #fffdf8;
}

.volunteer-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
</style>
