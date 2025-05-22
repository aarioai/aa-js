import {describe, test} from '@jest/globals'
import {SearchParams} from './search_params'

describe('SearchParams', () => {

    function testSearchParams(p: SearchParams) {
        expect(p.has('test')).toBe(false)
        expect(p.has('a')).toBe(true)
        expect(p.has('a', '100')).toBe(false)
        expect(p.has('a', '300')).toBe(true)
        expect(p.has('b')).toBe(true)
        expect(p.get('a')).toBe('300')
        expect(p.get('b')).toBe('{b:uint}')
        expect(p.sort().toString()).toBe('a=300&b=%7Bb%3Auint%7D')

        p.delete('b', 'NO')
        expect(p.get('b')).toBe('{b:uint}')
        p.delete('b', '{b:uint}')
        expect(p.has('b')).toBe(false)
        expect(p.get('b')).toBe(null)

        p.setFromSearch('c=1')
        expect(p.get('c')).toBe('1')
        expect(p.sort().toString()).toBe('a=300&c=1')

        p.setMany('c=2&d=3')
        expect(p.sort().toString()).toBe('a=300&c=2&d=3')
    }

    test(`SearchParams from search string`, () => {
        testSearchParams(new SearchParams('a=100&b={b:uint}&a=300'))
    })
    test(`SearchParams from URLSearchParams`, () => {
        testSearchParams(new SearchParams(new URLSearchParams('a=100&b={b:uint}&a=300')))
    })
    test(`SearchParams from Map Object`, () => {
        testSearchParams(new SearchParams({a: 300, b: '{b:uint}'}))
    })
    test(`SearchParams from Map`, () => {
        testSearchParams(new SearchParams(new Map([
            ['a', '100'],
            ['b', '{b:uint}'],
            ['a', '300'],
        ])))
        testSearchParams(new SearchParams(new Map<string, unknown>([
            ['a', 100],
            ['b', '{b:uint}'],
            ['a', 300],
        ])))
    })
})

