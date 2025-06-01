import {t_int} from '../../aa/atype/a_define'
import {t_resolution} from './define'

export function findClosestResolution(allowed: t_resolution[] | null, width: t_int, height: t_int): t_resolution {
    if (!allowed?.length) {
        return [width, height]
    }
    let maxWidth = 0
    let maxHeight = 0
    let closestWidth = 0
    let closestHeight = 0
    for (const [w, h] of allowed) {
        if (w === width && h === height) {
            return [w, h]
        }

        // Track maxWidth and maxHeight
        if (w > maxWidth || (w === maxWidth && h > maxHeight)) {
            maxWidth = w
            maxHeight = h
        }

        if (w < width || h < height) {
            continue
        }
        if ((closestWidth === 0 || w < closestWidth) || (w === closestWidth && h < closestHeight)) {
            closestWidth = w
            closestHeight = h
        }
    }
    return closestWidth === 0 ? [maxWidth, maxHeight] : [closestWidth, closestHeight]
}