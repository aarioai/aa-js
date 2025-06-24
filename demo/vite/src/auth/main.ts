import aa from 'aa-ts/src/aa.ts'
import type {AError} from 'aa-ts/src/aa/aerror/error.ts'
import type {UserToken} from 'aa-ts/src/aa/atype/a_server_dto.ts'

(async function () {
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

})()