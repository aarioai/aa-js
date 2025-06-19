import aa from 'aa-ts/src/aa.ts'
import defaults from 'aa-ts/src/rpc/http/base/defaults.ts'

(function () {
    defaults.baseURL = 'http://192.168.0.222:8080'
 
    aa.http.Fetch("/v1/ping").then(pong => {
        console.log(pong)
    })
    aa.http.Get("/v1/users").then(data => {
        console.log(data)
    })

})()