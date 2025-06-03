import {describe, expect, test} from '@jest/globals'
import {assignDict, union} from './groups'

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
})