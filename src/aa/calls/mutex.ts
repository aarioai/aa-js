import {Milliseconds, Second, Seconds} from "../atype/a_define_units";
import log from '../alog/log'
import {AError} from '../aerror/error'
import {asleep} from '../../basic/promises/fn'

export const E_DeadLock = new AError('dead lock').lock()

export class AaMutex {
    private static idIncr: number = 0
    name: string
    debug = false
    timeout = 5 * Second
    private readonly id = AaMutex.atomicId()
    private lockTime: number = 0
    private cleanTimer: number = 0

    constructor(name: string = '') {
        this.name = name
    }

    static atomicId() {
        return ++AaMutex.idIncr
    }

    destroy(): void {
        this.log('destroy lock')
        clearTimeout(this.cleanTimer)
    }


    isLocked(): boolean {
        if (!this.lockTime) {
            return false
        }
        const now = Date.now()
        const timeout = this.lockTime + this.timeout
        this.log(`checking is locked: ${this.lockTime} + ${this.timeout} = ${timeout} >? ${now}`)
        return timeout > now
    }


    gainLock(): boolean {
        if (this.isLocked()) {
            return false
        }
        // this.lockTime = Date.now()
        this.log(`lock at ${this.lockTime}`)
        this.setAutoUnlockTimer()
        return true
    }

    async awaitLock(maxWaitTime = 5 * Seconds): Promise<boolean> {
        const interval = 200 * Milliseconds
        const startTime = Date.now()
        while (Date.now() - startTime < maxWaitTime) {
            this.log(`await lock ${this.lockTime}`)
            if (this.gainLock()) {
                return true
            }
            await asleep(interval)
        }
        log.warn(`#${this.id} dead lock!`)
        return false
    }

    waitLock(maxWaitTime = 5 * Seconds): Promise<void> {
        return new Promise(async () => {
            this.log('wait lock')
            const ok = await this.awaitLock(maxWaitTime)
            if (!ok) {
                throw E_DeadLock
            }
        })
    }

    unlock(): void {
        this.log('unlock')
        clearTimeout(this.cleanTimer)
        this.lockTime = 0
    }


    private log(msg: string): void {
        if (this.debug) {
            log.debug(`${this.name}(#${this.id}) ${msg}`)
        }
    }

    private setAutoUnlockTimer() {
        const timeout = this.timeout
        clearTimeout(this.cleanTimer)
        this.cleanTimer = window.setTimeout(() => {
            this.log(`lock timeout (${timeout}ms)`)
            this.lockTime = 0
        }, timeout)
    }
}