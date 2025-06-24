import aa from 'aa-ts/src/aa.ts'
import type {AError} from 'aa-ts/src/aa/aerror/error.ts'
import type {UserToken} from 'aa-ts/src/aa/atype/a_server_dto.ts'

(async function () {
    // aa.storageManager.enableDebug()
    aa.http.enableDebug = true
    //aa.http.auth.enableDebug = true
    aa.http.auth.unauthorizedHandler = (e: AError): boolean => {
        console.error("Unauthorized " + e.toString())
        return true
    }

    // aa.httpDefaults.requestOptions.baseURL = ''
    aa.http.base.defaults.baseURL = 'http://localhost'
    if (!(await aa.http.auth.isAuthed())) {
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
    }
    const a = await aa.http.auth.getAuthorizationOptions()
    console.log(a)
    // aa.http.Request("/v1/authed/users2/uid/{uid:string}", {
    //     params: {
    //         uid: [1, 3, 5],
    //     }
    // }).then(data => {
    //     console.log(data)
    // })

})()