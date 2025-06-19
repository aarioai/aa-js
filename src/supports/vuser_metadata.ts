import AaCollection from '../basic/storage/collection'
import AaStorageManager from '../basic/storage/manager'
import AaDbLike from '../basic/storage/dblike'
import AaAuth from '../rpc/http/auth/auth'
import {HoursInSecond, Seconds} from '../aa/atype/a_define_units'
import {AaMutex} from '../aa/calls/mutex'
import type {HttpImpl} from '../rpc/http/base/define_interfaces'
import type {NormalizedVuserMetadata, t_vtype, Vuser, VuserMetadata} from './vuser'
import type {t_uint64b, t_url_pattern} from '../aa/atype/a_define'
import {uint64b} from '../aa/atype/t_basic'
import type {StorageOptions} from '../basic/storage/define_types'

export default class AaVuserMetadata {
    readonly tableName = 'vuser_metadata'
    getMetadataAPI?: t_url_pattern
    collectionOptions: StorageOptions = {
        expiresIn: 6 * HoursInSecond,
    }
    #selectedVuid?: t_uint64b
    #metadata?: NormalizedVuserMetadata
    private readonly tx = new AaMutex()
    private readonly auth: AaAuth
    private readonly collection: AaCollection
    private readonly http: HttpImpl

    constructor(auth: AaAuth, storageManager: AaStorageManager, http: HttpImpl, api?: t_url_pattern) {
        this.auth = auth
        this.collection = new AaCollection(this.tableName, new AaDbLike(storageManager.local))
        this.http = http
        this.getMetadataAPI = api
    }

    get selectedVuid(): t_uint64b | null {
        if (this.#selectedVuid) {
            return this.#selectedVuid
        }
        const vuid = this.collection.find<t_uint64b>('selected_vuid')
        if (!vuid) {
            return null
        }
        this.#selectedVuid = vuid
        return vuid
    }

    set selectedVuid(vuid: number | t_uint64b) {
        this.#selectedVuid = uint64b(vuid)
        this.collection.insert('selected_vuid', this.#selectedVuid, this.collectionOptions)
    }

    init(api: t_url_pattern) {
        this.getMetadataAPI = api
        this.metadata().then().catch(console.error)
    }

    clear() {
        this.#selectedVuid = undefined
        this.#metadata = undefined
        this.collection.drop()
    }

    async metadata(): Promise<NormalizedVuserMetadata> {
        if (!this.getMetadataAPI) {
            throw new Error('getMetadataAPI is missing')
        }
        const userToken = await this.auth.getOrRefreshUserToken()
        if (!userToken) {
            throw new Error('user token is missing or expired')
        }

        // Load from cache
        const metadata = this.cachedMetadata()
        if (metadata) {
            return metadata
        }

        if (!await this.tx.awaitLock(5 * Seconds)) {
            throw new Error('dead lock')
        }
        return this.http.Request(this.getMetadataAPI, {mustAuth: true}).then(metadata => {
            return this.normalizeAndSave(metadata as VuserMetadata)
        }).catch(err => {
            throw err
        }).finally(() => {
            this.tx.unlock()
        })
    }

    normalizeAndSave(metadata: VuserMetadata): NormalizedVuserMetadata {
        this.#metadata = {
            vuser: metadata.vuser,
            sub_vusers: metadata.sub_vusers || null,
            selected_vuid: null,
        }
        this.collection.insertMany(metadata, this.collectionOptions)
        return this.#metadata
    }

    vusers() {
        return this.metadata().then(metadata => {
            return [metadata!['vuser'],
                ...(metadata!['sub_vusers'] || [])
            ]
        })
    }

    vuserAsVtype(vtype: t_vtype) {
        return this.metadata().then(metadata => {
            const main = metadata!['vuser']
            if (!vtype || vtype === main['vtype']) {
                return main
            }
            const subs = metadata!['sub_vusers']
            if (!subs?.length) {
                return null
            }
            for (const sub of subs) {
                if (sub['vtype'] === vtype) {
                    return sub
                }
            }
            return null
        })
    }

    mainVuser(): Promise<Vuser> {
        return this.metadata().then(metadata => {
            return metadata!['vuser']
        })
    }

    vuser(vuid: t_uint64b): Promise<Vuser> {
        return this.metadata().then(metadata => {
            const main = metadata!['vuser']
            if (!vuid || vuid === main['vuid']) {
                return main
            }
            const subs = metadata['sub_vusers']
            if (!subs?.length) {
                throw new Error(`vuid ${vuid} does not exist`)
            }
            for (const sub of subs) {
                if (sub['vuid'] === vuid) {
                    return sub
                }
            }
            throw new Error(`vuid ${vuid} does not exist`)
        })
    }

    selectedOrMainVuser(): Promise<Vuser> {
        return this.selectedVuid ? this.vuser(this.selectedVuid) : this.mainVuser()
    }

    private cachedMetadata(): NormalizedVuserMetadata | null {
        if (this.#metadata) {
            return this.#metadata
        }
        return this.collection.findAll() as NormalizedVuserMetadata
    }


}