import {AError} from '../../../aa/aerror/error'
import {CODE_CLIENT_THROWING} from '../../../aa/aerror/code'

export const E_MissingResponseBody = new AError(CODE_CLIENT_THROWING, "missing response body").lock()

export const E_ParseResponseBodyFailed = new AError(CODE_CLIENT_THROWING, "parse response body failed").lock()
