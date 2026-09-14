import type { IStorage } from '@/domain'
import type { CookieOptions } from '@/shared'
import { Guards } from '@/shared'

export const createCookieStorage = (opts: CookieOptions): IStorage => ({
  getItem: (key: string): string | null => {
    if (!Guards.isDefined(document)) return null
    const match = new RegExp(`(^| )${encodeURIComponent(key)}=([^;]+)`).exec(document.cookie)
    return Guards.isDefined(match) ? decodeURIComponent(match[2]) : null
  },
  setItem: (key: string, value: string): void => {
    if (!Guards.isDefined(document)) return
    let cookieSuffix = ''
    if (Guards.isDefined(opts.path)) cookieSuffix += `; path=${opts.path}`
    if (Guards.isDefined(opts.maxAge)) cookieSuffix += `; max-age=${opts.maxAge}`
    if (Guards.isDefined(opts.domain)) cookieSuffix += `; domain=${opts.domain}`
    if (Guards.isDefined(opts.secure)) cookieSuffix += `; Secure`
    if (Guards.isDefined(opts.sameSite)) cookieSuffix += `; SameSite=${opts.sameSite}`
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}${cookieSuffix}`
  },
  removeItem: (key: string): void => {
    if (!Guards.isDefined(document)) return
    document.cookie = `${encodeURIComponent(key)}=; path=${opts.path ?? '/'}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  },
})
