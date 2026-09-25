import type { Dictionary, Maybe, Optional } from './common.types'

/**
 * @description Supported HTTP methods.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

/**
 * @description Header map used by agnostic HTTP clients.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
export type HttpHeaders = Dictionary<Optional<string | string[]>>

/**
 * @description Query string value accepted by the HTTP contract.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
export type HttpQueryValue = Maybe<string | number | boolean>

/**
 * @description Agnostic contract used to execute HTTP calls independently
 * from concrete transport libraries (fetch, axios, undici, etc.).

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
export type HttpOptions = 'url' | 'method' | 'body'

/**
 * @description Base Request options accepted by the agnostic HTTP client.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface HttpBaseRequest {
  /** @description Optional query string parameters.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly query?: Optional<Dictionary<HttpQueryValue>>

  /** @description Optional request headers.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly headers?: Optional<HttpHeaders>

  /** @description Optional abort signal used to cancel the request.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly signal: Optional<AbortSignal>

  /** @description Optional request timeout in milliseconds.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly timeoutMs?: Optional<number>

  /**
   * @description Optional response type for the request.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly responseType?: Optional<HttpResponseType>
}

/**
 * @description Represents the structure of an HTTP response.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export type HttpResponseType = 'json' | 'blob' | 'text' | 'arraybuffer'

/**
 * @description Request options accepted by the agnostic HTTP client.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
export interface HttpRequest<TBody = unknown> extends HttpBaseRequest {
  /** @description HTTP method used for the outgoing call.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly method: HttpMethod

  /** @description Optional request body.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly body?: Optional<TBody>

  /** @description Absolute or relative target URL.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly url?: string
}

/**
 * @description Normalized response returned by an agnostic HTTP client.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
export interface HttpResponse<TData = unknown> {
  /** @description HTTP status code returned by the server.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly status: number

  /** @description Indicates if the response status is in the 2xx range.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly ok: boolean

  /** @description Response headers normalized as a dictionary.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly headers: HttpHeaders

  /** @description Parsed response payload.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly data: TData
}

/**
 * @description Represents the CookieOptions interface.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface CookieOptions {
  /** @description The path for which the cookie is valid. Defaults to '/'. */
  path?: Optional<string>
  /** @description The value of the maximum age in seconds. If not specified, the cookie will expire when the browser session ends. */
  maxAge?: Optional<number>
  /** @description The domain for which the cookie is valid. Defaults to the domain of the current document host. */
  domain?: Optional<string>
  /** @description Whether the cookie is only transmitted over secure (HTTPS) connections. Defaults to true in production. */
  secure?: Optional<boolean>
  /** @description Controls whether the cookie is withheld on cross-site requests, providing some protection against cross-site request forgery attacks. */
  sameSite?: Optional<'lax' | 'strict' | 'none' | boolean>
}
