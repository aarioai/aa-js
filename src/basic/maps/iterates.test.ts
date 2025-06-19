import {describe, expect, test} from "@jest/globals";
import {sortKV} from './iterates'


describe('map object rebuild functions', () => {
    test('sortObjectMap', () => {
        const src = {b: 2, a: 1, c: 3}
        const result = sortKV(src, (key: string, value: number | undefined) => `${key}=${value || ''}`).join('&')
        expect(result).toBe('a=1&b=2&c=3')
    })
})