/** @typedef { "array"|"boolean"|"class"|"date"|"dom"|"function"|"null"|"number"|"struct"|"string"|"undefined"|"regexp"} atypes */

//  react state  数字 001231 === 1231 == 001231.000  这些数值都没有变化，state就不会触发

class types {
    static array = "array"
    static bigint = 'bigint'
    static boolean = "boolean"
    static class = "class"
    static date = "date"
    static dom = "dom"
    static function = "function"
    static null = "null"
    static number = "number"
    static struct = "struct"
    static string = "string"
    static undefined = "undefined"
    static regexp = "regexp"


    // 类型别名
    static alias = {
        array    : "a",
        boolean  : "b",
        class    : "c",
        date     : "d",
        function : "f",
        dom      : "h",
        bigint   : 'i',
        null     : "l",
        struct   : "m",
        number   : "n",
        regexp   : "r",
        string   : "s",
        undefined: "u",

        _serializable: 'z'         // 特殊类，可以序列化为JSON字符串，并且将字符串对应的JSON作为构造参数，自动还原
    }

    // 缩短类型为1个字符
    static aliasOf(t) {
        if (typeof t === "undefined") {
            return types.alias.undefined
        }
        if (t === null) {
            return types.alias.null
        }
        if (typeof t !== "string") {
            t = types.of(t)
        }
        return types.alias[t] ? types.alias[t] : types.alias.undefined
    }


    /**
     * Check if any of these arguments is not the type
     * @param type
     * @param args
     * @return {boolean}
     */
    static anyNot(type, ...args) {
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] !== type && types.of(args[i]) !== type) {
                return true
            }
        }
        return false
    }

    /**
     * Check if any of these arguments is undefined
     * @param args
     * @return {boolean}
     */
    static anyUndefined(...args) {
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] === 'undefined') {
                return true
            }
        }
        return false
    }

    /**
     * Check if any of these arguments is zero-value
     * @param args
     * @return {boolean}
     */
    static anyZero(...args) {
        for (let i = 0; i < args.length; i++) {
            if (!args[i]) {
                return true
            }
        }
        return false
    }


    // 对象 a={}   !a 为 false。。  a =={} 也是 false
    static isEmpty(...args) {
        let v = defval(...args)
        if (v === null) {// 不要用 AaLib.Type 判断是否 undefined
            return true
        }

        switch (types.of(v)) {
            case types.array:
                return v.length === 0
            case types.bigint:
                return v <= 0
            case types.boolean:
                return !v
            case types.class:
                return false
            case types.date:
            case types.dom:
            case types.function:
                return false
            case types.null:
                return true
            case types.number:
                return v <= 0
            case types.struct:
                v = Object.keys(v)
                return v.length === 0
            case types.string:
                return v === ""
        }
        return !v
    }

    static notEmpty(...args) {
        return !types.isEmpty(...args)
    }

    /**
     * @param {vv_vk_defaultV} args
     * @return {boolean}
     */
    static isDom(...args) {
        return types.of(...args) === "dom"
    }

    /**
     * @param {vv_vk_defaultV} args
     * @return {boolean}
     */
    static isSerializable(...args) {
        const v = defval(...args)
        if (!v || !v.constructor || !v.constructor.name) {
            return false
        }
        if (typeof v.serialize !== 'function') {
            return false
        }
        return AaHack.staticCallable(v.constructor.name, 'unserialize')
    }

    /**
     * @param {vv_vk_defaultV} args
     * @return {boolean}
     * @note 仅为 {} 结构体；不要用 typeof arr === "object" 判定是否是结构体，因为 typeof [] 也是 object。而 AaType.Of([]) 为array, AaType.Of({}) 为 object
     */
    static isStruct(...args) {
        return types.of(...args) === "struct"
    }


    /*

"array", "boolean", "date", "dom", "function", null, "number", "struct", "string", "undefined", "regexp" "class"
/[a-z]/.constructor
"John".constructor                // Returns function String(){[native code]}
(3.14).constructor                // Returns function Number(){[native code]}
false.constructor                 // Returns function Boolean(){[native code]}
[1,2,3,4].constructor             // Returns function Array(){[native code]}
{name:'John',age:34}.constructor  // Returns function Object(){[native code]}
new Date().constructor            // Returns function Date(){[native code]}
function () {}.constructor        // Returns function Function(){[native code]}
NaN.constructor                     ƒ Number(){ [native code] }
HTMLAnchorElement  / HTMLCollection     dom
jQuery dom     // function(e,t){return new c.fn.init(e,t)}
class   // Returns function XXX()
*/

    // @notice 不要用 AaLib.Type 判断是否 undefined；用 typeof(n) === "undefined" 更适合
    static of(v, ...args) {
        if (args.length > 0) {
            if (typeof v !== "object" || v === null) {  // typeof null is object
                return types.null
            }
            let k = args[0]
            if (!v.hasOwnProperty(k)) {
                return types.undefined
            }
            v = v[k]
        }
        if (v === null) {
            return types.null
        }
        if (Array.isArray(v)) {
            return types.array
        }
        let t = typeof v
        if ([types.boolean, types.function, types.number, types.string, types.undefined].includes(t)) {
            return t
        }

        // Safari replace 总是出幺蛾子！！！
        let typ = v.constructor.toString().toLowerCase()
        typ = typ.replace(/.*function\s+([a-z]+)\s*\(\)\s*{\s*\[[^\]]+]\s*}.*/, "$1")
        typ = typ.trim()
        if (typ.length > 9) {
            // 使用 new Cls()
            if (typ.indexOf("_classcallcheck") > 0) {
                return types.class
            }
            if (typ.substring(0, 4) === "html" || $(v).length > 0) {
                typ = types.dom
            }
        }
        return typ === "object" ? types.struct : typ
    }

    static toStringCallable(v) {
        if (v && typeof v.toString === 'function') {
            return v.toString().indexOf('[object ') !== 0
        }
        return false
    }

    /**
     * Zeroize a value
     * @param v
     * @param {boolean} [nullable]
     */
    static zeroize(v, nullable = false) {
        if (!v) {
            return v
        }
        if (typeof v === "string") {
            if (/^\d{4}-[01]\d-[03]\d[\sT][0-2]\d:[0-5]\d:[0-5]\d$/.test(v)) {
                return '0000-00-00 00:00:00'
            }
            return /^\d{4}-[01]\d-[03]\d$/.test(v) ? '0000-00-00' : ''
        }
        switch (types.of(v)) {
            case types.array:
                return nullable ? null : []
            case types.bigint:
                return 0n
            case types.boolean:
                return false
            case types.class:
                return null
            case types.date:
                return null
            case types.dom:
                return null
            case types.function:
                return nullable ? null : nif
            case types.null:
                return null
            case types.number:
                return 0
            case types.struct:
                v = nullable ? null : {}
                return v.length === 0
            case types.string:
                return ""
        }
        return typeof v === "object" ? null : undefined
    }

}


//  防止直接用 for( < len(x)) 导致异常
/**
 * Get length of anything
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 */
function len(...args) {
    let v = defval(...args)
    if (typeof v === "undefined" || v === null) {
        return 0
    }
    if (typeof v === "number" || typeof v === 'string') {
        return string(v).length  // String(undefined) ===>  "undefined"
    }
    if (Array.isArray(v)) {
        return v.length    // s.match() 必须不可用下面，否则长度会多
    }

    /**
     * Check if .len is a getter insteadof property
     * @note special method
     *  get len(){}
     */
    if (typeof v === 'object' && !v.hasOwnProperty('len') && Object.getPrototypeOf(v).hasOwnProperty('len')) {
        const l = v.len
        if (typeof l === 'number') {
            return l
        }
    }

    return Object.keys(v).length  // support string,array, object
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {function}
 * @ignore
 */
function func(...args) {
    let v = defval(...args)
    if (typeof v === "function") {
        return v
    }
    return nif
}


function _inRange(x, min, max, name) {
    if ((typeof min !== 'undefined' && x < min) || (typeof max !== 'undefined' && x > max)) {
        if (!name) {
            name = `[${min}, ${max}]`
        }
        let msg = x + " can't be converted to " + name
        throw new RangeError(msg)
    }
    return x
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {boolean}
 * @ignore
 */
function bool(...args) {
    /** @type {Bool} */
    let v = defval(...args)
    if (v === null) {// 不要用 AaLib.Type 判断是否 undefined
        return false
    }

    switch (typeof v) {
        case "number":
            return v > 0
        case "boolean":
            return v
        case 'function':
            return !!v()
        case "string":
            v = v.trim().toLowerCase()
            if (v === "") {
                return false
            }
            // html readonly="readonly" 这种情况是 true
            // bool("null")  ===>  false       "null" 是 false 词汇
            // bool({null:"null"}, "null")  ===>  true
            if (args.length > 0 && (args[0] + '').toLowerCase() === v) {
                return true
            }

            /*
                     null
             TRUE -> false
             T -> F
             1    -> 0
             yes   -> no
             on  -> off  // html attribute 会用到
             */
            return !["false", "f", "0", "no", "off", "null"].includes(v)
    }
    return !!v
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {0|1}
 * @ignore
 */
function booln(...args) {
    return bool(...args) ? 1 : 0
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {boolean}
 * @ignore
 */
function not(...args) {
    return !bool(...args)
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {string}
 * @ignore
 */
function string(...args) {
    let v = defval(...args)
    if (v === null) {
        return ''
    }
    if (typeof v === 'string') {
        return v
    }
    // toJSON 一定是最终数据
    if (typeof v.toJSON === "function") {
        return '' + v.toJSON()
    }


    // array, AaImgSrc, Decimal, Money, Percent, VMoney, Time, Date
    // [1,2,3].toString() ==> 1,2,3
    // Time toString 更接近 toJSON，比 valueOf() 更适合
    if (typeof v.toString === "function" && v.toString().indexOf('[object ') !== 0) {
        return v.toString()
    }
    // time, Date
    if (typeof v.valueOf === "function") {
        return '' + v.valueOf()
    }

    if (typeof v === 'function') {
        v = v()
    }
    if (typeof v === 'object') {
        let s = strings.json(v)
        return s ? s : v
    }
    return '' + v
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 * @note js 数字全部是采用的双精度浮点数存储的。 js number 最大值是：9007199254740992
 * @ignore
 */
function number(...args) {
    return Number(defval(...args))
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 * @ignore
 */
function float64(...args) {
    return number(...args)
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 * @ignore
 */
function float32(...args) {
    return float64(...args)
}


/**
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 * @ignore
 * @note 暂时不允许 int64，后端所有int64范围都应该保持载 int54范围内
 *  int64   [-2^63,       2^63 -1]
 *  int54   [-(2^53 - 1), 2^53 – 1]    ===> [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
 *  timestamp [0, 2^38]
 */
function int54(...args) {
    return Math.floor(number(...args))
}


/**
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 */
function int32(...args) {
    return _inRange(int54(...args), -2147483648, 2147483647, 'int32')
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 */
function int24(...args) {
    return _inRange(int54(...args), -8388608, 8388607, 'int24')
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 */
function int16(...args) {
    return _inRange(int54(...args), -32768, 32767, 'int16')
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 */
function int8(...args) {
    return _inRange(int54(...args), -128, 127, 'int8')
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {string} bigint 可以跟number比较，但是不可以直接计算
 * 是否使用BigInt:
 *  pros: BigInt无法直接在React及JSON.stringify()中使用，必须要先 .toString()
 *  cons: BigInt 比较大小更方便
 * @note BigInt 可以直接跟number比较，但是
 *      BigInt(0) === 0  ===> false
 *      BigInt(0) > 0    ===> false
 *      BigInt(0) < 0    ===> false
 *      BitInt(0) === 0n ===> true
 *   !BigInt(0) === true;   !BigInt(1) === false
 */
function uint64(...args) {
    let v = defval(...args)
    v = !v ? "0" : string(v)
    return v
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 */
function uint32(...args) {
    return _inRange(int54(...args), 0, 4294967295, 'uint32')
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 */
function uint24(...args) {
    return _inRange(int54(...args), 0, 16777215, 'uint24')
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 */
function uint16(...args) {
    return _inRange(int54(...args), 0, 65535, 'uint16')
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {number}
 */
function uint8(...args) {
    return _inRange(int54(...args), 0, 255, 'uint8')
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {struct}
 */
function struct(...args) {
    let v = defval(...args)
    if (v === null || typeof v !== "object") {
        return {}
    }
    if (Array.isArray(v)) {
        return {...v} // 数组转 object，如果用这种方法转化struct，会重新开辟内存
    }
    return v
}

/**
 * @param {vv_vk_defaultV} [args]
 * @return {array}
 */
function array(...args) {
    let v = defval(...args)
    if (v === null || typeof v !== "object") {
        return []
    }
    if (Array.isArray(v)) {
        return v
    }
    // Object.values 可以转化：struct, array, string，其他都转为空数组；这种方法会重新开辟内存
    return [v]
}

