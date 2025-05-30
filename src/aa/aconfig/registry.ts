import log from '../alog/log'

export default class Registry {
    private registry: Map<string, (...args: unknown[]) => unknown> = new Map()

    has(name: string): boolean {
        return this.registry.has(name)
    }

    activate(name: string, ...args: unknown[]): unknown {
        if (this.has(name)) {
            throw new Error(`activate unregistered ${name}`)
        }
        return this.registry.get(name)!(...args)
    }

    register(name: string, fn: (...args: unknown[]) => unknown) {
        if (this.registry.has(name)) {
            log.warn(`register ${name} was already registered`)
        }
        this.registry.set(name, fn)
    }

    unregister(name: string) {
        this.registry.delete(name)
    }
}