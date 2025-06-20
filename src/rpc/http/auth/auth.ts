import type {BaseRequestOptions, RequestImpl} from '../base/define_interfaces'
import {AaRequest} from '../middleware/request'
import AaCollection from '../../../basic/storage/collection'
import type {NormalizedUserToken, t_usertoken_key, UserToken, UserTokenAttach} from '../../../aa/atype/a_server_dto'
import type {CookieOptions, StorageImpl, StorageOptions} from '../../../basic/storage/define_types'
import AaStorageManager from '../../../basic/storage/manager'
import AaDbLike from '../../../basic/storage/dblike'
import {P_Logout} from '../../../aa/aconfig/const_param'
import defaults from '../base/defaults'
import type {t_expires, t_second} from '../../../aa/atype/a_define'
import {MinutesInSecond, NO_EXPIRES, Second, Seconds} from '../../../aa/atype/a_define_units'
import type {Dict} from '../../../aa/atype/a_define_interfaces'
import {cloneDict} from '../../../aa/atype/clone'
import {fillDict} from '../../../basic/maps/groups'
import {AaMutex, E_DeadLock} from '../../../aa/calls/mutex'
import {AError} from '../../../aa/aerror/error'
import log from '../../../aa/alog/log'
import {CODE_UNAUTHORIZED} from '../../../aa/aerror/code'
import {aerror} from '../../../aa/aerror/fn'
import {TRUE} from '../../../aa/atype/a_server_consts'

export const E_MissingUserToken = new AError(CODE_UNAUTHORIZED, 'missing user token').lock()
export const E_InvalidUserToken = new AError(CODE_UNAUTHORIZED, 'invalid user token').lock()
export default class AaAuth {
    readonly tableName = 'auth'
    readonly sessionCollection: AaCollection
    readonly localCollection: AaCollection
    readonly cookie: StorageImpl
    readonly request: RequestImpl
    customPackAuthorization?: (token: NormalizedUserToken) => BaseRequestOptions | null
    enableCookie: boolean = true
    defaultCookieOptions?: CookieOptions
    defaultUserTokenOptions?: UserToken
    enableDebug = false
    unauthorizedHandler?: (e: AError) => boolean
    private readonly tx = new AaMutex()
    private userToken: NormalizedUserToken | null = null
    #authTime: t_second = 0
    #validated?: boolean

    constructor(storageManager: AaStorageManager, r?: RequestImpl) {
        this.cookie = storageManager.cookie
        this.sessionCollection = new AaCollection(this.tableName, new AaDbLike(storageManager.session))
        this.localCollection = new AaCollection(this.tableName, new AaDbLike(storageManager.local))
        this.request = r ?? new AaRequest()
    }

    private get validated(): boolean {
        if (typeof this.#validated === 'boolean') {
            return this.#validated
        }
        const validated = this.sessionCollection.find('validated')
        if (typeof validated === 'boolean') {
            this.#validated = validated
            return validated
        }
        return false
    }

    private set validated(validated: boolean) {
        this.sessionCollection.insert('validated', validated)
        this.#validated = validated
    }

    clear() {
        this.debug('clear')
        this.cookie.clear()
        this.sessionCollection.drop()
        this.localCollection.drop()
    }

    async refresh(refreshToken: string, refreshAPI: string): Promise<[NormalizedUserToken | null, AError | null]> {
        this.debug(`refresh token: ${refreshToken}, refreshAPI: ${refreshAPI}`)
        if (!await this.tx.awaitLock(5 * Seconds)) {
            return [null, E_DeadLock]
        }
        try {
            const data = await this.request.Request<UserToken>(refreshAPI, {
                data: {
                    'grant_type': 'refresh_token',
                    'code': refreshToken,
                }
            })
            const userToken = this.handleAuthed(data!)
            if (!userToken) {
                return [null, E_InvalidUserToken.widthDetail(data)]
            }
            return [userToken, null]
        } catch (err) {
            const e = aerror(err as any)
            if (!e.isServerError()) {
                this.clear()
            }
            log.test(e)
            return [null, e]
        } finally {
            this.tx.unlock()
        }
    }

    async getOrRefreshUserToken(): Promise<[NormalizedUserToken | null, AError | null]> {
        if (!this.userToken) {
            return [null, E_InvalidUserToken]
        }
        if (!this.userToken['refresh_token'] || !this.userToken.attach?.['refresh_api']) {
            return [null, E_MissingUserToken]
        }
        const refreshToken = this.userToken['refresh_token']
        const api = this.userToken.attach['refresh_api']
        return await this.refresh(refreshToken, api)
    }

    packAuthorization(token: NormalizedUserToken): BaseRequestOptions | null {
        if (this.customPackAuthorization) {
            const result = this.customPackAuthorization(token)
            this.debug('custom pack authorization', token, result)
            return result
        }
        const accessToken = token['access_token']
        const tokenType = token['token_type']
        if (!accessToken) {
            this.debug('pack authorization missing access_token', token)
            return null
        }
        return {
            headers: {
                'Authorization': tokenType ? `${tokenType} ${accessToken}` : accessToken,
            }
        }
    }

    async getAuthorizationOptions(): Promise<[BaseRequestOptions | null, AError | null]> {
        const [userToken, err] = await this.getOrRefreshUserToken()
        if (err !== null) {
            return [null, aerror(err)]
        }
        const options = this.packAuthorization(userToken!)
        if (!options) {
            return [null, E_MissingUserToken]
        }
        return [options, null]
    }

    async validateUserToken(userToken: NormalizedUserToken): Promise<boolean> {
        if (this.validated) {
            return true
        }
        if (!(userToken.attach && 'validate_api' in userToken.attach)) {
            return true  // no validate-api regards as success
        }
        const options = this.packAuthorization(userToken)
        if (!options) {
            return false
        }
        const api = userToken.attach['validate_api']!
        if (!await this.tx.awaitLock(5 * Seconds)) {
            return false
        }
        try {
            this.validated = false
            await this.request.Request(api, options)
            this.validated = true
            return true
        } catch (err) {
            const e = aerror(err as any)
            if (!e.isServerError()) {
                this.clear()
            }
            log.warn(`validate user token failed: ${e}`)
        } finally {
            this.tx.unlock()
        }
        return false
    }

    saveUserToken(userToken: NormalizedUserToken | null) {
        this.debug('save user token', userToken)
        if (!userToken?.['access_token']) {
            return
        }
        const expiresIn = userToken['expires_in']!
        if (this.enableCookie) {
            this.setUserTokenCookies(expiresIn, userToken, 'access_token', 'token_type')
        } else {
            this.setUserTokenLocal(expiresIn, userToken, 'access_token', 'token_type')
        }
        const keys: t_usertoken_key[] = ['expires_in', 'refresh_token', 'scope', 'state', 'attach']
        this.setUserTokenLocal(expiresIn, userToken, ...keys)
    }

    handleAuthed(data: UserToken): NormalizedUserToken | null {
        this.debug(`handle authed remove cookie ${P_Logout}`)
        this.cookie.removeItem(P_Logout)
        this.#authTime = Date.now()
        const [userToken, ok] = this.normalizeUserToken(data)
        if (!ok) {
            this.debug('normalize user token failed', data)
            return null
        }
        this.#authTime = Date.now() / Second
        this.validated = true
        this.saveUserToken(userToken)
        return userToken
    }

    handleUnauthorized(e: AError): boolean {
        this.clear()
        const handler = this.unauthorizedHandler || defaults.unauthorizedHandler

        if (!handler) {
            log.error('missing unauthorized handler')
            return false
        }
        return handler(e)
    }

    async awaitAuthed() {
        const [userToken, ok] = this.loadUserToken()
        if (ok || !userToken) {
            return
        }
        await this.refresh(userToken['refresh_token']!, userToken.attach!['refresh_api']!)
    }

    logout() {
        this.cookie.clear(this.cookieOptions())
        this.userToken = null
        this.cookie.setItem(P_Logout, TRUE, {
            expiresIn: 5 * MinutesInSecond
        })
    }

    private authTime(): t_second {
        if (this.#authTime) {
            return this.#authTime
        }

        const result = this.localCollection.findWithTTL('expires_in')
        if (!result) {
            return 0
        }
        const [_, ttl] = result
        const now = Date.now() / Second
        this.#authTime = now - ttl
        return this.#authTime
    }

    private debug(...msgs: unknown[]) {
        if (!this.enableDebug) {
            return
        }
        log.debug('auth', ...msgs)
    }

    private setUserTokenLocal(expiresIn: t_expires, userToken: NormalizedUserToken, ...keys: t_usertoken_key[]) {
        const options: StorageOptions = {
            expiresIn: expiresIn
        }
        for (const key of keys) {
            if (key in userToken) {
                const value = userToken[key]
                this.debug(`insert collection ${key} to ${value}`)
                this.localCollection.insert(key, value, options)
            }
        }
    }

    private setUserTokenCookies(expires: t_expires, userToken: NormalizedUserToken, ...keys: string[]) {
        const options = this.cookieOptions(expires)
        for (const key of keys) {
            if (key in userToken) {
                const value = userToken[key as keyof typeof userToken]
                this.debug(`set cookie ${key} to ${value}`)
                this.cookie.setItem(key, value, options)
            }
        }
    }

    private cookieOptions(expiresIn?: t_expires): CookieOptions {
        const defaultOptions = this.defaultCookieOptions || defaults.cookieOptions
        const options = {
            ...defaultOptions
        }
        if (expiresIn) {
            options.expiresIn = expiresIn
        }
        return options
    }

    private loadStorage<T = string>(key: t_usertoken_key): T | null {
        let result = this.localCollection.find(key)
        if (result !== null && result !== undefined) {
            return result as T
        }
        result = this.sessionCollection.find(key)
        if (result !== null && result !== undefined) {
            return result as T
        }
        return this.cookie.getItem(key) as T | null
    }


    private getOrDefault<T = string>(data: UserToken, key: t_usertoken_key, defaultValue: T | null = null): T | null {
        if (data && key in data) {
            return data[key] as T
        }
        const userToken = this.defaultUserTokenOptions || defaults.userTokenOptions
        return (userToken && key in userToken) ? userToken[key] as T : defaultValue
    }

    private mergeDefault<T = Dict>(data: UserToken, key: t_usertoken_key): T | null {
        const userToken = this.defaultUserTokenOptions || defaults.userTokenOptions
        const defaultValue = (userToken && key in userToken) ? cloneDict(userToken) : null
        if (!data || !(key in data)) {
            return defaultValue ? defaultValue as T : null
        }
        if (!defaultValue) {
            return data[key] ? data[key] as T : null
        }
        const value = cloneDict(data[key] as Dict)
        return fillDict(value, defaultValue) as T
    }

    private checkUserToken(userToken: NormalizedUserToken): [NormalizedUserToken | null, boolean] {
        const accessToken = userToken['access_token']
        const refreshToken = userToken['refresh_token']
        const refreshAPI = userToken.attach?.['refresh_api']
        if (!accessToken && (!refreshToken || !refreshAPI)) {
            this.debug(`check user token access token=${accessToken}, refreshToken=${refreshToken}, refreshAPI=${refreshAPI}`)
            return [null, false]
        }
        if (!accessToken) {
            return [userToken, false]
        }
        const expiresIn = userToken['expires_in']
        if (expiresIn === undefined || expiresIn === null || expiresIn === NO_EXPIRES || (expiresIn + this.authTime() > Date.now())) {
            return [userToken, true]
        }
        this.debug(`check user token expires_in=${expiresIn}`)
        return [userToken, false]  // expired
    }

    private normalizeUserToken(data: UserToken): [NormalizedUserToken | null, boolean] {
        return this.checkUserToken({
            access_token: this.getOrDefault(data, 'access_token'),
            expires_in: this.getOrDefault<t_expires>(data, 'expires_in', NO_EXPIRES),
            refresh_token: this.getOrDefault(data, 'refresh_token'),
            scope: this.mergeDefault<UserTokenAttach>(data, 'scope'),
            state: this.getOrDefault(data, 'state'),
            token_type: this.getOrDefault(data, 'token_type'),
            attach: this.mergeDefault<UserTokenAttach>(data, 'attach'),
        })
    }


    private loadUserToken(): [NormalizedUserToken | null, boolean] {
        if (this.userToken) {
            return this.checkUserToken(this.userToken)
        }
        return this.checkUserToken({
            access_token: this.loadStorage('access_token'),
            expires_in: this.loadStorage<t_expires>('expires_in'),
            refresh_token: this.loadStorage('refresh_token'),
            scope: this.loadStorage<Dict>('scope'),
            state: this.loadStorage('state'),
            token_type: this.loadStorage('token_type'),
            attach: this.loadStorage<UserTokenAttach>('attach') ?? {},
        })
    }

}