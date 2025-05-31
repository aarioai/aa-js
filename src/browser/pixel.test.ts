import {describe, expect, test} from '@jest/globals'
import {px, pxInt} from './pixel'


describe('toPixels', () => {
    test('handles numbers', () => {
        expect(px(100)).toBe(100)
    })

    test('handles pixel strings', () => {
        expect(px('100px')).toBe(100)
        expect(px('200 PX')).toBe(200)
    })

    test('converts rem units', () => {
        expect(px('1rem')).toBe(16)
        expect(px('1.5rem')).toBe(24)
        expect(px('2rem')).toBe(32)
    })

    test('handles unit-less strings', () => {
        expect(px('300')).toBe(300)
    })

    test('throws error for unsupported units', () => {
        expect(() => px('10em')).toThrow()
    })
    test('vw/wh to pixels', () => {
        const innerWidth = window.innerWidth
        const innerHeight = window.innerHeight
        expect(pxInt('100vw')).toBe(innerWidth | 0)
        expect(pxInt('100vh')).toBe(innerHeight | 0)
        expect(pxInt('10vw')).toBe((innerWidth * 0.1) | 0)
        expect(pxInt('10vh')).toBe((innerHeight * 0.1) | 0)

        expect(px('100vw').toFixed(2)).toBe(innerWidth.toFixed(2))
        expect(px('100vh').toFixed(2)).toBe(innerHeight.toFixed(2))
        expect(px('10vw').toFixed(2)).toBe((innerWidth * 0.1).toFixed(2))
        expect(px('10vh').toFixed(2)).toBe((innerHeight * 0.1).toFixed(2))
    })

})
