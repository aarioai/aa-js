import {AError} from "./error";
import {E_ClientThrow} from "./code";

export const E_MissingArgument = new Error("missing required argument, or its value is empty")

export const E_MissingResponseBody = new AError(E_ClientThrow, "missing response body")
export const E_ParseResponseBodyFailed = new AError(E_ClientThrow, "parse response body failed")

