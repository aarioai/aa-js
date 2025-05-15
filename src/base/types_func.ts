import {a_string} from "./types_extend";

/**
 * Calculates the length/size of any value with consistent fallback behavior.
 *
 * Handles:
 * - null/undefined → 0
 * - Custom .len property (if numeric)
 * - Standard .length property (arrays, strings, etc.)
 * - Numbers → digit count
 * - Objects → key count
 * - Other types → 0
 *
 * @param {unknown} value - The value to measure
 * @returns {number} The length/size (always non-negative integer)
 *
 * @example
 * len(null)            // 0
 * len([1, 2, 3])       // 3
 * len("hello")         // 5
 * len({a: 1, b: 2})    // 2
 * len(123)             // 3
 * len(123.45)          // 6 (including decimal point)
 * len({len: 5})        // 5 (custom length property)
 * len(class A{get len(){return 5}})        // 5 (custom length property)
 */
export function len(value:unknown) :number {
    if(typeof value ==='undefined' || value ===null){
        return 0
    }

    // self-defined property or getter (get len(){ return 10 })
    if(typeof (value as any).len==="number"){
        return (value as any).len
    }

    // string, array or others
    if(typeof (value as any).length==="number"){
        return (value as any).length
    }

    switch(typeof value){
        case 'number':
            return String(value).length
        case 'object':
            return Object.keys(value).length
    }
    return a_string(value).length
}