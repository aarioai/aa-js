import {describe, expect, test} from '@jest/globals'
import {setNX} from './kv'


describe('map object key-value functions', () => {
    test('setNX', () => {
        expect(setNX({}, 'name', 'Aario')).toEqual({name: 'Aario'})
        expect(setNX(undefined, 'name', 'Aario')).toEqual({name: 'Aario'})
        expect(setNX({name: ''}, 'name', 'Aario')).toEqual({name: ''})
        expect(setNX({name: ''}, 'name', 'Aario', new Set(['']))).toEqual({name: 'Aario'})
        expect(setNX({name: 'Tom'}, 'name', 'Aario')).toEqual({name: 'Tom'})
    })
})