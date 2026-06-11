import { useSyncExternalStore } from 'react'
import type { Customer, FollowUp } from './types'
import { CUSTOMERS } from './customers'

// 试用版本地持久化层：新增客户与跟进记录保存在浏览器 localStorage。
// 正式版由 PostgreSQL 后端承载，本层接口与正式版 API 保持一致。

const KEY = 'ls_store_v1'

interface StoreData {
  extraCustomers: Customer[]
  extraFollowUps: Record<string, FollowUp[]>
  statusOverride: Record<string, Customer['status']>
}

function load(): StoreData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* 损坏数据直接重置 */ }
  return { extraCustomers: [], extraFollowUps: {}, statusOverride: {} }
}

let data = load()
let version = 0
const listeners = new Set<() => void>()

function commit() {
  localStorage.setItem(KEY, JSON.stringify(data))
  version++
  listeners.forEach(fn => fn())
}

export function useStoreVersion(): number {
  return useSyncExternalStore(
    cb => { listeners.add(cb); return () => listeners.delete(cb) },
    () => version,
  )
}

export function getAllCustomers(): Customer[] {
  const merged = [...data.extraCustomers, ...CUSTOMERS].map(c => ({
    ...c,
    status: data.statusOverride[c.id] ?? c.status,
    followUps: [...(data.extraFollowUps[c.id] ?? []), ...c.followUps],
  }))
  return merged
}

export function getCustomer(id: string): Customer | undefined {
  return getAllCustomers().find(c => c.id === id)
}

export function saveCustomer(c: Customer) {
  data.extraCustomers = [c, ...data.extraCustomers.filter(x => x.id !== c.id)]
  commit()
}

export function addFollowUp(customerId: string, fu: FollowUp) {
  data.extraFollowUps[customerId] = [fu, ...(data.extraFollowUps[customerId] ?? [])]
  commit()
}

export function setStatus(customerId: string, status: Customer['status']) {
  data.statusOverride[customerId] = status
  commit()
}

// 供额度变化等非数据事件触发界面刷新
export function touch() {
  version++
  listeners.forEach(fn => fn())
}
