import {describe} from '@jest/globals'
import {buildURL, revertURLPathParams} from './func'
import {Descend} from '../../aa/atype/const'

describe('buildURL', () => {
    test('buildURL simple', () => {
        const urlPattern = 'https://luexu.com/api/v1/users/{uid:uint64}/records/page/{page:int}?redirect={refer}#{hash:string}'
        const params = {
            'uid': 123n,
            'page': 100,
        }
        const {base, hash, search} = revertURLPathParams(urlPattern, params)
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?x-stringify=1')
        search.tidy = false
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?redirect=&x-stringify=1')

        search.xStringify = false
        search.tidy = true
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100')


    })

    test('buildURL with descending sort', () => {
        const urlPattern = 'https://luexu.com/api/v1/users/{uid:uint64}/records/page/{page:int}?redirect={refer}#{hash:string}'
        const params = {
            'uid': 123n,
            'page': 100,
            'name': 'Aario',
            'age': '18',
            'zig': 'zag',
        }
        const {base, hash, search} = revertURLPathParams(urlPattern, params)
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?age=18&name=Aario&x-stringify=1&zig=zag')
        search.tidy = false
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?age=18&name=Aario&redirect=&x-stringify=1&zig=zag')
        search.tidy = true
        search.sort(Descend)
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?zig=zag&x-stringify=1&name=Aario&age=18')
        search.tidy = false
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?zig=zag&x-stringify=1&redirect=&name=Aario&age=18')
        search.tidy = true
        search.xStringify = false
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?zig=zag&name=Aario&age=18')
    })
})