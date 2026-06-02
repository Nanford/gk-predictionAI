export type RiskLabel =
  | '冲刺'
  | '稳妥偏冲'
  | '稳妥'
  | '保底'
  | '高风险冲刺'
  | '数据不足'
  | '不可报考'

export type ConfidenceLevel = '高' | '中高' | '中' | '低'

export type RiskFilter = '全部' | '冲刺' | '稳妥' | '保底'

export interface HistoryPoint {
  year: number
  minScore: number
  minRank: number
  avgRank: number
  planCount: number
}

export interface Major {
  id: string
  name: string
  code: string
  requiredSubjects: string[]
  planCount: number
  probabilityLow: number
  probabilityHigh: number
  riskLabel: RiskLabel
  confidence: ConfidenceLevel
  minRankSummary: string
  note?: string
}

export interface UniversityGroup {
  id: string
  name: string
  requiredSubjects: string[]
  majors: Major[]
}

export interface University {
  id: string
  name: string
  city: string
  tags: string[]
  probability: number
  probabilityLow: number
  probabilityHigh: number
  riskLabel: RiskLabel
  confidence: ConfidenceLevel
  groupCount: number
  minRankSummary: string
  history: HistoryPoint[]
  planChange: string
  groups: UniversityGroup[]
  intro?: string
  sourceItems?: { name: string; url: string; updatedAt: string }[]
}

export interface VolunteerItem {
  id: string
  universityId: string
  universityName: string
  groupName: string
  riskLabel: RiskLabel
  majorName?: string
}

export interface CandidateProfile {
  year: number
  province: string
  category: string
  subjects: string[]
  mode: 'score' | 'rank'
  score: number
  rank: number
}

export interface AiAnalysis {
  summary: string
  reasoning: string[]
  riskWarning: string[]
  nextActions: string[]
  officialChecklist: string[]
}
