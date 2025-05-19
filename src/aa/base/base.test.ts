import {describe, expect, test} from '@jest/globals';
import {jsonify} from "./base";

describe('jsonify', () => {
    test('jsonify null', () => {
        expect(jsonify(null)).toBe('null')
    })

    test('jsonify undefined', () => {
        expect(jsonify(undefined)).toBe('null')
    })

    test('jsonify {}', () => {
        expect(jsonify({})).toBe('{}')
    })

    test('jsonify {a: 1, b: 2n}', () => {
        expect(jsonify({a: 1, b: 2n})).toBe('{"a":1,"b":"2"}')
    })
})
