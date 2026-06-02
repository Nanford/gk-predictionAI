import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { defaultCandidate, universities } from '../data/demo'
import { diagnoseVolunteers } from '../domain/prediction'
import { convertRank, generateAnalysis, purchaseQuota } from '../services/mockApi'
import type { AiAnalysis, Major, VolunteerItem } from '../types/prediction'

export const usePredictionStore = defineStore('prediction', () => {
  const candidate = reactive({ ...defaultCandidate, subjects: [...defaultCandidate.subjects] })
  const selectedUniversityId = ref('scut')
  const volunteers = ref<VolunteerItem[]>([])
  const freeQuota = ref(3)
  const paidQuota = ref(0)
  const lastAnalysis = ref<AiAnalysis>()
  const aiLoading = ref(false)
  const paymentLoading = ref(false)
  const paymentNotice = ref('')

  const selectedUniversity = computed(
    () => universities.find((item) => item.id === selectedUniversityId.value) ?? universities[1],
  )
  const availableQuota = computed(() => freeQuota.value + paidQuota.value)
  const volunteerDiagnosis = computed(() => diagnoseVolunteers(volunteers.value))
  const volunteerStats = computed(() => ({
    total: volunteers.value.length,
    rush: volunteers.value.filter((item) => item.riskLabel === '冲刺' || item.riskLabel === '高风险冲刺').length,
    safe: volunteers.value.filter((item) => item.riskLabel === '稳妥' || item.riskLabel === '稳妥偏冲').length,
    base: volunteers.value.filter((item) => item.riskLabel === '保底').length,
    limited: volunteers.value.filter((item) => item.riskLabel === '数据不足').length,
  }))

  async function confirmRank() {
    if (candidate.mode === 'score') candidate.rank = await convertRank(candidate.score)
  }

  function selectUniversity(id: string) {
    selectedUniversityId.value = id
  }

  function hasUniversity(id: string) {
    return volunteers.value.some((item) => item.universityId === id && !item.majorName)
  }

  function addUniversity(id: string) {
    const university = universities.find((item) => item.id === id)
    if (!university || hasUniversity(id)) return
    volunteers.value.push({
      id: `u-${id}`,
      universityId: university.id,
      universityName: university.name,
      groupName: university.groups[0]?.name ?? '专业组待确认',
      riskLabel: university.riskLabel,
    })
  }

  function addMajor(major: Major, groupName: string) {
    const id = `m-${selectedUniversity.value.id}-${major.id}`
    if (volunteers.value.some((item) => item.id === id)) return
    volunteers.value.push({
      id,
      universityId: selectedUniversity.value.id,
      universityName: selectedUniversity.value.name,
      groupName,
      majorName: major.name,
      riskLabel: major.riskLabel,
    })
  }

  function removeVolunteer(id: string) {
    volunteers.value = volunteers.value.filter((item) => item.id !== id)
  }

  async function runAnalysis() {
    if (availableQuota.value <= 0) return
    aiLoading.value = true
    lastAnalysis.value = await generateAnalysis()
    if (freeQuota.value > 0) freeQuota.value -= 1
    else paidQuota.value -= 1
    aiLoading.value = false
  }

  async function buyQuota(amount: number) {
    paymentLoading.value = true
    const purchased = await purchaseQuota(amount)
    paidQuota.value += purchased
    paymentNotice.value = `${purchased} 次 AI 使用额度已到账`
    paymentLoading.value = false
  }

  return {
    candidate,
    selectedUniversity,
    selectedUniversityId,
    volunteers,
    freeQuota,
    paidQuota,
    availableQuota,
    lastAnalysis,
    aiLoading,
    paymentLoading,
    paymentNotice,
    volunteerStats,
    volunteerDiagnosis,
    confirmRank,
    selectUniversity,
    hasUniversity,
    addUniversity,
    addMajor,
    removeVolunteer,
    runAnalysis,
    buyQuota,
  }
})
