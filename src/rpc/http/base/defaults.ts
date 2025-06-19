import {HoursInSecond, NO_EXPIRES} from '../../../aa/atype/a_define_units'
import type {UserToken} from '../../../aa/atype/a_server_dto'


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


class DefaultSettings {
    readonly headers = new defaultHTTPHeaders()
    readonly userToken: UserToken = {
        expires_in: 2 * HoursInSecond,
        attach: {
            refresh_ttl: NO_EXPIRES,
        }
    }
}

const defaults = new DefaultSettings()
export default defaults