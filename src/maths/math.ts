import {KB} from "../aa/atype/a_define_units";
import {floatToInt} from '../aa/atype/t_basic'

/**
 * Format bytes to B/KB/MB/GB/TB/PB/EB/ZB/YB
 *
 * @example
 * formatBytes(1024);       // [1, 'KB']
 * formatBytes(1500000, 2); // [1.43, 'MB']
 */
export function formatBytes(bytes: number, decimals: number = 0): [number, string] {
    bytes = !bytes || bytes < 0 ? 0 : bytes
    if (bytes < KB) {
        return [bytes, 'B']
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const dec = Math.max(0, decimals)
    const exponent = Math.min(
        floatToInt(Math.log(bytes) / Math.log(KB)),
        units.length - 1
    )
    const value = bytes / Math.pow(KB, exponent)
    return [parseFloat(value.toFixed(dec)), units[exponent]]
}