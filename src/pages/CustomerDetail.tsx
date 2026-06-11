import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Phone, Globe, Languages, MessageCircle, Clock,
  Sparkles, AlertTriangle, RefreshCw, CalendarClock, UserCheck,
} from 'lucide-react'
import { Card, CardHeader, GradeBadge, Flag, StatusBadge, Tag, ScoreRing } from '../components/ui'
import { getAllCustomers, addFollowUp, setStatus, useStoreVersion } from '../data/store'
import type { Customer } from '../data/types'

const STATUS_OPTIONS: Customer['status'][] = ['新询盘', '跟进中', '已报价', '待成交', '已成交', '流失风险']

export default function CustomerDetail() {
  const { id } = useParams()
  useStoreVersion()
  const all = getAllCustomers()
  const c = all.find(x => x.id === id) ?? all[0]
  const [showForm, setShowForm] = useState(false)
  const [action, setAction] = useState('')
  const [note, setNote] = useState('')

  const submitFollowUp = () => {
    if (!action.trim()) return
    addFollowUp(c.id, {
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      by: '黄总',
      action: action.trim(),
      note: note.trim() || '—',
    })
    setAction('')
    setNote('')
    setShowForm(false)
  }

  return (
    <div className="space-y-5">
      <Link to="/customers" className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-emerald-600">
        <ArrowLeft size={15} /> 返回客户列表
      </Link>

      {/* 头部档案卡 */}
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <ScoreRing score={c.score} size={64} />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[20px] font-bold text-slate-800">{c.name}</h1>
                <GradeBadge grade={c.grade} />
                <StatusBadge status={c.status} />
                <select
                  value={c.status}
                  onChange={e => setStatus(c.id, e.target.value as Customer['status'])}
                  className="text-[11.5px] text-slate-500 border border-slate-200 rounded-md px-1.5 py-0.5 outline-none hover:border-emerald-300 cursor-pointer bg-white"
                  title="变更客户状态"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {c.risk === '高' && (
                  <span className="inline-flex items-center gap-1 text-[11.5px] text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-2 py-0.5">
                    <AlertTriangle size={11} /> 流失风险
                  </span>
                )}
              </div>
              <div className="text-[13px] text-slate-400 mt-1">{c.company ?? '个人客户'} · 客户编号 {c.id}</div>
              <div className="flex items-center gap-4 mt-2 text-[12.5px] text-slate-500">
                <span className="flex items-center gap-1.5"><Phone size={13} />{c.phone}</span>
                <span className="flex items-center gap-1.5"><Flag code={c.countryCode} />{c.country} · {c.city}</span>
                <span className="flex items-center gap-1.5"><Languages size={13} />{c.language}</span>
                <span className="flex items-center gap-1.5"><Globe size={13} />来源 {c.source}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-[22px] font-bold text-emerald-600">{c.dealProbability}%</div>
              <div className="text-[11.5px] text-slate-400">成交概率</div>
            </div>
            <div>
              <div className="text-[22px] font-bold text-slate-800">${c.expectedDealUSD.toLocaleString()}</div>
              <div className="text-[11.5px] text-slate-400">预计成交额</div>
            </div>
            <div>
              <div className="text-[22px] font-bold text-slate-800">{c.chatCount}</div>
              <div className="text-[11.5px] text-slate-400">对话次数</div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-4 gap-4 text-[12.5px]">
          <div><span className="text-slate-400">需求产品：</span><span className="text-slate-700 font-medium">{c.products.join('、')}</span></div>
          <div><span className="text-slate-400">预算范围：</span><span className="text-slate-700 font-medium">{c.budget}</span></div>
          <div><span className="text-slate-400">采购计划：</span><span className="text-slate-700 font-medium">{c.purchasePlan}</span></div>
          <div><span className="text-slate-400">销售负责人：</span><span className="text-slate-700 font-medium">{c.owner}</span></div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.tags.map(t => <Tag key={t}>{t}</Tag>)}
        </div>
      </Card>

      <div className="grid grid-cols-5 gap-4">
        {/* 左：聊天记录 */}
        <Card className="col-span-2 flex flex-col" >
          <CardHeader
            title="WhatsApp 聊天记录"
            sub={`首次联系 ${c.firstContact} · 最近 ${c.lastContact}`}
            extra={<span className="flex items-center gap-1 text-[11.5px] text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />实时同步</span>}
          />
          <div className="flex-1 px-4 pb-4 space-y-3 overflow-y-auto max-h-[520px] bg-[#f0ebe3]/40 mx-4 mb-4 rounded-xl p-4">
            {c.chats.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'sales' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-[12.5px] leading-relaxed shadow-sm ${
                  m.from === 'sales' ? 'bg-[#d9fdd3] text-slate-800 rounded-tr-sm' : 'bg-white text-slate-800 rounded-tl-sm'
                }`}>
                  {m.text}
                  <div className="text-[10px] text-slate-400 text-right mt-1">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 右：AI 分析 */}
        <div className="col-span-3 space-y-4">
          {/* AI 画像 */}
          <Card>
            <CardHeader
              title="AI 客户画像"
              sub="基于全部聊天记录自动生成 · 最近更新 35 分钟前"
              extra={<button className="flex items-center gap-1 text-[12px] text-emerald-600 border border-emerald-200 bg-emerald-50 rounded-lg px-2.5 py-1 hover:bg-emerald-100"><RefreshCw size={12} />重新分析</button>}
            />
            <div className="px-5 pb-4">
              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 p-4">
                <div className="flex items-center gap-2 text-emerald-700 text-[13px] font-semibold mb-2">
                  <Sparkles size={14} /> 需求总结
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed">{c.aiSummary}</p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-[12.5px]">
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-slate-400 text-[11.5px]">需求紧急度</div>
                  <div className={`font-bold text-[15px] mt-0.5 ${c.urgency === '高' ? 'text-rose-600' : c.urgency === '中' ? 'text-amber-600' : 'text-slate-500'}`}>{c.urgency}</div>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-slate-400 text-[11.5px]">预计采购时间</div>
                  <div className="font-bold text-[15px] mt-0.5 text-slate-700">{c.purchasePlan}</div>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-slate-400 text-[11.5px]">风险等级</div>
                  <div className={`font-bold text-[15px] mt-0.5 ${c.risk === '高' ? 'text-rose-600' : c.risk === '中' ? 'text-amber-600' : 'text-emerald-600'}`}>{c.risk}</div>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-indigo-50/60 border border-indigo-100 p-4">
                <div className="text-indigo-700 text-[13px] font-semibold mb-1.5">AI 销售建议</div>
                <p className="text-[13px] text-slate-600 leading-relaxed">{c.aiAdvice}</p>
                <div className="mt-2.5 flex items-center gap-2 text-[12.5px] font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg px-3 py-2">
                  <CalendarClock size={14} /> 下一步：{c.aiNextStep}
                </div>
              </div>
            </div>
          </Card>

          {/* 评分明细 */}
          <Card>
            <CardHeader title="客户评分明细" sub={`当前评分 ${c.score} / 100 · 每条得分均可追溯到聊天证据`} />
            <div className="px-5 pb-4 space-y-1.5">
              {c.scoreBreakdown.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-[12.5px] py-1.5 border-b border-slate-50 last:border-0">
                  <span className={`shrink-0 w-12 text-center font-bold rounded-md py-0.5 text-[12px] ${
                    s.delta > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                  }`}>{s.delta > 0 ? `+${s.delta}` : s.delta}</span>
                  <span className="shrink-0 w-36 font-medium text-slate-700">{s.rule}</span>
                  <span className="text-slate-400 truncate">{s.evidence}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 跟进记录 */}
          <Card>
            <CardHeader title="销售跟进记录" sub={`负责人 ${c.owner} · 共 ${c.followUps.length} 条记录`} extra={
              <button onClick={() => setShowForm(v => !v)}
                className="flex items-center gap-1 text-[12px] text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 hover:bg-slate-50">
                <UserCheck size={12} />{showForm ? '收起' : '添加跟进'}
              </button>
            } />
            {showForm && (
              <div className="mx-5 mb-4 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2.5">
                <input value={action} onChange={e => setAction(e.target.value)} placeholder="跟进动作（如：发送报价单 / 电话回访）"
                  className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400 bg-white" />
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="备注说明（可选）" rows={2}
                  className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400 resize-none bg-white" />
                <button onClick={submitFollowUp} disabled={!action.trim()}
                  className="text-[12.5px] text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-4 py-1.5 disabled:opacity-50">
                  保存跟进记录
                </button>
              </div>
            )}
            <div className="px-5 pb-5">
              {c.followUps.length === 0 ? (
                <div className="text-[12.5px] text-slate-400 flex items-center gap-2"><Clock size={14} /> 暂无跟进记录，AI 已提醒销售 4 小时内首次响应</div>
              ) : (
                <div className="space-y-0">
                  {c.followUps.map((f, i) => (
                    <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-emerald-100 mt-1" />
                        {i < c.followUps.length - 1 && <div className="w-px flex-1 bg-slate-200" />}
                      </div>
                      <div className="flex-1 -mt-0.5">
                        <div className="flex items-center gap-2 text-[12.5px]">
                          <span className="font-semibold text-slate-700">{f.action}</span>
                          <span className="text-slate-400">{f.by}</span>
                          <span className="text-slate-300 text-[11.5px] ml-auto flex items-center gap-1"><MessageCircle size={11} />{f.time}</span>
                        </div>
                        <p className="text-[12px] text-slate-500 mt-0.5">{f.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
