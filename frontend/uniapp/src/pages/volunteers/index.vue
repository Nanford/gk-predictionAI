<template>
  <view class="page">
    <view class="hero">
      <text class="hero-title">志愿梯度诊断</text>
      <text class="hero-subtitle">志愿单不是收藏夹。系统会检查冲刺、稳妥和保底结构，帮助识别滑档风险。</text>
    </view>
    <view v-if="diagnosis" class="card">
      <text class="section-title">当前共 {{ diagnosis.total }} 个志愿</text>
      <text class="meta">冲刺 {{ diagnosis.sprint }} · 稳妥 {{ diagnosis.stable }} · 保底 {{ diagnosis.fallback }} · 数据不足 {{ diagnosis.insufficient }}</text>
      <text class="warning">{{ diagnosis.suggestion }}</text>
    </view>
    <view v-for="item in list.items" :key="item.id" class="card card-heading">
      <view>
        <text class="title">{{ item.university.name }}</text>
        <text class="meta">{{ item.riskLabel }} · 参考概率 {{ item.probability ?? "--" }}%</text>
      </view>
      <button class="button button-light" @click="remove(item.id)">移除</button>
    </view>
    <view v-if="list.items.length === 0" class="empty">尚未加入志愿，先从院校预测列表选择目标院校。</view>
    <DisclaimerBar compact />
  </view>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
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
</script>
