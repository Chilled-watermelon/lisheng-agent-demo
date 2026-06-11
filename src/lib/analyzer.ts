import type { Customer, ScoreItem } from '../data/types'

// 客户端规则分析引擎：基于多语言业务信号词典对聊天记录做确定性分析。
// 正式版中该步骤由大模型 + RAG 完成，这里保证试用版离线可用且结果可追溯。

interface SignalRule {
  rule: string
  delta: number
  patterns: RegExp[]
}

const SIGNALS: SignalRule[] = [
  {
    rule: '询问价格', delta: 15,
    patterns: [/how much|price|cost|cheap|expensive|quote me/i, /precio|cu[aá]nto|cotiza/i, /prix|combien/i, /سعر|كم/, /多少钱|价格|报价/],
  },
  {
    rule: '询问运费', delta: 10,
    patterns: [/shipping|freight|deliver|ship to|DDP|FOB|CIF|port|air express|sea/i, /env[ií]o|flete|mar[ií]timo/i, /livraison/i, /شحن/, /运费|物流|海运|空运/],
  },
  {
    rule: '询问付款方式', delta: 15,
    patterns: [/payment|pay(pal)?|T\/T|L\/C|deposit|installment|credit/i, /pago|carta de cr[eé]dito|dep[oó]sito/i, /paiement/i, /دفع/, /付款|定金|账期/],
  },
  {
    rule: '要求报价单', delta: 20,
    patterns: [/quotation|formal quote|proforma|PI\b|invoice|price list/i, /cotizaci[oó]n|factura/i, /devis/i, /عرض سعر/, /报价单|形式发票/],
  },
  {
    rule: '提供公司信息', delta: 20,
    patterns: [/our (company|store|shop|brand)|company name|we are a|my (store|shop|restaurant|cafe)|ltd\.?|llc|inc\.?|S\.?A\.?\b/i, /nuestra (empresa|tienda)|mi tienda/i, /شركتنا/, /我们公司|我的店/],
  },
  {
    rule: '采购紧迫', delta: 12,
    patterns: [/urgent|asap|as soon as|this week|next week|next month|opening (in|next|soon)|deadline|by (june|july|august|september)/i, /urgente|pr[oó]xim[oa]|inaugura/i, /عاجل/, /尽快|急|下个?月开业/],
  },
  {
    rule: '价格敏感严重', delta: -10,
    patterns: [/too expensive|cheaper|best price|lowest|discount\?|aliexpress|alibaba price|over my budget/i, /muy caro|m[aá]s barato|descuento/i, /غالي/, /太贵|便宜点|最低价/],
  },
]

const PRODUCT_MAP: [RegExp, string, string][] = [
  [/seal(ing|er)?\s*machine|selladora/i, '奶茶封口机', '#封口机'],
  [/shak(er|ing)\s*machine|agitador/i, '雪克机', '#雪克机'],
  [/ice\s*mak(er|ing)|m[aá]quina de hielo/i, '制冰机', '#制冰机'],
  [/fructose|dispensador de fructosa/i, '果糖定量机', '#果糖机'],
  [/tea\s*(brew|machine)|t[eé] m[aá]quina/i, '茶汤机', '#茶汤机'],
  [/cups?|straws?|vasos|tazas/i, '杯子/吸管耗材', '#耗材'],
  [/full (set|package)|whole (store|shop)|todo el paquete|equipar/i, '奶茶设备整套', '#整店设备'],
]

const COUNTRY_HINTS: [RegExp, string, string][] = [
  [/\+1\b|USA|United States|america|san francisco|new york|texas/i, '美国', 'US'],
  [/\+52|m[eé]xico|mexico city/i, '墨西哥', 'MX'],
  [/\+966|saudi|riyadh|jeddah/i, '沙特阿拉伯', 'SA'],
  [/\+971|dubai|UAE|abu dhabi/i, '阿联酋', 'AE'],
  [/\+44|UK\b|england|london/i, '英国', 'GB'],
  [/\+61|australia|melbourne|sydney/i, '澳大利亚', 'AU'],
  [/\+33|france|paris/i, '法国', 'FR'],
  [/\+57|colombia|bogot[aá]/i, '哥伦比亚', 'CO'],
  [/\+66|thailand|bangkok/i, '泰国', 'TH'],
  [/\+81|japan|osaka|tokyo/i, '日本', 'JP'],
  [/\+82|korea|seoul/i, '韩国', 'KR'],
  [/\+84|vietnam|hanoi/i, '越南', 'VN'],
  [/\+234|nigeria|lagos/i, '尼日利亚', 'NG'],
]

function detectLanguage(text: string): string {
  if (/[\u0600-\u06FF]/.test(text)) return '阿拉伯语'
  if (/¿|¡|ñ|cu[aá]nto|hola|gracias|precio/i.test(text)) return '西班牙语'
  if (/bonjour|combien|merci|prix/i.test(text)) return '法语'
  return '英语'
}

function excerpt(text: string, re: RegExp): string {
  const lines = text.split(/\n+/)
  const hit = lines.find(l => re.test(l))
  if (!hit) return ''
  const t = hit.trim()
  return t.length > 64 ? `"${t.slice(0, 64)}…"` : `"${t}"`
}

export interface AnalysisInput {
  chatText: string
  name?: string
  phone?: string
}

export function analyzeChat(input: AnalysisInput): Customer {
  const text = input.chatText
  const breakdown: ScoreItem[] = [
    { rule: '客户主动询价', delta: 10, evidence: '客户主动发起本段对话' },
  ]

  for (const s of SIGNALS) {
    const matched = s.patterns.find(p => p.test(text))
    if (matched) breakdown.push({ rule: s.rule, delta: s.delta, evidence: excerpt(text, matched) || '语义信号命中' })
  }

  // 消息轮次活跃度
  const lineCount = text.split(/\n+/).filter(l => l.trim()).length
  if (lineCount >= 8) breakdown.push({ rule: '多次主动联系', delta: 20, evidence: `对话包含 ${lineCount} 条消息，互动密集` })
  else if (lineCount <= 2) breakdown.push({ rule: '无明确需求', delta: -20, evidence: '对话过短，无法识别场景与数量' })

  const base = 18
  let score = base + breakdown.reduce((a, b) => a + b.delta, 0)
  score = Math.max(5, Math.min(98, score))
  breakdown.unshift({ rule: '基础互动分', delta: base, evidence: '建档基础分' })

  const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'

  const products = PRODUCT_MAP.filter(([re]) => re.test(text)).map(([, name]) => name)
  const productTags = PRODUCT_MAP.filter(([re]) => re.test(text)).map(([, , tag]) => tag)
  const budgetMatch = text.match(/\$ ?([\d,]+)(?:\s*[-–to]+\s*\$? ?([\d,]+))?|([\d,]+)\s*(usd|dollars|d[oó]lares)/i)
  const budget = budgetMatch ? `$${budgetMatch[1] ?? budgetMatch[3]}${budgetMatch[2] ? ` - $${budgetMatch[2]}` : ''}` : '待确认'
  const countryHit = COUNTRY_HINTS.find(([re]) => re.test(text + ' ' + (input.phone ?? '')))
  const [, country, countryCode] = countryHit ?? [null, '待确认', 'XX']
  const language = detectLanguage(text)
  const urgent = breakdown.some(b => b.rule === '采购紧迫')
  const urgency = urgent ? '高' : grade === 'A' || grade === 'B' ? '中' : '低'
  const dealProbability = Math.max(3, Math.min(92, Math.round(score * 0.82 - (grade === 'D' ? 10 : 0))))

  const now = new Date()
  const fmt = (d: Date) => d.toISOString().slice(0, 16).replace('T', ' ')
  const name = input.name?.trim() || '新询盘客户'

  const summaryParts: string[] = []
  summaryParts.push(products.length ? `客户对${products.join('、')}有明确兴趣` : '客户产品需求尚待明确')
  if (budget !== '待确认') summaryParts.push(`预算约 ${budget}`)
  if (urgent) summaryParts.push('表达了较强的时间紧迫性')
  if (breakdown.some(b => b.rule === '要求报价单')) summaryParts.push('已主动索取正式报价')
  if (breakdown.some(b => b.rule === '提供公司信息')) summaryParts.push('主动提供了公司/门店背景信息')
  if (breakdown.some(b => b.rule === '价格敏感严重')) summaryParts.push('对价格较为敏感，需注意价值引导')

  const adviceMap: Record<string, string> = {
    A: '高意向客户，建议 24 小时内发送正式报价并提供视频验机，趁热推动本周确认订单。',
    B: '意向真实但信息不完整，建议补齐关键画像（出杯量/预算/决策人），用案例与专业问答建立信任后推进报价。',
    C: '培育型客户，建议用开放式问题挖掘业务场景，发送产品视频引导互动，暂不投入重点跟进资源。',
    D: '低优先级，使用模板消息回复价格区间与产品目录，7 天无回复则归档，避免人工投入。',
  }
  const nextStepMap: Record<string, string> = {
    A: '今日发送正式报价单（PI），确认付款方式',
    B: '询问日出杯量与开业时间，发送对应案例',
    C: '发送产品演示视频，询问开店计划',
    D: '模板回复 + 7 天观察期',
  }

  return {
    id: `C-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 900) + 100)}`,
    name,
    phone: input.phone?.trim() || '待补充',
    country, countryCode, city: '待确认', language,
    source: 'WhatsApp',
    owner: '待分配',
    firstContact: fmt(now), lastContact: fmt(now), chatCount: lineCount,
    products: products.length ? products : ['待确认'],
    budget,
    purchasePlan: urgent ? '30-60 天内' : '待确认',
    score, grade, dealProbability,
    risk: grade === 'D' ? '高' : grade === 'C' ? '中' : '低',
    urgency,
    expectedDealUSD: 0,
    status: '新询盘',
    tags: [...productTags, `#${language}客户`, ...(country !== '待确认' ? [`#${country}客户`] : []), '#试用分析'],
    aiSummary: summaryParts.join('；') + '。',
    aiAdvice: adviceMap[grade],
    aiNextStep: nextStepMap[grade],
    scoreBreakdown: breakdown,
    chats: text.split(/\n+/).filter(l => l.trim()).slice(0, 40).map(l => {
      const salesMark = /^(me|sales|销售|我)\s*[:：]/i.test(l.trim())
      return {
        from: salesMark ? 'sales' as const : 'customer' as const,
        text: l.trim().replace(/^(me|sales|customer|客户|销售|我)\s*[:：]\s*/i, '').slice(0, 300),
        time: fmt(now).slice(5),
      }
    }),
    followUps: [],
  }
}
