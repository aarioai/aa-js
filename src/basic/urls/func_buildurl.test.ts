import {describe} from '@jest/globals'
import {buildURL, revertURLPathParams} from './func'
import {Descend} from '../../aa/atype/const'

describe('buildURL', () => {
    test('buildURL simple', () => {
        const urlPattern = 'https://luexu.com/api/v1/users/{uid:uint64}/records/page/{page:int}?redirect={redirect}#{hash:string}'
        const params = {
            'uid': 123n,
            'page': 100,
        }
        const {base, hash, search} = revertURLPathParams(urlPattern, params)
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100')
        search.tidy = false
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?redirect=')
    })

    test('buildURL with descending sort', () => {
        const urlPattern = 'https://luexu.com/api/v1/users/{uid:uint64}/records/page/{page:int}?redirect={redirect}#{hash:string}'
        const params = {
            'uid': 123n,
            'page': 100,
            'name': 'Aario',
            'age': '18',
            'zig': 'zag',
        }
        const {base, hash, search} = revertURLPathParams(urlPattern, params)
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?age=18&name=Aario&zig=zag')
        search.tidy = false
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?age=18&name=Aario&redirect=&zig=zag')
        search.tidy = true
        search.sort(Descend)
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?zig=zag&name=Aario&age=18')
        search.tidy = false
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?zig=zag&redirect=&name=Aario&age=18')
    })
})