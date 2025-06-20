import aa from 'aa-ts/src/aa.ts'

(function () {

    aa.http.baseURL = 'http://192.168.0.222:8080'

    // Fetch raw string
    aa.http.Fetch("/v1/ping").then(pong => {
        console.log(pong)
    })

    aa.http.Get("/v1/users").then(data => {
        console.log(data)
    })

    aa.http.Get("/v1/users", {
        params: {
            page: 2,
            sex: 2,
        }
    }).then(data => {
        console.log(data)
    })

    aa.http.Get("/v1/users/sex/{sex:uint8}/page/{page:uint8}", {
        params: {
            page: 5,
            sex: 1,
        }
    }).then(data => {
        console.log(data)
    })

    aa.http.Get("/v1/users/page/{page:uint8}", {
        params: {
            page: 5,
        }
    }).then(data => {
        console.log(data)
    })

    aa.http.Get("/v1/users/{uid:uint64}", {
        params: {
            uid: 3,
        }
    }).then(data => {
        console.log(data)
    })

})()