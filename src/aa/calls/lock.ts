import {Second} from "../atype/a_define_units";

let aaLockIncr = 0

export class AaLock {
    static debug = false
    name = 'aa-lock'
    private cleanTimer: number
    private readonly id = AaLock.atomicId()
    private readonly timeout: number
    private lockTime: number = 0

    constructor(timeout: number = 5 * Second) {
        this.timeout = timeout
    }

    static atomicId() {
        return ++aaLockIncr
    }

    destroy() {
        this.log('Destroy lock')
        this.clearTimer()
    }


    isLocked(): boolean {
        return this.lockTime > 0 && (this.lockTime + this.timeout > Date.now())
    }


    lock() {
        if (this.isLocked()) {
            return false
        }

        this.log('Lock')
        this.lockTime = Date.now()  // BEGIN 事务开启

        this.setAutoUnlockTimer()
        return true
    }

    unlock() {
        this.log('Unlock')
        this.clearTimer()
        this.lockTime = 0
    }


    xlock() {
        return !this.lock()
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

    async waitForUnlock(maxWaitTime = 5 * Second) {
        const startTime = Date.now();

        while (this.isLocked()) {
            if (Date.now() - startTime > maxWaitTime) {
                return false;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return true;
    }

    log(msg: string) {
        if (AaLock.debug) {
            console.debug("#" + this.id + " " + msg)
        }
    }

    private setAutoUnlockTimer() {
        const timeout = this.timeout
        this.clearTimer();
        this.cleanTimer = window.setTimeout(() => {
            this.log(`Lock timeout (${timeout}ms)`);
            this.lockTime = 0;
        }, timeout);
    }

    /**
     * 清除定时器
     * @private
     */
    private clearTimer() {
        if (this.cleanTimer) {
            clearTimeout(this.cleanTimer);
            this.cleanTimer = null;
        }
    }

}