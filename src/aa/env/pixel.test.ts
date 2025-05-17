import {describe, expect, test} from "@jest/globals";
import {px} from "./pixel";
import {MaxTabletWidth} from "./detect_device";

describe('toPixels', () => {
    test('handles numbers', () => {
        expect(px(100)).toBe(100);
    });

    test('handles pixel strings', () => {
        expect(px('100px')).toBe(100);
        expect(px('200 PX')).toBe(200);
    });

    test('converts rem units', () => {
        expect(px('1rem')).toBe(16);
        expect(px('1.5rem')).toBe(24);
        expect(px('2rem')).toBe(32);
    });

    test('handles unit-less strings', () => {
        expect(px('300')).toBe(300);
    });

    test('throws error for unsupported units', () => {
        expect(() => px('10em')).toThrow();
    });


    test('vw/wh to pixels', () => {
        expect(px('100vw')).toBe(MaxTabletWidth)
        expect(px('100vh')).toBe(1024)
        expect(px('10vh')).toBe(102.4)
        expect(px('10vh') | 0).toBe(102)
        expect(px('1vh') | 0).toBe(10)
    });
});