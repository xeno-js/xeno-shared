import type { HttpHeaders, Optional } from '@/shared'

/**
 * @description Agnostic contract used to execute HTTP calls independently
 * from concrete transport libraries (fetch, axios, undici, etc.),
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface HttpClientConfig {
  /** @description Optional default headers to include in every request made by the HTTP client.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  defaultHeaders: Optional<HttpHeaders>
  /** @description Optional base URL to prepend to all request URLs made by the HTTP client.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  baseURL: Optional<string>
  /** @description Optional timeout in milliseconds for all requests made by the HTTP client.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  timeoutMs: Optional<number>

  /** Abilita il riutilizzo delle connessioni TCP per ridurre la latenza dei retry (Default: true) */
  keepAlive: Optional<boolean>

  /** Numero massimo di socket simultanei per host (Default: 100) */
  maxSockets: Optional<number>

  /** Numero massimo di redirect consentiti prima di lanciare errore (Default: 5) */
  maxRedirects: Optional<number>

  /** Abilita la decompressione automatica di gzip/brotli per risparmiare banda (Default: true) */
  decompress: Optional<boolean>

  withCredentials: Optional<boolean>

  proxy: ProxyConfig | false
}

export interface ProxyConfig {
  host: string
  port: number
  auth?: {
    username: string
    password: string
  }
  protocol?: string
}
