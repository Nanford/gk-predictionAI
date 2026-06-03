<template>
  <PageShell title="院校推荐" back-url="/pages/rank/index" current="none">
    <view class="page results-page">
      <view class="candidate-strip">
        <view class="candidate-cell">
          <view class="row-icon"><AppIcon name="score" size="sm" /></view>
          <view>
            <text>{{ subjectLabel }} · 广东省</text>
            <text class="strip-value">{{ score ? `${score} 分` : "未填分数" }}</text>
          </view>
        </view>
        <view class="candidate-cell right">
          <view>
            <text>参考位次</text>
            <text class="strip-value">#{{ rank.toLocaleString("zh-CN") }}</text>
          </view>
          <view class="row-icon"><AppIcon name="rank" size="sm" /></view>
        </view>
      </view>

      <view>
        <view class="eyebrow">
          <AppIcon name="target" size="xs" />
          <text>院校最低门槛参考</text>
        </view>
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
        <view class="search-box">
          <AppIcon name="search" size="sm" />
          <input v-model="keyword" class="search-input" placeholder="搜索院校名称" />
        </view>
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
      <button class="button button-light primary-wide" @click="openVolunteers">
        <AppIcon name="list" size="sm" />
        <text>查看志愿单与梯度诊断</text>
      </button>
      <DisclaimerBar compact />
    </view>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import AppIcon from "../../components/AppIcon.vue";
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
  gap: 10px;
  padding: 13px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12px 34px rgba(25, 49, 78, 0.08);
}

.candidate-cell {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.candidate-cell view:not(.row-icon) {
  display: grid;
  gap: 3px;
}

.candidate-cell.right {
  text-align: right;
  justify-content: flex-end;
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

.toolbar {
  display: grid;
  gap: 10px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid rgba(196, 219, 238, 0.86);
  border-radius: 18px;
  background: rgba(250, 253, 255, 0.92);
  box-sizing: border-box;
}

.search-input {
  flex: 1;
  min-height: 46px;
  color: #172435;
  font-size: 15px;
}

.result-list {
  display: grid;
  gap: 12px;
}
</style>
