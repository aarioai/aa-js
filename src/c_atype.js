class atype {
    /**
     * @param {vv_vk_defaultV} [args]
     * @return {string|string}
     */
    static date(...args) {
        const v = defval(...args)
        if (v) {
            try {
                let d = new time(v)
                return d.toDateString()
            } catch (err) {
                console.error(err)
            }
        }

        return AaDateString.minDate
    }

    /**
     * @param {vv_vk_defaultV} [args]
     * @return {string|string}
     */
    static datetime(...args) {
        const v = defval(...args)
        if (v) {
            try {
                let d = new time(v)
                return d.toDatetimeString()
            } catch (err) {
                console.error(err)
            }
        }
        return AaDateString.minDatetime
    }
    static dist(v){
        return uint16(v)
    }
    static distri(v){
        return uint24(v)
    }
}