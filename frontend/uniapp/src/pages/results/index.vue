<template>
  <view class="page">
    <view class="hero">
      <text class="hero-title">院校最低门槛参考</text>
      <text class="hero-subtitle">当前位次 {{ rank }}。列表展示符合选科要求的可报专业组中最容易进入的一组，进入详情后可逐组查看。</text>
    </view>
    <view v-if="loading" class="empty">正在加载院校数据...</view>
    <PredictionCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @detail="openDetail"
      @add="addVolunteer"
    />
    <view v-if="!loading && items.length === 0" class="empty">当前科目暂无已入库可预测院校。</view>
    <button class="button button-light primary-wide" @click="openVolunteers">查看志愿单与梯度诊断</button>
    <DisclaimerBar compact />
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import DisclaimerBar from "../../components/DisclaimerBar.vue";
import PredictionCard from "../../components/PredictionCard.vue";
import { api } from "../../services/api";
import type { SubjectType, UniversitySearchItem } from "../../types/prediction";
import { normalizeRouteQuery } from "../../utils/route-query";

const rank = ref(0);
const score = ref<number | undefined>();
const subjectType = ref<SubjectType>("physics");
const loading = ref(true);
const items = ref<UniversitySearchItem[]>([]);

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
