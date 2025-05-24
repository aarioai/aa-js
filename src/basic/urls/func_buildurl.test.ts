import {describe} from '@jest/globals'
import {buildURL, revertURLPathParams} from './func'
import {DESCEND} from '../../aa/atype/a_define_funcs'

describe('buildURL', () => {
    test('buildURL simple', () => {
        const urlPattern = 'https://luexu.com/api/v1/users/{uid:uint64}/records/page/{page:int}?redirect={refer}#{hash:string}'
        const params = {
            'uid': 123n,
            'page': 100,
        }
        const {base, hash, search} = revertURLPathParams(urlPattern, params)
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100')
        search.tidy = false
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?redirect=&refer=')

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
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?age=18&name=Aario&zig=zag')
        search.tidy = false
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?age=18&name=Aario&redirect=&refer=&zig=zag')
        search.tidy = true
        search.sort(DESCEND)
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?zig=zag&name=Aario&age=18')
        search.tidy = false
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?zig=zag&refer=&redirect=&name=Aario&age=18')
        search.tidy = true
        expect(buildURL(base, hash, search)).toBe('https://luexu.com/api/v1/users/123/records/page/100?zig=zag&name=Aario&age=18')
    })
})