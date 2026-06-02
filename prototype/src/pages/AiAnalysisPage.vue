<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import DisclaimerBar from '../components/DisclaimerBar.vue'
import { usePredictionStore } from '../stores/prediction'

const store = usePredictionStore()

onMounted(() => {
  if (!store.lastAnalysis && store.availableQuota > 0) store.runAnalysis()
})
</script>

<template>
  <main class="page page-narrow">
    <section>
      <span class="eyebrow">DeepSeek 结构化解释模拟</span>
      <h1 class="page-title">AI 辅助分析</h1>
      <p class="page-subtitle">AI 只解释结构化结果，不直接决定录取概率。</p>
    </section>

    <section v-if="store.aiLoading" class="analysis-loading card card-pad">
      <span class="loading-dot"></span>
      <h2>正在整理风险依据</h2>
      <p>基础概率已经生成，AI 正在补充原因说明和官方资料核对清单。</p>
    </section>

    <template v-else-if="store.lastAnalysis">
      <section class="summary-card card card-pad">
        <span>华南理工大学 · 参考结论</span>
        <h2>{{ store.lastAnalysis.summary }}</h2>
        <p>生成时间：刚刚 · 本次消耗 1 次 AI 使用额度</p>
      </section>

      <section class="analysis-section card card-pad">
        <div class="section-head"><h2>关键依据</h2><span>结构化数据</span></div>
        <ol>
          <li v-for="item in store.lastAnalysis.reasoning" :key="item">{{ item }}</li>
        </ol>
      </section>

      <section class="analysis-section warning card card-pad">
        <div class="section-head"><h2>风险提示</h2><span>仍需人工核对</span></div>
        <ul>
          <li v-for="item in store.lastAnalysis.riskWarning" :key="item">{{ item }}</li>
        </ul>
      </section>

      <section class="analysis-section card card-pad">
        <div class="section-head"><h2>下一步动作</h2><span>降低填报风险</span></div>
        <ul>
          <li v-for="item in store.lastAnalysis.nextActions" :key="item">{{ item }}</li>
        </ul>
      </section>

      <section class="analysis-section official card card-pad">
        <div class="section-head"><h2>官方资料核对清单</h2><span>填报前必看</span></div>
        <ul>
          <li v-for="item in store.lastAnalysis.officialChecklist" :key="item">{{ item }}</li>
        </ul>
      </section>
    </template>

    <section v-else class="empty-state card">
      <strong>AI 使用额度已用完</strong>
      <span>查看费用说明后，可模拟购买新的 AI 使用额度。</span>
      <RouterLink class="primary-btn quota-link" to="/payment">查看 AI 使用费用</RouterLink>
    </section>

    <DisclaimerBar />
  </main>
</template>

<style scoped>
.analysis-loading {
  display: grid;
  justify-items: center;
  min-height: 210px;
  place-content: center;
  text-align: center;
}

.analysis-loading h2,
.analysis-loading p {
  margin: 8px 0 0;
}

.analysis-loading p {
  max-width: 300px;
  color: #7b8798;
  font-size: 12px;
  line-height: 1.8;
}

.loading-dot {
  width: 18px;
  height: 18px;
  border: 3px solid #eaf3ff;
  border-top-color: #2f80ed;
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}

.summary-card {
  color: white;
  background: linear-gradient(135deg, #2f80ed, #20bfa9);
}

.summary-card span,
.summary-card p {
  color: rgba(255, 255, 255, 0.74);
  font-size: 11px;
}

.summary-card h2 {
  margin: 12px 0;
  font-size: 19px;
  line-height: 1.7;
}

.summary-card p {
  margin: 0;
}

.analysis-section ol,
.analysis-section ul {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding-left: 20px;
  color: #5c6878;
  font-size: 12px;
  line-height: 1.8;
}

.warning {
  border-color: rgba(255, 181, 71, 0.26);
  background: #fffdf8;
}

.official {
  border-color: rgba(32, 191, 169, 0.2);
  background: #f8fffd;
}

.quota-link {
  padding: 0 18px;
  text-decoration: none;
  font-size: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
