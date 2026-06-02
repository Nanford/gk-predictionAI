import { createRouter, createWebHistory } from 'vue-router'
import AiAnalysisPage from './pages/AiAnalysisPage.vue'
import HomePage from './pages/HomePage.vue'
import MajorPredictionPage from './pages/MajorPredictionPage.vue'
import PaymentInfoPage from './pages/PaymentInfoPage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import QuotaPage from './pages/QuotaPage.vue'
import RankConfirmPage from './pages/RankConfirmPage.vue'
import UniversityDetailPage from './pages/UniversityDetailPage.vue'
import UniversityResultsPage from './pages/UniversityResultsPage.vue'
import VolunteerListPage from './pages/VolunteerListPage.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: HomePage, meta: { title: '晨光志愿' } },
    { path: '/rank', component: RankConfirmPage, meta: { title: '位次确认', back: '/' } },
    { path: '/universities', component: UniversityResultsPage, meta: { title: '院校推荐', back: '/rank' } },
    { path: '/universities/:id', component: UniversityDetailPage, meta: { title: '院校详情', back: '/universities' } },
    { path: '/universities/:id/majors', component: MajorPredictionPage, meta: { title: '专业预测', back: '/universities/scut' } },
    { path: '/analysis', component: AiAnalysisPage, meta: { title: 'AI 分析', back: '/universities/scut' } },
    { path: '/volunteers', component: VolunteerListPage, meta: { title: '志愿单' } },
    { path: '/quota', component: QuotaPage, meta: { title: 'AI 使用额度', back: '/' } },
    { path: '/payment', component: PaymentInfoPage, meta: { title: 'AI 使用费用说明', back: '/quota' } },
    { path: '/profile', component: ProfilePage, meta: { title: '我的' } },
  ],
})

export default router
