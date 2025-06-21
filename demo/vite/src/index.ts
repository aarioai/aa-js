import aa from 'aa-ts/src/aa.ts'
import type {AError} from 'aa-ts/src/aa/aerror/error'
import type {UserToken} from 'aa-ts/src/aa/atype/a_server_dto.ts'

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

    // global http request error hook
    aa.httpDefaults.requestErrorHook = (e: AError): AError => {
        alert(e.toString())
        return e
    }
    aa.http.Request("/v1/users3/{uid:uint64}", {
        params: {
            uid: 3,
        }
    }).then(data => {
        console.log(data)
    })

    aa.http.auth.enableDebug = true

    aa.http.Request("POST /v1/login", {
        data: {
            account: "12345",
            password: "hello",
            state: "aa-js",
        }
    }).then(data => {
        aa.http.auth.handleAuthed(data as UserToken)
    }).catch(e => {
        console.log("ERROR", e.toString())
    })


    aa.http.auth.unauthorizedHandler = (e: AError): boolean => {
        alert("Unauthorized " + e.toString())
        return true
    }
})()