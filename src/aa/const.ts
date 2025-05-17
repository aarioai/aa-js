// a signal from callback function to break forEach((value,key)) iterator
export const Break = '-.../.-././.-/-.-'

// return Continue in a loop is not important, but better for people to read
export const Continue = undefined

export const MinDate = "0000-00-00"
export const MinTime = "00=00=00"
export const MinDatetime = "0000-00-00 00=00=00"

export const Max = 'Max'
export const Min = 'Min'
export const Optional = false
export const Required = !Optional
export const Incr = 'INCR'
export const Decr = 'DECR'
export const ZeroValues = [null, '', undefined, false, 0, 0n, 0.0, '0', "0.0", "0.00", MinDate, MinTime, MinDatetime]


// 1 or `log` debug via log; 2 or `alert` debug via alert; 0 or others no debug
export const P_ClientDebug = "_debug"
export const P_ClientAuthAt = "_auth_at"

// server parameters
export const P_Debug = "x_debug"
export const P_DebugUrl = "x_debug_url"
export const P_Mock = "x_mock"
export const P_Apollo = "apollo"
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