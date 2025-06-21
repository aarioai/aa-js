import {HoursInSecond, Milliseconds, NO_EXPIRES} from '../../../aa/atype/a_define_units'
import type {UserToken} from '../../../aa/atype/a_server_dto'
import {HeaderSetting} from './define_interfaces.ts'
import type {CookieOptions} from '../../../basic/storage/define_types.ts'
import {AError} from '../../../aa/aerror/error.ts'


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
    baseURL = ''   // global default baseURL
    debounceInterval = 400 * Milliseconds
    readonly headers: HeaderSetting = defaultHeaderSetting
    readonly cookieOptions: CookieOptions = {
        path: '/',
        sameSite: 'Lax',
        secure: location.protocol === 'https:'
    }
    readonly userTokenOptions: UserToken = {
        expires_in: 2 * HoursInSecond,
        attach: {
            refresh_ttl: NO_EXPIRES,
        }
    }

    unauthorizedHandler?: (e: AError) => boolean
    requestErrorHandler?: (e: AError) => boolean
}

const defaults = new DefaultSettings()
export default defaults