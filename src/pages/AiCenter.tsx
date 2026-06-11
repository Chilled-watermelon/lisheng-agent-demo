import { BrainCircuit, Gauge, Tags, FileText, Play, Settings2 } from 'lucide-react'
import { Card, CardHeader, Tag, proToast } from '../components/ui'
import { SCORING_RULES, TAG_LIBRARY } from '../data/customers'

const PIPELINE = [
  { step: '1. 消息接入', desc: 'WhatsApp / 网站 / 展会数据统一进入消息队列', tech: 'Webhook + 消息队列' },
  { step: '2. 客户归一', desc: '按手机号 / 渠道 ID 去重合并，建立唯一客户档案', tech: '实体识别 + 规则合并' },
  { step: '3. 对话理解', desc: '大模型读取增量聊天，提取需求、预算、时间、异议', tech: 'GPT-4o / Claude + 结构化输出' },
  { step: '4. 评分评级', desc: '行为评分规则 + AI 语义修正，输出 0-100 分与 ABCD 等级', tech: '规则引擎 + LLM 校准' },
  { step: '5. 画像与建议', desc: '生成画像、标签、成交概率、风险与下一步建议', tech: 'RAG + 提示词工程' },
  { step: '6. 任务分发', desc: '高分变动触发提醒，自动生成销售跟进任务', tech: '规则触发 + 通知服务' },
]

const ANALYSIS_QUEUE = [
  { customer: 'John Smith', trigger: '新消息 2 条', result: '评分 89 → 92，维持 A 级，触发跟进提醒', time: '10:24', status: '完成' },
  { customer: 'Carlos Mendoza', trigger: '新客户建档', result: '初始评分 61，定级 B，分配 Emily Zhang', time: '08:31', status: '完成' },
  { customer: 'Olivia Brown', trigger: '新消息 1 条', result: '评分 76 → 81，升级 A 级，触发管理层通知', time: '11:05', status: '完成' },
  { customer: 'Fatima Hassan', trigger: '定时复审', result: '成交概率 61% → 66%（确认商场交付日期）', time: '23:00', status: '完成' },
  { customer: '全量夜间复审', trigger: '定时任务', result: '1,248 位客户复审，89 位标记 30 天未联系', time: '23:00', status: '完成' },
]

export default function AiCenter() {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">AI 分析中心</h1>
          <p className="text-[13px] text-slate-400 mt-0.5">评分模型、标签体系与分析任务全部可配置、可追溯</p>
        </div>
        <button onClick={() => proToast('手动触发全量分析')}
          className="flex items-center gap-1.5 text-[12.5px] text-white bg-emerald-600 rounded-lg px-3.5 py-2 hover:bg-emerald-700">
          <Play size={14} /> 手动触发全量分析
        </button>
      </div>

      {/* 分析管线 */}
      <Card>
        <CardHeader title="AI 分析管线" sub="从消息接入到任务分发的全自动流程" extra={<BrainCircuit size={18} className="text-emerald-500" />} />
        <div className="px-5 pb-5 grid grid-cols-6 gap-3">
          {PIPELINE.map((p, i) => (
            <div key={p.step} className="relative rounded-xl border border-slate-200 p-3.5 hover:border-emerald-300 transition-colors">
              <div className="text-[12.5px] font-bold text-emerald-600">{p.step}</div>
              <p className="text-[11.5px] text-slate-500 mt-1.5 leading-relaxed">{p.desc}</p>
              <div className="mt-2 text-[10.5px] text-slate-400 bg-slate-50 rounded px-1.5 py-0.5 inline-block">{p.tech}</div>
              {i < PIPELINE.length - 1 && <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-slate-300 z-10">›</div>}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* 评分规则 */}
        <Card>
          <CardHeader title="客户评分模型" sub="0-100 分 · 行为规则 + AI 语义修正 · 支持自定义调整" extra={
            <button onClick={() => proToast('评分规则编辑')} className="flex items-center gap-1 text-[12px] text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 hover:bg-slate-50"><Settings2 size={12} />编辑规则</button>
          } />
          <div className="px-5 pb-4">
            <div className="space-y-1">
              {SCORING_RULES.map(r => (
                <div key={r.rule} className="flex items-center gap-3 py-1.5 border-b border-slate-50 last:border-0 text-[12.5px]">
                  <span className={`shrink-0 w-12 text-center font-bold rounded-md py-0.5 text-[12px] ${
                    r.delta.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                  }`}>{r.delta}</span>
                  <span className="shrink-0 w-32 font-medium text-slate-700">{r.rule}</span>
                  <span className="text-slate-400">{r.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { g: 'A 级', range: '80-100', color: 'bg-emerald-500' },
                { g: 'B 级', range: '60-79', color: 'bg-indigo-500' },
                { g: 'C 级', range: '40-59', color: 'bg-amber-500' },
                { g: 'D 级', range: '0-39', color: 'bg-slate-400' },
              ].map(x => (
                <div key={x.g} className="rounded-lg border border-slate-200 p-2.5 text-center">
                  <div className={`w-6 h-6 rounded-md ${x.color} text-white text-[12px] font-bold flex items-center justify-center mx-auto`}>{x.g[0]}</div>
                  <div className="text-[11.5px] text-slate-500 mt-1">{x.range} 分</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {/* 标签库 */}
          <Card>
            <CardHeader title="客户标签体系" sub="AI 自动打标 · 标签可自由扩展" extra={<Tags size={16} className="text-slate-400" />} />
            <div className="px-5 pb-4 space-y-2.5">
              {Object.entries(TAG_LIBRARY).map(([cat, tags]) => (
                <div key={cat} className="flex gap-3 items-start">
                  <span className="shrink-0 w-10 text-[12px] text-slate-400 pt-0.5">{cat}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(t => <Tag key={t}>{t}</Tag>)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 模型表现 */}
          <Card>
            <CardHeader title="模型表现监控" sub="基于人工抽检与成交回流数据" extra={<Gauge size={16} className="text-slate-400" />} />
            <div className="px-5 pb-5 grid grid-cols-3 gap-3">
              {[
                { label: '画像字段准确率', value: '93.2%', sub: '人工抽检 200 例' },
                { label: '等级判定一致率', value: '89.5%', sub: '与资深销售对比' },
                { label: '成交概率校准度', value: '±8.4%', sub: '近 90 天回流校准' },
              ].map(m => (
                <div key={m.label} className="rounded-xl border border-slate-200 p-3 text-center">
                  <div className="text-[20px] font-bold text-slate-800">{m.value}</div>
                  <div className="text-[11.5px] text-slate-500 mt-1">{m.label}</div>
                  <div className="text-[10.5px] text-slate-400">{m.sub}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 分析任务队列 */}
      <Card>
        <CardHeader title="今日分析任务记录" sub="每一次 AI 分析均留痕，结果可追溯、可复核" extra={<FileText size={16} className="text-slate-400" />} />
        <div className="px-5 pb-5">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[11.5px] text-slate-400 border-y border-slate-100 bg-slate-50/60">
                <th className="px-3 py-2 font-medium">对象</th>
                <th className="py-2 font-medium">触发原因</th>
                <th className="py-2 font-medium">分析结果</th>
                <th className="py-2 font-medium">时间</th>
                <th className="py-2 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {ANALYSIS_QUEUE.map((q, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="px-3 py-2.5 font-medium text-slate-700">{q.customer}</td>
                  <td className="py-2.5 text-slate-500">{q.trigger}</td>
                  <td className="py-2.5 text-slate-500">{q.result}</td>
                  <td className="py-2.5 text-slate-400">{q.time}</td>
                  <td className="py-2.5"><span className="text-[11.5px] text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5">{q.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
