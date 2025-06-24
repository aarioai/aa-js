import aa from 'aa-ts/src/aa.ts'
import type {AError} from 'aa-ts/src/aa/aerror/error.ts'

(function () {
    // aa.httpDefaults.requestOptions.baseURL = ''
    aa.http.base.defaults.baseURL = 'http://localhost'


    // 注册全局请求错误hook --> 根据业务需求，自行注册
    aa.httpDefaults.requestErrorHook = (e: AError): AError => {
        console.error("Global request error hook: " + e.toString())
        return e
    }

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


})()