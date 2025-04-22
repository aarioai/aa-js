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
        "Bad Parameter: %s"    : "%s 输入错误",

        "Continue": "",
        "Switching Protocols":"",
        "Processing":"",
        "EarlyHints":"",

        "OK"        : "成功",  // 200
        "Created" :"创建成功",
        "Accepted":"已接受",
        "Non-Authoritative Information":"创建成功",
        "No Content": "操作成功", //204
        "Reset Content":"已重置，请刷新页面",
        "Partial Content":"断点数据成功",
        "Multi-Status":"",
        "Already Reported":"",
        "IM Used":"",

        "Multiple Choices":"",   // 300
        "Moved Permanently":"资源被重置到新位置",
        "Found":"临时重定向",
        "See Other":"操作成功后重定向",
        "Not Modified": "数据未变化", //304
        "Use Proxy":"需要代理才可访问",
        "Temporary Redirect":"临时重定向",
        "Permanent Redirect":"资源被重置到新位置",
        "Failed And See Other":"操作失败", // 391


        "Bad Request"     : "请求参数或其他错误", // 400
        "Unauthorized"    : "请登录或授权后使用", // 401
        "Payment Required": "请付费后使用", // 402
        "Forbidden"       : "您没有权限使用", // 403
        "Not found"       : "糟糕，数据找不到啦~", // 404
        "Not acceptable":"", // 406
        "Proxy Authentication Required":"需要代理认证", // 407
        "Request Timeout"           : "请求超时，请稍后再试", // 408
        "Conflict"          : "异常冲突", // 409
        "Gone"              : "数据已被删除", // 410
        "Length Required":"缺少长度数据",
        "Precondition Failed": "前置条件未满足", // 412
        "Request Entity Too Large":"上传数据过大", // 413
        "Request URI Too Long":"请求地址错误",//414
        "Request Target Invalid":"请求目标错误", // 414
        "Unsupported Media Type": "文件格式不正确", // 415
        "Requested Range Not Satisfiable":"",
        "Expectation Failed":"",
        "Page Expired":"临时token已过期，请刷新页面",
        "Enhance Your Calm":"服务器繁忙，请稍后再试",
        "Locked"           : "资源已被锁定", // 423
        "Failed dependency": "之前发生错误", // 424
        "Too Early":"拒绝重放",
        "Upgrade Required":"客户端版本过低，强制升级",
        "Precondition Required":"缺少前置",
        "Too Many Requests":"请求过于频繁",

        "Request Header Fields Too Large":"",
        "Login Time-out":"登录状态已过期",
        "No Response":"拒绝响应",
        "Unavailable For Legal Reasons"          : "内容违反规定", // 451


        "No Rows Available"          : "没有找到符合的数据", // 494
        "Conflict With"       : "数据异常冲突",  // 499

        "Internal server error"   : "服务层错误", // 500
        "Not implemented"         : "服务未开放", // 501
        "Bad gateway"             : "网关错误", // 502
        "Service unavailable"        : "服务不可用", // 503
        "Gateway timeout"         : "网关超时", // 504
        "Variant Also Negotiates"         : "服务端配置错误", // 506
        "Insufficient Storage":"存储空间不足", // 507
        "Loop Detected":"检测到死循环", // 508
        "Not Extended":"", //510
        "Network Authentication Required":"服务间认证失败", // 511
        "Exception" : "服务器异常", // 590
        "Client Throw"            : "客户端抛出异常", // 1000
    }
};
const ae = {

    Continue:100,
    SwitchingProtocols:101,
    Processing:102,
    EarlyHints:103,

    OK       : 200,
    Created:201,
    Accepted:202,
    NonAuthoritativeInformation:203,
    NoContent: 204,
    ResetContent:205,
    PartialContent:206,
    MultiStatus:207,
    AlreadyReported:208,
    IMUsed:209,

    MultipleChoices:300,
    MovedPermanently:301,
    Found:302,
    SeeOther:303,
    NotModified :304,
    UseProxy:305,
    TemporaryRedirect:307,
    PermanentRedirect:308,
    FailedAndSeeOther:391,

    BadRequest     : 400,
    Unauthorized   : 401,
    PaymentRequired: 402,
    Forbidden      : 403,
    NotFound       : 404,
    MethodNotAllowed:405,
    NotAcceptable:406,
    ProxyAuthRequired:407,
    Timeout             : 408,
    Conflict            : 409,
    Gone                : 410,
    LengthRequired:411,
    PreconditionFailed  : 412,
    RequestEntityTooLarge:413,
    RequestURIInvalid:414,
    UnsupportedMediaType: 415,
    RequestedRangeNotSatisfiable:416,
    ExpectationFailed:417,
    PageExpired:419,
    EnhanceYourCalm:420,
    Locked          : 423,
    FailedDependency: 424,
    TooEarly        : 425,
    UpgradeRequired:426,
    PreconditionRequired:428,
    TooManyRequests : 429,
    RequestHeaderFieldsTooLarge:431,
    LoginTimeOut:440,
    NoResponse:444,
    UnavailableForLegalReasons         : 451,
    RetryWith       : 492,  // 特殊错误码，msg 用于跳转
    NoRowsAvailable          : 494,
    ConflictWith    : 499, // 【自定义错误码】数据冲突，msg 是冲突的有效信息

    InternalServerError   : 500,
    NotImplemented        : 501, // 服务器不支持当前请求所需要的某个功能。当服务器无法识别请求的方法，
    BadGateway            : 502,  //
    ServerUnavailable       : 503,  // 客户端自定义，表示未知服务端错误；最常见的就是，没有正确返回数据，或者返回 {code:0,msg:""} 等未协商的数据，导致客户端无法正常处理
    GatewayTimeout        : 504,
    VariantAlsoNegotiates: 506, // 内部配置错误
    InsufficientStorage:507,
    LoopDetected:508,
    NotExtended:510,
    NetworkAuthenticationRequired:511,
    Exception : 590,  // http 状态码出错，未达到程序阶段
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
        for (const [key, value] of Object.entries(ae)) {
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
        let m = ae.getCode2MsgMap()
        let s = m[code] ? m[code] : "Client Throw"
        dict = ae.getDict(dict)
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
            for (const [key, value] of Object.entries(ae)) {
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
            return ae.code2Msg(code, dict)
        }
        msg = string(msg)
        dict = ae.getDict(dict)
        if (dict[msg]) {
            return dict[msg]
        }
        let arr = msg.matchAll(/Bad\s+Param\w*\s*:\s*(\w+)/ig)
        for (const a of arr) {
            let p = dict[a[1]] ? dict[a[1]] : a[1]
            return fmt.translate(dict, "Bad Parameter: %s", p)
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
            code = ae.ClientThrow
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
        const rawMsg = ae.code2Msg(this.code, 'en')
        return !this.message || this.message === rawMsg
    }
    getMsg(lang = 'zh-CN') {
        let dict = ae.getDict(lang)
        if (this.#dict) {
            dict = Object.assign(dict, this.#dict)
        }
        let heading = fmt.translate(dict, this.#heading)
        let msg = ae.translate(this.#code, this.message)
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
        return int32(code) === this.#code
    }

    isOK() {
        return this.#code >= 200 && this.#code < 300
    }

    isServerError() {
        return this.#code >= 500
    }

    isNotFound() {
        return [ae.NotFound, ae.Gone, ae.NoRowsAvailable].includes(this.#code)
    }

    isFailedAndSeeOther() {
        return this.is(ae.FailedAndSeeOther)
    }

    toString() {
        if (this.code === ae.BadRequest) {
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
            err = new AError(ae.ClientThrow, err.toString())
        }
        if (!(err instanceof AError)) {
            console.error(`AError.alert() invalid err `, err)
        }
        AError.alertHandler(err)
    }


    static newBadParam(param, dict) {
        return new AError(ae.BadRequest, "Bad Parameter: " + param, dict)

    }

    static parseResp(resp, dict) {
        if (!resp) {
            return new AError(ae.ClientThrow, "", dict)
        }
        if (typeof resp === "string") {
            try {
                resp = JSON.parse(resp.trim())
            } catch (e) {
                return new AError(ae.ClientThrow, "", dict)
            }
        }
        if (resp && typeof resp === "object" && resp.hasOwnProperty("code") && resp.hasOwnProperty("msg")) {
            return new AError(resp['code'], resp['msg'], dict)
        }

        return new AError(ae.ClientThrow, "", dict)
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