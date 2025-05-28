// 1 or `log` debug via log; 2 or `alert` debug via alert; 0 or others no debug
export const P_ClientDebug = "_debug"
export const P_ClientAuthAt = "_auth_at"

// server parameters
export const P_Stringify = 'x-stringify'
export const P_StringifyHeader = 'X-Stringify'
export const P_Fingerprint = "apollo"

export const P_Debug = "x_debug"
export const P_DebugUrl = "x_debug_url"
export const P_Mock = "x_mock"

export const P_Authorization = "Authorization"  // 由 token_type access_token 组合而成
export const P_AccessTokenType = "token_type"
export const P_AccessToken = "access_token"  // header/query/cookie
export const P_AccessTokenExpiresIn = "expires_in"
export const P_AccessTokenConflict = "conflict"
export const P_RefreshToken = "refresh_token"
export const P_Scope = "scope"
export const P_ScopeAdmin = "admin"
export const P_Redirect = 'redirect'

export const P_Logout = "logout"
export const P_PersistentNames = ["_debug", "_mock", "apollo", "logout"]