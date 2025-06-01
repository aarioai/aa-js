import aconfig from './aa/aconfig/aconfig'
import httpDefaults from './rpc/http/base/defaults'
import {HttpImpl} from './rpc/http/base/define_interfaces'
import AaFetch from './rpc/http/afetch/fetch'
import AaAuth from './rpc/http/auth/auth'
import Registry from './aa/aconfig/registry'
import AaStorageManager from './basic/storage/manager'
import {AaRequest} from './rpc/http/middleware/request'
import {Err_MissingArgument} from './aa/aerror/errors'
import {t_audiosrc, t_imgsrc, t_videosrc} from './source/base/define'
import audiosrc, {AudioSrc} from './source/media/audiosrc'
import imgsrc, {ImgSrc} from './source/media/imgsrc'
import videosrc, {VideoSrc} from './source/media/videosrc'

export class Aa {
    readonly config = aconfig
    readonly registry = new Registry()
    readonly httpDefaults = httpDefaults
    #storageManager: AaStorageManager = new AaStorageManager()
    #http: HttpImpl

    constructor() {
        const baseRequest = new AaRequest()
        const auth = new AaAuth(this.registry, this.#storageManager, baseRequest)
        this.#http = new AaFetch(auth)
    }

    get http(): HttpImpl {
        return this.#http
    }

    set http(value: HttpImpl) {
        if (!value) {
            throw Err_MissingArgument
        }
        this.#http = value
    }

    get storageManager(): AaStorageManager {
        return this.#storageManager
    }

    set storageManager(value: AaStorageManager) {
        if (!value) {
            throw Err_MissingArgument
        }
        this.#storageManager = value
    }

    audiosrc(src: t_audiosrc | AudioSrc) {
        return audiosrc(src)
    }

    imgsrc(src: t_imgsrc | ImgSrc) {
        return imgsrc(src)
    }

    videosrc(src: t_videosrc | VideoSrc) {
        return videosrc(src)
    }

}

const aa = new Aa()
export default aa