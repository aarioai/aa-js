import {describe, expect, test} from "@jest/globals"
import {joinPath, normalizePath, parseBaseName, parsePath, splitPath} from "./path_func";

describe('path functions', () => {
    test('splitPath', () => {
        expect(splitPath('/a/', '/', 'b')).toEqual(['a', 'b'])
        expect(splitPath('/a', '/b/c', 'd')).toEqual(['a', 'b', 'c', 'd'])
        expect(splitPath('/a', ' b c ', 'd')).toEqual(['a', 'b', 'c', 'd'])
        expect(splitPath('/a', '.', 'd')).toEqual(['a', 'd'])
        expect(splitPath('/a', '../.', 'd')).toEqual(['d'])
        expect(splitPath('/a', '../.././..', '.', 'd')).toEqual(['..', '..', 'd'])
    })
})

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
        expect(joinPath('/a/b/d', '../../c')).toBe('/a/c')
        expect(joinPath('/about/rule', '../us')).toBe('/about/us')
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


describe('parse path', () => {
    test('parseBaseName', () => {
        expect(parseBaseName('a')).toEqual({dirname: '', basename: 'a'})
        expect(parseBaseName('C:\\tests\\a.JPG')).toEqual({dirname: 'C:\\tests', basename: 'a.JPG'})
        expect(parseBaseName('/tests/a.test.js')).toEqual({dirname: '/tests', basename: 'a.test.js'})
        expect(parseBaseName('a.test.js')).toEqual({dirname: '', basename: 'a.test.js'})
        expect(parseBaseName('./.gitignore')).toEqual({dirname: '', basename: '.gitignore'})
    })
    test('parsePath', () => {
        expect(parsePath('a')).toEqual({dirname: '', basename: 'a', filename: 'a', extension: ''})
        expect(parsePath('C:\\tests\\a.JPG')).toEqual({
            dirname: 'C:\\tests',
            basename: 'a.JPG',
            filename: 'a',
            extension: '.JPG'
        })
        expect(parsePath('/tests/a.test.js')).toEqual({
            dirname: '/tests',
            basename: 'a.test.js',
            filename: 'a.test',
            extension: '.js'
        })
        expect(parsePath('a.test.js')).toEqual({
            dirname: '',
            basename: 'a.test.js',
            filename: 'a.test',
            extension: '.js'
        })
        expect(parsePath('./.gitignore')).toEqual({
            dirname: '',
            basename: '.gitignore',
            filename: '',
            extension: '.gitignore'
        })
    })
    test('normalizePath', () => {
        expect(normalizePath('/../a/c/')).toBe('/a/c')
        expect(normalizePath('a/b/c/..')).toBe('a/b')
        expect(normalizePath('./a/b/c/..')).toBe('a/b')
        expect(normalizePath('/./a/b/c/..')).toBe('/a/b')
        expect(normalizePath('/../a//b/c/d/e/../../../f/.//./g/.//.///./../.././i/./../.')).toBe('/a/b')
        expect(normalizePath('../a//b/c/d/e/../../../f/.//./g/.//.///./../.././i/./../.')).toBe('../a/b')
        expect(normalizePath('C:/a/c/')).toBe('C:\\a\\c')
    })
})