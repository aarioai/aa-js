import {Millisecond} from '../../aa/atype/a_define_units'
import AaRateLimit from './ratelimit'
import {RequestStruct} from '../base/define_interfaces'
import {AError} from '../../basic/aerror/error'

export default class AaMiddleware {
    readonly rateLimit: AaRateLimit
    readonly debounceInterval: number

    constructor(debounceInterval: number = 400 * Millisecond) {
        this.rateLimit = new AaRateLimit(debounceInterval)
    }

    denied(r: RequestStruct): [boolean, AError?] {
        return this.rateLimit.denied(r)
    }
}