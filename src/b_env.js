class AaEnv {
    /** @readonly */
    static MaxBodyWidth = 768
    name = 'aa-environment'

    // JS 无法获取DPI。
    /**
     * @return {number}
     */
    static devicePixelRatio() {
        return number(window, "devicePixelRatio", 1).toTrimmed(2)
    }

    static softDPR() {
        const dpr = AaEnv.devicePixelRatio()
        const mainWidth = AaEnv.mainWidth()
        const r = (mainWidth / AaEnv.MaxBodyWidth) * dpr
        return r.toTrimmed(2)
    }

    // same as $(document).height()
    static documentHeight() {
        const body = document.body
        const html = document.documentElement;
        return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    }

    static isAppleTouch() {
        const ua = window.navigator.userAgent.toLowerCase()
        // EdgiOS/  is iPhone/iPad Edge
        return ua.includes(" edgios/") ||AaEnv.isIphone() || AaEnv.isIpad()
    }

    static isDebug() {
        return !_aaDebug.disabled()
    }

    static isEdge() {
        // is Edg/ or EdgA/, not Edge
        return /\sEdg(A|iOS)?\//i.test(window.navigator.userAgent)
    }
    static isAndroid() {
        const ua = window.navigator.userAgent.toLowerCase()
        // EdgA is Android (Mobile/tablet) Edge
        return ua.includes(" edga/")
    }
    static isIE() {
        return !!window.ActiveXObject
    }

    static isIpad() {
        return /iPad/i.test(window.navigator.userAgent)
    }

    static isIphone() {
        return /iPhone/i.test(window.navigator.userAgent)
    }

    static isLocalhost() {
        return _aaDebug.isLocalhost()
    }

    static isPC() {
        return $(document).width() >= 768
    }

    static isSafari() {
        return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    }

    static isWeixin() {
        return /MicroMessenger/i.test(window.navigator.userAgent)
    }

    static isWin() {
        return /(win32|win64|windows|wince)/i.test(window.navigator.userAgent)
    }


    /**
     * Return the main area width
     *     核心区宽度
     *     // window.innerWidth /  window.innerHeight 去掉状态栏的高度、宽度
     *     // window.outerWidth / window.outerHeight 带状态栏高度
     *     // screen.width / screen.height  分辨率尺寸
     * @param {boolean} [inRatio]
     * @return {number}
     * @note
     *  12.1'       1280*800
     *  13.3'       1024*600 / 1280*800
     *  14.1'       1366*768
     *  iPad        768*1024
     *  iPad Pro    1024 * 1366
     */
    static mainWidth() {
        return Number(document.querySelector('body').offsetWidth).toTrimmed(2)
    }


}