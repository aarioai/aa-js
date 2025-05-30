import {describe, expect, test} from '@jest/globals'
import {cloneMap, cloneMapObject, structuredCloneUnsafe} from './clone'


describe('structuredCloneUnsafe on structuredClone enabled', () => {
    test('MapObject', () => {
        let source = {"name": "Aario"}
        expect(() => structuredClone(source)).not.toThrow()
        const {clone, ok} = structuredCloneUnsafe(source)
        source.name = "Tom"

        expect(ok).toBe(true)
        expect(clone).toEqual({"name": "Aario"})
        expect(source).toEqual({"name": "Tom"})
    })
})


describe('structuredCloneUnsafe on structuredClone disabled', () => {
    const sc = (window as any).structuredClone
    beforeEach(() => {
        delete (window as any).structuredClone
    })
    afterEach(() => {
        (window as any).structuredClone = sc
    })
    test('MapObject', () => {
        let source = {"name": "Aario"}
        expect(() => structuredClone(source)).toThrow()
        const {clone, ok} = structuredCloneUnsafe(source)
        source.name = "Tom"

        expect(ok).toBe(false)
        expect(clone).toEqual({"name": "Tom"})
        expect(source).toEqual({"name": "Tom"})
    })
})


describe('clone', () => {


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

        b.name = 'Tom'

        expect(target).toBeInstanceOf(Map)
        expect(target).toBeInstanceOf(CustomMap)
        expect(target.test()).toBe('OK')
        expect(target).not.toBe(source)
        expect(target.get('a')).toBe(a)
        expect(target.get('b')).toEqual({name: 'Aario'})
        expect(target.get('b')).not.toBe(b)
        expect(source.get('a')).toBe(a)
        expect(source.get('b')).toBe(b)
    })


    test('cloneObjectMap', () => {
        let source = {"name": "Aario"}
        let target = cloneMapObject(source)
        source.name = "Tom"
        expect(target).toEqual({"name": "Aario"})
        expect(source).toEqual({"name": "Tom"})
    })

    test('clone a standard Map', () => {
        const a = 100
        const b = {name: "Aario"}
        const source = new Map<string, unknown>([['a', a], ['b', b]])
        const target = cloneMap(source)
        expect(target).toBeInstanceOf(Map)
        expect(target).not.toBe(source)
        expect(target.get('a')).toBe(a)
        expect(target.get('b')).toEqual(b)
        expect(target.get('b')).not.toBe(b)
        expect(Array.from(target.entries())).toEqual(Array.from(source.entries()))
    })
})