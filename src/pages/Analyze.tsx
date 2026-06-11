import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wand2, Sparkles, Lock, Save, Loader2, ClipboardPaste } from 'lucide-react'
import { Card, CardHeader, GradeBadge, ScoreRing, Tag, Flag } from '../components/ui'
import { analyzeChat } from '../lib/analyzer'
import { analysisLeft, consumeAnalysis, LICENSE } from '../lib/license'
import { saveCustomer, touch, useStoreVersion } from '../data/store'
import type { Customer } from '../data/types'

const SAMPLE = `Hi, I saw your bubble tea sealing machine on Facebook. How much is the automatic model?
me: Hello! The automatic model is $1,650, seals 500-650 cups/hour. Are you opening a new store?
Yes, opening my shop in Dubai next month, so it is a bit urgent. Do you ship DDP to Dubai?
me: Yes, DDP by sea is about $280, 16-18 days. Air express 5-7 days.
Good. Our company is Sweet Corner LLC. Please send me a formal quotation, also for 10,000 cups. Do you accept T/T?`

const STAGES = ['正在解析对话结构…', '识别业务信号与产品需求…', '计算评分与等级…', '生成客户画像与建议…']

export default function Analyze() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [text, setText] = useState('')
  const [stage, setStage] = useState(-1)
  const [result, setResult] = useState<Customer | null>(null)
  const [saved, setSaved] = useState(false)
  useStoreVersion()
  const left = analysisLeft()

  const run = () => {
    if (!text.trim() || stage >= 0) return
    setResult(null)
    setSaved(false)
    setStage(0)
    STAGES.forEach((_, i) => setTimeout(() => setStage(i), i * 550))
    setTimeout(() => {
      consumeAnalysis()
      setResult(analyzeChat({ chatText: text, name, phone }))
      setStage(-1)
      touch()
    }, STAGES.length * 550 + 350)
  }

  const save = () => {
    if (!result || saved) return
    saveCustomer(result)
    setSaved(true)
    setTimeout(() => navigate(`/customers/${result.id}`), 600)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">AI 分析工作台</h1>
          <p className="text-[13px] text-slate-400 mt-0.5">粘贴任意客户聊天记录，AI 即时输出画像、评分与跟进建议 · 支持英/西/阿/法等多语言</p>
        </div>
        <div className={`text-[12.5px] px-3 py-1.5 rounded-lg border ${
          left > 5 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-300'
        }`}>
          {LICENSE.edition} · 剩余 AI 分析额度 <b>{left}</b> 次
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* 输入区 */}
        <Card className="col-span-2 flex flex-col">
          <CardHeader title="聊天记录输入" sub="正式版由 WhatsApp 实时同步自动触发，无需手动粘贴" extra={
            <button onClick={() => setText(SAMPLE)} className="flex items-center gap-1 text-[12px] text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 hover:bg-slate-50">
              <ClipboardPaste size={12} /> 填入示例
            </button>
          } />
          <div className="px-5 pb-5 flex-1 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="客户姓名（可选）"
                className="text-[13px] border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400" />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="手机号（可选，如 +971 50 1234）"
                className="text-[13px] border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400" />
            </div>
            <textarea
              value={text} onChange={e => setText(e.target.value)}
              placeholder={'粘贴 WhatsApp 聊天记录，每行一条消息。\n销售自己的消息可用 "me:" 开头标注，例如：\n\nHi, how much is the sealing machine?\nme: Hello! The automatic model is $1,650...'}
              className="flex-1 min-h-72 text-[13px] leading-relaxed border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-emerald-400 resize-none font-mono"
            />
            {left === 0 ? (
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-[13px] text-slate-500">
                <Lock size={15} className="text-amber-500 shrink-0" />
                试用额度已用完。开通正式版后由 WhatsApp 同步自动分析、不限次数 —— 请联系项目组。
              </div>
            ) : (
              <button onClick={run} disabled={!text.trim() || stage >= 0}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium text-[14px] rounded-xl py-3 transition-all disabled:opacity-50">
                {stage >= 0 ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                {stage >= 0 ? STAGES[stage] : '开始 AI 分析'}
              </button>
            )}
          </div>
        </Card>

        {/* 结果区 */}
        <div className="col-span-3">
          {!result ? (
            <Card className="h-full flex flex-col items-center justify-center text-center p-12">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                <Sparkles size={24} />
              </div>
              <div className="mt-4 text-[15px] font-semibold text-slate-700">分析结果将在这里呈现</div>
              <p className="mt-2 text-[12.5px] text-slate-400 leading-relaxed max-w-sm">
                输出内容：客户评分（0-100）、ABCD 等级、成交概率、需求画像、自动标签、风险提示与下一步跟进建议。每条结论均可追溯到聊天原文。
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <ScoreRing score={result.score} size={64} />
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[18px] font-bold text-slate-800">{result.name}</span>
                        <GradeBadge grade={result.grade} />
                        <span className="flex items-center gap-1.5 text-[12.5px] text-slate-500"><Flag code={result.countryCode} />{result.country} · {result.language}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">{result.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
                    </div>
                  </div>
                  <div className="flex gap-5 text-center shrink-0">
                    <div>
                      <div className="text-[20px] font-bold text-emerald-600">{result.dealProbability}%</div>
                      <div className="text-[11px] text-slate-400">成交概率</div>
                    </div>
                    <div>
                      <div className={`text-[20px] font-bold ${result.urgency === '高' ? 'text-rose-600' : 'text-slate-700'}`}>{result.urgency}</div>
                      <div className="text-[11px] text-slate-400">紧急度</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-[12.5px]">
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-400 text-[11px]">需求产品</div><div className="font-semibold text-slate-700 mt-0.5">{result.products.join('、')}</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-400 text-[11px]">预算判断</div><div className="font-semibold text-slate-700 mt-0.5">{result.budget}</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-400 text-[11px]">采购计划</div><div className="font-semibold text-slate-700 mt-0.5">{result.purchasePlan}</div></div>
                </div>
              </Card>

              <Card>
                <CardHeader title="AI 画像与建议" />
                <div className="px-5 pb-4 space-y-3">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 p-4">
                    <div className="text-emerald-700 text-[12.5px] font-semibold mb-1">需求总结</div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{result.aiSummary}</p>
                  </div>
                  <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-4">
                    <div className="text-indigo-700 text-[12.5px] font-semibold mb-1">销售建议</div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{result.aiAdvice}</p>
                    <div className="mt-2 text-[12.5px] font-medium text-indigo-700">下一步：{result.aiNextStep}</div>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader title="评分明细" sub="每条加减分均可追溯到聊天原文" extra={
                  <button onClick={save} disabled={saved}
                    className="flex items-center gap-1.5 text-[12.5px] text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-3 py-1.5 disabled:opacity-60">
                    <Save size={13} /> {saved ? '已保存，正在打开档案…' : '保存为客户档案'}
                  </button>
                } />
                <div className="px-5 pb-4 space-y-1">
                  {result.scoreBreakdown.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-[12.5px] py-1.5 border-b border-slate-50 last:border-0">
                      <span className={`shrink-0 w-12 text-center font-bold rounded-md py-0.5 text-[12px] ${s.delta > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                        {s.delta > 0 ? `+${s.delta}` : s.delta}
                      </span>
                      <span className="shrink-0 w-32 font-medium text-slate-700">{s.rule}</span>
                      <span className="text-slate-400 truncate">{s.evidence}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
