import {describe, expect, test} from "@jest/globals";
import {sort} from './iterates'


describe('map object rebuild functions', () => {
    test('sortObjectMap', () => {
        const src = {b: 2, a: 1, c: 3}
        expect(sort(src)).toEqual({a: 1, b: 2, c: 3})
    })
})