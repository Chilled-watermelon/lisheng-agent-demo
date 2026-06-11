import type { ReactNode } from 'react'
import type { Grade } from '../data/types'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)] ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, sub, extra }: { title: string; sub?: string; extra?: ReactNode }) {
  return (
    <div className="flex items-start justify-between px-5 pt-4 pb-3">
      <div>
        <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
        {sub && <p className="text-[12px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {extra}
    </div>
  )
}

const GRADE_STYLE: Record<Grade, string> = {
  A: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  B: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  C: 'bg-amber-50 text-amber-700 border-amber-200',
  D: 'bg-slate-100 text-slate-500 border-slate-200',
}

export function GradeBadge({ grade, size = 'md' }: { grade: Grade; size?: 'md' | 'lg' }) {
  return (
    <span className={`inline-flex items-center justify-center font-bold border rounded-lg ${GRADE_STYLE[grade]} ${
      size === 'lg' ? 'text-[16px] w-10 h-10' : 'text-[12px] px-2 py-0.5'
    }`}>
      {grade}{size === 'md' ? '级' : ''}
    </span>
  )
}

export function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const r = (size - 6) / 2
  const c = 2 * Math.PI * r
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#6366f1' : score >= 40 ? '#f59e0b' : '#94a3b8'
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} strokeLinecap="round" />
      </svg>
      <span className="absolute font-bold text-slate-800" style={{ fontSize: size * 0.3 }}>{score}</span>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    '新询盘': 'bg-sky-50 text-sky-700 border-sky-200',
    '跟进中': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    '已报价': 'bg-violet-50 text-violet-700 border-violet-200',
    '待成交': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    '已成交': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    '流失风险': 'bg-rose-50 text-rose-600 border-rose-200',
  }
  return (
    <span className={`inline-flex text-[11.5px] px-2 py-0.5 rounded-md border font-medium ${map[status] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {status}
    </span>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex text-[11.5px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
      {children}
    </span>
  )
}

// 试用版未开放功能的统一提示
export function proToast(feature: string) {
  const el = document.createElement('div')
  el.textContent = `「${feature}」为正式版功能 · 试用版暂未开放`
  el.style.cssText = 'position:fixed;top:72px;left:50%;transform:translateX(-50%);z-index:9999;background:#0f172a;color:#fff;font-size:13px;padding:10px 18px;border-radius:12px;box-shadow:0 8px 24px rgba(15,23,42,.25);opacity:0;transition:opacity .2s'
  document.body.appendChild(el)
  requestAnimationFrame(() => { el.style.opacity = '1' })
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 250) }, 2200)
}

const FLAGS: Record<string, string> = {
  US: '🇺🇸', MX: '🇲🇽', SA: '🇸🇦', JP: '🇯🇵', FR: '🇫🇷', NG: '🇳🇬',
  AU: '🇦🇺', KR: '🇰🇷', TH: '🇹🇭', AE: '🇦🇪', GB: '🇬🇧', VN: '🇻🇳', CO: '🇨🇴',
}
export function Flag({ code }: { code: string }) {
  return <span className="text-[15px]">{FLAGS[code] ?? '🌍'}</span>
}
