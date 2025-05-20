import {AError} from "./error";
import {E_ClientThrow} from "./code";

export const MissingResponseBody = new AError(E_ClientThrow, "missing response body")
export const ParseResponseBodyFailed = new AError(E_ClientThrow, "parse response body failed")

