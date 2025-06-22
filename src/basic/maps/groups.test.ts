import {describe, expect, test} from '@jest/globals'
import {assignDict, union} from './groups'
import {Dict} from '../../aa/atype/a_define_interfaces.ts'

describe('map objects merging functions', () => {
    test('assignMapObject', () => {
        const source = undefined
        expect(assignDict(source, {name: 'Aario'})).toEqual({name: 'Aario'})
        expect(assignDict(null, {name: 'Aario'})).toEqual({name: 'Aario'})
    })
})

describe('union', () => {
    test('union', () => {
        expect(union({a: 100, b: 200}, {b: 1, c: 2})).toEqual({a: 100, b: 1, c: 2})
        expect(union({a: {aa: {aaa: 1}}}, {a: {aa: {bbb: 2}, ab: 2}})).toEqual({a: {aa: {aaa: 1, bbb: 2}, ab: 2}})
        expect(union({a: [100]}, {a: [200]}, false)).toEqual({a: [200]})
    })

    test('union header', () => {
        const headerA = new Headers()
        headerA.set('X-A', 'A')
        headerA.set('X-C', 'C')

        const headerB = new Headers()
        headerB.set('X-B', 'B')
        headerB.set('X-D', 'D')

        const result = union({a: {aa: headerA}}, {a: {aa: headerB, ab: 2}}) as Dict
        const a = result.a as Dict
        const aa = a.aa as Headers
        expect(a.ab).toBe(2)
        expect(aa.get('X-A')).toBe('A')
        expect(aa.get('X-B')).toBe('B')
        expect(aa.get('X-C')).toBe('C')
        expect(aa.get('X-D')).toBe('D')
    })
})