import {describe, expect, test} from "@jest/globals";
import {divideBigint} from "./types_cast_decimal";


describe('divideBigint', () => {

    test('basic bigint division', () => {
        expect(divideBigint(100n, 2n)).toBe(50)
        expect(divideBigint(100n, 3n).toFixed(4)).toBe('33.3333')
        expect(Number(divideBigint(-100n, 3n).toFixed(4))).toBe(-33.3333)
    })
})