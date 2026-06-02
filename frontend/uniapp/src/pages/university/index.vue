<template>
  <view class="page">
    <view v-if="detail" class="hero">
      <text class="hero-title">{{ detail.name }}</text>
      <text class="hero-subtitle">{{ detail.city }} · {{ detail.levelTags?.join(" · ") }}</text>
    </view>
    <view v-for="group in detail?.groups" :key="group.id" class="card">
      <text class="section-title">{{ group.name }}</text>
      <text class="meta">选科要求：{{ group.subjectRequirements || "请以官方招生章程为准" }}</text>
      <text class="meta">近年最低位次：{{ historyRanks(group.history) }}</text>
      <button class="button button-primary primary-wide" @click="createSchoolExplanation">生成院校 AI 解读</button>
      <view v-for="major in group.majors" :key="major.id" class="card">
        <text class="title">{{ major.name }}</text>
        <text class="meta">{{ major.category || "专业预测参考" }}</text>
        <button class="button button-light primary-wide" @click="createMajorExplanation(group.id, major.id)">
          查看专业预测与 AI 解读
        </button>
      </view>
    </view>
    <DisclaimerBar compact />
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import { api } from "../../services/api";
import type { HistoryItem, SubjectType, UniversityDetail } from "../../types/prediction";
import { normalizeRouteQuery } from "../../utils/route-query";

const detail = ref<UniversityDetail>();
const rank = ref(0);
const score = ref<number | undefined>();
const subjectType = ref<SubjectType>("physics");

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

const createSchoolExplanation = async () => {
  const prediction = await api.authenticatedRequest<{ id: number }>("/predictions/university", {
    method: "POST",
    data: payload()
  });
  uni.navigateTo({ url: `/pages/ai/index?predictionId=${prediction.id}` });
};

const createMajorExplanation = async (groupId: number, majorId: number) => {
  const prediction = await api.authenticatedRequest<{ id: number }>("/predictions/major", {
    method: "POST",
    data: { ...payload(), groupId, majorId }
  });
  uni.navigateTo({ url: `/pages/ai/index?predictionId=${prediction.id}` });
};
</script>
