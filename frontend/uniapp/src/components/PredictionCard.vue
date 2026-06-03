<template>
  <view class="school-card-item">
    <view class="school-head">
      <view class="school-main">
        <text class="school-name">{{ item.name }}</text>
        <text class="school-meta">{{ tagsText }} · {{ item.city }} · {{ item.representativeGroup.name }}</text>
      </view>
      <text class="probability">{{ item.probability ?? "--" }}<text v-if="item.probability !== null">%</text></text>
    </view>

    <view class="tag-row">
      <RiskTag :label="item.riskLabel" />
      <text class="tag info">{{ confidenceTag }}</text>
      <text class="tag info">近 {{ recentHistory.length }} 年</text>
    </view>

    <view class="confidence">
      <view class="bar"><view class="bar-fill" :style="{ width: `${confidencePercent}%` }"></view></view>
      <view class="small-row"><text>参考可信度</text><text>{{ confidenceText }}</text></view>
    </view>

    <view v-if="item.warnings.length" class="notice compact-notice">{{ item.warnings[0] }}</view>

    <view class="action-row">
      <button class="button button-light" @click="$emit('detail', item)">查看详情</button>
      <button class="button button-primary" @click="$emit('add', item)">加入志愿单</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import RiskTag from "./RiskTag.vue";
import type { UniversitySearchItem } from "../types/prediction";

const props = defineProps<{ item: UniversitySearchItem }>();
defineEmits<{ detail: [UniversitySearchItem]; add: [UniversitySearchItem] }>();

const tagsText = computed(() => props.item.levelTags?.join(" · ") || "普通本科");
const recentHistory = computed(() => [...props.item.history].sort((left, right) => right.year - left.year).slice(0, 5));
const confidencePercent = computed(() => {
  if (props.item.confidenceLevel === "高") return 88;
  if (props.item.confidenceLevel === "中高") return 82;
  if (props.item.confidenceLevel === "中") return 66;
  if (props.item.confidenceLevel === "低") return 48;
  return 28;
});
const confidenceText = computed(() => {
  if (props.item.confidenceLevel === "高" || props.item.confidenceLevel === "中高") return "较高";
  if (props.item.confidenceLevel === "中") return "中等";
  if (props.item.confidenceLevel === "低") return "偏低";
  return "不足";
});
const confidenceTag = computed(() => (props.item.confidenceLevel === "数据不足" ? "数据不足" : "数据完整"));
</script>

<style scoped>
.school-card-item {
  display: grid;
  gap: 12px;
  padding: 14px;
  border: 1px solid #e5eef8;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(47, 128, 237, 0.06);
}

.school-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.school-main {
  min-width: 0;
}

.school-name,
.school-meta {
  display: block;
}

.school-name {
  color: #1f2937;
  font-size: 17px;
  font-weight: 900;
}

.school-meta {
  margin-top: 6px;
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.5;
}

.tag.info {
  color: #4b5563;
  background: #f3f7fb;
}

.compact-notice {
  margin: 0;
}

.action-row .button {
  min-height: 42px;
  border-radius: 16px;
  font-size: 13px;
}
</style>
