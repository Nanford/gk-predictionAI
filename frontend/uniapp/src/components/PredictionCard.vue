<template>
  <view class="card prediction-card">
    <view class="card-heading">
      <view class="school-heading">
        <view class="school-icon"><AppIcon name="school" size="sm" /></view>
        <view>
          <text class="title">{{ item.name }}</text>
          <text class="meta">{{ item.city }} · {{ tagsText }} · {{ item.representativeGroup.name }}</text>
        </view>
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
      <view v-for="history in recentHistory" :key="history.year" class="history-pill">
        <text class="history-year">{{ history.year }}</text>
        <text>{{ history.minRank ?? "--" }}名</text>
      </view>
    </view>
    <view v-for="warning in item.warnings" :key="warning" class="warning-line">
      <AppIcon name="warning" size="xs" />
      <text>{{ warning }}</text>
    </view>
    <view class="action-row">
      <button class="button button-light" @click="$emit('detail', item)">
        <AppIcon name="doc" size="sm" />
        <text>查看详情</text>
      </button>
      <button class="button button-primary" @click="$emit('add', item)">
        <text>加入志愿单</text>
        <AppIcon name="arrowRight" size="sm" />
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";
import RiskTag from "./RiskTag.vue";
import type { UniversitySearchItem } from "../types/prediction";

const props = defineProps<{ item: UniversitySearchItem }>();
defineEmits<{ detail: [UniversitySearchItem]; add: [UniversitySearchItem] }>();

const tagsText = computed(() => props.item.levelTags?.join(" · ") || "普通本科");
const recentHistory = computed(() => [...props.item.history].sort((left, right) => right.year - left.year).slice(0, 3));
</script>

<style scoped>
.prediction-card {
  display: grid;
  gap: 14px;
  overflow: hidden;
}

.prediction-card::after {
  position: absolute;
  right: -44px;
  top: -48px;
  width: 118px;
  height: 118px;
  border-radius: 50%;
  background: rgba(18, 136, 241, 0.06);
  content: "";
}

.school-heading {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.school-icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 17px;
  background: linear-gradient(145deg, #e9f5ff, #e7fbf6);
}

.mini-history {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.history-pill {
  display: grid;
  gap: 3px;
  padding: 10px 8px;
  border-radius: 16px;
  color: #607086;
  background: rgba(248, 251, 255, 0.96);
  font-size: 11px;
  text-align: center;
}

.history-year {
  color: #075ec5;
  font-weight: 950;
}

.warning-line {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  color: #8a5a13;
  font-size: 12px;
  line-height: 1.65;
}
</style>
