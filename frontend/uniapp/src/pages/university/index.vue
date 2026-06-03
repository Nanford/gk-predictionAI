<template>
  <PageShell title="院校详情" :back-url="resultsUrl" current="none">
    <view class="page">
      <view v-if="detail" class="detail-hero card">
        <view class="school-line">
          <view>
            <text class="eyebrow">广东省 · {{ subjectLabel }}</text>
            <text class="school-name">{{ detail.name }}</text>
            <text class="meta">{{ detail.city }} · {{ detail.levelTags?.join(" · ") || "普通本科" }}</text>
          </view>
          <view class="school-code">代码 {{ detail.code }}</view>
        </view>
        <view class="chip-row">
          <text class="chip">专业组 {{ detail.groups.length }} 个</text>
          <text class="chip active">官方章程需复核</text>
        </view>
      </view>

      <view v-if="detail" class="page-grid">
        <view class="content-stack">
          <view v-for="group in detail.groups" :key="group.id" class="card group-card">
            <view class="section-head">
              <view>
                <text class="section-title">{{ group.name }}</text>
                <text class="meta">选科要求：{{ group.subjectRequirements || "请以官方招生章程为准" }}</text>
              </view>
              <text class="muted">{{ group.majors.length }} 个专业</text>
            </view>
            <view class="history-grid">
              <view v-for="history in sortedHistory(group.history)" :key="history.year">
                <text class="muted">{{ history.year }}</text>
                <text class="value">{{ history.minRank ?? "--" }} 名</text>
              </view>
            </view>
            <button class="button button-primary primary-wide" @click="createSchoolExplanation">
              生成院校 AI 解读
            </button>
          </view>
        </view>

        <view class="card">
          <view class="section-head">
            <text class="section-title">关键提醒</text>
            <text class="muted">填报前核对</text>
          </view>
          <view class="reason-list">
            <text>· 院校概率按最低门槛专业组展示，不代表热门专业概率。</text>
            <text>· 专业组选科、招生计划和调剂规则需要以官方招生计划为准。</text>
            <text>· 专业预测应进入专业页单独计算。</text>
          </view>
        </view>
      </view>

      <view v-if="!detail" class="empty card">正在加载院校详情...</view>
      <DisclaimerBar compact />

      <view v-if="detail" class="bottom-action">
        <button class="button button-ghost" @click="createSchoolExplanation">院校 AI 解读</button>
        <button class="button button-primary" @click="openMajors">查看专业预测</button>
      </view>
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
const subjectLabel = computed(() => (subjectType.value === "history" ? "历史类" : "物理类"));
const resultsUrl = computed(
  () => `/pages/results/index?rank=${rank.value}&score=${score.value ?? ""}&subjectType=${subjectType.value}`
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

const sortedHistory = (history: HistoryItem[]) => [...history].sort((left, right) => right.year - left.year);

const payload = () => ({
  year: 2026,
  provinceCode: "44",
  subjectType: subjectType.value,
  score: score.value,
  rank: rank.value,
  universityId: detail.value!.id
});

const createSchoolExplanation = async () => {
  if (!detail.value) return;
  const prediction = await api.authenticatedRequest<{ id: number }>("/predictions/university", {
    method: "POST",
    data: payload()
  });
  uni.navigateTo({ url: `/pages/ai/index?predictionId=${prediction.id}` });
};

const openMajors = () => {
  if (!detail.value) return;
  uni.navigateTo({
    url: `/pages/major/index?id=${detail.value.id}&rank=${rank.value}&score=${score.value ?? ""}&subjectType=${subjectType.value}`
  });
};
</script>

<style scoped>
.detail-hero {
  background: linear-gradient(135deg, #ffffff, #f3fbff 56%, #f0fffb);
}

.school-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.school-name {
  display: block;
  margin-top: 16px;
  color: #1f2937;
  font-size: 27px;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.school-code {
  align-self: flex-start;
  padding: 7px 10px;
  border-radius: 99px;
  color: #185fbe;
  background: #eaf3ff;
  font-size: 11px;
  font-weight: 800;
}

.page-grid,
.content-stack,
.group-card,
.reason-list {
  display: grid;
  gap: 14px;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.history-grid view {
  display: grid;
  gap: 5px;
  padding: 10px;
  border-radius: 13px;
  background: #f8fbff;
}

.reason-list text {
  color: #5c6878;
  font-size: 12px;
  line-height: 1.8;
}
</style>
