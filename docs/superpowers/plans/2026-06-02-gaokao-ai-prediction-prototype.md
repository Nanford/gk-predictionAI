# 高考志愿 AI 预测系统 1.0 交互原型 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个手机端优先、Web/H5 兼容的高考志愿 AI 预测系统 1.0 可点击原型，完整演示广东省普通类物理方向的院校预测、专业预测、AI 分析、志愿单诊断和 AI 使用费用说明。

**Architecture:** 在 `prototype/` 中创建独立 Vue 3 + TypeScript + Vite 应用。页面通过 Vue Router 管理，演示数据集中在 `src/data/demo.ts`，业务规则集中在 `src/domain/prediction.ts`，共享状态集中在 Pinia store，组件不直接读取散落常量。AI 分析和支付采用本地异步模拟，不接入真实密钥或支付渠道。

**Tech Stack:** Vue 3、TypeScript、Vite、Vue Router、Pinia、Vitest、CSS Variables

---

## File Structure

```text
prototype/
├── package.json                         # 项目命令与依赖
├── tsconfig.json                        # TypeScript 配置
├── vite.config.ts                       # Vite 与 Vitest 配置
├── index.html                           # 单页应用入口
├── src/
│   ├── main.ts                          # 应用初始化
│   ├── App.vue                          # 路由容器
│   ├── router.ts                        # 页面路由
│   ├── styles/theme.css                 # 晨光蓝绿主题与通用样式
│   ├── types/prediction.ts              # 数据模型
│   ├── data/demo.ts                     # 广东演示数据与省份入口
│   ├── domain/prediction.ts             # 筛选、选科校验、梯度诊断
│   ├── services/mockApi.ts              # 位次换算、AI 分析、模拟支付
│   ├── stores/prediction.ts             # 考生条件、额度、志愿单
│   ├── components/AppShell.vue          # 手机容器、页头、底部导航
│   ├── components/DisclaimerBar.vue     # 统一免责声明
│   ├── components/RiskTag.vue           # 风险标签
│   ├── components/ConfidenceBadge.vue   # 置信度标签
│   ├── components/ProbabilityRange.vue  # 概率区间展示
│   ├── components/TrendChart.vue        # 近三年位次趋势
│   ├── components/UniversityCard.vue    # 院校卡片
│   ├── pages/HomePage.vue               # 首页输入
│   ├── pages/RankConfirmPage.vue        # 位次确认
│   ├── pages/UniversityResultsPage.vue  # 院校推荐
│   ├── pages/UniversityDetailPage.vue   # 院校详情
│   ├── pages/MajorPredictionPage.vue    # 专业预测
│   ├── pages/AiAnalysisPage.vue         # AI 结构化解释
│   ├── pages/VolunteerListPage.vue      # 志愿单诊断
│   ├── pages/QuotaPage.vue              # AI 额度
│   ├── pages/PaymentInfoPage.vue        # AI 使用费用说明
│   └── pages/ProfilePage.vue            # 我的
└── tests/
    └── prediction.spec.ts               # 规则层测试
```

## Task 1: Scaffold Frontend Runtime

**Files:**
- Create: `prototype/package.json`
- Create: `prototype/tsconfig.json`
- Create: `prototype/vite.config.ts`
- Create: `prototype/index.html`
- Create: `prototype/src/main.ts`
- Create: `prototype/src/App.vue`

- [ ] **Step 1: Create the Vue 3 + TypeScript + Vite scaffold**

Create package scripts:

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "vue-tsc --noEmit && vite build",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`

Expected: packages installed with exit code `0`.

- [ ] **Step 3: Verify the scaffold**

Run: `npm run build`

Expected: Vite build exits `0`.

## Task 2: Define Domain Rules With TDD

**Files:**
- Create: `prototype/src/types/prediction.ts`
- Create: `prototype/src/data/demo.ts`
- Create: `prototype/tests/prediction.spec.ts`
- Create: `prototype/src/domain/prediction.ts`

- [ ] **Step 1: Write failing tests**

Test these rules:

```ts
expect(filterUniversities(universities, '冲刺').map(item => item.name)).toEqual(['中山大学'])
expect(isSubjectEligible(['物理', '生物'], ['物理', '化学'])).toBe(false)
expect(diagnoseVolunteers([{ riskLabel: '冲刺' }, { riskLabel: '稳妥' }])).toContain('保底')
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npm test`

Expected: FAIL because `src/domain/prediction.ts` does not exist.

- [ ] **Step 3: Implement minimal domain functions**

Implement:

```ts
export function filterUniversities(items: University[], filter: RiskFilter): University[]
export function isSubjectEligible(selected: string[], required: string[]): boolean
export function diagnoseVolunteers(items: VolunteerItem[]): string
```

- [ ] **Step 4: Run tests to verify GREEN**

Run: `npm test`

Expected: all tests PASS.

## Task 3: Build Theme, Shell, and Shared Components

**Files:**
- Create: `prototype/src/styles/theme.css`
- Create: `prototype/src/router.ts`
- Create: `prototype/src/components/AppShell.vue`
- Create: `prototype/src/components/DisclaimerBar.vue`
- Create: `prototype/src/components/RiskTag.vue`
- Create: `prototype/src/components/ConfidenceBadge.vue`
- Create: `prototype/src/components/ProbabilityRange.vue`
- Create: `prototype/src/components/TrendChart.vue`
- Create: `prototype/src/components/UniversityCard.vue`

- [ ] **Step 1: Implement the morning blue-green visual system**

Define:

```css
:root {
  --brand-blue: #2f80ed;
  --brand-teal: #20bfa9;
  --brand-amber: #ffb547;
  --page-bg: #f6faff;
  --ink: #1f2937;
}
```

- [ ] **Step 2: Implement reusable result components**

Each university card must expose:

```text
院校名称、城市、标签、概率区间、风险标签、置信度、近三年位次摘要、查看详情、加入志愿单
```

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: type-check and build PASS.

## Task 4: Implement Prediction Flow

**Files:**
- Create: `prototype/src/services/mockApi.ts`
- Create: `prototype/src/stores/prediction.ts`
- Create: `prototype/src/pages/HomePage.vue`
- Create: `prototype/src/pages/RankConfirmPage.vue`
- Create: `prototype/src/pages/UniversityResultsPage.vue`
- Create: `prototype/src/pages/UniversityDetailPage.vue`
- Create: `prototype/src/pages/MajorPredictionPage.vue`

- [ ] **Step 1: Implement local API simulation**

Provide:

```ts
export async function convertRank(score: number): Promise<number>
export async function generateAnalysis(): Promise<AiAnalysis>
export async function purchaseQuota(amount: number): Promise<number>
```

- [ ] **Step 2: Implement home and rank confirmation**

Validate required fields. When a non-Guangdong province is selected, show:

```text
该省份的院校专业组规则与历年数据正在接入。
```

- [ ] **Step 3: Implement university and major prediction**

The Guangdong flow must render at least six universities. Major cards with mismatched subjects must show `不可报考` and disable volunteer addition.

- [ ] **Step 4: Run build**

Run: `npm run build`

Expected: type-check and build PASS.

## Task 5: Implement AI Analysis, Volunteer Diagnosis, and Payment Explanation

**Files:**
- Create: `prototype/src/pages/AiAnalysisPage.vue`
- Create: `prototype/src/pages/VolunteerListPage.vue`
- Create: `prototype/src/pages/QuotaPage.vue`
- Create: `prototype/src/pages/PaymentInfoPage.vue`
- Create: `prototype/src/pages/ProfilePage.vue`

- [ ] **Step 1: Implement asynchronous AI analysis simulation**

Render:

```text
一句话结论、关键依据、风险提示、下一步动作、官方资料核对清单、免责声明
```

- [ ] **Step 2: Implement volunteer list diagnosis**

Support adding and removing university groups. Show counts for `冲刺 / 稳妥 / 保底 / 数据不足`.

- [ ] **Step 3: Implement AI quota and simulated payment**

Display free quota, paid quota, consumption boundary, agreement links, and simulated quota arrival after confirmation.

- [ ] **Step 4: Run tests and build**

Run: `npm test`

Expected: all tests PASS.

Run: `npm run build`

Expected: type-check and build PASS.

## Task 6: Verify the Interactive Prototype

**Files:**
- Verify: `prototype/`

- [ ] **Step 1: Start local development server**

Run: `npm run dev`

Expected: local app available at `http://127.0.0.1:5173`.

- [ ] **Step 2: Verify core mobile path in browser**

Verify:

```text
首页 → 位次确认 → 院校推荐 → 华南理工大学详情 → 专业预测 → AI 分析
```

- [ ] **Step 3: Verify volunteer and payment paths**

Verify:

```text
加入志愿单 → 查看梯度诊断
AI 额度 → AI 使用费用说明 → 模拟支付 → 额度到账
```

- [ ] **Step 4: Verify responsive layout**

Verify at mobile viewport `390x844` and desktop viewport `1440x1000`.

- [ ] **Step 5: Run final verification**

Run: `npm test`

Expected: all tests PASS.

Run: `npm run build`

Expected: type-check and build PASS.

