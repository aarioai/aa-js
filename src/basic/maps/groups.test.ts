import {describe, expect, test} from '@jest/globals'
import {assignObjects} from './groups'

describe('map objects merging functions', () => {
    test('assignMapObject', () => {
        const source = undefined
        expect(assignObjects(source, {name: 'Aario'})).toEqual({name: 'Aario'})
        expect(assignObjects(null, {name: 'Aario'})).toEqual({name: 'Aario'})
    })
})