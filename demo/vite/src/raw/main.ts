import aa from 'aa-ts/src/aa.ts'

(function () {
    // aa.httpDefaults.requestOptions.baseURL = ''
    aa.http.base.defaults.baseURL = 'http://localhost'

    // Fetch raw string
    aa.http.Fetch("/v1/ping").then(pong => {
        console.log("/v1/ping", "==>", pong)
    })

})()