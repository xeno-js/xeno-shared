import type { IQuery } from '@/domain'
import type { ICacheableOptions, RequestType } from '@/shared'
import { REQUEST_TYPE } from '@/shared'

/**
 * @description Base class for all queries.
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export abstract class Query<TResponse = unknown> implements IQuery<TResponse> {
  public readonly type: RequestType = REQUEST_TYPE.QUERY

  constructor(
    readonly intent: string,
    readonly cacheOptions: ICacheableOptions,
  ) {}
}
