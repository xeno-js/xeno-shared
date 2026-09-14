import type { IAllowOrigin } from '@/domain'
import { Guards, type Optional } from '@/shared'

export class AllowOrigin implements IAllowOrigin {
  constructor(private readonly _list: string[]) {}

  public isAllowed(origin: Optional<string>): boolean {
    if (Guards.isNullOrEmpty(origin)) return false

    return this._list.includes(origin.trim().toLowerCase())
  }
}
