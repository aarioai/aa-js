import {describe, test} from '@jest/globals'
import AaURL from './url'
import {NewChangeReferrerError, URLPathError} from './base'

describe('AaURL with absolute URL', () => {

    test(`AaURL simple`, () => {
        const base = 'https://luexu.com/api/v1/users/{uid:uint64}'
        const url = new AaURL(base)
        expect(() => url.href).toThrow(URLPathError)

        url.setParam('uid', 10000n)
        expect(url.host).toBe('luexu.com')
        expect(url.pathname).toBe('/api/v1/users/%7Buid:uint64%7D')
        expect(url.href).toBe('https://luexu.com/api/v1/users/10000')

        url.setParam('name', 'Aario')
        expect(url.href).toBe('https://luexu.com/api/v1/users/10000?name=Aario')
        url.setParams({
            nation: 'China',
            age: '80',
        })
        expect(url.href).toBe('https://luexu.com/api/v1/users/10000?age=80&name=Aario&nation=China')
        url.deleteParam('age')
        expect(url.href).toBe('https://luexu.com/api/v1/users/10000?name=Aario&nation=China')

        url.resetParams({
            uid: 1,
            nation: 'Singapore',
            redirect: '',
        })
        expect(url.href).toBe('https://luexu.com/api/v1/users/1?nation=Singapore')
        url.tidy = false
        expect(url.href).toBe('https://luexu.com/api/v1/users/1?nation=Singapore&redirect=')
    })


})


describe('AaURL with relative URL', () => {
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

    test(`AaURL simple relative URL`, () => {
        const base = '/api/v1/users/{uid:uint64}/groups/{group_tag}?redirect={refer}'
        const url = new AaURL(base)
        expect(() => url.href).toThrow(URLPathError)

        url.setParam('uid', 10000n)
        expect(() => url.toString()).toThrow(URLPathError)

        url.setParams({
            group_tag: 'classmates',
        })
        expect(url.host).toBe('luexu.com')
        expect(url.pathname).toBe('/api/v1/users/%7Buid:uint64%7D/groups/%7Bgroup_tag%7D')
        expect(url.toString()).toBe('https://luexu.com/api/v1/users/10000/groups/classmates')

        url.setParam('name', 'Aario')
        expect(url.href).toBe('https://luexu.com/api/v1/users/10000/groups/classmates?name=Aario')
        url.setParams({
            nation: 'China',
            age: '80',
        })
        expect(url.href).toBe('https://luexu.com/api/v1/users/10000/groups/classmates?age=80&name=Aario&nation=China')
        url.deleteParam('age')
        expect(url.href).toBe('https://luexu.com/api/v1/users/10000/groups/classmates?name=Aario&nation=China')

        url.tidy = false
        expect(url.href).toBe('https://luexu.com/api/v1/users/10000/groups/classmates?name=Aario&nation=China&redirect=&refer=')

        expect(() => url.resetParams({
            uid: 1,
            group_tag: 'friends',
            nation: 'Singapore',
            redirect: 'R1',  // redirect is alias to 'refer', so this setting is useless
        })).toThrow(NewChangeReferrerError('redirect', 'refer'))


        url.resetParams({
            uid: 1,
            group_tag: 'friends',
            nation: 'Singapore',
            refer: 'R2',
        })
        expect(url.toString()).toBe('https://luexu.com/api/v1/users/1/groups/friends?nation=Singapore&redirect=R2&refer=R2')
    })

})