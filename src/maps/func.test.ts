import {describe, expect, test} from "@jest/globals";
import {cloneMap, cloneObjectMap, sortObjectMap} from "./func";


describe('func', () => {

    test('clone a standard Map', () => {
        const a = 100
        const b = {name: "Aario"}
        const source = new Map<string, unknown>([['a', a], ['b', b]])
        const target = cloneMap(source)
        expect(target).toBeInstanceOf(Map)
        expect(target).not.toBe(source)
        expect(target.get('a')).toBe(100)
        expect(target.get('b')).toEqual(b)
        expect(target.get('b')).not.toBe(b)
        expect(Array.from(target.entries())).toEqual(Array.from(source.entries()))
    })

    test('clone a Map subclass', () => {
        class CustomMap<K, V> extends Map<K, V> {
            test() {
                return 'OK'
            }
        }

        const a = 200
        const b = {name: "Aario"}
        const source = new CustomMap<string, unknown>([['a', a], ['b', b]])
        const target = cloneMap(source)

        expect(target).toBeInstanceOf(Map)
        expect(target).toBeInstanceOf(CustomMap)
        expect(target.test()).toBe('OK')
        expect(target).not.toBe(source)
        expect(target.get('a')).toBe(100)
        expect(target.get('b')).toEqual(b)
        expect(target.get('b')).not.toBe(b)
        expect(Array.from(target.entries())).toEqual(Array.from(source.entries()))
    })

    test('cloneObjectMap', () => {
        let source = {"name": "Aario"}
        let target = cloneObjectMap(source)
        source.name = "Tom"
        expect(target).toEqual({"name": "Aario"})
        expect(source).toEqual({"name": "Tom"})
    })


    test('sortObjectMap', () => {
        const src = {b: 2, a: 1, c: 3}
        expect(sortObjectMap(src)).toEqual({a: 1, b: 2, c: 3})
    })
})