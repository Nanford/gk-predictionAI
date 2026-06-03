<template>
  <PageShell title="专业预测" :back-url="detailUrl" current="none">
    <view class="page">
      <view v-if="detail">
        <text class="eyebrow">院校与专业分开判断</text>
        <text class="page-title">{{ detail.name }}专业预测</text>
        <text class="hero-subtitle">专业竞争强度可能高于院校整体，生成结果前请核对专业组选科和招生计划。</text>
      </view>

      <view v-for="group in detail?.groups" :key="group.id" class="card group-card">
        <view class="section-head">
          <view>
            <text class="section-title">{{ group.name }}</text>
            <text class="meta">选科要求：{{ group.subjectRequirements || "请以官方招生计划为准" }}</text>
          </view>
          <text class="muted">{{ group.majors.length }} 个专业</text>
        </view>
        <view class="major-list">
          <view v-for="major in group.majors" :key="major.id" class="major-item">
            <view class="major-head">
              <view>
                <text class="title">{{ major.name }}</text>
                <text class="meta">代码 {{ major.code }} · {{ major.category || "专业预测参考" }}</text>
              </view>
              <text class="chip active">专业</text>
            </view>
            <text class="meta">近年位次：{{ historyRanks(group.history) }}</text>
            <button class="button button-light primary-wide" @click="createMajorExplanation(group.id, major.id)">
              生成专业 AI 解读
            </button>
          </view>
        </view>
      </view>

      <view v-if="!detail" class="empty card">正在加载专业数据...</view>
      <DisclaimerBar compact />
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PageShell from "../../components/PageShell.vue";
import { api } from "../../services/api";
import type { HistoryItem, SubjectType, UniversityDetail } from "../../types/prediction";
import { normalizeRouteQuery } from "../../utils/route-query";

const detail = ref<UniversityDetail>();
const rank = ref(0);
const score = ref<number | undefined>();
const subjectType = ref<SubjectType>("physics");
const detailUrl = computed(
  () => `/pages/university/index?id=${detail.value?.id ?? ""}&rank=${rank.value}&score=${score.value ?? ""}&subjectType=${subjectType.value}`
);

onLoad(async (query) => {
  const normalized = normalizeRouteQuery(query ?? {});
  rank.value = Number(normalized.rank ?? 0);
  score.value = normalized.score ? Number(normalized.score) : undefined;
  subjectType.value = normalized.subjectType === "history" ? "history" : "physics";
  detail.value = await api.publicRequest<UniversityDetail>(
    `/universities/${normalized.id}?subjectType=${subjectType.value}`
  );
});

const historyRanks = (history: HistoryItem[]) =>
  [...history]
    .sort((left, right) => right.year - left.year)
    .map((item) => `${item.year}: ${item.minRank ?? "--"}`)
    .join(" / ");

const payload = () => ({
  year: 2026,
  provinceCode: "44",
  subjectType: subjectType.value,
  score: score.value,
  rank: rank.value,
  universityId: detail.value!.id
});

const createMajorExplanation = async (groupId: number, majorId: number) => {
  const prediction = await api.authenticatedRequest<{ id: number }>("/predictions/major", {
    method: "POST",
    data: { ...payload(), groupId, majorId }
  });
  uni.navigateTo({ url: `/pages/ai/index?predictionId=${prediction.id}` });
};
</script>

<style scoped>
.page-title {
  display: block;
  margin-top: 12px;
  font-size: 25px;
  font-weight: 900;
}

.group-card,
.major-list,
.major-item {
  display: grid;
  gap: 12px;
}

.major-item {
  padding: 13px;
  border: 1px solid #e5eef8;
  border-radius: 15px;
  background: #fbfdff;
}

.major-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
</style>
