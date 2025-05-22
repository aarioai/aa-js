import {describe, expect, test} from '@jest/globals';
import {
    deepDecodeURI,
    deepEncodeURI,
    joinURL,
    normalizeURL,
    normalizeURLWithMethod,
    parseURLSearch,
    revertURLPathParams,
    splitURLHost,
    splitURLMethod,
    splitURLSearch
} from './func';
import {URLBase, URLPathError} from './base'
import {SearchParams} from './search_params'

function testURLBase(received: URLBase, expected: URLBase) {
    const {base, hash, search} = received
    expect(base).toBe(expected.base)
    expect(hash).toBe(expected.hash)
    expect(search.sort().toString()).toBe(expected.search.sort().toString())
}

describe('url func', () => {
    test('deepDecodeURI', () => {
        expect(deepDecodeURI('hello%2520world')).toBe('hello world')
        expect(deepDecodeURI('hello%20world')).toBe('hello world')
        expect(deepDecodeURI('hello world')).toBe('hello world')
        expect(deepDecodeURI('/hello%20world')).toBe('/hello world')
    })
    test('encodeURI', () => {
        expect(deepEncodeURI('hello%2520world')).toBe('hello%20world')
        expect(deepEncodeURI('hello%20world')).toBe('hello%20world')
        expect(deepEncodeURI('hello world')).toBe('hello%20world')
        expect(deepEncodeURI('/hello world')).toBe('%2Fhello%20world')
    })
    test('splitURLMethod', () => {
        expect(splitURLMethod('//luexu.com/m')).toEqual({method: '', url: '//luexu.com/m'})
        expect(splitURLMethod('GET //luexu.com/m')).toEqual({method: 'GET', url: '//luexu.com/m'})
        expect(splitURLMethod('Put //luexu.com/m')).toEqual({method: 'PUT', url: '//luexu.com/m'})
        expect(splitURLMethod('ANY //luexu.com/m')).toEqual({method: '', url: 'ANY //luexu.com/m'})
    })

    test('splitURLHost', () => {
        expect(splitURLHost('https://luexu.com/m')).toEqual({host: 'https://luexu.com', path: '/m'})
        expect(splitURLHost('//luexu.com/m')).toEqual({host: '//luexu.com', path: '/m'})
        expect(splitURLHost('luexu.com/m')).toEqual({host: '', path: 'luexu.com/m'})
        expect(splitURLHost('/m')).toEqual({host: '', path: '/m'})
    })

    test('isURLSearchPattern', () => {
        expect(parseURLSearch('')).toEqual({valid: true, search: {}})
        expect(parseURLSearch('a=')).toEqual({valid: true, search: {a: ''}})
        expect(parseURLSearch('a=100&b=20')).toEqual({valid: true, search: {a: '100', b: '20'}})
        expect(parseURLSearch('a=100&&b=20')).toEqual({valid: true, search: {a: '100', b: '20'}})
        expect(parseURLSearch('a')).toEqual({valid: false, search: {}})
        expect(parseURLSearch('a=100&b')).toEqual({valid: false, search: {}})
        expect(parseURLSearch('a={a}')).toEqual({valid: true, search: {a: '{a}'}})
        expect(parseURLSearch('a={a:uint}')).toEqual({valid: true, search: {a: '{a:uint}'}})
        expect(parseURLSearch('a={a:uint}&&&key={key_value}')).toEqual({
            valid: true,
            search: {a: '{a:uint}', key: '{key_value}'}
        })
    })


    test('splitURLSearch', () => {
        testURLBase(splitURLSearch('https://luexu.com/m?name={name}&age=30'), {
            base: 'https://luexu.com/m',
            hash: '',
            search: new SearchParams({name: '{name}', age: '30'})
        })
        testURLBase(splitURLSearch('/api/v1/users/{user:uint64}/favorites/page/{page}#hash0#{hash1:string}?name=Aario#hash2#{hash2}&age=30?age=18&sex=male#{hash3}#{hash3:string}'), {
            base: '/api/v1/users/{user:uint64}/favorites/page/{page}',
            hash: '#{hash3:string}',
            search: new SearchParams({name: 'Aario', age: '18', sex: 'male'})
        })
    })
})


describe('url func with mock location', () => {
    const mockURL = 'https://luexu.com/about/rule/user'

    beforeEach(() => {
        delete (window as any).location
        const mockLocation = new URL(mockURL) as any
        mockLocation.assign = jest.fn()
        mockLocation.replace = jest.fn()
        mockLocation.reload = jest.fn()
        Object.defineProperty(window, 'location', {
            value: mockLocation,
            writable: true
        })
    })

    test('mock location', () => {
        expect(window.location.href).toBe(mockURL)
        expect(window.location.protocol).toBe('https:')
        expect(window.location.origin).toBe('https://luexu.com')
    })

    test('normalizeURL', () => {
        expect(normalizeURL('//luexu.com/m')).toBe('https://luexu.com/m')
        expect(normalizeURL('GET /m')).toBe('https://luexu.com/m')
        expect(normalizeURL('GET /m', true)).toBe('GET https://luexu.com/m')
        expect(normalizeURL('user_privacy')).toBe('https://luexu.com/about/rule/user_privacy')
        expect(normalizeURL('./user_privacy')).toBe('https://luexu.com/about/rule/user_privacy')
        expect(normalizeURL('../us')).toBe('https://luexu.com/about/us')
    })

    test('normalizeURLWithMethod', () => {
        expect(normalizeURLWithMethod('//luexu.com/m')).toEqual({method: '', url: 'https://luexu.com/m'})
        expect(normalizeURLWithMethod('GET /m')).toEqual({method: 'GET', url: 'https://luexu.com/m'})
        expect(normalizeURLWithMethod('post user_privacy')).toEqual({
            method: 'POST',
            url: 'https://luexu.com/about/rule/user_privacy'
        })
        expect(normalizeURLWithMethod('Get ./user_privacy')).toEqual({
            method: 'GET',
            url: 'https://luexu.com/about/rule/user_privacy'
        })
        expect(normalizeURLWithMethod('Delete ../us')).toEqual({method: 'DELETE', url: 'https://luexu.com/about/us'})
    })


    test('joinURL', () => {
        expect(joinURL('https://luexu.com', 'api', 'v1/users')).toBe('https://luexu.com/api/v1/users')
        expect(joinURL('/api/', '/users/', '/1/')).toBe('https://luexu.com/api/users/1/')
        expect(joinURL('/api/v1', '../.', 'v2', 'test')).toBe('https://luexu.com/api/v2/test')
    })
})

describe('revertURLPathParams', () => {
    const urlPatternNoParams = 'https://luexu.com/m?&mark=true&from=me&&&hello=&uid=1#top'
    const urlPatternSimple = 'https://luexu.com/api/v1/users/{uid}'
    const urlPatternTyped = 'https://luexu.com/api/v1/users/{uid:uint64}#tag?&name=Aario&&age=30&age=18#middle'
    const urlPatternMixed = 'https://luexu.com/api/v1/users/{uid:uint64}/records/page/{page}#middle'
    const urlPatternComplex = '/api/v1/users/{uid:uint64}/records/page/{page:int}?redirect={redirect}#{hash:string}'
    const urlPatternWithAlias = '/api/v1/users/{uid:uint64}/records/page/{page:int}?sex={gender}&name={name}#{hash:string}'


    test('revertURLPathParams MapObject', () => {

        const urlPattern = 'https://luexu.com/api/v1/users/{uid:uint64}/records/page/{page:int}?redirect={redirect}#{hash:string}'
        const params = {
            'uid': 123n,
            'page': 100,
        }
        testURLBase(revertURLPathParams(urlPattern, params), {
            base: 'https://luexu.com/api/v1/users/123/records/page/100',
            hash: '',
            search: new SearchParams({redirect: ''})
        })


        testURLBase(revertURLPathParams(urlPatternWithAlias, {
            uid: 1000n,
            page: 1,
            hash: 'alias',
            name: 'Aario',
            sex: 'female',
            gender: 'male'          // sex={gender}  alias has priority
        }), {
            base: '/api/v1/users/1000/records/page/1',
            hash: '#alias',
            search: new SearchParams({name: 'Aario', sex: 'male', gender: 'male'}),
        })


        testURLBase(revertURLPathParams(urlPatternNoParams, {uid: 1000n}), {
            base: 'https://luexu.com/m',
            hash: '#top',
            search: new SearchParams({mark: "true", from: "me", hello: "", uid: "1000"}),
        })

        expect(() => revertURLPathParams(urlPatternSimple, {})).toThrow(URLPathError)
        expect(() => revertURLPathParams(urlPatternSimple, {uid: ''})).toThrow(URLPathError)
        testURLBase(revertURLPathParams(urlPatternSimple, {uid: 0n}), {
            base: 'https://luexu.com/api/v1/users/0',
            hash: '',
            search: new SearchParams(),
        })
        testURLBase(revertURLPathParams(urlPatternSimple, {uid: 1000n, hash: 'end'}), {
            base: 'https://luexu.com/api/v1/users/1000',
            hash: '',
            search: new SearchParams({hash: 'end'}),
        })

        expect(() => revertURLPathParams(urlPatternTyped, {uid: 'uid', hash: 'end'})).toThrow()

        testURLBase(revertURLPathParams(urlPatternTyped, {uid: 0n, page: 1, hash: 'end'}), {
            base: 'https://luexu.com/api/v1/users/0',
            hash: '#middle',
            search: new SearchParams({page: '1', hash: 'end', name: 'Aario', age: '18'}),
        })

        testURLBase(revertURLPathParams(urlPatternMixed, {uid: 0n, page: 1, hash: 'end'}), {
            base: 'https://luexu.com/api/v1/users/0/records/page/1',
            hash: '#middle',
            search: new SearchParams({hash: 'end'}),
        })
        testURLBase(revertURLPathParams(urlPatternComplex, {uid: 1000n, page: 1, hash: 'end'}), {
            base: '/api/v1/users/1000/records/page/1',
            hash: '#end',
            search: new SearchParams({redirect: ''}),
        })

        testURLBase(revertURLPathParams(urlPatternComplex, {uid: 1000n, page: 1, hash: 'end'}), {
            base: '/api/v1/users/1000/records/page/1',
            hash: '#end',
            search: new SearchParams({redirect: ''}),
        })
    })

    test('revertURLPathParams Map', () => {

        testURLBase(revertURLPathParams(urlPatternNoParams, new Map([['uid', 1000n]])), {
            base: 'https://luexu.com/m',
            hash: '#top',
            search: new SearchParams({mark: "true", from: "me", hello: "", uid: "1000"}),
        })

        expect(() => revertURLPathParams(urlPatternSimple, new Map())).toThrow(URLPathError)
        expect(() => revertURLPathParams(urlPatternSimple, new Map([['uid', '']]))).toThrow(URLPathError)
        testURLBase(revertURLPathParams(urlPatternSimple, new Map([['uid', 0n]])), {
            base: 'https://luexu.com/api/v1/users/0',
            hash: '',
            search: new SearchParams(),
        })
        testURLBase(revertURLPathParams(urlPatternSimple, new Map<string, unknown>([['uid', 1000n], ['hash', 'end']])), {
            base: 'https://luexu.com/api/v1/users/1000',
            hash: '',
            search: new SearchParams({hash: 'end'}),
        })

        expect(() => revertURLPathParams(urlPatternTyped, new Map<string, unknown>([['uid', 'uid'], ['hash', 'end']]))).toThrow()


        testURLBase(revertURLPathParams(urlPatternTyped, new Map<string, unknown>([['uid', 0n], ['hash', 'end'], ['page', 1]])), {
            base: 'https://luexu.com/api/v1/users/0',
            hash: '#middle',
            search: new SearchParams({page: '1', hash: 'end', name: 'Aario', age: '18'}),
        })

        testURLBase(revertURLPathParams(urlPatternMixed, new Map<string, unknown>([['uid', 0n], ['page', 1], ['hash', 'end']])), {
            base: 'https://luexu.com/api/v1/users/0/records/page/1',
            hash: '#middle',
            search: new SearchParams({hash: 'end'}),
        })
        testURLBase(revertURLPathParams(urlPatternComplex, new Map<string, unknown>([['uid', 1000n], ['page', 1], ['hash', 'end']])), {
            base: '/api/v1/users/1000/records/page/1',
            hash: '#end',
            search: new SearchParams({redirect: ''}),
        })
    })

    test('revertURLPathParams URLSearchParams', () => {
        testURLBase(revertURLPathParams(urlPatternNoParams, new URLSearchParams('uid=1000')), {
            base: 'https://luexu.com/m',
            hash: '#top',
            search: new SearchParams({mark: "true", from: "me", hello: "", uid: "1000"}),
        })

        expect(() => revertURLPathParams(urlPatternSimple, new URLSearchParams(''))).toThrow(URLPathError)
        expect(() => revertURLPathParams(urlPatternSimple, new URLSearchParams('uid=&page=2'))).toThrow(URLPathError)
        testURLBase(revertURLPathParams(urlPatternSimple, new URLSearchParams('uid=0')), {
            base: 'https://luexu.com/api/v1/users/0',
            hash: '',
            search: new SearchParams(),
        })
        testURLBase(revertURLPathParams(urlPatternSimple, new URLSearchParams('uid=1000&hash=end')), {
            base: 'https://luexu.com/api/v1/users/1000',
            hash: '',
            search: new SearchParams({hash: 'end'}),
        })


        expect(() => revertURLPathParams(urlPatternTyped, new URLSearchParams('uid=uid&hash=end'))).toThrow()

        testURLBase(revertURLPathParams(urlPatternTyped, new URLSearchParams('uid=0&page=1&hash=end')), {
            base: 'https://luexu.com/api/v1/users/0',
            hash: '#middle',
            search: new SearchParams({page: '1', hash: 'end', name: 'Aario', age: '18'}),
        })

        testURLBase(revertURLPathParams(urlPatternMixed, new URLSearchParams('uid=0&page=1&hash=end')), {
            base: 'https://luexu.com/api/v1/users/0/records/page/1',
            hash: '#middle',
            search: new SearchParams({hash: 'end'}),
        })

        testURLBase(revertURLPathParams(urlPatternComplex, new URLSearchParams('uid=1000&page=1&hash=end')), {
            base: '/api/v1/users/1000/records/page/1',
            hash: '#end',
            search: new SearchParams({redirect: ''}),
        })
    })
})

