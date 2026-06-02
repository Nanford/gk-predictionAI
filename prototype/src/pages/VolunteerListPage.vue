<script setup lang="ts">
import { RouterLink } from 'vue-router'
import DisclaimerBar from '../components/DisclaimerBar.vue'
import RiskTag from '../components/RiskTag.vue'
import { usePredictionStore } from '../stores/prediction'

const store = usePredictionStore()
</script>

<template>
  <main class="page page-narrow">
    <section>
      <span class="eyebrow">志愿梯度诊断</span>
      <h1 class="page-title">我的志愿单</h1>
      <p class="page-subtitle">志愿单不是普通收藏夹，重点是检查冲刺、稳妥和保底结构。</p>
    </section>

    <section class="stats-grid">
      <article><strong>{{ store.volunteerStats.total }}</strong><span>当前志愿</span></article>
      <article><strong>{{ store.volunteerStats.rush }}</strong><span>冲刺</span></article>
      <article><strong>{{ store.volunteerStats.safe }}</strong><span>稳妥</span></article>
      <article><strong>{{ store.volunteerStats.base }}</strong><span>保底</span></article>
    </section>

    <section class="diagnosis card card-pad">
      <div class="section-head"><h2>梯度诊断</h2><span>AI 辅助参考</span></div>
      <p>{{ store.volunteerDiagnosis }}</p>
    </section>

    <section v-if="store.volunteers.length" class="volunteer-list fade-list">
      <article v-for="item in store.volunteers" :key="item.id" class="volunteer-item card card-pad">
        <div>
          <h3>{{ item.universityName }}</h3>
          <p>{{ item.groupName }}<template v-if="item.majorName"> · {{ item.majorName }}</template></p>
        </div>
        <div class="item-actions">
          <RiskTag :label="item.riskLabel" />
          <button class="remove-btn" @click="store.removeVolunteer(item.id)">移除</button>
        </div>
      </article>
    </section>

    <section v-else class="empty-state card">
      <strong>还没有加入志愿</strong>
      <span>从院校推荐中加入目标院校，再回来查看梯度诊断。</span>
      <RouterLink class="primary-btn link-btn" to="/universities">查看院校推荐</RouterLink>
    </section>

    <DisclaimerBar />
  </main>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
}

.stats-grid article {
  display: grid;
  gap: 3px;
  border: 1px solid #e5eef8;
  border-radius: 14px;
  padding: 10px 5px;
  background: #fff;
  text-align: center;
}

.stats-grid strong {
  color: #2f80ed;
  font-size: 20px;
}

.stats-grid span {
  color: #7b8798;
  font-size: 10px;
}

.diagnosis {
  border-color: rgba(255, 181, 71, 0.22);
  background: #fffdf8;
}

.diagnosis p {
  margin: 12px 0 0;
  color: #8a5a13;
  font-size: 12px;
  line-height: 1.8;
}

.volunteer-list {
  display: grid;
  gap: 10px;
}

.volunteer-item,
.item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

h3,
p {
  margin: 0;
}

h3 {
  font-size: 15px;
}

.volunteer-item p {
  margin-top: 5px;
  color: #7b8798;
  font-size: 11px;
}

.remove-btn {
  border: 0;
  color: #c2410c;
  background: transparent;
  font-size: 11px;
}

.link-btn {
  padding: 0 18px;
  text-decoration: none;
  font-size: 12px;
}
</style>
