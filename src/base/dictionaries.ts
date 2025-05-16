import {sprintf} from "./format";

export type Dictionary = Record<string, string>
export type Dictionaries = Record<string, string | Dictionary>

/**
 * Translate formatted string
 *
 * @example
 * translate({'I LOVE %s':'我爱%s'}, "I LOVE %s", "你")    ===>   我爱你
 */
export function translate(d: Dictionary | undefined, format: string, ...args: any[]): string {
    if (d && d.hasOwnProperty(format) && d[format]) {
        format = d[format]
    }
    return sprintf(format, ...args)

}