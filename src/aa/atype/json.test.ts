import {describe, expect, test} from '@jest/globals';
import json from "./json";

describe('json.Marshal (require node 21+)', () => {
    const bigNumber = 123456789101112131415161718n
    test('json.Marshal empty objects', () => {
        expect(json.Marshal(null)).toBe(null)
        expect(json.Marshal(undefined)).toBe(null)
        expect(json.Marshal({})).toBe('{}')
        expect(json.Marshal([])).toBe('[]')
    })

    test('json.Marshal simple', () => {
        expect(json.Marshal({a: 1, b: bigNumber})).toBe('{"a":1,"b":"123456789101112131415161718"}')
    })

    class A {
        id: number = 100
        jsonkey: string = 'id'

        // toJSON can overwrite server-defined property `jsonkey`
        toJSON() {
            return 'AAA'
        }
    }

    class B {
        value: bigint = 10000n
        jsonkey: string = 'value'
    }

    test('json.Marshal jsonkey', () => {
        expect(json.Marshal({
            a: 1,
            b: 2n,
            Apple: new A(),
            Boy: new B()
        })).toBe('{"a":1,"b":"2","Apple":"AAA","Boy":"10000"}')
    })

})


describe('json.Unmarshal (require node 21+)', () => {
    const bigNumber = 123456789101112131415161718n
    test('json.Unmarshal empty objects', () => {
        expect(json.Unmarshal(null)).toBe(null)
        expect(json.Unmarshal('null')).toBe(null)
        expect(json.Unmarshal(undefined)).toBe(null)
        expect(json.Unmarshal({})).toEqual({})
        expect(json.Unmarshal([])).toEqual([])
        expect(json.Unmarshal('')).toBe(null)
    })

    test('json.Unmarshal simple', () => {
        expect(json.Unmarshal('[123456789101112131415161718, 1, "2"]')).toEqual([bigNumber, 1, "2"])

        expect(json.Unmarshal('{"a":123456789101112131415161718}')).toEqual({a: bigNumber})

        expect(json.Unmarshal('{"a":123456789101112131415161718, "b":[123456789101112131415161718, 1,"2"]}')).toEqual({
            a: bigNumber,
            b: [bigNumber, 1, "2"]
        })
    })

})