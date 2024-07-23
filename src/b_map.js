// @import atype

// 自定义map类型  参考 Map
class map {
    name = 'aa-map'

    object // {{[key:string]:*} | FormData| string}

    // len() 函数会识别这个
    len() {
        return this.keys().length
    }

    init(o) {
        this.object = map.parse(o)
    }

    /**
     * @param {{[key:string]:*} | string} o
     */
    constructor(o = {}) {
        this.init(...arguments)
    }


    /**
     * Sort this map
     * @return {map}
     */
    sort() {
        let ks = this.keys().sort();
        let sortedObj = {};
        for (let i = 0; i < ks.length; i++) {
            sortedObj[ks[i]] = this.object[ks[i]];
        }
        this.object = sortedObj
        return this
    }

    toString() {
        return JSON.stringify(this.object)
    }

    toQueryString(assert, sort = true) {
        let params = [];
        this.forEach((k, v) => {
            if (k === "" || typeof v === "undefined" || v === null) {
                return
            }
            if (typeof assert === "function" && assert(k, v)) {
                return
            }
            if (Array.isArray(v)) {
                v = v.join(",")  // url param，数组用逗号隔开模式
            }
            v = encodeURIComponent(string(v))
            params.push(k + '=' + v)
        }, sort)
        return params.join('&')
    }


    entries() {
        return Object.entries(this.object)
    }

    forEach(callback, sort = false) {
        // 这种方式forEach 中进行删除未遍历到的值是安全的
        if (!sort) {
            for (let [k, v] of this.entries()) {
                callback(k, v)
            }
            return
        }
        let keys = this.keys().sort()
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i]
            callback(k, this.get(k))
        }
    }

    has(key, allowUndefined = false) {
        return this.object.hasOwnProperty(key) && (allowUndefined || typeof this.object[key] != "undefined")
    }

    get(key, cast = string) {
        let v = this.has(key) ? this.object[key] : void 0
        return cast(v)
    }

    keys() {
        return Object.keys(this.object)
    }

    values() {
        return Object.values(this.object)
    }

    clear() {
        this.object = {}
    }

    delete(key) {
        delete this.object[key]
    }

    set(key, value) {
        if (!key) {
            return
        }
        this.object[key] = value
    }

    getOrSet(key, defaultValue, allowUndefined = false) {
        if (!this.has(key, allowUndefined)) {
            this.set(key, defaultValue)
        }
        return this.get(key)
    }

    /**
     *
     * @param {map|{[key:string]:*}} obj
     */
    extend(obj) {
        if (obj instanceof map) {
            obj.forEach((k, v) => {
                this.set(k, v)
            })
            return
        }
        if (!obj || typeof obj !== "object") {
            return this
        }
        for (let [k, v] of Object.entries(obj)) {
            this.set(k, v)
        }
        return this
    }

    // 深度复制
    clone(deep = true) {
        let obj = deep ? map.clone(this.object) : {...this.object}
        return new map(obj)
    }

    /**
     * 解析json或{} 为 {}
     * @param obj
     * @returns {{[key:string]:any}}
     */
    static parse(obj) {
        if (!obj) {
            return {}
        }
        if (obj instanceof FormData) {
            let o = {}
            for (const pair of obj.entries()) {
                o[pair[0]] = pair[1]
            }
            return obj
        }
        if (typeof obj === "object") {
            return obj
        }
        try {
            return JSON.parse(obj)
        } catch (e) {
            console.error("invalid new map object", obj)
        }
        return {}
    }

    /**
     * Clone an object 深度复制一个对象；浅复制，就自行  newObj  = {...obj}
     * @param obj
     * @returns {any}
     */
    static clone(obj) {
        return obj ? JSON.parse(JSON.stringify(obj)) : obj
    }

    /**
     * Merge the contents of two objects together into the first object based on the properties of the first object
     * @description 以第一个对象target的属性为基础，使用后面sources对象与target相同属性名覆盖，抛弃sources对象多余属性值。常用于配置文件填充
     * @param {{[key:string]:*}} target A --> 会污染 target。 target 可以是struct，也可以是class.
     * @param {{[key:string]:*}} source B
     * @return {object|{[key:string]:*}}   A = A  ∪ (A ∩ B)
     */
    static merge(target, source) {
        for (let [k, v] of Object.entries(struct(source))) {
            // 定义不存在undefined。undefined当作特殊情况过滤；
            if (typeof v !== "undefined" && target.hasOwnProperty(k)) {
                target[k] = v
            }
        }
        return target
    }

    /**
     * Merge the contents of two objects together into the first object based on the properties and their types of the first object
     * @description 以第一个对象target的属性为基础，使用后面sources对象与target相同属性名且值类型相同的覆盖，抛弃sources对象多余属性值
     *      常用于配置文件填充
     * @param {object|{[key:string]:*}} target A --> 会污染 target。 target 可以是struct，也可以是class.
     * @param {{[key:string]:*}}  source B
     * @return  {object|{[key:string]:*}}     A = A ∪ (|A| ∩ |B|)
     */
    static strictMerge(target, source) {
        for (let [k, v] of Object.entries(struct(source))) {
            if (typeof v === "undefined" || !target.hasOwnProperty(k)) {
                continue
            }
            let t = target[k]
            // type consistency, except undefined/null (unknown type)
            if (typeof t === "undefined" || t === null || v === null || typeof v === typeof t) {
                target[k] = v
            }
        }
        return target
    }

    /**
     *
     * @param target A
     * @param source B
     * @return {*}    A = A ∪ B
     */
    static assign(target, source) {
        return Object.assign(struct(target), struct(source))
    }

    /**
     * Merge two objects into a new object
     * @description 合并两个对象属性，若出现相同属性，则后者b的该属性覆盖前者a的该属性。若想相反覆盖，则调换位置即可
     * @param {{[key:string]:*}} target A
     * @param {{[key:string]:*}} source B
     * @returns {{[key:string]:*}}      C = A ∪ B
     */
    static spread(target, source) {
        return Object.assign({}, struct(target), struct(source))// 等同于{...struct(target), ...struct(source)}
    }

    /**
     * Fill up the non-existent properties of the first object with the second object's
     * @description 将两个对象的差集填充进target对象。通常用于填充默认配置。
     * @param {{[key:string]:*}} target   A --> 会污染 target
     * @param {{[key:string]:*}} defaults B
     * @param {function} [handler]
     * @return  {object|{[key:string]:*}}    A = A ∪ (A - B)
     */
    static fillUp(target, defaults, handler) {
        target = struct(target)
        if (typeof handler !== "function") {
            handler = (k, v, target) => {
                if (typeof target[k] === "undefined") {
                    target[k] = v
                }
            }
        }
        for (let [k, v] of Object.entries(struct(defaults))) {
            handler(k, v, target, defaults)
        }
        return target
    }

    /**
     * Overwrite the target object's content with source object based on the target object's properties,
     *      and zeroize the target object's properties before overwriting.
     * @description 将两个对象的交集填充进target，将target其他属性设为零值。通常重新填充配置target。
     * @param {object|{[key:string]:*}} target A --> 会污染 target。
     * @param {{[key:string]:*}}  source B --> probably it's a configuration struct ，后者往往是配置项，覆盖掉前者
     * @param {function} keynameConvertor convert properties' field names in source object
     * @return {object|{[key:string]:*}} A = (A ∩ B) ∪ zeroize(A)
     */
    static overwrite(target, source, keynameConvertor) {
        let fields = target.hasOwnProperty('_fields_') && target._fields_ ? target._fields_ : target.constructor['_fields_'] ? target.constructor['_fields_'] : null
        for (let [k, v] of Object.entries(source)) {
            let keyname = typeof keynameConvertor === "function" ? keynameConvertor(k) : k
            if (!target.hasOwnProperty(keyname)) {
                for (let [k2, _] of Object.entries(target)) {
                    // "base_url" ===> baseUrl  or  baseURL
                    if (k2.toLowerCase() === k.toLowerCase()) {
                        keyname = k2
                        break
                    }
                }
            }
            if (keyname === '_fields_' || !target.hasOwnProperty(keyname)) {
                continue
            }

            // filter by target._fields_
            if (fields && !fields.includes(k) && !fields.includes(keyname)) {
                continue
            }

            if (typeof v === "undefined") {
                target[keyname] = atype.zeroize(target[keyname])
            } else {
                target[keyname] = typeof target[keyname] === "number" ? number(v) : v
            }
        }
        return target
    }
}