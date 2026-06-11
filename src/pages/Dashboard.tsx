import { Link } from 'react-router-dom'
import {
  Users, UserPlus, Crown, Flame, Clock, Target,
  ArrowUpRight, ArrowDownRight, Sparkles,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from 'recharts'
import { Card, CardHeader, GradeBadge, Flag, StatusBadge } from '../components/ui'
import { CUSTOMERS, SALES, COUNTRY_DIST, GRADE_DIST, TREND_DATA } from '../data/customers'

const KPI = [
  { label: '总客户数', value: '1,248', delta: '+12.5%', up: true, icon: Users, color: 'text-sky-600 bg-sky-50' },
  { label: '本月新增客户', value: '186', delta: '+18.2%', up: true, icon: UserPlus, color: 'text-indigo-600 bg-indigo-50' },
  { label: 'A 级客户', value: '156', delta: '+9.8%', up: true, icon: Crown, color: 'text-emerald-600 bg-emerald-50' },
  { label: '高意向客户', value: '203', delta: '+15.4%', up: true, icon: Flame, color: 'text-orange-600 bg-orange-50' },
  { label: '待跟进客户', value: '178', delta: '-8.3%', up: false, icon: Clock, color: 'text-amber-600 bg-amber-50' },
  { label: '本月预计成交', value: '47', delta: '+21.0%', up: true, icon: Target, color: 'text-rose-600 bg-rose-50' },
]

export default function Dashboard() {
  const hot = [...CUSTOMERS].sort((a, b) => b.score - a.score).slice(0, 5)
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">经营仪表盘</h1>
          <p className="text-[13px] text-slate-400 mt-0.5">数据截至 2026-06-11 11:30 · WhatsApp 实时同步中</p>
        </div>
        <div className="flex items-center gap-2 text-[12.5px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
          <Sparkles size={14} />
          AI 引擎：上次全量分析 30 分钟前
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-6 gap-4">
        {KPI.map(k => (
          <Card key={k.label} className="p-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${k.color}`}>
              <k.icon size={17} />
            </div>
            <div className="mt-3 text-[24px] font-bold text-slate-800 leading-none">{k.value}</div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[12px] text-slate-400">{k.label}</span>
              <span className={`flex items-center text-[11.5px] font-medium ${k.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                {k.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{k.delta}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Trend */}
        <Card className="col-span-2">
          <CardHeader title="客户增长与 A 级转化趋势" sub="近 30 天 · 每 4 天一个统计点" />
          <div className="px-4 pb-4 h-56">
            <ResponsiveContainer>
              <AreaChart data={TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="新增客户" stroke="#6366f1" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="A级转化" stroke="#10b981" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Grade distribution */}
        <Card>
          <CardHeader title="客户等级分布" sub="AI 评分模型实时输出" />
          <div className="px-4 pb-2 h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={GRADE_DIST} dataKey="count" nameKey="grade" innerRadius={42} outerRadius={62} paddingAngle={3}>
                  {GRADE_DIST.map(g => <Cell key={g.grade} fill={g.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="px-5 pb-4 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {GRADE_DIST.map(g => (
              <div key={g.grade} className="flex items-center justify-between text-[12.5px]">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2 h-2 rounded-full" style={{ background: g.color }} />{g.grade}
                </span>
                <span className="font-semibold text-slate-700">{g.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Hot customers */}
        <Card className="col-span-2">
          <CardHeader
            title="高意向客户队列"
            sub="AI 根据最新对话识别的优先跟进客户"
            extra={<Link to="/customers" className="text-[12.5px] text-emerald-600 font-medium hover:underline">查看全部 →</Link>}
          />
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[11.5px] text-slate-400 border-y border-slate-100 bg-slate-50/60">
                <th className="px-5 py-2 font-medium">客户</th>
                <th className="py-2 font-medium">国家</th>
                <th className="py-2 font-medium">等级 / 评分</th>
                <th className="py-2 font-medium">成交概率</th>
                <th className="py-2 font-medium">状态</th>
                <th className="py-2 pr-5 font-medium">AI 建议下一步</th>
              </tr>
            </thead>
            <tbody>
              {hot.map(c => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-2.5">
                    <Link to={`/customers/${c.id}`} className="font-medium text-slate-800 hover:text-emerald-600">{c.name}</Link>
                    <div className="text-[11px] text-slate-400">{c.company ?? c.phone}</div>
                  </td>
                  <td className="py-2.5"><span className="flex items-center gap-1.5"><Flag code={c.countryCode} /><span className="text-slate-600">{c.country}</span></span></td>
                  <td className="py-2.5"><span className="flex items-center gap-2"><GradeBadge grade={c.grade} /><span className="font-semibold text-slate-700">{c.score}</span></span></td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.dealProbability}%` }} />
                      </div>
                      <span className="text-[12px] font-medium text-slate-600">{c.dealProbability}%</span>
                    </div>
                  </td>
                  <td className="py-2.5"><StatusBadge status={c.status} /></td>
                  <td className="py-2.5 pr-5 text-[12px] text-slate-500 max-w-52 truncate">{c.aiNextStep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Country distribution */}
        <Card>
          <CardHeader title="客户国家分布" sub="全量 1,248 位客户" />
          <div className="px-4 pb-4 h-64">
            <ResponsiveContainer>
              <BarChart data={COUNTRY_DIST} layout="vertical" margin={{ top: 0, right: 16, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="country" tick={{ fontSize: 11.5, fill: '#64748b' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Sales ranking */}
      <Card>
        <CardHeader title="销售排行榜" sub="本月数据 · 按预计成交金额排序" />
        <div className="px-5 pb-5 grid grid-cols-4 gap-4">
          {SALES.map((s, i) => (
            <div key={s.name} className="rounded-xl border border-slate-200/80 p-4 relative overflow-hidden">
              {i === 0 && <span className="absolute top-0 right-0 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">TOP 1</span>}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold" style={{ background: s.avatarColor }}>
                  {s.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold text-slate-800">{s.name}</div>
                  <div className="text-[11px] text-slate-400">{s.customers} 位客户</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-[12px]">
                <span className="text-slate-400">A 级客户</span><span className="text-right font-semibold text-emerald-600">{s.aGrade}</span>
                <span className="text-slate-400">待跟进</span><span className="text-right font-semibold text-amber-600">{s.pendingFollowUp}</span>
                <span className="text-slate-400">本月成交</span><span className="text-right font-semibold text-slate-700">{s.dealsThisMonth} 单</span>
                <span className="text-slate-400">预计成交额</span><span className="text-right font-semibold text-slate-800">${(s.expectedUSD / 1000).toFixed(1)}k</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
