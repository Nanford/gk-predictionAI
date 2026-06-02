<script setup lang="ts">
import { RouterLink } from 'vue-router'
import DisclaimerBar from '../components/DisclaimerBar.vue'
import { usePredictionStore } from '../stores/prediction'

const store = usePredictionStore()

const sections = [
  ['历史查询', '查看已生成的院校与专业预测'],
  ['AI 使用记录', '查看额度扣除与异常退回记录'],
  ['用户协议', '服务范围、免责声明和隐私政策'],
  ['录取结果反馈', '单独授权后用于模型复盘'],
]
</script>

<template>
  <main class="page page-narrow">
    <section class="profile-hero card card-pad">
      <div class="avatar">考</div>
      <div>
        <h1>考生用户</h1>
        <p>{{ store.candidate.province }} · {{ store.candidate.category }} · {{ store.candidate.score }} 分</p>
      </div>
      <RouterLink class="quota" to="/quota">{{ store.availableQuota }} 次额度</RouterLink>
    </section>

    <section class="profile-list card">
      <a v-for="[name, note] in sections" :key="name" href="#">
        <div><strong>{{ name }}</strong><span>{{ note }}</span></div>
        <b>›</b>
      </a>
    </section>

    <section class="notice">
      分数、位次、志愿单和录取结果属于需要谨慎处理的信息。系统默认不公开敏感信息，不向第三方营销机构提供用户数据。
    </section>

    <DisclaimerBar />
  </main>
</template>

<style scoped>
.profile-hero {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 18px 18px 18px 6px;
  color: white;
  background: linear-gradient(135deg, #2f80ed, #20bfa9);
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 25px;
}

h1,
p {
  margin: 0;
}

h1 {
  font-size: 17px;
}

p {
  margin-top: 4px;
  color: #7b8798;
  font-size: 11px;
}

.quota {
  margin-left: auto;
  border-radius: 99px;
  padding: 6px 9px;
  color: #087f75;
  background: #e8fff8;
  font-size: 11px;
  font-weight: 800;
  text-decoration: none;
}

.profile-list {
  overflow: hidden;
}

.profile-list a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px;
  border-bottom: 1px solid #edf3f9;
  text-decoration: none;
}

.profile-list a:last-child {
  border-bottom: 0;
}

.profile-list div {
  display: grid;
  gap: 4px;
}

.profile-list strong {
  font-size: 13px;
}

.profile-list span {
  color: #7b8798;
  font-size: 11px;
}

.profile-list b {
  color: #9ca3af;
  font-size: 24px;
}
</style>
