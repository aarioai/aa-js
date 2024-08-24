/**
 * @typedef {boolean|function:boolean|number|string} bool  --> 注意支持对函数判断
 * @typedef {string} jsonstr
 * @typedef {{[key:string]:any}|*} struct   为了方便JSDoc，这里struct 用空泛的更方便
 * @typedef {object|*} Class
 * @typedef {array|struct|map|URLSearchParams|*} iterable
 * @typedef {(value:any, key:string)=>*} IteratorCallback
 * @typedef {((a:any, b:any)=>number)|boolean} SortMethod
 * @typedef {string|number} StringN
 * @typedef {number|string} NumberX
 * @typedef {number} TimeUnit
 * @typedef {number} UnixTime     unix time in seconds
 * @typedef {number} UnixTimeMillisecond unix time in milliseconds
 * @typedef {number} Timeout
 * @typedef {string} RequestURL  e.g. 'GET https://luexu.com' or 'https://luexu.com'
 * @typedef {string} filepath
 * @typedef {string} QueryString  k=v&k=v&k=v
 * @typedef {*} vv_vk_defaultV  e.g. (value) (obj, key)  (obj, key, defaultValue)
 * @typedef {string} MAX
 * @typedef {string} MIN
 * @typedef {'<'|'='|'>'|'>='|'<='|'=='} ComparisonSymbol
 *
 */

const nif = () => void 0   // a nil function  ==>  Go语言都定义 any = interface{}，这里定义要给 nif 是有必要的
const MAX = 'MAX'
const MIN = 'MIN'
const BREAK_SIGNAL = '-.../.-././.-/-.-/..--.-/.../../--./-./.-/.-..' // a signal from callback function to break forEach((value,key)) iterator
const OPTIONAL = false
const REQUIRED = !OPTIONAL
const INCR = 'INCR'
const DECR = 'DECR'
const U0 = uint64(0)


/**
 * Keep-names of URL parameters
 */
const aparam = {
    Debug   : "_debug", // 0 o debug; 1/true debug via console; 2/alert debug via alert
    DebugUrl: "_debug_url",
    Apollo  : "apollo",


    Authorization: "Authorization",  // 由 token_type access_token 组合而成

    AccessTokenType     : "token_type",
    AccessToken         : "access_token",  // header/query/cookie
    AccessTokenExpiresIn: "expires_in",
    AccessTokenConflict : "conflict",
    RefreshToken        : "refresh_token",
    Scope               : "scope",
    ScopeAdmin          : "admin",

    Redirect       : 'redirect',
    LocalAuthAt    : "_localAuthAt",
    Logout         : "logout",
    PersistentNames: ["_debug", "apollo", "logout"],
}


/**
 * 为了方便 log 类，debug状态一律用全局
 */
var _aaDebug = new (class {
    name = 'aa-debug'
    value = 0

    #storageKeyname = "aa_" + aparam.Debug
    #disabled = 0
    #console = 1
    #alert = 2

    constructor() {
        // check query string
        const match = location.search.match(new RegExp("[?&]" + aparam.Debug + "=(\\w+)", 'i'))
        if (match) {
            this.init(match[1], true)
            return
        }

        const [_, ok] = this.loadStorage()
        if (ok) {
            return
        }
        this.value = this.isLocalhost() ? this.#console : this.#disabled
    }

    isLocalhost() {
        const h = location.hostname.toLowerCase()
        if (['localhost', '127.0.0.1', '::1'].includes(h)) {
            return true
        }
        // A类局域网IP范围
        if (/^10\.\d+\.\d+\.\d+$/.test(h)) {
            return true
        }
        // B类局域网
        if (/^127\.\d+\.\d+\.\d+$/.test(h) || /^172\.(1[6-9]|2\d|3[0-2])\.\d+\.\d+$/.test(h)) {
            return true
        }

        // C类局域网IP
        return /^192\.168\.\d+\.\d+$/.test(h);

    }

    init(type, store = false) {
        type = string(type).toUpperCase()
        if (['1', 'TRUE'].includes(type)) {
            this.value = this.#console
        }
        if (['2', 'ALERT'].includes(type)) {
            this.value = this.#alert
        }
        if (!['0', 'FALSE', 'DISABLED'].includes(type)) {
            console.error("RangeError: set debug error " + type)
        } else if (store) {
            this.store()
        }
        this.value = this.#disabled
    }


    store() {
        if (!localStorage) {
            return
        }
        const value = atype.aliasOf(this.value).toUpperCase() + ":" + this.value  // N:1, add N: make this storage persistent
        localStorage.setItem(this.#storageKeyname, value)
    }

    loadStorage() {
        if (!localStorage) {
            return
        }
        const sk = localStorage.getItem(this.#storageKeyname)
        const value = sk ? Number(sk.replace('N:', '')) : 0
        const ok = isNaN(value) || ![0, 1, 2].includes(value)
        return [value, ok]
    }

    disabled() {
        return this.value === this.#disabled
    }

    isConsole() {
        return this.value === this.#console
    }

    isAlert() {
        return this.value === this.#alert
    }

    toValue() {
        return this.value
    }
})()

