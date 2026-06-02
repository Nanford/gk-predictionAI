import { describe, expect, it } from 'vitest'
import {
  diagnoseVolunteers,
  filterUniversities,
  isSubjectEligible,
} from '../src/domain/prediction'
import type { University, VolunteerItem } from '../src/types/prediction'
import { convertRank, generateAnalysis, purchaseQuota } from '../src/services/mockApi'

const universities: University[] = [
  {
    id: 'sysu',
    name: '中山大学',
    city: '广州',
    tags: ['985'],
    probability: 48,
    probabilityLow: 42,
    probabilityHigh: 53,
    riskLabel: '冲刺',
    confidence: '中',
    groupCount: 3,
    minRankSummary: '近三年最低位次 11,200 - 14,300',
    history: [],
    planChange: '招生计划总体稳定',
    groups: [],
  },
  {
    id: 'scut',
    name: '华南理工大学',
    city: '广州',
    tags: ['985'],
    probability: 72,
    probabilityLow: 65,
    probabilityHigh: 78,
    riskLabel: '稳妥偏冲',
    confidence: '中高',
    groupCount: 2,
    minRankSummary: '近三年最低位次 14,600 - 15,400',
    history: [],
    planChange: '计划人数小幅增加',
    groups: [],
  },
]

describe('prediction domain rules', () => {
  it('filters university recommendations by risk group', () => {
    expect(filterUniversities(universities, '冲刺').map((item) => item.name)).toEqual([
      '中山大学',
    ])
  })

  it('rejects a major group when the selected subjects do not meet requirements', () => {
    expect(isSubjectEligible(['物理', '生物'], ['物理', '化学'])).toBe(false)
  })

  it('diagnoses a volunteer list without a fallback option', () => {
    const items = [
      { id: '1', universityId: 'sysu', universityName: '中山大学', groupName: '201 专业组', riskLabel: '冲刺' },
      { id: '2', universityId: 'scut', universityName: '华南理工大学', groupName: '202 专业组', riskLabel: '稳妥' },
    ] satisfies VolunteerItem[]

    expect(diagnoseVolunteers(items)).toContain('保底')
  })
})

describe('prototype API simulation', () => {
  it('converts the Guangdong demo score into a rank', async () => {
    await expect(convertRank(612)).resolves.toBe(14800)
  })

  it('returns a structured AI explanation', async () => {
    const analysis = await generateAnalysis()

    expect(analysis.reasoning.length).toBeGreaterThanOrEqual(3)
    expect(analysis.officialChecklist).toContain('核对广东省教育考试院公布的招生计划')
  })

  it('returns the purchased quota count', async () => {
    await expect(purchaseQuota(30)).resolves.toBe(30)
  })
})
