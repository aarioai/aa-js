import {HashAliasName, URLBase, URLPathError} from './base'
import {describe, expect, test} from '@jest/globals'
import {revertURLPathParams} from './func'
import SearchParams from './search_params'
import SearchReference from './search_reference'

function testURLBaseAlias(received: URLBase, expected: URLBase) {
    const {base, hash, search} = received
    expect(base).toBe(expected.base)
    expect(hash).toBe(expected.hash)
    expect(search.sort().toString()).toBe(expected.search.sort().toString())
    expect(search.references.data).toEqual(expected.search.references.data)
}


describe('revertURLPathParams', () => {

    test('revertURLPathParams Alias', () => {
        const urlPattern = 'https://luexu.com/api/v1/users/{uid:uint64}/records/page/{page:int}?redirect={refer}&win={top:bool}#{hash:string}'
        const params = {
            'uid': 123n,
            'page': 100,
        }
        let search = new SearchParams({redirect: ''})
        search.references = new SearchReference([[HashAliasName, ['hash', ':string']], ['redirect', ['refer', ':string']], ['win', ['top', ':bool']]])
        testURLBaseAlias(revertURLPathParams(urlPattern, params), {
            base: 'https://luexu.com/api/v1/users/123/records/page/100',
            hash: '',
            search: search,
        })


        const urlPatternWithAlias = '/api/v1/users/{uid:uint64}/records/page/{page:int}?sex={gender:uint8}&name={name}#{hash:string}'
        search = new SearchParams({name: 'Aario', sex: 1, gender: 1})
        search.references = new SearchReference([[HashAliasName, ['hash', ':string']], ['sex', ['gender', ':uint8']]])

        testURLBaseAlias(revertURLPathParams(urlPatternWithAlias, {
            uid: 1000n,
            page: 1,
            hash: 'alias',
            name: 'Aario',
            sex: 2,      // sex={gender}
            gender: 1          // sex={gender}  alias has priority
        }), {
            base: '/api/v1/users/1000/records/page/1',
            hash: '#alias',
            search: search,
        })
    })


    const urlPatternNoParams = 'https://luexu.com/m?&mark=true&from=me&&&hello=&uid=1#top'
    const urlPatternSimple = 'https://luexu.com/api/v1/users/{uid}'
    const urlPatternTyped = 'https://luexu.com/api/v1/users/{uid:uint64}#tag?&name=Aario&&age=30&age=18#middle'
    const urlPatternMixed = 'https://luexu.com/api/v1/users/{uid:uint64}/records/page/{page}#middle'
    const urlPatternComplex = '/api/v1/users/{uid:uint64}/records/page/{page:int}?redirect={redirect}#{hash:string}'


    test('revertURLPathParams MapObject', () => {
        let search = new SearchParams({mark: "true", from: "me", hello: "", uid: "1000"})
        testURLBaseAlias(revertURLPathParams(urlPatternNoParams, {uid: 1000n}), {
            base: 'https://luexu.com/m',
            hash: '#top',
            search: search
        })

        expect(() => revertURLPathParams(urlPatternSimple, {})).toThrow(URLPathError)
        expect(() => revertURLPathParams(urlPatternSimple, {uid: ''})).toThrow(URLPathError)

        search = new SearchParams()
        testURLBaseAlias(revertURLPathParams(urlPatternSimple, {uid: 0n}), {
            base: 'https://luexu.com/api/v1/users/0',
            hash: '',
            search: search,
        })
        search = new SearchParams({hash: 'end'})
        testURLBaseAlias(revertURLPathParams(urlPatternSimple, {uid: 1000n, hash: 'end'}), {
            base: 'https://luexu.com/api/v1/users/1000',
            hash: '',
            search: search
        })

        expect(() => revertURLPathParams(urlPatternTyped, {uid: 'uid', hash: 'end'})).toThrow()

        search = new SearchParams({page: '1', hash: 'end', name: 'Aario', age: '18'})
        testURLBaseAlias(revertURLPathParams(urlPatternTyped, {uid: 0n, page: 1, hash: 'end'}), {
            base: 'https://luexu.com/api/v1/users/0',
            hash: '#middle',
            search: search,
        })
        search = new SearchParams({hash: 'end'})
        testURLBaseAlias(revertURLPathParams(urlPatternMixed, {uid: 0n, page: 1, hash: 'end'}), {
            base: 'https://luexu.com/api/v1/users/0/records/page/1',
            hash: '#middle',
            search: search,
        })
        search = new SearchParams({redirect: ''})
        search.references = new SearchReference([[HashAliasName, ['hash', ':string']]])
        testURLBaseAlias(revertURLPathParams(urlPatternComplex, {uid: 1000n, page: 1, hash: 'end'}), {
            base: '/api/v1/users/1000/records/page/1',
            hash: '#end',
            search: search,
        })
        search = new SearchParams({redirect: ''})
        search.references = new SearchReference([[HashAliasName, ['hash', ':string']]])
        testURLBaseAlias(revertURLPathParams(urlPatternComplex, {uid: 1000n, page: 1, hash: 'end'}), {
            base: '/api/v1/users/1000/records/page/1',
            hash: '#end',
            search: search,
        })
    })

    test('revertURLPathParams Map', () => {
        let search = new SearchParams({mark: "true", from: "me", hello: "", uid: "1000"})
        testURLBaseAlias(revertURLPathParams(urlPatternNoParams, new Map([['uid', 1000n]])), {
            base: 'https://luexu.com/m',
            hash: '#top',
            search: search,
        })

        expect(() => revertURLPathParams(urlPatternSimple, new Map())).toThrow(URLPathError)
        expect(() => revertURLPathParams(urlPatternSimple, new Map([['uid', '']]))).toThrow(URLPathError)

        search = new SearchParams()
        testURLBaseAlias(revertURLPathParams(urlPatternSimple, new Map([['uid', 0n]])), {
            base: 'https://luexu.com/api/v1/users/0',
            hash: '',
            search: search,
        })

        search = new SearchParams({hash: 'end'})
        testURLBaseAlias(revertURLPathParams(urlPatternSimple, new Map<string, unknown>([['uid', 1000n], ['hash', 'end']])), {
            base: 'https://luexu.com/api/v1/users/1000',
            hash: '',
            search: search,
        })

        expect(() => revertURLPathParams(urlPatternTyped, new Map<string, unknown>([['uid', 'uid'], ['hash', 'end']]))).toThrow()


        search = new SearchParams({page: '1', hash: 'end', name: 'Aario', age: '18'})
        testURLBaseAlias(revertURLPathParams(urlPatternTyped, new Map<string, unknown>([['uid', 0n], ['hash', 'end'], ['page', 1]])), {
            base: 'https://luexu.com/api/v1/users/0',
            hash: '#middle',
            search: search,
        })

        search = new SearchParams({hash: 'end'})
        testURLBaseAlias(revertURLPathParams(urlPatternMixed, new Map<string, unknown>([['uid', 0n], ['page', 1], ['hash', 'end']])), {
            base: 'https://luexu.com/api/v1/users/0/records/page/1',
            hash: '#middle',
            search: search,
        })

        search = new SearchParams({redirect: ''})
        search.references = new SearchReference([[HashAliasName, ['hash', ':string']]])
        testURLBaseAlias(revertURLPathParams(urlPatternComplex, new Map<string, unknown>([['uid', 1000n], ['page', 1], ['hash', 'end']])), {
            base: '/api/v1/users/1000/records/page/1',
            hash: '#end',
            search: search,
        })
    })

    test('revertURLPathParams URLSearchParams', () => {
        let search = new SearchParams({mark: "true", from: "me", hello: "", uid: "1000"})
        testURLBaseAlias(revertURLPathParams(urlPatternNoParams, new URLSearchParams('uid=1000')), {
            base: 'https://luexu.com/m',
            hash: '#top',
            search: search,
        })

        expect(() => revertURLPathParams(urlPatternSimple, new URLSearchParams(''))).toThrow(URLPathError)
        expect(() => revertURLPathParams(urlPatternSimple, new URLSearchParams('uid=&page=2'))).toThrow(URLPathError)

        search = new SearchParams()
        testURLBaseAlias(revertURLPathParams(urlPatternSimple, new URLSearchParams('uid=0')), {
            base: 'https://luexu.com/api/v1/users/0',
            hash: '',
            search: search,
        })

        search = new SearchParams({hash: 'end'})
        testURLBaseAlias(revertURLPathParams(urlPatternSimple, new URLSearchParams('uid=1000&hash=end')), {
            base: 'https://luexu.com/api/v1/users/1000',
            hash: '',
            search: search,
        })


        expect(() => revertURLPathParams(urlPatternTyped, new URLSearchParams('uid=uid&hash=end'))).toThrow()


        search = new SearchParams({page: '1', hash: 'end', name: 'Aario', age: '18'})
        testURLBaseAlias(revertURLPathParams(urlPatternTyped, new URLSearchParams('uid=0&page=1&hash=end')), {
            base: 'https://luexu.com/api/v1/users/0',
            hash: '#middle',
            search: search,
        })


        search = new SearchParams({hash: 'end'})
        testURLBaseAlias(revertURLPathParams(urlPatternMixed, new URLSearchParams('uid=0&page=1&hash=end')), {
            base: 'https://luexu.com/api/v1/users/0/records/page/1',
            hash: '#middle',
            search: search,
        })


        search = new SearchParams({redirect: ''})
        search.references = new SearchReference([[HashAliasName, ['hash', ':string']]])
        testURLBaseAlias(revertURLPathParams(urlPatternComplex, new URLSearchParams('uid=1000&page=1&hash=end')), {
            base: '/api/v1/users/1000/records/page/1',
            hash: '#end',
            search: search
        })
    })
})

