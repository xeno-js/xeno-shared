import type { IStorage } from '@/domain'
import type { CookieOptions, Optional } from '@/shared'

export interface AuthConfig<TOptions = unknown> {
  url: string
  key: string
  opts: Optional<TOptions>
  storageOpts: {
    type: Optional<'local' | 'session' | 'memory' | 'cookie'>
    cookieOpts: Optional<CookieOptions>
    storage: Optional<IStorage>
  }
  redirectTo: Optional<string>
}
