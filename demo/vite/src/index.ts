import aa from 'aa-ts/src/aa.ts'
import {UNAUTHORIZED_HANDLER} from '../../../src/aa/aconfig/registry_names.ts'

(function () {
    // aa.httpDefaults.baseURL = ''
    aa.http.baseURL = 'http://192.168.0.222:8080'

    // Fetch raw string
    aa.http.Fetch("/v1/ping").then(pong => {
        console.log(pong)
    })

    aa.http.Request("/v1/users").then(data => {
        console.log(data)
    })

    aa.http.Request("/v1/users/page/{page:uint8}", {
        params: {
            page: 5,
        }
    }).then(data => {
        console.log(data)
    })

    aa.http.Request("/v1/users", {
        params: {
            page: 2,
            sex: 2,
        }
    }).then(data => {
        console.log(data)
    })

    aa.http.Request("/v1/users/sex/{sex:uint8}/page/{page:uint8}", {
        params: {
            page: 5,
            sex: 1,
        }
    }).then(data => {
        console.log(data)
    })

    aa.http.Request("/v1/users/{uid:uint64}", {
        params: {
            uid: 3,
        }
    }).then(data => {
        console.log(data)
    })

    aa.registry.register(UNAUTHORIZED_HANDLER, (...args) => {
        console.log(args)
    })

    aa.http.Request("POST /v1/login", {
        data: {
            account: "12345",
            password: "hello",
        }
    }).then(data => {
        console.log(data)
    })
})()