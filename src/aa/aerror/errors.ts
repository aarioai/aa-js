import {AError} from "./error";
import {CODE_CLIENT_THROWING, CODE_OK} from "./code";

export const Err_MissingArgument = new Error("missing required argument, or its value is empty")

export const E_OK = new AError(CODE_OK)
export const E_ParseResponseBodyFailed = new AError(CODE_CLIENT_THROWING, "parse response body failed").lock()

