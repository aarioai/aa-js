import aa from 'aa-ts/src/aa.ts'

(function () {
    // aa.httpDefaults.requestOptions.baseURL = ''
    aa.http.base.defaults.baseURL = 'http://localhost'

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
        console.log("POST /v1/restful", "==>", data)
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
        console.log("PATCH /v1/restful", "==>", data)
    })

    // DELETE 请求，等价于 aa.http.Delete('/v1/restful', {}).then(data=>{})
    aa.http.Request("DELETE /v1/restful").then(data => {
        console.log("DELETE /v1/restful", "==>", data)
    })
})()