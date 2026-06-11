export type Grade = 'A' | 'B' | 'C' | 'D'

export interface ChatMessage {
  from: 'customer' | 'sales'
  text: string
  time: string
}

export interface ScoreItem {
  rule: string
  delta: number
  evidence: string
}

export interface FollowUp {
  time: string
  by: string
  action: string
  note: string
}

export interface Customer {
  id: string
  name: string
  company?: string
  phone: string
  country: string
  countryCode: string
  city: string
  language: string
  source: 'WhatsApp' | 'Facebook' | 'Instagram' | '网站询盘' | '展会'
  owner: string
  firstContact: string
  lastContact: string
  chatCount: number
  // 业务信息
  products: string[]
  budget: string
  purchasePlan: string
  // AI 分析
  score: number
  grade: Grade
  dealProbability: number
  risk: '低' | '中' | '高'
  urgency: '高' | '中' | '低'
  expectedDealUSD: number
  status: '新询盘' | '跟进中' | '已报价' | '待成交' | '已成交' | '流失风险'
  tags: string[]
  aiSummary: string
  aiAdvice: string
  aiNextStep: string
  scoreBreakdown: ScoreItem[]
  chats: ChatMessage[]
  followUps: FollowUp[]
}

export interface SalesPerson {
  name: string
  avatarColor: string
  customers: number
  aGrade: number
  pendingFollowUp: number
  expectedUSD: number
  dealsThisMonth: number
  avgResponseMin: number
}
