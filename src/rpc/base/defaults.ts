import {HoursInSecond, Millisecond, NO_EXPIRES} from '../../aa/atype/a_define_units'
import {t_millisecond} from '../../aa/atype/a_define'
import {UserToken} from '../../aa/atype/a_server_dto'


class defaultHTTPHeaders {
    common = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    HEAD = {}
    GET = {}
    DELETE = {}
    POST = {}
    PUT = {}
    PATCH = {}
}

class defaultHTTPSettings {
    baseURL = ''
    debounceInterval: t_millisecond = 400 * Millisecond
    readonly headers = new defaultHTTPHeaders()
    readonly userToken: UserToken = {
        expires_in: 2 * HoursInSecond,
        attach: {
            refresh_ttl: NO_EXPIRES,
        }
    }
}

class DefaultSettings {
    readonly http = new defaultHTTPSettings()
}

const defaults = new DefaultSettings()
export default defaults