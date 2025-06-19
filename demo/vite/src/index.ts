import aa from 'aa-js/src/aa.ts'

(function () {
    console.log("Hello World!")

    aa.http.Get("http://192.168.0.222:8080/v1/users3").then(data => {
        console.log(data)
    })

})()