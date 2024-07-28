/**
 * @import AaAuth
 * @typedef {struct} Profile
 */

class AaAccount {
    name = 'aa-account'

    static TableName = 'auth_account'
    #profile
    #selectedVuid

    #tx
    // @type {AaCache}
    #db
    #auth
    #fetch
    #fetchUrl

    initFetchUrl(url) {
        this.#fetchUrl = url
        if (!this.#auth.authed()) {
            return
        }
        const profile = this.getCachedProfile()
        if (profile) {
            return
        }
        this.getProfile(true).then()
    }

    /**
     *
     * @param {typeof AaTX} tx
     * @param {AaCache} db
     * @param auth
     * @param {AaFetch} fetch
     */
    constructor(tx, db, auth, fetch) {
        this.#tx = new tx()
        this.#db = db
        this.#auth = auth
        this.#fetch = fetch

    }

    save(data) {
        this.#auth.setToken(data['token'], data['fields'])
        this.saveProfile(data['profile'])
    }

    saveProfile(profile) {
        this.#profile = profile
        this.#db.save(AaAccount.TableName, profile)
    }

    drop() {
        this.#db.drop(AaAccount.TableName)
    }

    getCachedProfile() {
        let profile = this.#profile
        if (len(profile) > 0) {
            return profile
        }
        profile = this.#db.selectAll(AaAccount.TableName)
        if (len(profile) === 0 || len(profile['vuser']) === 0) {
            this.#profile = null
            return null
        }
        return profile
    }

    /**
     * @param {boolean} [refresh]  false on  [program cache] -> [local storage] -> [remote api]; true on [remote api] only
     * @return {Promise<Profile>|*}
     */
    getProfile(refresh = false) {
        if (!this.#auth.authed()) {
            return new Promise((_, reject) => {
                reject()
            })
        }

        if (!refresh) {
            let profile = this.getCachedProfile()
            if (len(profile) > 0) {
                return new Promise((resolve, _) => {
                    resolve(profile)
                })
            }
        }
        const fetch = this.#fetch
        const url = this.#fetchUrl
        if (!url || !fetch) {
            return new Promise((_, reject) => {
                reject("invalid profile fetch")
            })
        }
        this.#tx.begin()
        if (this.#tx.notFree()) {
            return asleep(200 * time.Millisecond).then(() => {
                return this.getProfile(refresh)
            })
        }
        return fetch.fetch(url).then(profile => {
            this.#tx.commit()
            this.saveProfile(profile)
            return profile
        }).catch(err => {
            this.#tx.rollback()
            throw err
        })
    }

    /**
     * Get vusers
     * @return {Promise<Vuser[]>}
     */
    getVusers() {
        return this.getProfile().then(profile => {
            let vusers = [profile['vuser']]
            let doppes = array(profile, 'doppes')
            vusers.push(...doppes)
            return vusers
        })
    }

    /**
     * Get vuser with vtype
     * @param {number|string} vtype
     * @return {Promise<Vuser>}
     */
    searchVuser(vtype) {
        return this.getVusers().then(vusers => {
            vtype = string(vtype)
            for (let i = 0; i < vusers.length; i++) {
                let vuser = vusers[i]
                if (string(vuser['vtype']) === vtype) {
                    return vuser
                }
            }
            throw new RangeError(`not found vuser with vtype: ${vtype}`)
        })
    }

    /**
     * Get main vuser
     * @return {Promise<Vuser>}
     */
    mainVuser() {
        return this.searchVuser(0)
    }


    /**
     * Get vuser
     * @param vuid
     * @return {Promise<Vuser>}
     */
    getVuser(vuid) {
        return this.getVusers().then(vusers => {
            for (let i = 0; i < vusers.length; i++) {
                let vuser = vusers[i]
                if (string(vuser['vuid']) === string(vuid)) {
                    return vuser
                }
            }
            throw new RangeError(`not found vuser ${vuid}`)
        })
    }

    setSelectedVuid(vuid) {
        this.#selectedVuid = vuid
        this.#db.save(AaAccount.TableName, {'selected_vuid_': vuid})
    }

    #readSelectedVuid() {
        return this.#db.find(AaAccount.TableName, 'selected_vuid_')
    }


    /**
     * Last selected vuser, default is main vuser
     * @return {Promise<Vuser>}
     */
    getSelectedVuser() {
        let vuid = this.#selectedVuid
        if (!vuid || vuid === '0') {
            vuid = this.#readSelectedVuid()
        }
        if (!vuid) {
            return this.mainVuser()
        }
        return this.getVuser(vuid)
    }
}