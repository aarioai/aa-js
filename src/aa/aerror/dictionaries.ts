import {Dictionaries} from '../translate/dictionary'

export const AErrorDictionaries: Dictionaries = {
    'zh-CN': {
        "missing response body": "缺少响应体",
        "parse response body failed": "解析响应体失败",

        "Bad Parameter: %s": "%s 输入错误",
        "Too Short Parameter: %s": "%s 输入过短",
        "Too Long Parameter: %s": "%s 输入过长",
        "Wrong Password": "密码错误",
        "Wrong Token": "Token 错误",
        "Wrong Vericode": "验证码错误",
        "Wrong Code": "校验码错误",
        "Wrong Openid": "Openid 错误",
        "Token Expired": "Token 已过期",

        "Continue": "",
        "Switching Protocols": "",
        "Processing": "",
        "Early Hints": "",

        "OK": "成功",  // 200
        "Created": "创建成功",
        "Accepted": "已接受",
        "Non-Authoritative Information": "创建成功",
        "No Content": "操作成功", //204
        "Reset Content": "已重置，请刷新页面",
        "Partial Content": "断点数据成功",
        "Multi-Status": "",
        "Already Reported": "",
        "IM Used": "",

        "Multiple Choices": "",   // 300
        "Moved Permanently": "资源被重置到新位置",
        "Found": "临时重定向",
        "See Other": "操作成功后重定向",
        "Not Modified": "数据未变化", //304
        "Use Proxy": "需要代理才可访问",
        "Temporary Redirect": "临时重定向",
        "Permanent Redirect": "资源被重置到新位置",
        "Failed And See Other": "操作失败", // 391


        "Bad Request": "请求参数或其他错误", // 400
        "Unauthorized": "请登录或授权后使用", // 401
        "Payment Required": "请付费后使用", // 402
        "Forbidden": "您没有权限使用", // 403
        "Not found": "糟糕，数据找不到啦~", // 404
        "Not acceptable": "", // 406
        "Proxy Authentication Required": "需要代理认证", // 407
        "Request Timeout": "请求超时，请稍后再试", // 408
        "Conflict": "异常冲突", // 409
        "Gone": "数据已被删除", // 410
        "Length Required": "缺少长度数据",
        "Precondition Failed": "先决条件失败", // 412
        "Request Entity Too Large": "上传数据过大", // 413
        "Request URI Invalid": "请求地址错误",//414
        "Request Target Invalid": "请求目标错误", // 414
        "Unsupported Media Type": "文件格式不正确", // 415
        "Requested Range Not Satisfiable": "",
        "Expectation Failed": "",
        "Page Expired": "临时token已过期，请刷新页面",
        "Enhance Your Calm": "服务器繁忙，请稍后再试",
        "Locked": "资源已被锁定", // 423
        "Failed dependency": "依赖失败", // 424
        "Too Early": "拒绝重放",
        "Upgrade Required": "客户端版本过低，强制升级",
        "Precondition Required": "缺少先决条件",
        "Too Many Requests": "请求过于频繁",

        "Request Header Fields Too Large": "",
        "Login Time-out": "登录状态已过期",
        "No Response": "拒绝响应",
        "Unavailable For Legal Reasons": "内容违反规定", // 451


        "No Rows Available": "没有找到符合的数据", // 494
        "Conflict With": "数据异常冲突",  // 499

        "Internal server error": "服务层错误", // 500
        "Not implemented": "服务未开放", // 501
        "Bad gateway": "网关错误", // 502
        "Service unavailable": "服务不可用", // 503
        "Gateway timeout": "网关超时", // 504
        "Variant Also Negotiates": "服务端配置错误", // 506
        "Insufficient Storage": "存储空间不足", // 507
        "Loop Detected": "检测到死循环", // 508
        "Not Extended": "", //510
        "Network Authentication Required": "服务间认证失败", // 511
        "Exception": "服务器异常", // 590
        "Client Throw": "客户端抛出异常", // 1000
    }
};