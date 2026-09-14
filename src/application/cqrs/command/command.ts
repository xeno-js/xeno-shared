import type { ICommand } from '@/domain'
import type { RequestType } from '@/shared'
import { REQUEST_TYPE } from '@/shared'

export abstract class Command<TResponse = unknown> implements ICommand<TResponse> {
  public readonly type: RequestType = REQUEST_TYPE.COMMAND

  constructor(readonly intent: string) {}
}
