# aa-ts

AaTS 一个优雅调用 Restful API 的库，包括路由自动填充、鉴权、防抖、限流、自动重试、token过期自动更新等功能。

## HTTP 请求

**原生string数据请求**

```ts
import aa from 'aa-ts/src/aa.ts'

// 设置全局默认 base URL
aa.httpDefaults.baseURL = 'http://localhost:8080'
//aa.http.baseURL = 'http://localhost:8080'

// 请求并异步返回原生string数据
aa.http.Fetch("/v1/ping").then(pong => {
    console.log(pong)
})

//  不使用默认 baseURL，直接请求，并异步返回字符串结果
aa.http.Fetch("http://xxx.com/v1/ping").then(pong => {
    console.log(pong)
})
```

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

```ts
import aa from 'aa-ts/src/aa.ts'

// 设置全局默认 base URL
aa.httpDefaults.baseURL = 'http://localhost:8080'
//aa.http.baseURL = 'http://localhost:8080'

// 获取用户列表接口，返回第一页内容
// 等价于 aa.http.Get("/v1/users")
aa.http.Request("/v1/users").then(data => {
    console.log(data)
})

// 获取用户列表第五页内容
aa.http.Request("/v1/users/page/{page:uint8}", {
    params: {
        page: 5,
    }
}).then(data => {
    console.log(data)
})


// 通过性别查询用户列表接口，并返回第二页内容
aa.http.Request("/v1/users", {
    params: {
        page: 2,
        sex: 2,
    }
}).then(data => {
    console.log(data)
})

// 使用Restful URL 标准方式，通过 Path parameter 查询
aa.http.Request("/v1/users/sex/{sex:uint8}/page/{page:uint8}", {
    params: {
        page: 5,
        sex: 1,
    }
}).then(data => {
    console.log(data)
})

// 通过uid查询匹配的用户列表
aa.http.Request("/v1/users/{uid:uint64}", {
    params: {
        uid: 3,
    }
}).then(data => {
    console.log(data)
})

```

**进行HTTP Auth的接口请求**

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

### HTTP 配置

#### HTTP 全局默认配置

```ts 
import {Millisecond} from './a_define_units'

aa.httpDefaults.baseURL = ''  // 全局默认 base URL
aa.httpDefaults.debounceInterval = 400 * Milliseconds  // 全局默认防抖时间间隔
aa.httpDefaults.headers = {}  //  全局默认 header 默认配置
aa.httpDefaults.cookieOptions = {}  // 全局 auth cookie 默认配置
aa.httpDefaults.userTokenOptions = {}  // 全局默认 user token 默认配置
```

#### 默认 HTTP 配置

aa.http 是默认的一个 HttpImpl 实例，也可以使用自定义的实例。

```ts
aa.http.baseURL = '' // 默认http实例 base URL
aa.http.debounceInterval = 400 * Milliseconds  // 默认http实例防抖时间间隔
aa.http.defaultHeader = {} // 默认http实例防抖时间间隔
aa.http.auth.defaultCookieOptions = {}// 默认http实例 auth cookie 配置
aa.http.auth.defaultUserTokenOptions = {}// 默认http实例 user token 配置
```

可以重置aa.http，改为自定义的实例，当然也可以设置多个http实例，分别为不同实例设置不同的默认实例配置。

```ts 
aa.http = HttpImpl // 重置默认HttpImpl实例
```

 

