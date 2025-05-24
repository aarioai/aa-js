import {escapeRegExp} from "../format/regexp";

export type Dictionary = Record<string, string>
export type Dictionaries = Record<string, Dictionary>

export const NumberPattern = /(\d+(?:\.\d+)?)/.source
export const WordPattern = /([^\s　'"`“”‘’]+)/.source

/**
 * Translate text with support for string formatting
 * %s - A string without whitespace and quote marks
 * %d - A decimal string, includes float and integer
 *
 * @example
 * translate({'I love Mary! And you?':'我爱玛丽！你呢？', 'I love %s! And you?':'我爱%s！你呢？'}, "I love Mary! And you?")
 * // Returns 我爱玛丽！你呢？
 *
 * translate({'I love Mary! And you?':'我爱玛丽！你呢？', 'I love %s! And you?':'我爱%s！你呢？'}, "I love Mary! And you?")
 * // Returns 我爱Lucy！你呢？
 *
 * translate({'Age: %d, Sex: %s':'年龄：%d，性别：%s'}, "Age: 18, Sex: Female")
 * // Returns 年龄：18，性别：Female
 *
 * translate({'Price: %d':'价格：%d'}, "Price: %d", 12.99)
 * // Returns 价格：12.99
 *
 * translate({'Price: %d':'价格：%d'}, "Price: %d", 12)
 * // Returns 价格：12
 */
export function translate(text: string, d?: Dictionary): string {
    if (!d) {
        return text
    }
    if (d[text]) {
        return d[text]
    }
    let {pattern, values} = findDictionaryPattern(text, d)
    return pattern ? translateFormat(pattern, values) : text
}

const dictionaryPatternCache = new Map<string, RegExp>()

export function findDictionaryPattern(text: string, d: Dictionary): { pattern: string, values: string[] } {
    if (d[text]) {
        return {
            pattern: text,
            values: [],
        }
    }
    for (const [pattern, target] of Object.entries(d)) {
        if (!pattern.includes('%')) {
            continue
        }
        let re = dictionaryPatternCache.get(pattern)
        if (!re) {
            let p = escapeRegExp(pattern)
                .replaceAll('%d', NumberPattern)
                .replaceAll('%s', WordPattern)
                .replaceAll(' ', '\\s+')
            // only match the first matched pattern, ignore case
            re = new RegExp(p, 'i')
            dictionaryPatternCache.set(pattern, re)
        }

        const matches = text.match(re)
        if (matches) {
            let values: string[] = []
            const matchText = matches[0]
            const ms = matches.slice(1)
            for (const m of ms) {
                // remove undefined matches from NumberPattern
                if (typeof m !== 'undefined') {
                    values.push(m)
                }
            }
            return {
                pattern: text.replace(matchText, target),
                values: values,
            }
        }
    }
    return {
        pattern: null,
        values: [],
    }
}

export function translateFormat(format: string, values: string[]): string {
    let valueIndex = 0
    return format.replace(/%[sd]/g, () => {
        const value = values[valueIndex++]
        return value ?? ''
    })
}
