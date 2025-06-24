# aa-ts

AaTS 一个优雅调用 Restful API 的库，包括路由自动填充、鉴权、防抖、限流、自动重试、token过期自动更新等功能。

这里案例使用的后端接口，可以参考 [Airis Simple Demo](https://github.com/aarioai/airis/blob/main/demo/project/simple/README_%E8%AF%B4%E6%98%8E.md)
启动后端服务。

## HTTP 请求

> **baseURL 优先级**：URL 里面的 > option.baseURL > aa.http.baseURL > aa.httpDefaults.baseURL

### 原生HTTP API请求

原生数据请求，指直接按原始服务器返回的字符串返回，不进行任何处理。

参考：[demo/vite/src/raw/main.ts](https://github.com/aarioai/aa-ts/blob/main/demo/vite/src/raw/main.ts)

```ts
import aa from 'aa-ts/src/aa.ts'

// 设置全局默认 base URL
aa.httpDefaults.baseURL = 'http://localhost'

// 设置默认 http 实例的 base URL
//aa.http.baseURL = 'http://localhost'

// 请求并异步返回原生string数据
aa.http.Fetch("/v1/ping").then(pong => {
    console.log(pong)
})

//  不使用默认 baseURL，直接请求，并异步返回字符串结果
aa.http.Fetch("http://xxx.com/v1/ping").then(pong => {
    console.log(pong)
})
```

### 简化Restful API请求

为了规范Restful API返回结果，aa-ts 按照 ResponseBody
结构体自动解析。错误码（code）规范，可以根据服务端自行定义，如果使用[Airis 错误码规范](https://github.com/aarioai/rules/blob/main/api_doc/%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E5%92%8C%E9%94%99%E8%AF%AF%E7%A0%81%E8%AF%B4%E6%98%8E.md)
，则只允许http状态码以内的错误码，这样方便对HTTP状态码错误一并处理。

```ts 
export type ResponseBodyData = Dict | string | null
export type ResponseBody = {
    code: number,
    msg: string,
    data: ResponseBodyData,
}
```

aa-ts 会自动解析HTTP状态码，以及 `ResponseBody.code` 错误码，如果成功，则以异步 `Promise<ResponseBodyData>` 方式返回
`ResponseBody.data`。若HTTP状态码或 `ResponseBody.code` 错误码，任何一个错误，则会抛出 `AError` 异常。

参考：[demo/vite/src/restful-simple/main.ts](https://github.com/aarioai/aa-ts/blob/main/demo/vite/src/restful-simple/main.ts)

```ts 
import aa from 'aa-ts/src/aa.ts'

aa.http.baseURL = 'http://localhost'

// HEAD 请求，等价于 aa.http.Head('/v1/restful').then()
aa.http.Request("HEAD /v1/restful").then()

// GET 请求，等价于 aa.http.Get('/v1/restful/{response:string}').then(data=>{})
aa.http.Request("/v1/restful/{response:string}", {
    params: {
        response: "Success",
        hello: "world",
    }
}).then(data => {
    console.log("GET /v1/restful/{response:string}", "==>", data)
})


// POST 请求，等价于 aa.http.Post('/v1/restful', {}).then(data=>{})
aa.http.Request("POST /v1/restful", {
    data: {
        say: "POST -> Hello, World!"
    }
}).then(data => {
    console.log(data)
})

// PUT 请求，等价于 aa.http.Put('/v1/restful/{id:int}', {}).then(data=>{})
aa.http.Request("PUT /v1/restful/{id:int}", {
    params: {
        id: 110,
    },
    data: {
        say: "PUT -> Hello, World!"
    }
}).then(data => {
    console.log("PUT /v1/restful/{id:int}", "==>", data)
})


// PATCH 请求，等价于 aa.http.Patch('/v1/restful', {}).then(data=>{})
aa.http.Request("PATCH /v1/restful", {
    data: {
        num: 2
    }
}).then(data => {
    console.log(data)
})

// DELETE 请求，等价于 aa.http.Delete('/v1/restful', {}).then(data=>{})
aa.http.Request("DELETE /v1/restful").then(data => {
    console.log(data)
})
```

#### 无状态API请求（标准Restful API，带Path Parameter）

参考：[demo/vite/src/restful/main.ts](https://github.com/aarioai/aa-ts/blob/main/demo/vite/src/restful/main.ts)

```ts
import aa from 'aa-ts/src/aa.ts'

// 设置全局默认 base URL
aa.httpDefaults.baseURL = 'http://localhost'
//aa.http.baseURL = 'http://localhost'

// 获取用户列表接口，返回第一页内容
// 等价于 aa.http.Get("/v1/users")
aa.http.Request("/v1/users").then(data => {
    console.log(data)
})

// 获取用户列表第五页内容
// 等价于 aa.http.Get("/v1/users/page/{page:uint8}", ...)
aa.http.Request("/v1/users/page/{page:uint8}", {
    params: {
        page: 5,
    }
}).then(data => {
    console.log(data)
})


// 通过性别查询用户列表接口，并返回第二页内容
// 等价于 aa.http.Get("/v1/users", ...)
aa.http.Request("/v1/users", {
    params: {
        page: 2,
        sex: 2,
    }
}).then(data => {
    console.log(data)
})

// 使用Restful URL 标准方式，通过 Path parameter 查询
// 等价于 aa.http.Get("/v1/users/sex/{sex:uint8}/page/{page:uint8}", ...)
aa.http.Request("/v1/users/sex/{sex:uint8}/page/{page:uint8}", {
    params: {
        page: 5,
        sex: 1,
    }
}).then(data => {
    console.log(data)
})

// 通过uid查询匹配的用户列表
// 等价于 aa.http.Get("/v1/users/{uid:uint64}", ...)
aa.http.Request("/v1/users/{uid:uint64}", {
    params: {
        uid: 3,
    }
}).then(data => {
    console.log(data)
})

```

## 有状态Restful API请求

参考：[demo/vite/src/auth/main.ts](https://github.com/aarioai/aa-ts/blob/main/demo/vite/src/auth/main.ts)

HTTP auth 目前支持对后端 `ResponseBody.data` 返回 `UserToken` 结构的数据：

```ts
export type UserTokenAttach = {
    refresh_api?: string
    refresh_ttl?: t_expires
    secure?: boolean
    validate_api?: string
    [key: string]: unknown
}

export type UserToken = {
    access_token?: string    // access token
    expires_in?: t_expires  // access token 剩余时间（秒）
    refresh_token?: string // refresh token，可以使用 refresh token 刷新 access token（可能会返回新的token），延长其过期时间
    scope?: Dict  // 授权范围
    state?: string // 客户端透传字符串
    token_type?: string // access token 类型

    attach?: UserTokenAttach  // 附带参数
}
```

注册全局未登录方法，若服务端返回HTTP状态码或`ResponseBody.code`错误码 401，则会调用该注册的方法

```ts 
aa.http.auth.unauthorizedHandler = (e: AError): boolean => {
    go_to_login_page()   // 一般设置为跳转至登录页
    return true
}
```

密码登录接口，`ResponseBody.data` 返回 UserToken

```ts
// aa.storageManager.enableDebug()
// aa.http.enableDebug = true
// aa.http.auth.enableDebug = true

// 开启Cookie
// 注意：若开启 Cookie，应注意防护CSRF，要求类似微信小程序一样，任何“写”操作，必须用户进入页面点击后才能进行，不可以直接进入某个页面自动进行
aa.http.auth.enableCookie = true

aa.http.auth.unauthorizedHandler = (e: AError): boolean => {
    console.error("Unauthorized " + e.toString())
    return true
}

// aa.httpDefaults.requestOptions.baseURL = ''
aa.http.base.defaults.baseURL = 'http://localhost'
if (!(await aa.http.auth.isAuthed())) {
    // 等价于 aa.http.Post("/v1/login", ...)
    aa.http.Request("POST /v1/login", {
        data: {
            account: "12345",
            password: "hello",
            state: "aa-js",
        }
    }).then(data => {
        // 登录成功，自动存储 user token 信息
        aa.http.auth.handleAuthed(data as UserToken)
    }).catch(e => {
        console.log("ERROR", e.toString())
    })
}

// 等价于 aa.http.Get("/v1/authed/users2/uid/{uid:string}", ...)
aa.http.Request("/v1/authed/users2/uid/{uid:string}", {
    params: {
        uid: [1, 3, 5],
    }
}).then(data => {
    console.log(data)
})
```

### HTTP 配置

#### HTTP 全局默认配置

```ts 
import {Millisecond} from './a_define_units'

aa.httpDefaults.requestOptions = {} // BaseRequestOptions   默认全局配置
aa.httpDefaults.headers = {}  //  HeaderSetting 全局默认 header 默认配置
aa.httpDefaults.cookieOptions = {}  // CookieOptions 全局 auth cookie 默认配置
aa.httpDefaults.userTokenOptions = {}  // UserToken 全局默认 user token 默认配置
aa.httpDefaults.unauthorizedHandler = undefined  // ?: (e: AError) => boolean
aa.httpDefaults.requestErrorHook = undefined // ?: (e: AError) => AError
```

#### 默认 HTTP 配置

aa.http 是默认的一个 HttpImpl 实例，也可以使用自定义的实例。

```ts
aa.http.enableDebug = false  // 是否开启debug日志
aa.http.authenableDebug = false // 是否开启 auth debug 日志
aa.http.auth.defaultCookieOptions = {}// 默认http  auth cookie 实例配置
aa.http.auth.defaultUserTokenOptions = {}// 默认http user token 实例配置

aa.http.base.defaults = {} // BaseRequestOptions 默认http 实例配置
aa.http.base.defaultHeader = {} // HeaderSetting 默认http 实例header

```

可以重置aa.http，改为自定义的实例，当然也可以设置多个http实例，分别为不同实例设置不同的默认实例配置。

```ts 
aa.http = HttpImpl // 重置默认HttpImpl实例
```

 

