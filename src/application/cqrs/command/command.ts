import type { ICommand } from '@/domain'
import type { RequestType } from '@/shared'
import { REQUEST_TYPE } from '@/shared'

/**
 * @description Base class for all commands.
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export abstract class Command<TResponse = unknown> implements ICommand<TResponse> {
  public readonly type: RequestType = REQUEST_TYPE.COMMAND

  constructor(readonly intent: string) {}
}
