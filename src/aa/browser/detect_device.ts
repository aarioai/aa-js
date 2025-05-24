import {t_percent} from "../atype/a_define";
import {Panic} from "../atype/panic";
import {HUNDRED_PERCENT} from '../atype/a_server_consts'

export const MAX_TABLET_WIDTH = 768


/**
 * Gets the main width of tablet devices, e.g. phones, pads
 */
export function tabletMainWidth(proportion: t_percent = HUNDRED_PERCENT): number {
    Panic.assertLessThanZero(proportion)
    let bodyWidth = document.querySelector('body')?.offsetWidth || MAX_TABLET_WIDTH
    if (proportion === HUNDRED_PERCENT) {
        return bodyWidth
    }
    return proportion * bodyWidth / HUNDRED_PERCENT
}

// Device Pixel Ratio
export function devicePixelRatio(): number {
    return window.devicePixelRatio
}


export function softDevicePixelRatio(): number {
    const dpr = devicePixelRatio()
    const mainWidth = tabletMainWidth()
    const ratio = (mainWidth / MAX_TABLET_WIDTH) * dpr
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
    return documentWidth() >= MAX_TABLET_WIDTH
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


