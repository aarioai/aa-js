import {Second} from "../env/const_unit";

let _aaLockIncr_ = 0
const defaultAaLockTimeout = 5 * Second

export class AaLock {
    static debug = false
    name = 'aa-lock'
    readonly timeout: number
    #id = AaLock.atomicId()
    #lockAt: number = 0
    #timer: number

    constructor(timeout?: number) {
        this.timeout = timeout && timeout > 0 ? timeout : defaultAaLockTimeout
    }

    static atomicId() {
        return ++_aaLockIncr_
    }

    destroy() {
        this.log('Destroy lock')
        this.#clearTimer()
    }


    isLocked(): boolean {
        return this.#lockAt > 0 && (this.#lockAt + this.timeout > Date.now())
    }


    lock() {
        if (this.isLocked()) {
            return false
        }

        this.log('Lock')
        this.#lockAt = Date.now()  // BEGIN 事务开启

        this.#setAutoUnlockTimer()
        return true
    }

    unlock() {
        this.log('Unlock')
        this.#clearTimer()
        this.#lockAt = 0
    }


    xlock() {
        return !this.lock()
    }

    getStatus() {
        return {
            id: this.#id,
            isLocked: this.isLocked(),
            lockAt: this.#lockAt,
            timeout: this.timeout,
            remainingTime: this.#lockAt > 0 ? Math.max(0, this.#lockAt + this.timeout - Date.now()) : 0
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
            console.debug("#" + this.#id + " " + msg)
        }
    }

    /**
     * 清除定时器
     * @private
     */
    #clearTimer() {
        if (this.#timer) {
            clearTimeout(this.#timer);
            this.#timer = null;
        }
    }


    #setAutoUnlockTimer() {
        const timeout = this.timeout > 0 ? this.timeout : defaultAaLockTimeout
        this.#clearTimer();
        this.#timer = window.setTimeout(() => {
            this.log(`Lock timeout (${timeout}ms)`);
            this.#lockAt = 0;
        }, timeout);
    }

}