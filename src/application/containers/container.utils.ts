import type { ApplicationRegistry, IServiceContainer, IServiceScope } from "@/domain";
import { Guards, TOKENS } from "@/shared";

export const ContainerUtils = Object.freeze({
    resolveServiceScoped<K extends keyof T, T extends ApplicationRegistry>(token: K, container: IServiceContainer<T>) {
        const scope = container.resolve(TOKENS.SERVICE_SCOPE_ACCESSOR).getScope()
        if (!Guards.isDefined(scope)) {
            throw new Error('Active service scope is required to execute Scoped service.')
        }

        const service = (scope as IServiceScope<T>).resolve(token)
        return service
    }
})