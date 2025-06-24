import {HoursInSecond, NO_EXPIRES} from '../../../aa/atype/a_define_units'
import type {UserToken} from '../../../aa/atype/a_server_dto'
import {BaseRequestOptions, HeaderSetting} from './define_interfaces.ts'
import type {CookieOptions} from '../../../basic/storage/define_types.ts'
import {AError} from '../../../aa/aerror/error.ts'


const defaultHeaderSetting: HeaderSetting = {
    ANY: {
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
    requestOptions: BaseRequestOptions = {}
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
    requestErrorHook?: (e: AError) => AError
}

const defaults = new DefaultSettings()
export default defaults