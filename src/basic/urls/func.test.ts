import {describe, expect, test} from '@jest/globals';
import {
    deepDecodeURI,
    deepEncodeURI,
    joinURL,
    normalizeURL,
    normalizeURLWithMethod,
    revertURLPathParams,
    splitURLHost,
    splitURLMethod
} from './func';
import {URLPathError} from './base'

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
    const urlPatternNoParams = 'https://luexu.com/m'
    const urlPatternSimple = 'https://luexu.com/api/v1/users/{uid}'
    const urlPatternTyped = 'https://luexu.com/api/v1/users/{uid:uint64}'
    const urlPatternMixed = 'https://luexu.com/api/v1/users/{uid:uint64}/records/page/{page}'
    const urlPatternComplex = '/api/v1/users/{uid:uint64}/records/page/{page:int}#{hash:string}?redirect={redirect}'

    test('revertURLPathParams MapObject', () => {
        expect(revertURLPathParams(urlPatternNoParams, {uid: 1000n})).toEqual({
            url: urlPatternNoParams,
            search: {uid: "1000"},
            ok: true
        })

        expect(() => revertURLPathParams(urlPatternSimple, {})).toThrow(URLPathError)
        expect(() => revertURLPathParams(urlPatternSimple, {uid: ''})).toThrow(URLPathError)
        expect(revertURLPathParams(urlPatternSimple, {uid: 0n})).toEqual({
            url: 'https://luexu.com/api/v1/users/0',
            search: {},
            ok: true
        })
        expect(revertURLPathParams(urlPatternSimple, {uid: 1000n, hash: 'end'})).toEqual({
            url: 'https://luexu.com/api/v1/users/1000',
            search: {hash: 'end'},
            ok: true
        })

        expect(() => revertURLPathParams(urlPatternTyped, {uid: 'uid', hash: 'end'})).toThrow()
        expect(revertURLPathParams(urlPatternMixed, {uid: 0n, page: 1, hash: 'end'})).toEqual({
            url: 'https://luexu.com/api/v1/users/0/records/page/1',
            search: {hash: 'end'},
            ok: true
        })
        expect(revertURLPathParams(urlPatternComplex, {uid: 1000n, page: 1, hash: 'end'})).toEqual({
            url: '/api/v1/users/1000/records/page/1#end?redirect=',
            search: {},
            ok: true
        })
    })

    test('revertURLPathParams Map', () => {

        expect(revertURLPathParams(urlPatternNoParams, new Map([['uid', 1000n]]))).toEqual({
            url: urlPatternNoParams,
            search: {uid: "1000"},
            ok: true
        })

        expect(() => revertURLPathParams(urlPatternSimple, new Map())).toThrow(URLPathError)
        expect(() => revertURLPathParams(urlPatternSimple, new Map([['uid', '']]))).toThrow(URLPathError)
        expect(revertURLPathParams(urlPatternSimple, new Map([['uid', 0n]]))).toEqual({
            url: 'https://luexu.com/api/v1/users/0',
            search: {},
            ok: true
        })
        expect(revertURLPathParams(urlPatternSimple, new Map<string, unknown>([['uid', 1000n], ['hash', 'end']]))).toEqual({
            url: 'https://luexu.com/api/v1/users/1000',
            search: {hash: 'end'},
            ok: true
        })

        expect(() => revertURLPathParams(urlPatternTyped, new Map<string, unknown>([['uid', 'uid'], ['hash', 'end']]))).toThrow()
        expect(revertURLPathParams(urlPatternMixed, new Map<string, unknown>([['uid', 0n], ['page', 1], ['hash', 'end']]))).toEqual({
            url: 'https://luexu.com/api/v1/users/0/records/page/1',
            search: {hash: 'end'},
            ok: true
        })
        expect(revertURLPathParams(urlPatternComplex, new Map<string, unknown>([['uid', 1000n], ['page', 1], ['hash', 'end']]))).toEqual({
            url: '/api/v1/users/1000/records/page/1#end?redirect=',
            search: {},
            ok: true
        })
    })

    test('revertURLPathParams URLSearchParams', () => {
        expect(revertURLPathParams(urlPatternNoParams, new URLSearchParams('uid=1000'))).toEqual({
            url: urlPatternNoParams,
            search: {uid: "1000"},
            ok: true
        })

        expect(() => revertURLPathParams(urlPatternSimple, new URLSearchParams(''))).toThrow(URLPathError)
        expect(() => revertURLPathParams(urlPatternSimple, new URLSearchParams('uid=&page=2'))).toThrow(URLPathError)
        expect(revertURLPathParams(urlPatternSimple, new URLSearchParams('uid=0'))).toEqual({
            url: 'https://luexu.com/api/v1/users/0',
            search: {},
            ok: true
        })
        expect(revertURLPathParams(urlPatternSimple, new URLSearchParams('uid=1000&hash=end'))).toEqual({
            url: 'https://luexu.com/api/v1/users/1000',
            search: {hash: 'end'},
            ok: true
        })

        expect(() => revertURLPathParams(urlPatternTyped, new URLSearchParams('uid=uid&hash=end'))).toThrow()


        expect(revertURLPathParams(urlPatternMixed, new URLSearchParams('uid=0&page=1&hash=end'))).toEqual({
            url: 'https://luexu.com/api/v1/users/0/records/page/1',
            search: {hash: 'end'},
            ok: true
        })

        expect(revertURLPathParams(urlPatternComplex, new URLSearchParams('uid=1000&page=1&hash=end'))).toEqual({
            url: '/api/v1/users/1000/records/page/1#end?redirect=',
            search: {},
            ok: true
        })
    })


})