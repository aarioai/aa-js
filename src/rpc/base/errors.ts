import {AError} from '../../aa/aerror/error'
import {E_ClientThrow} from '../../aa/aerror/code'

export const E_MissingResponseBody = new AError(E_ClientThrow, "missing response body").lock()

export const E_ParseResponseBodyFailed = new AError(E_ClientThrow, "parse response body failed").lock()
