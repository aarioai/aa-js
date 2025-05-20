import {describe, expect, test} from "@jest/globals";
import {sortObjectMap} from "./func";


describe('func', () => {


    test('sortObjectMap', () => {
        const src = {b: 2, a: 1, c: 3}
        expect(sortObjectMap(src)).toEqual({a: 1, b: 2, c: 3})
    })
})