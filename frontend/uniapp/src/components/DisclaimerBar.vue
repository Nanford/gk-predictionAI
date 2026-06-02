<template>
  <view class="disclaimer">
    <text>{{ compact ? shortText : fullText }}</text>
  </view>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false });

const shortText = "预测结果仅供辅助参考，不代表最终录取结果。";
const fullText =
  "本系统基于公开历史录取数据、位次变化、招生计划变化和 AI 分析模型生成预测结果，仅作为高考志愿填报辅助参考。最终填报请以所在省教育考试院、高校招生章程、官方招生计划和本人实际决策为准。";
</script>
