<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import DisclaimerBar from '../components/DisclaimerBar.vue'
import UniversityCard from '../components/UniversityCard.vue'
import { universities } from '../data/demo'
import { filterUniversities } from '../domain/prediction'
import { usePredictionStore } from '../stores/prediction'
import type { RiskFilter } from '../types/prediction'

const router = useRouter()
const store = usePredictionStore()
const activeFilter = ref<RiskFilter>('全部')
const query = ref('')
const filters: RiskFilter[] = ['全部', '冲刺', '稳妥', '保底']

const resultItems = computed(() =>
  filterUniversities(universities, activeFilter.value).filter((item) => item.name.includes(query.value.trim())),
)

function openDetail(id: string) {
  store.selectUniversity(id)
  router.push(`/universities/${id}`)
}
</script>

<template>
  <main class="page results-page">
    <section class="candidate-strip">
      <div>
        <span>{{ store.candidate.province }} · {{ store.candidate.category }}</span>
        <strong>{{ store.candidate.score }} 分</strong>
      </div>
      <div>
        <span>参考位次</span>
        <strong>#{{ store.candidate.rank.toLocaleString() }}</strong>
      </div>
    </section>

    <section>
      <h1 class="page-title">院校推荐</h1>
      <p class="page-subtitle">基于位次、近三年数据和招生计划变化生成参考范围。</p>
    </section>

    <section class="toolbar">
      <div class="chip-row">
        <button
          v-for="filter in filters"
          :key="filter"
          class="chip"
          :class="{ active: activeFilter === filter }"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>
      <input v-model="query" type="search" placeholder="搜索院校名称" />
    </section>

    <section class="result-list fade-list">
      <UniversityCard
        v-for="university in resultItems"
        :key="university.id"
        :university="university"
        :saved="store.hasUniversity(university.id)"
        @view="openDetail"
        @save="store.addUniversity"
      />
    </section>

    <DisclaimerBar />
  </main>
</template>

<style scoped>
.results-page {
  max-width: 960px;
  margin: 0 auto;
}

.candidate-strip {
  display: flex;
  justify-content: space-between;
  border: 1px solid rgba(47, 128, 237, 0.14);
  border-radius: 18px;
  padding: 13px 14px;
  background: linear-gradient(135deg, #eaf3ff, #f8fffd);
}

.candidate-strip div {
  display: grid;
  gap: 3px;
}

.candidate-strip div:last-child {
  text-align: right;
}

.candidate-strip span {
  color: #607086;
  font-size: 11px;
}

.candidate-strip strong {
  color: #185fbe;
  font-size: 16px;
}

.toolbar {
  display: grid;
  gap: 10px;
}

input {
  min-height: 42px;
  border: 1px solid #e5eef8;
  border-radius: 13px;
  outline: 0;
  padding: 0 12px;
  background: #fff;
}

.result-list {
  display: grid;
  gap: 11px;
}

@media (min-width: 760px) {
  .result-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .toolbar {
    grid-template-columns: 1fr 220px;
    align-items: center;
  }
}
</style>
