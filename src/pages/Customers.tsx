import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Filter, Download, MessageCircle } from 'lucide-react'
import { Card, GradeBadge, Flag, StatusBadge, Tag, ScoreRing } from '../components/ui'
import { CUSTOMERS } from '../data/customers'
import type { Grade } from '../data/types'

const GRADES: (Grade | '全部')[] = ['全部', 'A', 'B', 'C', 'D']
const STATS = [
  { label: 'A级客户', value: 156, color: 'text-emerald-600' },
  { label: 'B级客户', value: 327, color: 'text-indigo-600' },
  { label: 'C级客户', value: 489, color: 'text-amber-600' },
  { label: 'D级客户', value: 276, color: 'text-slate-500' },
  { label: '待跟进', value: 178, color: 'text-orange-600' },
  { label: '30天未联系', value: 89, color: 'text-rose-500' },
  { label: '高意向', value: 203, color: 'text-emerald-600' },
  { label: '预计成交', value: 47, color: 'text-violet-600' },
]

export default function Customers() {
  const [grade, setGrade] = useState<Grade | '全部'>('全部')
  const [kw, setKw] = useState('')
  const list = useMemo(() =>
    CUSTOMERS.filter(c =>
      (grade === '全部' || c.grade === grade) &&
      (kw === '' || c.name.toLowerCase().includes(kw.toLowerCase()) || c.country.includes(kw) || c.tags.some(t => t.includes(kw)))
    ), [grade, kw])

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">客户知识库</h1>
          <p className="text-[13px] text-slate-400 mt-0.5">每位客户一份独立档案 · AI 自动建档、评分、打标签</p>
        </div>
        <button className="flex items-center gap-1.5 text-[12.5px] text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50">
          <Download size={14} /> 导出客户数据
        </button>
      </div>

      {/* 分类统计 */}
      <div className="grid grid-cols-8 gap-3">
        {STATS.map(s => (
          <Card key={s.label} className="px-3 py-3 text-center">
            <div className={`text-[20px] font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11.5px] text-slate-400 mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* 筛选 */}
      <Card className="px-4 py-3 flex items-center gap-3">
        <Filter size={15} className="text-slate-400" />
        <div className="flex gap-1.5">
          {GRADES.map(g => (
            <button key={g} onClick={() => setGrade(g)}
              className={`text-[12.5px] px-3 py-1 rounded-lg border transition-colors ${
                grade === g ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
              }`}>
              {g === '全部' ? '全部等级' : `${g} 级`}
            </button>
          ))}
        </div>
        <input
          value={kw} onChange={e => setKw(e.target.value)}
          placeholder="搜索姓名 / 国家 / 标签…"
          className="ml-auto text-[13px] border border-slate-200 rounded-lg px-3 py-1.5 w-64 outline-none focus:border-emerald-400"
        />
        <span className="text-[12px] text-slate-400">{list.length} 位客户</span>
      </Card>

      {/* 客户列表 */}
      <div className="grid grid-cols-2 gap-4">
        {list.map(c => (
          <Link to={`/customers/${c.id}`} key={c.id}>
            <Card className="p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <ScoreRing score={c.score} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 text-[14.5px]">{c.name}</span>
                      <GradeBadge grade={c.grade} />
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-400 mt-1">
                      <Flag code={c.countryCode} /> {c.country} · {c.city} · {c.language} · 来源 {c.source}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">成交概率</div>
                  <div className="text-[17px] font-bold text-emerald-600">{c.dealProbability}%</div>
                </div>
              </div>
              <p className="mt-3 text-[12.5px] text-slate-500 leading-relaxed line-clamp-2">{c.aiSummary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.tags.slice(0, 5).map(t => <Tag key={t}>{t}</Tag>)}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11.5px] text-slate-400">
                <span className="flex items-center gap-1"><MessageCircle size={12} /> {c.chatCount} 次对话 · 负责人 {c.owner}</span>
                <span>最近联系 {c.lastContact.slice(5, 16)}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
