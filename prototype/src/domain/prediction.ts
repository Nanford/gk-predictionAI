import type { RiskFilter, University, VolunteerItem } from '../types/prediction'

export function filterUniversities(items: University[], filter: RiskFilter): University[] {
  if (filter === '全部') return items
  if (filter === '稳妥') {
    return items.filter((item) => item.riskLabel === '稳妥' || item.riskLabel === '稳妥偏冲')
  }
  return items.filter((item) => item.riskLabel === filter)
}

export function isSubjectEligible(selected: string[], required: string[]): boolean {
  return required.every((subject) => selected.includes(subject))
}

export function diagnoseVolunteers(items: VolunteerItem[]): string {
  const fallbackCount = items.filter((item) => item.riskLabel === '保底').length
  const rushCount = items.filter((item) => item.riskLabel === '冲刺' || item.riskLabel === '高风险冲刺').length

  if (items.length === 0) return '志愿单还是空的，先加入目标院校专业组，再查看梯度诊断。'
  if (fallbackCount === 0) return '当前志愿单缺少保底志愿，建议补充 2-3 所参考概率更高的院校专业组。'
  if (rushCount > Math.ceil(items.length / 2)) return '当前冲刺志愿占比偏高，建议增加稳妥和保底志愿，降低滑档风险。'
  return '当前冲稳保梯度基本合理，正式填报前仍需核对招生章程和专业组要求。'
}
