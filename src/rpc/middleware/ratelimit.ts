import {t_timestamp_ms} from '../../aa/atype/a_define'
import {AnyMap} from '../../aa/atype/a_define_interfaces'
import {createRequestFactor} from '../base/fn_checksum'
import {Millisecond, Second} from '../../aa/atype/a_define_units'
import {RequestStruct} from '../base/define_interfaces'

export default class AaRateLimit {
    readonly debounceInterval: number
    readonly records: AnyMap<t_timestamp_ms> = new Map()
    private cleanTimer: number

    constructor(debounceInterval: number = 400 * Millisecond) {
        this.debounceInterval = debounceInterval
        this.activeAutoClean()
    }

    deny(r: RequestStruct): boolean {
        this.activeAutoClean()

        const now = new Date().getTime()
        const factor = createRequestFactor(r.url.method, r.url.href, r.headers, r.data)
        const prevTime = this.records.get(factor) ?? 0

        if (prevTime + this.debounceInterval < now) {
            this.records.set(factor, now)
            return false        // allow
        }
        return true // deny
    }

    private cleanExpiredRecords(): void {
        const now = new Date().getTime()
        this.records.forEach((time, factor) => {
            if (this.debounceInterval + time >= now) {
                this.records.delete(factor)
            }
        })
    }

    private activeAutoClean(): void {
        if (this.cleanTimer) {
            return
        }
        this.cleanTimer = window.setTimeout(() => {
            this.cleanExpiredRecords()
            clearTimeout(this.cleanTimer)
            this.activeAutoClean()
        }, 1 * Second)
    }
}