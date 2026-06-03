<template>
  <PageShell title="院校推荐" back-url="/pages/rank/index" current="none">
    <view class="page results-page">
      <view class="candidate-strip">
        <view>
          <text>{{ subjectLabel }} · 广东省</text>
          <text class="strip-value">{{ score ? `${score} 分` : "未填分数" }}</text>
        </view>
        <view>
          <text>参考位次</text>
          <text class="strip-value">#{{ rank.toLocaleString("zh-CN") }}</text>
        </view>
      </view>

      <view>
        <text class="eyebrow">院校最低门槛参考</text>
        <text class="page-title">院校推荐</text>
        <text class="hero-subtitle">列表展示符合选科要求的最低门槛专业组。进入详情后可逐组查看，再生成院校或专业 AI 解读。</text>
      </view>

      <view class="toolbar">
        <view class="chip-row">
          <button
            v-for="filter in filters"
            :key="filter"
            class="chip"
            :class="{ active: activeFilter === filter }"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </view>
        <input v-model="keyword" class="input search-input" placeholder="搜索院校名称" />
      </view>

      <view v-if="loading" class="empty card">正在加载院校数据...</view>
      <view class="result-list">
        <PredictionCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          @detail="openDetail"
          @add="addVolunteer"
        />
      </view>
      <view v-if="!loading && filteredItems.length === 0" class="empty card">当前条件暂无已入库可预测院校。</view>
      <button class="button button-light primary-wide" @click="openVolunteers">查看志愿单与梯度诊断</button>
      <DisclaimerBar compact />
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PageShell from "../../components/PageShell.vue";
import PredictionCard from "../../components/PredictionCard.vue";
import { api } from "../../services/api";
import type { SubjectType, UniversitySearchItem } from "../../types/prediction";
import { normalizeRouteQuery } from "../../utils/route-query";

const rank = ref(0);
const score = ref<number | undefined>();
const subjectType = ref<SubjectType>("physics");
const loading = ref(true);
const items = ref<UniversitySearchItem[]>([]);
const activeFilter = ref("全部");
const keyword = ref("");
const filters = ["全部", "冲刺", "稳妥", "保底", "数据不足"];
const subjectLabel = computed(() => (subjectType.value === "history" ? "历史类" : "物理类"));

const filteredItems = computed(() =>
  items.value.filter((item) => {
    const matchesKeyword = item.name.includes(keyword.value.trim());
    const label = item.riskLabel;
    const matchesFilter =
      activeFilter.value === "全部" ||
      (activeFilter.value === "稳妥" && label.includes("稳妥")) ||
      (activeFilter.value === "冲刺" && label.includes("冲刺")) ||
      (activeFilter.value === "保底" && label === "保底") ||
      (activeFilter.value === "数据不足" && label === "数据不足");
    return matchesKeyword && matchesFilter;
  })
);

onLoad(async (query) => {
  const normalized = normalizeRouteQuery(query ?? {});
  rank.value = Number(normalized.rank ?? 0);
  score.value = normalized.score ? Number(normalized.score) : undefined;
  subjectType.value = normalized.subjectType === "history" ? "history" : "physics";
  try {
    const result = await api.publicRequest<{ items: UniversitySearchItem[] }>(
      `/universities/search?provinceCode=44&subjectType=${subjectType.value}&rank=${rank.value}`
    );
    items.value = result.items;
  } catch (error) {
    uni.showToast({ title: String(error), icon: "none" });
  } finally {
    loading.value = false;
  }
});

const openDetail = (item: UniversitySearchItem) => {
  uni.navigateTo({
    url: `/pages/university/index?id=${item.id}&rank=${rank.value}&score=${score.value ?? ""}&subjectType=${subjectType.value}`
  });
};

const addVolunteer = async (item: UniversitySearchItem) => {
  try {
    const prediction = await api.authenticatedRequest<{ id: number }>("/predictions/university", {
      method: "POST",
      data: {
        year: 2026,
        provinceCode: "44",
        subjectType: subjectType.value,
        rank: rank.value,
        score: score.value,
        universityId: item.id
      }
    });
    await api.authenticatedRequest("/volunteers/items", {
      method: "POST",
      data: { predictionId: prediction.id }
    });
    uni.showToast({ title: "已加入志愿单", icon: "success" });
  } catch (error) {
    uni.showToast({ title: String(error), icon: "none" });
  }
};

const openVolunteers = () => uni.navigateTo({ url: "/pages/volunteers/index" });
</script>

<style scoped>
.candidate-strip {
  display: flex;
  justify-content: space-between;
  padding: 13px 14px;
  border: 1px solid rgba(47, 128, 237, 0.14);
  border-radius: 18px;
  background: linear-gradient(135deg, #eaf3ff, #f8fffd);
}

.candidate-strip view {
  display: grid;
  gap: 3px;
}

.candidate-strip view:last-child {
  text-align: right;
}

.candidate-strip text {
  color: #607086;
  font-size: 11px;
}

.candidate-strip .strip-value {
  color: #185fbe;
  font-size: 16px;
  font-weight: 800;
}

.page-title {
  display: block;
  margin-top: 12px;
  font-size: 26px;
  font-weight: 800;
}

.toolbar {
  display: grid;
  gap: 10px;
}

.search-input {
  min-height: 42px;
}

.result-list {
  display: grid;
  gap: 12px;
}
</style>
