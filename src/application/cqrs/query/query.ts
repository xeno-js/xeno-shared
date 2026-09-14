import type { IQuery } from '@/domain'
import type { ICacheableOptions, RequestType } from '@/shared'
import { REQUEST_TYPE } from '@/shared'

export abstract class Query<TResponse = unknown> implements IQuery<TResponse> {
  public readonly type: RequestType = REQUEST_TYPE.QUERY

  constructor(
    readonly intent: string,
    readonly cacheOptions: ICacheableOptions,
  ) {}
}
