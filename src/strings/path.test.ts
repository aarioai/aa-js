import {describe, expect, test} from "@jest/globals"
import {joinPath} from "./path";


describe('joinPath', () => {
    test('should handle basic path joining', () => {
        expect(joinPath('a', 'b')).toBe('a/b')
        expect(joinPath('a/', '/b')).toBe('a/b')
        expect(joinPath('a/b', 'c/d')).toBe('a/b/c/d')
    })

    test('should handle relative paths', () => {
        expect(joinPath('a/b', '../c')).toBe('a/c')
        expect(joinPath('a/b/c', '../../d')).toBe('a/d')
        expect(joinPath('a/b', '../../../xyz')).toBe('../xyz')
        expect(joinPath('a/b/c', './d/./e')).toBe('a/b/c/d/e')
    })

    test('should handle absolute paths', () => {
        expect(joinPath('a/b', '/c/d')).toBe('a/b/c/d')
        expect(joinPath('', '/test/file')).toBe('test/file')
        expect(joinPath('/base', '/test/file')).toBe('/base/test/file')
    })

    test('should handle multiple slashes', () => {
        expect(joinPath('', '//test/file')).toBe('test/file')
        expect(joinPath('/', '//test/file')).toBe('/test/file')
        expect(joinPath('a//b', 'c//d')).toBe('a/b/c/d')
    })

    test('should handle empty paths', () => {
        expect(joinPath('', 'a/b')).toBe('a/b')
        expect(joinPath('a/b', '')).toBe('a/b')
        expect(joinPath('', '')).toBe('')
    })

    test('should handle root path correctly', () => {
        expect(joinPath('/', 'a/b')).toBe('/a/b')
        expect(joinPath('/', '../a/b')).toBe('/a/b')
        expect(joinPath('/', '../../a/b')).toBe('/a/b')
    })

    test('should handle multiple arguments', () => {
        expect(joinPath('a', 'b', 'c', 'd')).toBe('a/b/c/d')
        expect(joinPath('a', '../b', 'c/../d')).toBe('b/d')
        expect(joinPath('', 'a', '', 'b', 'c')).toBe('a/b/c')
    })

    test('should normalize paths', () => {
        expect(joinPath('a/./b', '../c/.')).toBe('a/c')
        expect(joinPath('a/././b', './c/../d')).toBe('a/b/d')
        expect(joinPath('a/b/c', '../../..')).toBe('')
        expect(joinPath('a/b/c', '../../..', 'd')).toBe('d')
    })

    test('should handle edge cases', () => {
        expect(joinPath('', '/')).toBe('')
        expect(joinPath('/', '')).toBe('/')
        expect(joinPath('///a', 'b///')).toBe('/a/b')
        expect(joinPath('.../a', 'b/...')).toBe('.../a/b/...')
    })

    test('should handle Windows-style paths (backslashes)', () => {
        expect(joinPath('a\\b', 'c\\d')).toBe('a/b/c/d')
        expect(joinPath('a\\b\\', '\\c\\d')).toBe('a/b/c/d')
        expect(joinPath('c:\\a\\b\\', '\\c\\d')).toBe('C:\\a\\b\\c\\d')
    })
})