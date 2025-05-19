import {describe, expect, test} from "@jest/globals";
import {deepDecodeURI, encodeURI, normalizeURL} from "./func";

describe("url func", () => {


    test("deepDecodeURI", () => {
        expect(deepDecodeURI("hello%2520world")).toBe("hello world")
        expect(deepDecodeURI("hello%20world")).toBe("hello world")
        expect(deepDecodeURI("hello world")).toBe("hello world")
    })
    test("encodeURI", () => {
        expect(encodeURI("hello%2520world")).toBe("hello%20world")
        expect(encodeURI("hello%20world")).toBe("hello%20world")
        expect(encodeURI("hello world")).toBe("hello%20world")
    })


})

describe("url func", () => {
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

    test("mock location", () => {
        expect(window.location.href).toBe(mockURL)
        expect(window.location.protocol).toBe('https:')
        expect(window.location.origin).toBe('https://luexu.com')
    })

    test("normalizeURL", () => {
        expect(normalizeURL("//luexu.com/m")).toBe("https://luexu.com/m")
        expect(normalizeURL("/m")).toBe("https://luexu.com/m")
        expect(normalizeURL("user_privacy")).toBe("https://luexu.com/about/rule/user_privacy")
        expect(normalizeURL("./user_privacy")).toBe("https://luexu.com/about/rule/user_privacy")
        expect(normalizeURL("../us")).toBe("https://luexu.com/about/us")
    })
})