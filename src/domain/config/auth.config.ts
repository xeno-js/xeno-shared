import type { IStorage } from '@/domain'
import type { CookieOptions, Optional } from '@/shared'

/**
 * @description Configuration options for the authentication service.
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface AuthConfig<TOptions = unknown> {
  /**
   * @description The URL of the authentication service.
   * @type {string}
   */
  url: string
  /**
   * @description The key of the authentication service.
   * @type {string}
   */
  key: string
  /**
   * @description The options of the authentication service.
   * @type {TOptions}
   */
  opts: Optional<TOptions>
  /**
   * @description The storage options of the authentication service.
   * @type {StorageOptions}
   * @default { type: 'local', cookieOpts: {}, storage: null }
   */
  storageOpts: Optional<StorageOptions>
  /**
   * @description The redirect URL of the authentication service.
   * @type {string}
   * @default '/'
   */
  redirectTo: Optional<string>
}

interface StorageOptions {
  type: Optional<'local' | 'session' | 'memory' | 'cookie'>
  cookieOpts: Optional<CookieOptions>
  storage: Optional<IStorage>
}
