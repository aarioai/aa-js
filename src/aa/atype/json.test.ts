import {describe, expect, test} from '@jest/globals';
import json from "./json";

describe('json.Marshal', () => {
    test('json.Marshal null', () => {
        expect(json.Marshal(null)).toBe('null')
    })

    test('json.Marshal undefined', () => {
        expect(json.Marshal(undefined)).toBe('null')
    })

    test('json.Marshal {}', () => {
        expect(json.Marshal({})).toBe('{}')
    })

    test('json.Marshal {a: 1, b: 2n}', () => {
        expect(json.Marshal({a: 1, b: 2n})).toBe('{"a":1,"b":"2"}')
    })
})


describe('json.Unmarshal', () => {

})