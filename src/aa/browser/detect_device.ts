import {Percent, PercentMultiplicand} from "../env/const_unit";
import {t_percent} from "../atype/basic_types";

export const MaxTabletWidth = 768


/**
 * Gets the main width of tablet devices, e.g. phones, pads
 */
export function tabletMainWidth(proportion: t_percent = 100 * Percent): number {
    if (!proportion || proportion < 0) {
        throw new RangeError(`proportion must be greater than 0`)
    }
    let bodyWidth = document.querySelector('body')?.offsetWidth || MaxTabletWidth
    if (proportion === 100 * Percent) {
        return bodyWidth
    }
    return proportion * bodyWidth / PercentMultiplicand
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


