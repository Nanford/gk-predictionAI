<template>
  <aside class="disclaimer">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 20 7v5c0 4.6-3 7.7-8 9-5-1.3-8-4.4-8-9V7l8-4Z" />
      <path d="M12 8v5m0 3h.01" />
    </svg>
    <span>预测结果仅供辅助参考，不代表最终录取结果。</span>
  </aside>
</template>

<style scoped>
.disclaimer {
  display: flex;
  align-items: start;
  gap: 9px;
  border: 1px solid rgba(47, 128, 237, 0.12);
  border-radius: 14px;
  padding: 11px 12px;
  color: #4d6b91;
  background: rgba(234, 243, 255, 0.72);
  font-size: 11px;
  line-height: 1.65;
}

svg {
  width: 16px;
  min-width: 16px;
  fill: none;
  stroke: #2f80ed;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}
</style>
