import type { IStorage } from '@/domain'
import type { CookieOptions, Optional } from '@/shared'
import { Guards } from '@/shared'

import { createCookieStorage } from './cookie.storage'
import { createMemoryStorage } from './memory.storage'

export const StorageHelper = Object.freeze({
  create(opts: {
    type: Optional<'local' | 'session' | 'memory' | 'cookie'>
    storage: Optional<IStorage>
    cookieOpts: Optional<CookieOptions>
  }): Optional<IStorage> {
    switch (opts.type) {
      case 'memory':
        return createMemoryStorage()
      case 'cookie':
        if (!Guards.isDefined(opts.cookieOpts)) throw new Error('At least ')
        return createCookieStorage(opts.cookieOpts)
      case 'session':
        return sessionStorage
      case 'local':
        return localStorage

      default:
        return opts.storage
    }
  },
} as const)
