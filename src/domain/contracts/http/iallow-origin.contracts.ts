import type { Optional } from "@/shared";

export interface IAllowOrigin {
    isAllowed(origin: Optional<string>): boolean
}