// @import aparam, _aaStorageFactor, _aaFetch


class _aaAuth {


    // @type _aaStorageFactor
    #storage
    // @type _aaFetch
    #fetch
    // @type {{access_token: string, refresh_token: string, refresh_api: string, scope: null, token_type: string, secure: boolean|undefined, expires_in: number, conflict: boolean|undefined}}
    #_token
    #tokenAuthAt = 0

    // aa.auth.token['access_token']
    get token() {
        let now = Math.floor(new Date().getTime() / 1000)
        // 由于access token经常使用，并且可能会由于第三方登录，导致修改cookie。
        // 因此，查询变量方式效率更高，且改动相对无时差
        const r = this.#storage
        if (!this.#_token) {
            const accessToken = r.getItem("aa:auth.access_token")
            if (!accessToken) {
                return null
            }
            this.#_token = {
                "access_token" : accessToken,
                "expires_in"   : r.getItem("aa:auth.expires_in"),
                "token_type"   : r.getItem("aa:auth.token_type"),
                "refresh_api"  : r.getItem("aa:auth.refresh_api"),
                "refresh_token": r.getItem("aa:auth.refresh_token"),
                "secure"       : r.getItem("aa:auth.secure"),
                "scope"        : r.getItem("aa:auth.scope"),
                "conflict"     : r.getItem("aa:auth.conflict"),
            }
            this.#tokenAuthAt = r.getItem("aa:auth._localAuthAt")
        }


        const exp = this.#_token['expires_in'] + this.#tokenAuthAt - now
        if (exp <= 0) {
            return this.refresh()
        }
        return this.#_token
    }

    set token(token) {
        this.setToken(token)
    }


    /**
     *
     * @param {_aaStorageFactor} storage
     * @param {_aaFetch} fetch
     */
    constructor(storage, fetch) {
        this.#storage = storage
        this.#fetch = fetch
    }


    #tryStoreCookie(key, value, expiresInMilliseconds = 7 * C.Day) {
        if (this.#storage.cookie.isPseudo()) {
            this.#storage.local.setItem(key, value)
            return
        }


        // sameSite: Lax 仅支持GET表单、链接发送第三方站点cookie，POST/Ajax/Image等就不支持
        //  strict 跨站点时候，完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie。换言之，只有当前网页的 URL 与请求目标一致，才会带上 Cookie。
        // domain: .luexu.com  会让所有子站点，如 cns.luexu.com 也同时能获取到
        // domain 前面必须要带上 .
        let domain = window.location.hostname.replace(/.*\.(\w+\.com)/ig, '$1')
        const cf = {
            domain : domain,
            path   : '/',
            expires: new Date() + expiresInMilliseconds,
            // Lax 允许部分第三方跳转过来时请求携带Cookie；Strict 仅允许同站请求携带cookie
            // 微信授权登录，跳转回来。如果是strict，就不会携带cookie（防止csrf攻击）；而lax就会携带。
            // 在 Lax 模式下只会阻止在使用危险 HTTP 方法进行请求携带的三方 Cookie，例如 POST 方式。同时，使用 Js 脚本发起的请求也无法携带三方 Cookie。
            // 谷歌默认 sameSite=Lax
            sameSite: 'lax',
            secure  : location.protocol === "https",  // 只允许https访问
        }

        /*
   在服务器端设置cookie的HttpOnly属性为true。这将防止JavaScript修改cookie，因为在HttpOnly模式下，cookie只能通过HTTP协议访问，无法通过JavaScript或其它客户端脚本来修改。
        */
        // 由于cookie可以跨域，而 localStorage 不能跨域。
        // 单点登录，所以这些信息都用 cookie 来保存

        this.#storage.cookie.setItem(key, value, cf)

    }

    validateToken(token) {
        if (!token['access_token'] || !token['expires_in'] || !token['token_type']) {
            return null
        }
        const expiresIn = intMax(token['expires_in'])  // expires in seconds
        if (expiresIn * C.Second < 3 * C.Minute) {
            return null
        }
        return {
            "access_token" : token["access_token"],
            "expires_in"   : expiresIn,
            "token_type"   : token["token_type"],
            "refresh_api"  : string(token, "refresh_api"),  // 非必要
            "refresh_token": string(token, "refresh_token"),
            "secure"       : token.hasOwnProperty('secure') ? bool(token["secure"]) : void false,
            "scope"        : token.hasOwnProperty('scope') ? token["secure"] : null,
            "conflict"     : token.hasOwnProperty('conflict') ? bool(token["conflict"]) : void false,
        }
    }

    setToken(token) {
        token = this.validateToken(token)
        if (!token) {
            alert("set invalid token")
            return
        }

        if (bool(token, "conflict")) {
            alert("授权登录绑定过其他账号，已切换至授权登录的账号。")
        }

        this.#_token = {
            "access_token" : token["access_token"],
            "expires_in"   : intMax(token["expires_in"]),
            "token_type"   : token["token_type"],
            "refresh_api"  : token["refresh_api"],
            "refresh_token": token["refresh_token"],
            "secure"       : bool(token["secure"]),
            "scope"        : token["scope"],
            "conflict"     : bool(token['conflict']),
        }
        this.#tokenAuthAt = Math.floor(new Date().getTime() / 1000)

        // 清空其他缓存
        this.#storage.clearAll()


        const expiresIn = this.#_token['expires_in']
        this.#tryStoreCookie("aa:auth.access_token", this.#_token['access_token'], expiresIn * C.Second)

        this.#tryStoreCookie("aa:auth.token_type", this.#_token['token_type'], expiresIn * C.Second)

        // refresh token 不应该放到cookie里面
        this.#storage.local.setItem("aa:auth.expires_in", expiresIn, expiresIn * C.Second)
        this.#storage.local.setItem("aa:auth.refresh_api", this.#_token['refresh_api'])
        this.#storage.local.setItem("aa:auth.refresh_token", this.#_token['refresh_token'])
        this.#storage.local.setItem("aa:auth.secure", this.#_token['secure'])
        this.#storage.local.setItem("aa:auth.scope", this.#_token['scope'])
        this.#storage.local.setItem("aa:auth.conflict", this.#_token['conflict'])

        this.#storage.local.setItem("aa:auth._localAuthAt", this.#tokenAuthAt)
        this.#storage.session.setItem('aa:auth.checked', 1)
    }

    refresh() {
        const token = this.token
        if (!token) {
            return null
        }
        const api = token['refresh_api']
        const refreshToken = token['refresh_token']

        this.#fetch.get(api, {
            'grant_type': 'refresh_token',
            'code'      : refreshToken,
        }).then(data => {
            this.setToken(data)
        }).catch(err => {
            log.error(err.toString())
        })
    }

    clear() {
        this.#storage.removeAll("aa:auth.access_token")
        this.#storage.removeAll("aa:auth.expires_in")
        this.#storage.removeAll("aa:auth.token_type")
        this.#storage.removeAll("aa:auth.refresh_api")
        this.#storage.removeAll("aa:auth.refresh_token")
        this.#storage.removeAll("aa:auth.secure")
        this.#storage.removeAll("aa:auth.scope")
        this.#storage.removeAll("aa:auth.conflict")

        this.#storage.removeAll("aa:auth._localAuthAt")
        this.#storage.removeAll("aa:auth.checked")

    }

    /**
     * Get authorization value in header
     * @return {string}
     */
    getAuthorization() {
        if (!this.token || !this.token['access_token'] || !this.token['token_type']) {
            return ""
        }
        return this.token['token_type'] + " " + this.token['access_token']
    }


    /**
     *  Check is  in logged in status
     * @return {boolean}
     */
    authed() {
        return len(this.token, 'access_token') > 0 && len(this.token, 'token_type') > 0
    }

    // 所有401，都执行一次服务端退出，这样可以排除大量异常情况 ——— 影响用户下单的成本是最重的！！
    logout(callback) {
        this.#storage.clearAllExcept([aparam.Logout])
        this.#_token = null // clear program cache
        this.#tryStoreCookie(aparam.Logout, 1, 5 * C.Minute)
        callback()
    }
}