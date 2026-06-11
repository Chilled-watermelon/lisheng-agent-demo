import { Link } from 'react-router-dom'
import { AlarmClock, TrendingUp, AlertTriangle } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { Card, CardHeader, GradeBadge, StatusBadge, Flag } from '../components/ui'
import { CUSTOMERS, SALES } from '../data/customers'

const FUNNEL = [
  { stage: '新询盘', count: 286, color: '#38bdf8' },
  { stage: '跟进中', count: 412, color: '#6366f1' },
  { stage: '已报价', count: 184, color: '#8b5cf6' },
  { stage: '待成交', count: 47, color: '#10b981' },
  { stage: '本月成交', count: 15, color: '#059669' },
]

const TODAY_TASKS = [
  { customer: 'John Smith', cid: 'C-20260601-001', owner: 'Sarah Lee', due: '今天 14:00', task: '跟进报价单反馈，确认 5% 折扣是否促成下单', level: 'high' },
  { customer: 'Olivia Brown', cid: 'C-20260610-038', owner: 'Sarah Lee', due: '今天 16:00', task: '发送正式报价单 + 澳洲客户案例', level: 'high' },
  { customer: 'Fatima Hassan', cid: 'C-20260530-019', owner: 'Sarah Lee', due: '今天 18:00', task: '确认 6/14 前下定金以保证 7/12 到港', level: 'high' },
  { customer: 'Maria Garcia', cid: 'C-20260528-014', owner: 'David Chen', due: '明天 10:00', task: '发送竞品差异化对比表，预约决策人视频会议', level: 'mid' },
  { customer: 'Kim Min-jun', cid: 'C-20260525-017', owner: 'Michael Wong', due: '明天 11:00', task: '跟进样品测试反馈，提出年度框架协议', level: 'mid' },
  { customer: 'Nguyen Thi Lan', cid: 'C-20260418-005', owner: 'Michael Wong', due: '本周五', task: '发送展会专属优惠激活消息（最后一次主动触达）', level: 'low' },
]

const PER_SALES_CHART = SALES.map(s => ({
  name: s.name.split(' ')[0],
  A级客户: s.aGrade,
  待跟进: s.pendingFollowUp,
  本月成交: s.dealsThisMonth,
}))

export default function SalesMonitor() {
  const overdue = CUSTOMERS.filter(c => c.tags.some(t => t.includes('未联系')) || c.status === '流失风险')
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[20px] font-bold text-slate-800">销售跟进监控</h1>
        <p className="text-[13px] text-slate-400 mt-0.5">管理层视角 · 每位客户绑定销售负责人 · AI 自动生成跟进任务</p>
      </div>

      {/* 漏斗 */}
      <Card>
        <CardHeader title="销售漏斗" sub="实时统计 · 点击阶段可下钻客户列表" />
        <div className="px-5 pb-5 flex items-center gap-3">
          {FUNNEL.map((f, i) => (
            <div key={f.stage} className="flex-1 relative">
              <div className="rounded-xl p-4 text-white" style={{ background: f.color }}>
                <div className="text-[24px] font-bold leading-none">{f.count}</div>
                <div className="text-[12px] opacity-90 mt-1.5">{f.stage}</div>
              </div>
              {i < FUNNEL.length - 1 && (
                <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-300 text-[18px]">›</div>
              )}
            </div>
          ))}
          <div className="w-44 shrink-0 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-4">
            <div className="text-[12px] text-emerald-700 font-medium flex items-center gap-1"><TrendingUp size={13} />本月预计成交金额</div>
            <div className="text-[22px] font-bold text-emerald-700 mt-1">$320,500</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {/* 各销售对比 */}
        <Card className="col-span-1">
          <CardHeader title="销售团队对比" sub="A级客户 / 待跟进 / 本月成交" />
          <div className="px-3 pb-4 h-64">
            <ResponsiveContainer>
              <BarChart data={PER_SALES_CHART} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11.5 }} />
                <Bar dataKey="A级客户" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="待跟进" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="本月成交" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 今日任务 */}
        <Card className="col-span-2">
          <CardHeader title="AI 跟进任务队列" sub="根据客户评分变化与时间节点自动生成" extra={
            <span className="text-[11.5px] text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-2 py-0.5">3 项今日到期</span>
          } />
          <div className="px-5 pb-4 space-y-2.5">
            {TODAY_TASKS.map(t => (
              <div key={t.cid + t.due} className="flex items-center gap-3 rounded-xl border border-slate-200/80 px-4 py-2.5 hover:border-emerald-300 transition-colors">
                <span className={`w-1.5 h-8 rounded-full shrink-0 ${
                  t.level === 'high' ? 'bg-rose-400' : t.level === 'mid' ? 'bg-amber-400' : 'bg-slate-300'
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[13px]">
                    <Link to={`/customers/${t.cid}`} className="font-semibold text-slate-800 hover:text-emerald-600">{t.customer}</Link>
                    <span className="text-[11.5px] text-slate-400">负责人 {t.owner}</span>
                  </div>
                  <div className="text-[12px] text-slate-500 truncate">{t.task}</div>
                </div>
                <span className={`shrink-0 flex items-center gap-1 text-[12px] font-medium ${
                  t.due.includes('今天') ? 'text-rose-600' : 'text-slate-500'
                }`}><AlarmClock size={13} />{t.due}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 销售个人卡片 */}
      <Card>
        <CardHeader title="销售个人看板" sub="管理层可查看每位销售手上的客户结构与预计产出" />
        <div className="px-5 pb-5">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[11.5px] text-slate-400 border-y border-slate-100 bg-slate-50/60">
                <th className="px-3 py-2 font-medium">销售</th>
                <th className="py-2 font-medium">客户总数</th>
                <th className="py-2 font-medium">A 级客户</th>
                <th className="py-2 font-medium">待跟进</th>
                <th className="py-2 font-medium">本月成交</th>
                <th className="py-2 font-medium">平均响应时长</th>
                <th className="py-2 font-medium">预计成交金额</th>
                <th className="py-2 font-medium">负载状态</th>
              </tr>
            </thead>
            <tbody>
              {SALES.map(s => (
                <tr key={s.name} className="border-b border-slate-50">
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-semibold" style={{ background: s.avatarColor }}>
                        {s.name.split(' ').map(w => w[0]).join('')}
                      </span>
                      <span className="font-medium text-slate-700">{s.name}</span>
                    </span>
                  </td>
                  <td className="py-3 text-slate-600">{s.customers}</td>
                  <td className="py-3 font-semibold text-emerald-600">{s.aGrade}</td>
                  <td className="py-3 font-semibold text-amber-600">{s.pendingFollowUp}</td>
                  <td className="py-3 text-slate-600">{s.dealsThisMonth} 单</td>
                  <td className="py-3 text-slate-600">{s.avgResponseMin} 分钟</td>
                  <td className="py-3 font-semibold text-slate-800">${s.expectedUSD.toLocaleString()}</td>
                  <td className="py-3">
                    {s.pendingFollowUp >= 15
                      ? <span className="text-[11.5px] text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-2 py-0.5">待跟进偏多</span>
                      : <span className="text-[11.5px] text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5">正常</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 风险客户 */}
      <Card>
        <CardHeader title="风险客户提醒" sub="30 天未联系 / 流失风险客户 · AI 已生成激活建议" extra={
          <span className="flex items-center gap-1 text-[11.5px] text-amber-600"><AlertTriangle size={12} />共 89 位，展示最近 {overdue.length} 位</span>
        } />
        <div className="px-5 pb-5 grid grid-cols-2 gap-3">
          {overdue.map(c => (
            <Link to={`/customers/${c.id}`} key={c.id} className="flex items-center gap-3 rounded-xl border border-amber-200/70 bg-amber-50/40 px-4 py-3 hover:border-amber-400 transition-colors">
              <Flag code={c.countryCode} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 text-[13px]">{c.name}</span>
                  <GradeBadge grade={c.grade} />
                  <StatusBadge status={c.status} />
                </div>
                <div className="text-[12px] text-slate-500 truncate mt-0.5">{c.aiNextStep}</div>
              </div>
              <span className="text-[11.5px] text-slate-400 shrink-0">最后联系 {c.lastContact.slice(0, 10)}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
