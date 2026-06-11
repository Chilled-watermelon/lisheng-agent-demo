import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, BrainCircuit, PlugZap, BellRing,
  TrendingUp, Search, Sparkles, LogOut,
} from 'lucide-react'
import { CUSTOMERS } from '../data/customers'
import { GradeBadge, Flag } from './ui'

const NAV = [
  { to: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { to: '/customers', label: '客户知识库', icon: Users },
  { to: '/sales', label: '销售跟进监控', icon: TrendingUp },
  { to: '/ai', label: 'AI 分析中心', icon: BrainCircuit },
  { to: '/integrations', label: '数据接入', icon: PlugZap },
]

const TITLES: Record<string, string> = {
  '/dashboard': '经营仪表盘',
  '/customers': '客户知识库',
  '/sales': '销售跟进监控',
  '/ai': 'AI 分析中心',
  '/integrations': '数据接入中心',
}

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [kw, setKw] = useState('')
  const [focused, setFocused] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const base = '利盛智能客户中枢'
    const page = location.pathname.startsWith('/customers/')
      ? '客户详情'
      : TITLES[location.pathname]
    document.title = page ? `${page} · ${base}` : base
  }, [location.pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const results = useMemo(() => {
    const q = kw.trim().toLowerCase()
    if (!q) return []
    return CUSTOMERS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.replace(/\s/g, '').includes(q) ||
      c.country.includes(q) ||
      (c.company ?? '').toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q)),
    ).slice(0, 6)
  }, [kw])

  const go = (id: string) => {
    setKw('')
    setFocused(false)
    navigate(`/customers/${id}`)
  }

  const logout = () => {
    sessionStorage.removeItem('ls_auth')
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#0b1727] text-slate-300 flex flex-col">
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-[15px] leading-tight">利盛智能客户中枢</div>
            <div className="text-[11px] text-slate-400">AI Customer Intelligence</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] transition-colors ${
                  isActive || (to === '/customers' && location.pathname.startsWith('/customers'))
                    ? 'bg-emerald-500/15 text-emerald-300 font-medium'
                    : 'hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-400/20 p-3.5">
            <div className="flex items-center gap-2 text-emerald-300 text-[12.5px] font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              AI 引擎运行中
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              今日已分析 247 段对话<br />更新 48 位客户画像
            </div>
          </div>
          <div className="text-[10.5px] text-slate-500 mt-3 text-center">
            Powered by 万物智灵 · V1.0
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div ref={boxRef} className="relative w-80">
            <div className={`flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-1.5 transition-colors ${
              focused ? 'border-emerald-400 bg-white' : 'border-slate-200'
            }`}>
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                value={kw}
                onChange={e => setKw(e.target.value)}
                onFocus={() => setFocused(true)}
                placeholder="搜索客户姓名 / 手机 / 公司 / 标签…"
                className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            {focused && kw.trim() && (
              <div className="absolute top-11 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                {results.length === 0 ? (
                  <div className="px-4 py-3 text-[12.5px] text-slate-400">未找到匹配客户</div>
                ) : results.map(c => (
                  <button key={c.id} onClick={() => go(c.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left border-b border-slate-50 last:border-0">
                    <Flag code={c.countryCode} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-slate-800">{c.name}</span>
                        <GradeBadge grade={c.grade} />
                      </div>
                      <div className="text-[11.5px] text-slate-400 truncate">{c.company ?? c.phone} · {c.country} · 负责人 {c.owner}</div>
                    </div>
                    <span className="text-[12px] font-semibold text-slate-500 shrink-0">{c.score} 分</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer">
              <BellRing size={18} className="text-slate-500" />
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9.5px] rounded-full px-1.5 py-px font-medium">5</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[12px] font-semibold">黄</div>
              <div className="leading-tight">
                <div className="text-[13px] font-medium text-slate-800">黄总</div>
                <div className="text-[11px] text-slate-400">管理员</div>
              </div>
            </div>
            <button onClick={logout} title="退出登录"
              className="text-slate-400 hover:text-rose-500 transition-colors">
              <LogOut size={17} />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
