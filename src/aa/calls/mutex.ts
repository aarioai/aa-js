import {Milliseconds, Second, Seconds} from "../atype/a_define_units";
import log from '../alog/log'
import {AError} from '../aerror/error'
import {asleep, reject, resolve} from '../../basic/promises/fn'


export const E_DeadLock = new AError('dead lock').lock()

export class AaMutex {
    private static idIncr: number = 0
    name: string
    debug = false
    timeout = 5 * Second
    private readonly id = AaMutex.atomicId()
    private lockTime: number = 0
    private cleanTimer: number | null = null

    constructor(name: string = '') {
        this.name = name
    }

    static atomicId() {
        return ++AaMutex.idIncr
    }


    isLocked(): boolean {
        if (!this.lockTime) {
            return false
        }
        const now = Date.now()
        const expire = this.lockTime + this.timeout
        this.log(`checking is locked: ${this.lockTime} + ${this.timeout} = ${expire} >? ${now}`)
        if (expire > now) {
            return true
        }
        // Auto-unlock if expired
        this.unlock()
        return false
    }


    gainLock(): boolean {
        if (this.isLocked()) {
            return false
        }
        this.lockTime = Date.now()
        this.log(`lock acquired at ${this.lockTime}`)
        this.setAutoUnlockTimer()
        return true
    }

    async awaitLock(maxWaitTime = 5 * Seconds): Promise<boolean> {
        const interval = 200 * Milliseconds
        const startTime = Date.now()
        while (Date.now() - startTime < maxWaitTime) {
            this.log(`await lock before (${this.lockTime})`)
            if (this.gainLock()) {
                this.log(`lock gained at ${this.lockTime}`)
                return true
            }
            await asleep(interval)
        }

        log.warn(`${this.name}(#${this.id}) dead lock!`)
        return false
    }

    waitLock(maxWaitTime = 5 * Seconds): Promise<void> {
        return this.awaitLock(maxWaitTime).then((ok) => {
            this.log(`wait lock ${ok}`)
            if (!ok) {
                return reject(E_DeadLock)
            }
            return resolve(undefined)
        })
    }

    unlock(): void {
        this.log('unlock')
        this.clearTimer()
        this.lockTime = 0
    }


    private log(msg: string): void {
        if (this.debug) {
            log.debug(`${this.name}(#${this.id}) ${msg}`)
        }
    }

    private setAutoUnlockTimer() {
        this.clearTimer()
        this.cleanTimer = window.setTimeout(() => {
            this.log(`lock auto-released after timeout (${this.timeout}ms)`)
            this.unlock()
        }, this.timeout)
    }

    private clearTimer() {
        if (this.cleanTimer) {
            clearTimeout(this.cleanTimer)
            this.cleanTimer = null
        }
    }
}