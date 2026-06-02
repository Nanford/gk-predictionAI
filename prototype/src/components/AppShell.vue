<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { usePredictionStore } from '../stores/prediction'

const route = useRoute()
const store = usePredictionStore()

const title = computed(() => String(route.meta.title ?? '晨光志愿'))
const showBack = computed(() => Boolean(route.meta.back))
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink v-if="showBack" class="round-action" :to="String(route.meta.back)">
        <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
      </RouterLink>
      <RouterLink v-else class="brand" to="/">
        <span class="brand-mark">志</span>
        <span>晨光志愿</span>
      </RouterLink>
      <strong v-if="showBack" class="route-title">{{ title }}</strong>
      <RouterLink class="quota-pill" to="/quota">
        <svg viewBox="0 0 24 24"><path d="M12 3v18m5-14H9.5a3.5 3.5 0 0 0 0 7H15a3.5 3.5 0 0 1 0 7H6" /></svg>
        {{ store.availableQuota }} 次
      </RouterLink>
    </header>

    <RouterView />

    <nav class="bottom-nav">
      <RouterLink to="/">
        <svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z" /></svg>
        <span>首页</span>
      </RouterLink>
      <RouterLink to="/volunteers">
        <svg viewBox="0 0 24 24"><path d="M6 3h12v18H6zM9 7h6m-6 4h6m-6 4h4" /></svg>
        <span>志愿单</span>
      </RouterLink>
      <RouterLink to="/analysis">
        <svg viewBox="0 0 24 24"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 13 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></svg>
        <span>AI 分析</span>
      </RouterLink>
      <RouterLink to="/profile">
        <svg viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></svg>
        <span>我的</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
  min-height: 100vh;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 62px;
  padding: 9px 16px;
  border-bottom: 1px solid rgba(229, 238, 248, 0.82);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
}

.brand,
.round-action,
.quota-pill {
  text-decoration: none;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1f2937;
  font-weight: 800;
}

.brand-mark {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 13px 13px 13px 4px;
  color: white;
  background: linear-gradient(135deg, #2f80ed, #20bfa9);
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 20px;
  box-shadow: 0 8px 18px rgba(47, 128, 237, 0.2);
}

.route-title {
  position: absolute;
  left: 50%;
  font-size: 15px;
  transform: translateX(-50%);
}

.round-action {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid #e5eef8;
  border-radius: 50%;
  background: #fff;
}

.round-action svg,
.quota-pill svg,
.bottom-nav svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.quota-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 7px 10px;
  border-radius: 999px;
  color: #087f75;
  background: #e8fff8;
  font-size: 12px;
  font-weight: 800;
}

.quota-pill svg {
  width: 14px;
  height: 14px;
}

.bottom-nav {
  position: fixed;
  z-index: 30;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  min-height: 66px;
  padding: 7px 10px max(7px, env(safe-area-inset-bottom));
  border-top: 1px solid rgba(229, 238, 248, 0.92);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(20px);
}

.bottom-nav a {
  display: grid;
  place-items: center;
  gap: 2px;
  color: #8a98aa;
  text-decoration: none;
  font-size: 10px;
  font-weight: 700;
}

.bottom-nav a.router-link-active {
  color: #2f80ed;
}

@media (min-width: 760px) {
  .topbar,
  .bottom-nav {
    right: max(0px, calc((100vw - 1180px) / 2));
    left: max(0px, calc((100vw - 1180px) / 2));
  }
}
</style>
