import {Milliseconds, Second, Seconds} from "../atype/a_define_units";
import log from '../alog/log'
import {AError} from '../aerror/error'
import {asleep} from '../../basic/promises/fn'

export const E_DeadLock = new AError('dead lock').lock()

export class AaMutex {
    private static idIncr: number = 0
    debug: boolean
    private readonly id = AaMutex.atomicId()
    private readonly timeout: number
    private lockTime: number = 0
    private cleanTimer: number

    constructor(timeout: number = 5 * Second, debug: boolean = false) {
        this.timeout = timeout
        this.debug = debug
    }

    static atomicId() {
        return ++AaMutex.idIncr
    }

    destroy(): void {
        this.log('Destroy lock')
        this.clearTimer()
    }


    isLocked(): boolean {
        return this.lockTime > 0 && (this.lockTime + this.timeout > Date.now())
    }


    gainLock(): boolean {
        if (this.isLocked()) {
            return false
        }

        this.log('Lock')
        this.lockTime = Date.now()
        this.setAutoUnlockTimer()
        return true
    }

    async awaitLock(maxWaitTime = 5 * Seconds): Promise<boolean> {
        const interval = 100 * Milliseconds
        const startTime = Date.now()
        while (Date.now() - startTime < maxWaitTime) {
            if (this.gainLock()) {
                return true
            }
            await asleep(interval)
        }
        return false
    }

    waitLock(maxWaitTime = 5 * Seconds): Promise<boolean> {
        return new Promise(async resolve => this.awaitLock(maxWaitTime))
    }

    unlock(): void {
        this.log('Unlock')
        this.clearTimer()
        this.lockTime = 0
    }


    getStatus() {
        return {
            id: this.id,
            isLocked: this.isLocked(),
            lockAt: this.lockTime,
            timeout: this.timeout,
            remainingTime: this.lockTime > 0 ? Math.max(0, this.lockTime + this.timeout - Date.now()) : 0
        };
    }


    private log(msg: string): void {
        if (this.debug) {
            log.debug("#" + this.id + " " + msg)
        }
    }

    private setAutoUnlockTimer() {
        const timeout = this.timeout
        this.clearTimer()
        this.cleanTimer = window.setTimeout(() => {
            this.log(`Lock timeout (${timeout}ms)`)
            this.lockTime = 0
        }, timeout)
    }


    private clearTimer() {
        if (this.cleanTimer !== null) {
            clearTimeout(this.cleanTimer)
            this.cleanTimer = null
        }
    }
}