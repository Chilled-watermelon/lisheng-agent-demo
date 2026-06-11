import { MessageSquare, Globe2, Database, Upload, CheckCircle2, CircleDashed, ShieldCheck } from 'lucide-react'
import { Card, CardHeader } from '../components/ui'
import { SYNC_LOGS } from '../data/customers'

const CHANNELS = [
  {
    name: 'WhatsApp Business API', icon: MessageSquare, status: 'connected',
    desc: '官方 Cloud API · 新消息实时同步 · 历史记录批量导入',
    stats: '已同步 1,032 位客户 · 28,460 条消息',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    name: '网站询盘', icon: Globe2, status: 'connected',
    desc: 'Webhook 接入 · 询盘自动建档并分配销售',
    stats: '已接入 116 条询盘',
    color: 'from-sky-500 to-blue-600',
  },
  {
    name: 'Facebook Messenger', icon: MessageSquare, status: 'beta',
    desc: 'Meta Graph API · 灰度测试中',
    stats: '已同步 64 位客户',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    name: 'Instagram DM', icon: MessageSquare, status: 'planned',
    desc: '二期接入 · 与 Facebook 共用 Meta 商业账号授权',
    stats: '规划中',
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: '展会客户导入', icon: Upload, status: 'connected',
    desc: 'Excel / 名片扫描批量导入 · 自动去重合并',
    stats: '已导入 87 位展会客户',
    color: 'from-amber-500 to-orange-600',
  },
  {
    name: 'ERP / 财务系统', icon: Database, status: 'planned',
    desc: '二期规划 · 订单回流闭环，自动校准成交概率模型',
    stats: '规划中',
    color: 'from-slate-500 to-slate-600',
  },
]

export default function Integrations() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[20px] font-bold text-slate-800">数据接入中心</h1>
        <p className="text-[13px] text-slate-400 mt-0.5">所有渠道数据统一进入客户数据库 · 自动去重合并 · 同一客户多渠道身份关联</p>
      </div>

      {/* 渠道卡片 */}
      <div className="grid grid-cols-3 gap-4">
        {CHANNELS.map(ch => (
          <Card key={ch.name} className="p-5">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ch.color} flex items-center justify-center text-white`}>
                <ch.icon size={19} />
              </div>
              {ch.status === 'connected' && <span className="flex items-center gap-1 text-[11.5px] text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5"><CheckCircle2 size={11} />已连接</span>}
              {ch.status === 'beta' && <span className="flex items-center gap-1 text-[11.5px] text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md px-2 py-0.5"><CircleDashed size={11} />灰度中</span>}
              {ch.status === 'planned' && <span className="flex items-center gap-1 text-[11.5px] text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5"><CircleDashed size={11} />二期规划</span>}
            </div>
            <div className="mt-3 font-semibold text-slate-800 text-[14.5px]">{ch.name}</div>
            <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{ch.desc}</p>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[12px] text-slate-400">{ch.stats}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* 同步日志 */}
        <Card className="col-span-2">
          <CardHeader title="同步与分析日志" sub="实时记录每一次数据同步与 AI 分析任务" />
          <div className="px-5 pb-5 space-y-0">
            {SYNC_LOGS.map((log, i) => (
              <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 border-2 ${
                    log.status === 'success' ? 'bg-emerald-500 border-emerald-100' : 'bg-amber-400 border-amber-100'
                  }`} />
                  {i < SYNC_LOGS.length - 1 && <div className="w-px flex-1 bg-slate-200" />}
                </div>
                <div className="flex-1 -mt-0.5">
                  <div className="flex items-center gap-2 text-[12.5px]">
                    <span className="font-semibold text-slate-700">{log.event}</span>
                    <span className="text-[11px] text-slate-400 bg-slate-100 rounded px-1.5 py-px">{log.channel}</span>
                    <span className="text-slate-300 text-[11.5px] ml-auto">{log.time}</span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-0.5">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 数据安全 */}
        <Card>
          <CardHeader title="数据安全与合规" sub="客户数据资产保护机制" />
          <div className="px-5 pb-5 space-y-3">
            {[
              { t: '数据库加密存储', d: 'PostgreSQL 静态加密 + TLS 传输加密' },
              { t: '手机号脱敏展示', d: '前台默认脱敏，导出需管理员权限' },
              { t: '角色权限隔离', d: '销售仅见自有客户，管理层可见全量' },
              { t: '操作审计日志', d: '导出、删除、转移客户均留痕可追溯' },
              { t: '每日自动备份', d: '数据库每日快照，保留 30 天' },
              { t: 'WhatsApp 官方接口', d: '使用 Meta 官方 Cloud API，无封号风险' },
            ].map(x => (
              <div key={x.t} className="flex gap-2.5">
                <ShieldCheck size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[13px] font-medium text-slate-700">{x.t}</div>
                  <div className="text-[11.5px] text-slate-400">{x.d}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
