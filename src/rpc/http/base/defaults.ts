import {HoursInSecond, NO_EXPIRES} from '../../../aa/atype/a_define_units'
import type {UserToken} from '../../../aa/atype/a_server_dto'
import {HeaderSetting} from './define_interfaces.ts'


const defaultHeaderSetting: HeaderSetting = {
    common: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    CONNECT: {},
    DELETE: {},
    GET: {},
    HEAD: {},
    OPTIONS: {},
    POST: {},
    PUT: {},
    PATCH: {},
    TRACE: {},
}


class DefaultSettings {
    readonly baseURL = ''   // global default baseURL
    readonly headers: HeaderSetting = defaultHeaderSetting
    readonly userToken: UserToken = {
        expires_in: 2 * HoursInSecond,
        attach: {
            refresh_ttl: NO_EXPIRES,
        }
    }
}

const defaults = new DefaultSettings()
export default defaults