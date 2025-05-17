import {describe, expect, test} from "@jest/globals";
import {escapeRegExp} from "./format_regexp";

describe('escapeRegExp', () => {
    test('escapeRegExp a/b.txt', () => {
        expect(escapeRegExp('a/b.txt')).toBe('a\/b\\.txt')
    })

    test('escapeRegExp a/b.txt', () => {
        const text = 'a/b/c/d/e/f/g'
        const replace = escapeRegExp('/')
        expect(text.replace(new RegExp(replace, 'g'), ' ')).toBe(text.replaceAll('/', ' '))
    })
})

