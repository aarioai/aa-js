/**  @typedef {{ domain?:string, persistent?:boolean, expires?:number|Date|string, path?:string, secure?:boolean, sameSite?:string }} StorageOptions */
class AaCookieStorage {
    name = 'aa-cookie-storage'

    // cookie 不能使用 : 等分隔符作为key，因此不同Engine里面自己指定分隔符
    separator = '_'
    subSeparator = '_'


    get length() {
        const all = this.getAll()
        return all ? Object.keys(all).length : 0
    }


    available() {
        return typeof document !== 'undefined'
    }

    /**
     * Note that this code has two limitations:
     *
     * It will not delete cookies with HttpOnly flag set, as the HttpOnly flag disables JavaScript's access to the cookie.
     * It will not delete cookies that have been set with a Path value. (This is despite the fact that those cookies will appear in document.cookie, but you can't delete it without specifying the same Path value with which it was set.)
     * @param {StorageOptions} [options]
     */
    clear(options) {
        if (!this.available() || !document.cookie) {
            return
        }
        this.forEach((key, _) => {
            this.removeItem(key, options)
        })
    }


    /**
     *
     * @param {ForEachCallback} callback
     * @param {(value:any)=>any} [valueHandler]
     */
    forEach(callback, valueHandler) {
        let result = []   // React 会需要通过这个渲染array/struct
        const all = this.getAll()
        if (!all) {
            return result
        }
        for (let [key, value] of Object.entries(all)) {
            if (typeof valueHandler === "function") {
                value = valueHandler(value)
            }
            const r = callback(key, value)
            if (r === BREAK) {
                break
            }
            result.push(r)
        }
        return result
    }


    /**
     * Get all
     * @return {?struct}
     */
    getAll() {
        if (!this.available() || !document.cookie) {
            return null
        }
        let data = {}
        // 相同key，前面优先
        //  k=v; k=v; k=v; k=xxx=xxx; k; k;
        document.cookie.splitTrim('; ').forEach(cookie => {
            let parts = cookie.splitTrim('=')
            if (parts.length < 2 || !parts[0]) {
                return
            }
            let key = decodeURIComponent(parts[0])
            // 有可能是  k=xxx=xxx; k=v; k;
            data[key] = decodeURIComponent(parts.slice(1).join('='))
        })

        return data
    }

    /**
     *
     * @param {string} key
     * @return {any}
     */
    getItem(key) {
        if (!this.available() || !document.cookie) {
            return
        }
        const all = this.getAll()
        return all && typeof all[key] === "string" ? all[key] : null
    }

    /**
     *
     * @param {number} index
     * @return {?string}
     */
    key(index) {
        const all = this.getAll()
        const keys = all ? Object.keys(all) : []
        return keys.length > index ? keys[index] : null
    }

    /**
     *
     * @param key
     * @param options
     * Note that this code has two limitations:
     *
     * It will not delete cookies with HttpOnly flag set, as the HttpOnly flag disables JavaScript's access to the cookie.
     * It will not delete cookies that have been set with a Path value. (This is despite the fact that those cookies will appear in document.cookie, but you can't delete it without specifying the same Path value with which it was set.)
     * @param {StorageOptions} [options]
     */
    removeItem(key, options) {
        this.setItem(key, '', map.fillUp({expires: -3600 * 48}, options))
    }


    /**
     *
     * @param {string } key
     * @param {string|number} value
     * @param {StorageOptions} [options]
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
     */
    setItem(key, value, options) {
        if (!this.available() || !key) {
            return
        }
        options = options ? options : {}
        // cookie domain 新标准已经取消了域名前面的.，   luexu.com 将会被视为 .luexu.com，可以匹配任何子域名
        if (!options.domain) {
            options.domain = location.hostname
            const [d, ok] = AaURI.parseDomainUnsafe(options.domain)
            if (ok) {
                options.domain = d
            }
        }
        if (typeof options.path === 'undefined') {
            options.path = '/'
        }
        if (typeof options.secure === 'undefined') {
            options.secure = location.protocol === "https"
        }

        // Lax 允许部分第三方跳转过来时请求携带Cookie；Strict 仅允许同站请求携带cookie
        // 微信授权登录，跳转回来。如果是strict，就不会携带cookie（防止csrf攻击）；而lax就会携带。
        // 在 Lax 模式下只会阻止在使用危险 HTTP 方法进行请求携带的三方 Cookie，例如 POST 方式。同时，使用 Js 脚本发起的请求也无法携带三方 Cookie。
        // 谷歌默认 sameSite=Lax
        if (typeof options.sameSite === 'undefined') {
            options.sameSite = 'Lax'
        }
        if (typeof options.expires === 'number') {
            options.expires = new Date(Date.now() + options.expires)  // 多少ms后过期
        }
        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString()
        }
        let s = ''
        for (const [k, v] of Object.entries(options)) {
            if (!v) {
                continue
            }
            s += '; ' + k
            if (v === true) {
                continue
            }
            // Considers RFC 6265 section 5.2:
            // ...
            // 3.  If the remaining unparsed-attributes contains a %x3B (";")
            //     character:
            // Consume the characters of the unparsed-attributes up to,
            // not including, the first %x3B (";") character.
            // ...
            s += '=' + v.split(';')[0]
        }
        key = encodeURIComponent(key)
        document.cookie = key + '=' + encodeURIComponent(value) + s
    }
}


class AaStorageEngine {
    name = 'aa-storage-engine'

    static DefaultSeparator = ':'
    static DefaultSubSeparator = '.'

    /** @type {number} */
    defaultExpiresIn

    ttlDiffKey = `aa${AaStorageEngine.DefaultSeparator}storage${AaStorageEngine.DefaultSeparator}ttld`
    ttlUnit = time.Minute

    #storage
    #persistentNames = []
    #withOptions = false

    // 是否封装value格式
    #encapsulate = false


    get length() {
        return this.#storage.length
    }

    get instanceName() {
        const s = this.#storage
        if (s === localStorage) {
            return 'window.localStorage'
        }
        if (s === sessionStorage) {
            return 'window.sessionStorage'
        }
        return s.name
    }
    get persistentName() {
        return this.#persistentNames
    }
    // cookie 不能使用 : 等分隔符作为key，因此不同Engine里面自己指定分隔符
    // 冒号 : 是特殊分隔符，默认都是 : 隔开
    get separator() {
        return string(this.#storage, 'separator', AaStorageEngine.DefaultSeparator)
    }

    get subSeparator() {
        return string(this.#storage, 'subSeparator', AaStorageEngine.DefaultSubSeparator)
    }

    // 不用报错，正常人也不会这么操作
    // set length(name) {
    //     throw new SyntaxError("storage length is readonly")
    // }


    /**
     * @param {Storage|function|object} storage
     * @param {[string]} [persistentNames]
     * @param {boolean} [withOptions]
     * @param {boolean} [encapsulate]
     * @param {number} [defaultExpiresIn]
     */
    constructor(storage, persistentNames, withOptions, encapsulate, defaultExpiresIn = 0) {
        this.#storage = storage
        if (typeof persistentNames !== "undefined") {
            this.setPersistentNames(persistentNames)
        }
        if (typeof withOptions === "boolean") {
            this.#withOptions = withOptions
        }
        if (typeof encapsulate === "boolean") {
            this.#encapsulate = encapsulate
        }
        this.defaultExpiresIn = int54(defaultExpiresIn);
    }

    /**
     * Clear all data except persistent data from this storage
     * @param {boolean} force
     */
    clear(force = false) {
        this.clearExcept(undefined, force)
    }


    /**
     * Clear all data except persistent data and ignores data from this storage
     * @param {(string|RegExp)[]} [ignores]
     * @param {boolean} force
     */
    clearExcept(ignores, force = false) {
        let keepData = ignores ? [...ignores] : []
        if (!force) {
            const pers = this.getPersistentValues()
            keepData = pers ? keepData.concat(Object.keys(pers)) : keepData
        }

        if (len(keepData) === 0) {
            this.#storage.clear()
            return
        }

        this.forEach((key, _) => {
            if (!arrays.contains(keepData, key)) {
                log.debug(this.instanceName, "DELETE", key, keepData[key])
                this.#storage.removeItem(key)
            }
        })
    }


    cleanExpired() {
        if (!this.#encapsulate) {
            return
        }
        const keys = Object.keys(this.#storage)
        if (!keys) {
            return
        }
        // 要保持外面forEach 进行删除操作时安全，就必须要遍历一个独立的数组，而不是直接遍历并操作原数组（破坏序列）
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            let value = this.#storage.getItem(key)
            this.decodeValue(key, value)  // will remove expired data

        }
    }

    convertExpires(expires) {
        if (expires instanceof Date) {
            expires = expires.valueOf() - Date.now()
        }
        if (typeof expires !== 'number') {
            return ''
        }
        expires /= this.ttlUnit
        this.#getTtlStartTime()
        return String(expires)
    }


    /**
     *
     * @param {string} key
     * @param value
     * @param {number} ttlUnit
     * @return {{ttl: number, persistent: boolean, value}}   [value, expired]
     *  ttl(Time to live): returns the remaining time (in this.ttlUnit) to live of a key that has a timeout
     */
    decodeValue(key, value, ttlUnit = time.Second) {
        let ttl = 0
        let persistent = false
        if (!this.#encapsulate || typeof value !== "string") {
            return {value, persistent, ttl}
        }
        let match = value.match(/^(.*)\s\|([a-zA-Z])(\d*)$/)
        if (!match) {
            this.removeItem(key)  // 异常数据，清除为妙
            return {value: null, persistent, ttl}
        }
        value = match[1]
        let type = match[2]
        persistent = type >= 'A' && type <= 'Z'

        ttl = this.#ttl(number(match[3]), ttlUnit)
        switch (type.toLowerCase()) {
            case types.alias._serializable:
                let arr = value.split('::')
                let className = arr[0]
                value = arr.slice(1).join('::')
                try {
                    value = AaHack.class(className).serialize(value)
                } catch (err) {
                    this.removeItem(key)
                    return {value: null, persistent, ttl}
                }
                break
            case types.alias.array:
            case types.alias.struct:
                try {
                    value = JSON.parse(value)
                } catch (error) {
                    log.error(`storage parse ${value} failed: ${error}`)
                }
                break
            case types.alias.bigint:
                value = BigInt(value)
                break
            case types.alias.boolean:
                value = bool(value)
                break
            case types.alias.null:
                value = (value === "null") ? null : undefined
                break
            case types.alias.number:
                value = int54(value)
                break
            case types.alias.date:
                value = new Date(value)
                break
            case types.alias.regexp:
                value = new RegExp(value)
                break
            case types.alias.string:
                break
        }
        if (typeof value === 'undefined' || (ttl !== null && ttl < 0)) {
            this.removeItem(key)
            value = null
        }
        return {value, persistent, ttl}
    }


    /**
     * @param {any} value
     * @param {StorageOptions} [options]
     * @return {string}
     */
    encodeValue(value, options) {
        let ok = true;
        let typeAlias

        if (types.isSerializable(value)) {
            typeAlias = types.alias._serializable
            const className = value.constructor.name
            value = value.serialize()
            value = className + '::' + value
        } else {
            const type = types.of(value)
            typeAlias = types.aliasOf(type)
            switch (type) {
                case types.number:
                    break
                case types.boolean:
                    value = booln(value)
                    break;
                case types.array:
                case types.class:
                case types.struct:
                    value = strings.json(value)
                    break;
                case types.date:
                    value = value.valueOf()
                    break;
                case types.function:
                case types.undefined:
                    ok = false
                    break;
            }
        }

        if (!ok) {
            return string(value)
        }
        const persistent = bool(options, 'persistent')
        let expires = this.convertExpires(defval(options, 'expires'))

        if (bool(persistent)) {
            typeAlias = typeAlias.toUpperCase()
        }

        value = value + ' |' + typeAlias + string(expires)
        return value
    }


    /**
     * Iterate storage
     * @param {ForEachCallback} callback
     * @param {boolean} [raw]
     */
    forEach(callback, raw = false) {
        if (typeof this.#storage.forEach === "function") {
            return this.#storage.forEach(callback)
        }
        let result = []
        const keys = Object.keys(this.#storage)
        if (!keys) {
            return result
        }
        // 要保持外面forEach 进行删除操作时安全，就必须要遍历一个独立的数组，而不是直接遍历并操作原数组（破坏序列）
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let value = raw ? this.#storage.getItem(key) : this.getItem(key)
            const r = callback(key, value)
            if (r === BREAK) {
                break
            }
            result.push(r)
        }
        return result
    }

    getAll() {
        if (this.length === 0) {
            return null
        }
        if (typeof this.#storage.getAll === "function") {
            return this.#storage.getAll()
        }
        let data = {}
        this.forEach((key, value) => {
            data[key] = value
        })
        return data
    }

    getTtlStartTime(unit = this.ttlUnit) {
        let diff = this.#getTtlStartTime()
        return unit === this.ttlUnit ? diff : diff * this.ttlUnit / unit
    }

    /**
     * Get item, returns null on not exists
     * @param {string} key
     * @return {null|*}
     */
    getItem(key) {
        let raw = this.#storage.getItem(key)
        const {value} = this.decodeValue(key, raw)  // decodeValue will remove expired key
        return value
    }


    /**
     * Get items matched with key
     * @param {RegExp} reg
     */
    getItems(reg) {
        let items = {}
        this.forEach((key, value) => {
            if (reg.test(key)) {
                items[key] = value
            }
        })
        return items.length === 0 ? null : items
    }

    getPersistentValues() {
        let items = {}
        // 这里是是获取raw数据
        this.forEach((key, value) => {
            if (array(aparam, 'PersistentNames').includes(key)) {
                items[key] = value
                return CONTINUE
            }
            if (this.#persistentNames.includes(key)) {
                items[key] = value
                return CONTINUE
            }
            if (typeof value === 'undefined') {
                return CONTINUE
            }
            const {persistent, ttl} = this.decodeValue(key, value)
            if (persistent && ttl > 0) {
                items[key] = value
            }
        }, true)

        return len(items) > 0 ? items : null
    }

    /**
     * Get item with ttl
     * @param {string} key
     * @param {TimeUnit} unit
     * @return {{ttl: number, persistent: boolean, value}}
     *   ttl(Time to live): returns the remaining time (in this.ttlUnit) to live of a key that has a timeout
     */
    getTTL(key, unit = time.Second) {
        let raw = this.#storage.getItem(key)
        return this.decodeValue(key, raw, unit)  // decodeValue will remove expired key
    }

    key(index) {
        return this.#storage.key(index)
    }

    /**
     * Set Item
     * @param {string} key
     * @param {any} value
     * @param {StorageOptions} [options]
     */
    setItem(key, value, options) {

        if (this.defaultExpiresIn > 0) {
            options = map.setNotExist(options, 'expires', this.defaultExpiresIn)
        }
        if (this.#encapsulate) {
            value = this.encodeValue(value, options)
        }
        if (/data:image\/\w+;\s*base64/i.test(value) && not(options, "base64Image")) {
            log.debug(`${this.name} setItem ${key} ignore ${value}`)
            return
        }

        const args = this.#withOptions && options ? [key, value, options] : [key, value]
        this.#storage.setItem(...args)
    }

    /**
     * Set items in key:value pairs
     * @param {struct} items
     * @param {StorageOptions} [options]
     */
    setItems(items, options) {
        for (let [key, value] of Object.entries(items)) {
            this.setItem(key, value, options)
        }
    }

    /**
     * @param {string[]} persistentNames
     */
    setPersistentNames(persistentNames) {
        this.#persistentNames = persistentNames ? persistentNames : []
        return this
    }

    saveFromSearch(names, search=location.search){
        const query = new URLSearchParams(search)
        let items = {}
        for (const name of names){
            if (query.has(name)) {
                items[name] = query.get(name)
            }
        }
        if (len(items)>0) {
            this.setItems(items)
        }
        return this
    }
    /**
     * save parameters from url search params
     * @param search
     * @param ignores
     */
    savePersistentFromSearch(search = location.search, ignores=[]) {
        const names = this.#persistentNames
        if(len(names)===0 || len(ignores)===0) {
            return this.saveFromSearch(array(names))
        }
        let newNames = []
        for (const name of names){
            if (!ignores.includes(name)) {
                newNames.push(name)
            }
        }
        return this.saveFromSearch(newNames)
    }

    /**
     * Remove item from this storage
     * @param {string} key
     * @param {StorageOptions} [options]
     */
    removeItem(key, options) {
        const args = this.#withOptions && options ? [key, options] : [key]
        this.#storage.removeItem(...args)

    }

    /**
     * Remove items matched with key
     * @param {RegExp} key separator colon ':' is wildcard separator. it matches the engine's separator and subSeparator
     * @param {StorageOptions} [options]
     */
    removeItems(key, options) {
        let wild = null
        const sep = this.separator
        const sub = this.subSeparator
        let source = key.source
        if ((sep !== AaStorageEngine.DefaultSeparator || sub !== AaStorageEngine.DefaultSubSeparator) && source.indexOf(':') > -1) {
            source = source.replaceAll(':', '[' + `${sep}${sub}`.toRegSource() + ']')
            wild = new RegExp(source)
        }

        this.forEach((k,) => {
            if (key.test(k) || (wild && wild.test(k))) {
                const args = this.#withOptions && options ? [k, options] : [k]
                this.#storage.removeItem(...args)
            }
        })
    }

    /**
     * @return {number}
     */
    #getTtlStartTime() {
        const key = this.ttlDiffKey
        // here must use the native getItem method
        let diff = this.#storage.getItem(key)
        try {
            diff = Number(diff)
        } catch (err) {
            diff = 0
        }
        if (!diff) {
            // expires for client is not important
            diff = Math.ceil(Date.now() / this.ttlUnit)
            this.#storage.setItem(key, diff)
        }
        return diff
    }

    /**
     *
     * @param {number} s  0 是不会存储的
     * @param {number} unit
     * @return {number}
     */
    #ttl(s, unit = time.Second) {
        // ttl will never be 0, except convert empty string to 0
        // empty string ttl will be never expired
        if (!s) {
            return Math.floor(365 * 24 * 3600 * time.Second / unit)
        }
        const startTime = this.getTtlStartTime(time.Millisecond)
        const now = Date.now()
        const ttl = Number(s) * this.ttlUnit
        return Math.floor((startTime + ttl - now) / unit)
    }

}


class AaStorageFactor {
    name = 'aa-storage-factor'
    static DailyCleanSessionKey = 'aa:storage:daily_clean'

    /** @type {AaStorageEngine} */
    local
    /** @type {AaStorageEngine} */
    session
    /** @type {AaStorageEngine} */
    cookie


    get length() {
        return this.local.length + this.session.length + this.cookie.length
    }

    /**
     *
     * @param {Storage|AaStorageEngine} [cookieStorage]
     * @param {Storage|AaStorageEngine} [localStorage]
     * @param {Storage|AaStorageEngine} [sessionStorage]
     */
    constructor(cookieStorage, localStorage, sessionStorage) {
        localStorage = localStorage ? localStorage : window.localStorage
        sessionStorage= sessionStorage ? sessionStorage : window.sessionStorage
        cookieStorage=cookieStorage ? cookieStorage : new AaCookieStorage()
        this.local = localStorage instanceof AaStorageEngine ? localStorage : new AaStorageEngine(localStorage, [], false, true, 7 * time.Day)
        this.session = sessionStorage instanceof AaStorageEngine ? sessionStorage : new AaStorageEngine(sessionStorage, [], false, true)
        this.cookie = cookieStorage instanceof AaStorageEngine ? cookieStorage : new AaStorageEngine(cookieStorage, [], true, false)
        this.cleanExpired()
    }

    cleanExpired() {
        const cleaned = this.session.getItem(AaStorageFactor.DailyCleanSessionKey)
        if (cleaned) {
            return
        }
        this.local.cleanExpired()
        this.session.cleanExpired()
        // this.cookie.cleanExpired()
        this.session.setItem(AaStorageFactor.DailyCleanSessionKey, 1)
    }

    /**
     * Get item from all storages
     * @param {string} key
     */
    getEntire(key) {
        let value = this.cookie.getItem(key)
        if (value) {
            return value
        }

        value = this.session.getItem(key)
        if (value) {
            return value
        }

        return this.local.getItem(key)
    }



    /**
     * Remove items from all storages
     * @param {string|RegExp} key  separator colon ':' is wildcard separator. it matches the engine's separator and subSeparator
     * @param [options]
     */
    removeEntire(key, options) {
        if (key instanceof RegExp) {
            this.local.removeItems(key, options)
            this.session.removeItems(key, options)
            this.cookie.removeItems(key, options)
        } else {
            this.local.removeItem(key, options)
            this.session.removeItem(key, options)
            this.cookie.removeItem(key, options)
        }
    }

    /**
     * Clear from all storages
     * @param {boolean} force
     */
    clearAll(force = false) {
        this.local.clear(force)
        this.session.clear(force)
        this.cookie.clear(force)
    }

    /**
     * Clear all data except some fields from all storages
     * @param {(string|RegExp)[]} [ignores] ignore these fields
     */
    clearAllExcept(ignores) {
        this.local.clearExcept(ignores)
        this.session.clearExcept(ignores)
        this.cookie.clearExcept(ignores)
    }

    /**
     * Iterate all storages in the order of localStorage, sessionStorage,  CookieStorage
     * @param {ForEachCallback} callback
     * @param {struct} [options] cookie options
     */
    forEachEntire(callback, options) {
        this.local.forEach(callback)
        this.session.forEach(callback)
        this.cookie.forEach(callback)
    }
}