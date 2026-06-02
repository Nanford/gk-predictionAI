import { aiAnalysis } from '../data/demo'
import type { AiAnalysis } from '../types/prediction'

const wait = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration))

export async function convertRank(score: number): Promise<number> {
  await wait(40)
  if (score === 612) return 14800
  return Math.max(1, Math.round(14800 + (612 - score) * 760))
}

export async function generateAnalysis(): Promise<AiAnalysis> {
  await wait(180)
  return aiAnalysis
}

export async function purchaseQuota(amount: number): Promise<number> {
  await wait(120)
  return amount
}
