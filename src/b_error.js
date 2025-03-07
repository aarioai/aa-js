/**
 * @import atype
 * @private
 */
/** @type {(null|struct)} */
let _aerrorCode2MsgMap_ = null

/** @type {{[key:string]:?struct}} */
let _aerrorDict_ = {
    'en'   : null,  // will init later   必须要增加一个en模式的，这样直接匹配到可以直接输出
    'zh-CN': {
        "please input: %s"     : "请输入：%s",
        "bad param: %s"    : "%s 输入错误",
        "invalid param: %s": "%s 输入不符合规则",


        "Ok"        : "成功",  // 200
        "No content": "成功", //204
        "Not modified": "数据未变化", //304

        "Bad request"     : "请求参数或其他错误", // 400
        "Unauthorized"    : "请登录授权后使用", // 401
        "Payment required": "请付费后使用", // 402
        "Forbidden"       : "您没有权限使用", // 403
        "Not found"       : "糟糕，数据找不到啦~", // 404
        "Not acceptable":"", // 406
        "Proxy Authentication Required":"需要代理认证", // 407
        "Timeout"           : "请求超时，请稍后再试", // 408
        "Conflict"          : "异常冲突", // 409
        "Gone"              : "数据已被删除", // 410
        "PreconditionFailed": "前置条件未满足", // 412
        "RequestEntityTooLarge":"上传数据过大", // 413
        "Unsupported media type": "文件格式不正确", // 415


        "Locked"           : "资源已被锁定", // 423
        "Failed dependency": "之前发生错误", // 424

        "Illegal"          : "因法律原因不可用", // 425

        "No rows available"          : "没有找到符合的数据", // 490
        "Retry with"       : "尝试重试",  // 491

        "Internal server error"   : "服务端错误", // 500
        "Not implemented"         : "服务未开放", // 501
        "Bad gateway"             : "上游服务异常", // 502
        "Service unavailable"        : "服务不可用", // 503
        "Gateway timeout"         : "上游服务器超时", // 504
        "Variant also negotiates"         : "服务端配置错误", // 506
        "Status exception" : "服务器状态异常", // 590
        "Client throw"            : "客户端抛出异常", // 1000
    }
};
const AErrorEnum = {
    OK       : 200,
    NoContent: 204,

    NotModified :304,

    BadRequest     : 400,
    Unauthorized   : 401,
    PaymentRequired: 402,
    Forbidden      : 403,
    NotFound       : 404,// refer to redis.Nil, sql.ErrNoRows
    NotAcceptable:406,
    ProxyAuthRequired:407,
    Timeout             : 408, // 被限流也是返回这个
    Conflict            : 409,
    Gone                : 410,              // 以前存在过，以后都不会再存在了，表示数据已经删除、过期、失效
    PreconditionFailed  : 412,
    RequestEntityTooLarge:413,
    UnsupportedMediaType: 415, // 上传的数据格式非法

    Locked          : 423,
    FailedDependency: 424,// 之前发生错误
    TooEarly        : 425, // 表示服务器不愿意冒险处理可能被重播的请求。
    TooManyRequests : 429, // 用户在给定的时间内发送了太多请求（"限制请求速率"）

    Illegal         : 451,// 该请求因政策法律原因不可用。

    // code:490, data:null   表示空数组返回这个错误，表示不可以再进行下一页查询了
    // code:200/204, data:[]  空数组，表示查询到了数据，但是数据过滤完了，可以尝试下一页查询
    NoRowsAvailable          : 490,
    RetryWith       : 491,  // 特殊错误码，msg 用于跳转
    ConflictWith    : 492, // 【自定义错误码】数据冲突，msg 是冲突的有效信息

    InternalServerError   : 500,
    NotImplemented        : 501, // 服务器不支持当前请求所需要的某个功能。当服务器无法识别请求的方法，
    BadGateway            : 502,  //
    ServerException       : 503,  // 客户端自定义，表示未知服务端错误；最常见的就是，没有正确返回数据，或者返回 {code:0,msg:""} 等未协商的数据，导致客户端无法正常处理
    GatewayTimeout        : 504,
    VariantAlsoNegotiates: 506, // 内部配置错误

    StatusException : 590,  // http 状态码出错，未达到程序阶段
    ClientThrow           : 1000, // 客户端错误；捕获js catch的报错


    /**
     *
     * @return {struct}
     */
    getCode2MsgMap: function () {
        if (_aerrorCode2MsgMap_) {
            return _aerrorCode2MsgMap_
        }
        _aerrorCode2MsgMap_ = {}
        for (const [key, value] of Object.entries(AErrorEnum)) {
            // starts with BigCase
            if (typeof key !== "string" || !/^[A-Z][a-zA-Z]*$/.test(key)) {
                continue
            }
            _aerrorCode2MsgMap_[value] = fmt.toSentenceCase(key, true)
        }
        return _aerrorCode2MsgMap_
    },
    /**
     *
     * @param {number} code
     * @param  {string|struct} [dict]
     * @return {string}
     */
    code2Msg: function (code, dict = 'zh-CN') {
        code = number(code)
        let m = AErrorEnum.getCode2MsgMap()
        let s = m[code] ? m[code] : "Status exception"
        dict = AErrorEnum.getDict(dict)
        return dict[s] ? dict[s] : s
    },

    /**
     *
     * @param  {string|struct} [dict]
     * @return {struct}
     */
    getDict: function (dict = 'zh-CN') {
        if (!_aerrorDict_['en']) {
            _aerrorDict_['en'] = {}
            for (const [key, value] of Object.entries(AErrorEnum)) {
                // starts with BigCase
                if (typeof key !== "string" || !/^[A-Z][a-zA-Z]*$/.test(key)) {
                    continue
                }
                let k = fmt.toSentenceCase(key, true)
                _aerrorDict_['en'][k] = k  // 'Bad gateway': 'Bad gateway'  就是 k:k方式，不同于上面 code2msg map
            }
        }
        let baseDict = {..._aerrorDict_}
        if (!dict) {
            dict = 'zh-CN'
        }
        if (typeof dict === 'string') {
            return len(baseDict[dict]) > 0 ? baseDict[dict] : baseDict['zh-CN']
        }
        return Object.assign(baseDict, dict)
    },
    /**
     *
     * @param {number} code
     * @param {string} [msg]
     * @param  {string|struct} [dict]
     * @return {string}
     */
    translate: function (code, msg, dict = 'zh-CN') {
        if (!msg) {
            return AErrorEnum.code2Msg(code, dict)
        }
        msg = string(msg)
        dict = AErrorEnum.getDict(dict)
        if (dict[msg]) {
            return dict[msg]
        }
        let arr = msg.matchAll(/param[^`]*`([^`]+)`.*is\s+required/ig)
        for (const a of arr) {
            let p = dict[a[1]] ? dict[a[1]] : a[1]
            return fmt.translate(dict, "please input: %s", p)
        }
        arr = msg.matchAll(/bad\s+param[^`]*`([^`]+)`/ig)
        for (const a of arr) {
            let p = dict[a[1]] ? dict[a[1]] : a[1]
            return fmt.translate(dict, "bad param: %s", p)
        }
        arr = msg.matchAll(/param[^`]*`([^`]+)`.*not\s+match/ig)
        for (const a of arr) {
            let p = dict[a[1]] ? dict[a[1]] : a[1]
            return fmt.translate(dict, "invalid param: %s", p)
        }

        return msg
    }

}


/**
 * @warn ts 下就不要继承 Error，因为ts把 Error.prototype设为私有，外面是无法访问的
 */
class AError extends Error {
    name = "AError"

    /** @type {(err:AError)=>void} */
    static alertHandler = err => alert(err.toString())

    #code
    message // 原始数据。部分错误会把msg当作有效信息。比如 491 RetryWith 会通过该数据传递跳转URL等
    #dict = {}
    #heading = ''
    #ending = ''

    get code() {
        return this.#code
    }

    get msg() {
        return this.getMsg()
    }

    set msg(value) {
        this.message = value
    }


    /**
     *
     * @param {number|Error} code
     * @param {string|struct} [msg]
     * @param {struct} [dict] 创建的时候更接近业务，而输出的时候往往由框架或底层完成。因此字典创建时期提供更合理
     * @example
     *  new AError(code)
     *  new AError(code, dict)        new AError(400, {})
     */
    constructor(code, msg, dict) {
        if (code instanceof Error) {
            msg = code.toString()
            code = AErrorEnum.ClientThrow
        } else if (!dict && typeof msg === "object") {
            dict = msg
            msg = ''
        }
        super(msg)
        this.#code = code
        this.message = msg
        this.#dict = dict
    }

    isRawMessage(){
        const rawMsg = AErrorEnum.code2Msg(this.code, 'en')
        return !this.message || this.message === rawMsg
    }
    getMsg(lang = 'zh-CN') {
        let dict = AErrorEnum.getDict(lang)
        if (this.#dict) {
            dict = Object.assign(dict, this.#dict)
        }
        let heading = fmt.translate(dict, this.#heading)
        let msg = AErrorEnum.translate(this.#code, this.message)
        let ending = fmt.translate(dict, this.#ending)
        if (heading) {
            heading += ' '
        }
        if (ending) {
            ending = ' ' + ending
        }
        return heading + msg + ending
    }

    /**
     * Append message to error message
     * @param {string} heading
     * @return {AError}
     */
    addHeading(heading) {
        this.#heading += '#[' + heading + ']#'
        return this
    }

    is(code) {
        return code === this.#code
    }

    isOK() {
        return this.#code >= 200 && this.#code < 300
    }

    isServerErrors() {
        return this.#code >= 500
    }

    isNoContent() {
        return this.is(AErrorEnum.NoContent)
    }

    isBadRequest() {
        return this.is(AErrorEnum.BadRequest)
    }

    isUnauthorized() {
        return this.is(AErrorEnum.Unauthorized)
    }

    isPaymentRequired() {
        return this.is(AErrorEnum.PaymentRequired)
    }

    isForbidden() {
        return this.is(AErrorEnum.Forbidden)
    }

    noMatched() {
        return [AErrorEnum.NoRowsAvailable, AErrorEnum.NotFound, AErrorEnum.Gone].includes(this.#code)
    }

    isTimeout() {
        return this.is(AErrorEnum.Timeout)
    }

    isConflict() {
        return this.is(AErrorEnum.Conflict)
    }

    isGone() {
        return this.is(AErrorEnum.Gone)
    }

    isPreconditionFailed() {
        return this.is(AErrorEnum.PreconditionFailed)
    }

    isUnsupportedMediaType() {
        return this.is(AErrorEnum.UnsupportedMediaType)
    }

    isLocked() {
        return this.is(AErrorEnum.Locked)
    }

    isFailedDependency() {
        return this.is(AErrorEnum.FailedDependency)
    }

    isTooEarly() {
        return this.is(AErrorEnum.TooEarly)
    }

    isTooManyRequests() {
        return this.is(AErrorEnum.TooManyRequests)
    }

    isRetryWith() {
        return this.is(AErrorEnum.RetryWith)
    }
    isConflictWith() {
        return this.is(AErrorEnum.ConflictWith)
    }

    isIllegal() {
        return this.is(AErrorEnum.Illegal)
    }

    isInternalServerError() {
        return this.is(AErrorEnum.InternalServerError)
    }

    isNotImplemented() {
        return this.is(AErrorEnum.NotImplemented)
    }

    isBadGateway() {
        return this.is(AErrorEnum.BadGateway)
    }

    isServerException() {
        return this.is(AErrorEnum.ServerException)
    }

    isGatewayTimeout() {
        return this.is(AErrorEnum.GatewayTimeout)
    }


    isServerStatusException() {
        return this.is(AErrorEnum.StatusException)
    }

    isClientThrow() {
        return this.is(AErrorEnum.ClientThrow)
    }


    toString() {
        if (this.code === AErrorEnum.BadRequest) {
            return this.getMsg()
        }
        return this.getMsg() + ` (${this.code})`
    }

    log(pattern) {
        let msg = this.toString()
        if (pattern) {
            pattern = string(pattern)
            msg = pattern.indexOf('%ERROR') > -1 ? pattern.replaceAll('%ERROR', msg) : `${pattern} ${msg}`
        }
        log.error(msg)
    }

    /**
     * Alert to client user
     * @param {AError|Error|*} err 要进行广泛判断。有可能业务层处理resolve里面，出现异常未捕获并修改为AError，比如 JSON.parse()等未捕获异常
     * @note 这里使用console.error()，而不是 log.error()，因为本身就是要展示给客户的
     */
    static alert(err) {
        if (err instanceof Error) {
            err = new AError(AErrorEnum.ClientThrow, err.toString())
        }
        if (!(err instanceof AError)) {
            console.error(`AError.alert() invalid err `, err)
        }
        AError.alertHandler(err)
    }


    static newBadRequest(param, dict) {
        return new AError(AErrorEnum.BadRequest, "Bad request `" + param + "`", dict)

    }

    static parseResp(resp, dict) {
        if (!resp) {
            return new AError(AErrorEnum.ServerException, "", dict)
        }
        if (typeof resp === "string") {
            try {
                resp = JSON.parse(resp.trim())
            } catch (e) {
                return new AError(AErrorEnum.ServerException, "", dict)
            }
        }
        if (resp && typeof resp === "object" && resp.hasOwnProperty("code") && resp.hasOwnProperty("msg")) {
            return new AError(resp['code'], resp['msg'], dict)
        }

        return new AError(AErrorEnum.ServerException, "", dict)
    }
}

/**
 *
 * @param {number|Error} code
 * @param args
 * @warn 有可能业务层处理resolve里面，出现异常未捕获并修改为AError，比如 JSON.parse()等未捕获异常。因此，catch里使用 err，必须要先
 *  err = aerror(err) 避免异常
 */
function aerror(code, ...args) {
    if (code instanceof AError) {
        return code
    }
    return new AError(code, ...args)
}