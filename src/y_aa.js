class Aa {
    // a_
    // @type typeof _aaPath
    Path = _aaPath


    //@type _aaRegistry
    registry

    // @type _aaStorageFactor
    storage


    // log   log 类是纯静态方法，全局直接使用

    //@type typeof _aaURI
    uri = _aaURI


    // b_

    //@type typeof _aaEnvironment
    env = _aaEnvironment
    // c_
    // @type _aaAuth
    auth
    // d_

    // @type _aaFetch
    fetch

    //@type _aaOSS
    oss

    constructor() {
        this.registry = new _aaRegistry()
        this.storage = new _aaStorageFactor()

        const rawFetch = new _aaRawFetch(this.storage, this.uri)
        this.fetch = new _aaFetch(this.uri, rawFetch, this.auth)
        this.auth = new _aaAuth(this.storage, rawFetch)

        this.oss = new _aaOSS()

    }

    path(path) {
        return new _aaPath(path)
    }


    url(url = window.location.href, params = {}) {
        return new this.uri(url, params)

    }


    /**
     * Apollo
     * @param {string } url
     * @param {(fp:string)=>void} fingerprintGenerator 设备唯一码生成器
     * @param {(data:{[key:string]:*})=>void} loginDataHandler 登录处理
     * @param {(k:string)=>string} storageGetter 存储读取方法
     * @param {(k:string, v:string)=>void} storageSetter 存储保存方法
     * @return {_aaApollo}
     */
    apollo(url, fingerprintGenerator, loginDataHandler, storageGetter, storageSetter) {
        return new _aaApollo(this.fetch, url, fingerprintGenerator, loginDataHandler, storageGetter, storageSetter)
    }

}


