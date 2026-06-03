<template>
  <view class="card prediction-card">
    <view class="card-heading">
      <view>
        <text class="title">{{ item.name }}</text>
        <text class="meta">{{ item.city }} · {{ tagsText }} · {{ item.representativeGroup.name }}</text>
      </view>
      <RiskTag :label="item.riskLabel" />
    </view>

    <view class="probability-row">
      <view>
        <text class="label">院校最低门槛参考</text>
        <text class="probability">{{ item.probability ?? "--" }}<text v-if="item.probability !== null">%</text></text>
      </view>
      <view class="range">
        <text>参考区间</text>
        <text v-if="item.probabilityLow !== null">{{ item.probabilityLow }}% - {{ item.probabilityHigh }}%</text>
        <text v-else>数据不足</text>
        <text>置信度 {{ item.confidenceLevel }}</text>
      </view>
    </view>

    <view class="mini-history">
      <text v-for="history in recentHistory" :key="history.year">
        {{ history.year }} · {{ history.minRank ?? "--" }}名
      </text>
    </view>
    <text v-for="warning in item.warnings" :key="warning" class="warning">{{ warning }}</text>
    <view class="action-row">
      <button class="button button-light" @click="$emit('detail', item)">查看详情</button>
      <button class="button button-primary" @click="$emit('add', item)">加入志愿单</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { UniversitySearchItem } from "../types/prediction";
import RiskTag from "./RiskTag.vue";

const props = defineProps<{ item: UniversitySearchItem }>();
defineEmits<{ detail: [UniversitySearchItem]; add: [UniversitySearchItem] }>();

const tagsText = computed(() => props.item.levelTags?.join(" · ") || "普通本科");
const recentHistory = computed(() => [...props.item.history].sort((left, right) => right.year - left.year).slice(0, 3));
</script>

<style scoped>
.prediction-card {
  display: grid;
  gap: 13px;
}

.mini-history {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
}

.mini-history text {
  padding: 8px;
  border-radius: 12px;
  color: #607086;
  background: #f8fbff;
  font-size: 11px;
  text-align: center;
}
</style>
