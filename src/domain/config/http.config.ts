import type { HttpHeaders, Optional } from '@/shared'

/**
 * @description Agnostic contract used to execute HTTP calls independently
 * from concrete transport libraries (fetch, axios, undici, etc.),
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface HttpClientConfig {
  /** @description Optional default headers to include in every request made by the HTTP client.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  defaultHeaders: Optional<HttpHeaders>
  /** @description Optional base URL to prepend to all request URLs made by the HTTP client.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  baseURL: Optional<string>
  /** @description Optional timeout in milliseconds for all requests made by the HTTP client.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  timeoutMs: Optional<number>

  /** @description Optional keep-alive configuration for the HTTP client.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  keepAlive: Optional<boolean>

  /** @description Optional maximum number of sockets to be used by the HTTP client.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  maxSockets: Optional<number>

  /**
   * @description Optional maximum number of redirects to follow for the HTTP client.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  maxRedirects: Optional<number>

  /**
   * @description Optional flag to enable or disable automatic decompression of response bodies.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  decompress: Optional<boolean>

  /**
   * @description Optional flag to enable or disable sending credentials (cookies, authorization headers, or TLS client certificates) with cross-origin requests.
   */
  withCredentials: Optional<boolean>

  /**
   * @description Optional proxy configuration for the HTTP client.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  proxy: ProxyConfig | false
}

/**
 * @description Configuration interface for HTTP client settings, defining parameters such as timeouts, headers, and proxy configurations.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface ProxyConfig {
  /**
   * @description The hostname or IP address of the proxy server.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  host: string
  /**
   * @description The port number of the proxy server.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  port: number
  /**
   * @description Optional authentication credentials for the proxy server.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  auth?: {
    /**
     * @description The username for the proxy server.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/xeno-js/xeno-js
     */
    username: string
    /**
     * @description The password for the proxy server.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/xeno-js/xeno-js
     */
    password: string
  }
  /**
   * @description The protocol to use for the proxy server (e.g., 'http', 'https').
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   */
  protocol?: string
}
