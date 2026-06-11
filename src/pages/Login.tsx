import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ShieldCheck, BrainCircuit, Database, Lock, User, ArrowRight } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [account, setAccount] = useState('admin@lisheng.com')
  const [password, setPassword] = useState('••••••••')
  const [loading, setLoading] = useState(false)

  const login = () => {
    setLoading(true)
    setTimeout(() => {
      sessionStorage.setItem('ls_auth', '1')
      navigate('/dashboard')
    }, 600)
  }

  return (
    <div className="min-h-screen flex">
      {/* 品牌区 */}
      <div className="hidden lg:flex w-[46%] bg-[#0b1727] text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-[28rem] h-[28rem] rounded-full bg-teal-500/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="font-bold text-[18px]">利盛智能客户中枢</div>
              <div className="text-[12px] text-slate-400">AI Customer Intelligence Platform</div>
            </div>
          </div>
        </div>
        <div className="relative space-y-7">
          <h1 className="text-[30px] font-bold leading-snug">
            让每一条客户对话<br />都变成<span className="text-emerald-400">可经营的资产</span>
          </h1>
          <div className="space-y-4">
            {[
              { icon: Database, t: '全渠道客户数据统一沉淀', d: 'WhatsApp · 网站询盘 · 展会客户自动归档建档' },
              { icon: BrainCircuit, t: 'AI 自动画像、评分与评级', d: '0-100 分评分模型，每条结论可追溯到聊天证据' },
              { icon: ShieldCheck, t: '企业级数据安全', d: '权限隔离 · 加密存储 · 操作审计 · 每日备份' },
            ].map(x => (
              <div key={x.t} className="flex gap-3.5">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                  <x.icon size={17} />
                </div>
                <div>
                  <div className="text-[14.5px] font-medium">{x.t}</div>
                  <div className="text-[12.5px] text-slate-400 mt-0.5">{x.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-[11.5px] text-slate-500">
          © 2026 万物智灵（深圳）科技有限公司 · 为利盛餐饮设备定制开发
        </div>
      </div>

      {/* 登录区 */}
      <div className="flex-1 flex items-center justify-center bg-[#f5f7fa] p-8">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <span className="font-bold text-[17px] text-slate-800">利盛智能客户中枢</span>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.06)] p-8">
            <h2 className="text-[22px] font-bold text-slate-800">欢迎回来</h2>
            <p className="text-[13px] text-slate-400 mt-1">登录后查看您的客户资产与 AI 分析结果</p>
            <div className="mt-7 space-y-4">
              <div>
                <label className="text-[12.5px] font-medium text-slate-600">账号</label>
                <div className="mt-1.5 flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-emerald-400 transition-colors">
                  <User size={16} className="text-slate-400" />
                  <input value={account} onChange={e => setAccount(e.target.value)}
                    className="flex-1 text-[14px] outline-none text-slate-700" />
                </div>
              </div>
              <div>
                <label className="text-[12.5px] font-medium text-slate-600">密码</label>
                <div className="mt-1.5 flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-emerald-400 transition-colors">
                  <Lock size={16} className="text-slate-400" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    className="flex-1 text-[14px] outline-none text-slate-700" />
                </div>
              </div>
              <button onClick={login} disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium text-[14.5px] rounded-xl py-3 transition-all disabled:opacity-70">
                {loading ? '正在登录…' : <>进入系统 <ArrowRight size={16} /></>}
              </button>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 text-[12px] text-slate-400 leading-relaxed">
              演示环境说明：本系统为概念验证版本，已预置模拟数据，点击「进入系统」即可体验全部功能。正式版将对接企业账号体系（销售 / 主管 / 管理员三级权限）。
            </div>
          </div>
          <div className="text-center text-[11.5px] text-slate-400 mt-6">
            遇到问题？联系项目组 · 万物智灵（深圳）科技有限公司
          </div>
        </div>
      </div>
    </div>
  )
}
