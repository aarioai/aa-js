import {describe, expect, test} from "@jest/globals";
import {len} from "./func";

describe('len', () => {
    test('len null', () => {
        expect(len(null)).toBe(0)
    })
    test('len undefined', () => {
        expect(len(undefined)).toBe(0)
    })
    test('len .300', () => {
        expect(len(.300)).toBe(3)
    })
    test('len 123.45', () => {
        expect(len(123.45)).toBe(6)
    })
    test('len {a: 1, b: 2}', () => {
        expect(len({a: 1, b: 2})).toBe(2)
    })
    test('len [1,2,3]', () => {
        expect(len([1, 2, 3])).toBe(3)
    })

    class LenTester {
        get len() {
            return 100
        }
    }

    test('len class', () => {
        expect(len(new LenTester())).toBe(100)
    })

    test('len Map', () => {
        const m = new Map()
        m.set("Content-Type", "text/plain")
        m.set("Accept", "*/*")
        expect(len(m)).toBe(2)
    })

    test('len Header', () => {
        const header = new Headers()
        header.set("Content-Type", "text/plain")
        header.set("Accept", "*/*")
        expect(len(header)).toBe(2)
    })
})