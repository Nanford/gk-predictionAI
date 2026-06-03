<template>
  <PageShell current="home">
    <view class="page">
      <view class="mobile-headline">
        <text class="mobile-headline-title">用历年数据\n看清志愿选择</text>
        <text class="mobile-headline-copy">输入分数、位次和选科条件，获取院校概率参考与风险提示。</text>
      </view>

      <view class="card form-card">
        <view class="field-grid">
          <view class="field">
            <text class="field-label">所在省份</text>
            <view class="picker">广东省</view>
          </view>
          <view class="field">
            <text class="field-label">高考年份</text>
            <view class="picker">2026</view>
          </view>
          <view class="field">
            <text class="field-label">科目类型</text>
            <picker :range="subjectLabels" :value="subjectIndex" @change="changeSubject">
              <view class="picker">{{ subjectLabels[subjectIndex] }}</view>
            </picker>
          </view>
          <view class="field">
            <text class="field-label">全省位次</text>
            <input v-model="rank" class="input" type="number" placeholder="例如 9200" />
          </view>
        </view>

        <view class="score-input-card">
          <text class="field-label">高考分数</text>
          <view class="score-line">
            <input v-model="score" class="input" type="number" placeholder="612" />
            <text class="unit">分</text>
          </view>
        </view>

        <button class="button button-primary primary-wide" @click="startPrediction">开始 AI 志愿分析</button>

        <view class="notice">
          2026 年一分一段表尚未导入时，不跨年强行估算位次。AI 分析基于历年公开数据生成，仅供辅助参考。
        </view>
      </view>

      <view class="school-card">
        <view class="school">
          <view class="school-head">
            <view>
              <text class="school-name">推荐查看</text>
              <text class="school-meta">院校概率 · 专业风险 · 志愿梯度</text>
            </view>
            <text class="tag safe">今日剩余 3 次</text>
          </view>
        </view>
      </view>
      <DisclaimerBar compact />
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PageShell from "../../components/PageShell.vue";

const subjectLabels = ["物理类", "历史类"];
const subjectIndex = ref(0);
const score = ref("");
const rank = ref("");

const changeSubject = (event: { detail: { value: string } }) => {
  subjectIndex.value = Number(event.detail.value);
};

const startPrediction = () => {
  if (!rank.value) {
    uni.showToast({ title: "请先填写全省位次", icon: "none" });
    return;
  }
  const subjectType = subjectIndex.value === 0 ? "physics" : "history";
  uni.navigateTo({
    url: `/pages/rank/index?rank=${rank.value}&score=${score.value}&subjectType=${subjectType}`
  });
};
</script>

<style scoped>
.school-card {
  display: grid;
  gap: 12px;
}

.school {
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

.school-name,
.school-meta {
  display: block;
}

.school-name {
  color: #1f2937;
  font-size: 16px;
  font-weight: 900;
}

.school-meta {
  margin-top: 6px;
  color: #9ca3af;
  font-size: 12px;
}

.tag {
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.tag.safe {
  color: #047857;
  background: #e8fff8;
}
</style>
