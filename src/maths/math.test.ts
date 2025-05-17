import {describe, expect, test} from "@jest/globals"
import {formatBytes} from "./math"

describe('formatBytes', () => {
    test('handles 0 bytes', () => {
        expect(formatBytes(0)).toEqual([0, 'B'])
        expect(formatBytes(0, 2)).toEqual([0, 'B'])
    })

    test('handles negative bytes', () => {
        expect(formatBytes(-100)).toEqual([0, 'B'])
        expect(formatBytes(-1024, 2)).toEqual([0, 'B'])
    })

    test('formats bytes without decimal places', () => {
        expect(formatBytes(500)).toEqual([500, 'B'])
        expect(formatBytes(1023)).toEqual([1023, 'B'])
    })

    test('formats kilobytes', () => {
        expect(formatBytes(1024)).toEqual([1, 'KB'])
        expect(formatBytes(1536)).toEqual([2, 'KB'])
        expect(formatBytes(1536, 1)).toEqual([1.5, 'KB'])
        expect(formatBytes(2048)).toEqual([2, 'KB'])
    })

    test('formats megabytes', () => {
        expect(formatBytes(1024 * 1024)).toEqual([1, 'MB'])
        expect(formatBytes(1.5 * 1024 * 1024, 1)).toEqual([1.5, 'MB'])
    })

    test('formats gigabytes', () => {
        expect(formatBytes(1024 * 1024 * 1024)).toEqual([1, 'GB'])
        expect(formatBytes(2.5 * 1024 * 1024 * 1024, 1)).toEqual([2.5, 'GB'])
    })

    test('respects decimal precision', () => {
        expect(formatBytes(1536, 0)).toEqual([2, 'KB'])
        expect(formatBytes(1536, 1)).toEqual([1.5, 'KB'])
        expect(formatBytes(1536, 2)).toEqual([1.5, 'KB'])
        expect(formatBytes(1536, 3)).toEqual([1.5, 'KB'])
        expect(formatBytes(1550, 2)).toEqual([1.51, 'KB'])
    })

    test('handles negative decimals', () => {
        expect(formatBytes(1536, -1)).toEqual([2, 'KB'])
        expect(formatBytes(1550, -2)).toEqual([2, 'KB'])
    })

    test('handles very large numbers', () => {
        expect(formatBytes(1024 ** 4)).toEqual([1, 'TB'])
        expect(formatBytes(1024 ** 5)).toEqual([1, 'PB'])
        expect(formatBytes(1024 ** 8)).toEqual([1, 'YB']) // Largest supported unit
    })

    test('handles decimal input', () => {
        expect(formatBytes(1024.5)).toEqual([1, 'KB'])
        expect(formatBytes(1024.5, 1)).toEqual([1, 'KB'])
    })

    test('handles edge cases', () => {
        expect(formatBytes(1023)).toEqual([1023, 'B'])
        expect(formatBytes(1025)).toEqual([1, 'KB'])
    })
})