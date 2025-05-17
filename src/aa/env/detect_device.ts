export const MaxTabletWidth = 768


/**
 * Gets the main width of portable devices, e.g. phones, pads
 *     核心区宽度
 *     // window.innerWidth /  window.innerHeight 去掉状态栏的高度、宽度
 *     // window.outerWidth / window.outerHeight 带状态栏高度
 *     // screen.width / screen.height  分辨率尺寸
 * @note
 *  12.1'       1280*800
 *  13.3'       1024*600 / 1280*800
 *  14.1'       1366*768
 *  iPad        768*1024
 *  iPad Pro    1024 * 1366
 */
export function tabletMainWidth(): number {
    const bodyWidth = document.querySelector('body')?.offsetWidth || 0
    return Number(bodyWidth.toFixed(2))
}

// Device Pixel Ratio
export function devicePixelRatio(): number {
    return Number((window?.devicePixelRatio || 1).toFixed(2))
}


export function softDevicePixelRatio(): number {
    const dpr = devicePixelRatio()
    const mainWidth = tabletMainWidth()
    const ratio = (mainWidth / MaxTabletWidth) * Number(dpr)
    return Number(ratio.toFixed(2))
}

// Gets document height, same as jQuery(document).height()
export function documentHeight(): number {
    return Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    )
}

// Gets document width, same as jQuery(document).width()
export function documentWidth(): number {
    return Math.max(
        document.documentElement.clientWidth,
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth
    )
}

export function isIPad(): boolean {
    return /iPad/i.test(navigator.userAgent)
}

export function isIPhone(): boolean {
    return /iPhone/i.test(navigator.userAgent)
}

export function isApplePortable(): boolean {
    const ua = navigator.userAgent.toLowerCase()
    return ua.includes(" edgios/") || isIPhone() || isIPad()
}


export function isEdge(): boolean {
    // is Edg/ or EdgA/, not Edge
    return /\sEdg(A|iOS)?\//i.test(navigator.userAgent)
}

export function isAndroid(): boolean {
    // EdgA is Android (Mobile/tablet) Edge
    return navigator.userAgent.toLowerCase().includes(" edga/")
}

export function isDesktop(): boolean {
    return documentWidth() >= MaxTabletWidth
}

export function isSafari(): boolean {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

export function isWeixin(): boolean {
    return /MicroMessenger/i.test(navigator.userAgent)
}

export function isWin(): boolean {
    return /(win32|win64|windows|wince)/i.test(navigator.userAgent)
}


