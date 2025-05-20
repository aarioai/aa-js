import {t_safeint} from '../atype/a_define'

/**
 * Converts rem to pixels
 * @return number float
 */
export function remToPx(rem: number): number {
    const style = window.getComputedStyle(document.documentElement)
    const unit = parseFloat(style?.fontSize) || 16 // default 1rem=16px
    return rem * unit
}

/**
 * Converts vw to pixels
 * @return number float
 */
export function vwToPx(vw: number): number {
    const innerWidth = window.innerWidth
    if (vw === 100) {
        return innerWidth
    }
    return innerWidth * vw / 100
}

/**
 * Converts vh to pixels
 * @return number float
 */
export function vhToPx(vh: number): number {
    const innerHeight = window.innerHeight
    if (vh === 100) {
        return innerHeight
    }
    return innerHeight * vh / 100
}

/**
 * Converts various CSS size units to pixels.
 *
 * @example
 * px(100) // Returns 100
 * px('100px') // Returns 100
 * px('100 PX') // Returns 100
 * px('1rem') // convert 1 rem to pixel
 * px('100vw') // convert 100vw to pixel
 * px('100vh') // convert 100vh to pixel
 */
export function px(size: number | string): number {
    if (!size) {
        return 0
    }
    if (typeof size === 'number') {
        return size
    }

    size = size.trim().toLowerCase()
    if (size.endsWith('px')) {
        return parseFloat(size)
    }
    if (size.endsWith('rem')) {
        return remToPx(parseFloat(size))
    }

    if (size.endsWith('vw')) {
        return vwToPx(parseFloat(size))
    }

    if (size.endsWith('vh')) {
        return vhToPx(parseFloat(size))
    }

    if (/^\d+$/.test(size)) {
        return parseFloat(size)
    }
    throw new Error(`Unsupported size unit: "${size}". Supported units: px, rem, vw, vh, or unit-less numbers.`)
}

export function pxInt(size: number | string): t_safeint {
    return px(size) | 0
}