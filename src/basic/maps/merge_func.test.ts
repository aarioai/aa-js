import {describe, expect, test} from '@jest/globals'
import {assign} from './merge_func'

describe('map objects merging functions', () => {
    test('assign', () => {
        const source = undefined
        expect(assign(source, {name: 'Aario'})).toEqual({name: 'Aario'})
        expect(assign(null, {name: 'Aario'})).toEqual({name: 'Aario'})
    })
})