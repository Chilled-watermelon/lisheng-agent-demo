// 试用授权控制：到期后无法登录，分析额度用完后无法继续分析
export const LICENSE = {
  edition: '试用版',
  licensee: '利盛餐饮设备',
  expiry: '2026-07-05',
  analysisQuota: 30,
}

const USED_KEY = 'ls_analysis_used'

export function isLicenseValid(): boolean {
  return new Date().toISOString().slice(0, 10) <= LICENSE.expiry
}

export function daysLeft(): number {
  const ms = new Date(LICENSE.expiry + 'T23:59:59').getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86400000))
}

export function analysisUsed(): number {
  return Number(localStorage.getItem(USED_KEY) ?? 0)
}

export function analysisLeft(): number {
  return Math.max(0, LICENSE.analysisQuota - analysisUsed())
}

export function consumeAnalysis(): void {
  localStorage.setItem(USED_KEY, String(analysisUsed() + 1))
}
