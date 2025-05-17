import {describe, expect, test} from "@jest/globals"
import {findDictionaryPattern, translate, translateFormat} from "./dictionary"

describe('findDictionaryPattern', () => {
    const dictionary = {
        'Hello %s': '你好%s',
        'Count: %d': '计数：%d',
    }

    test('exact word pattern', () => {
        const result = findDictionaryPattern('Hello World', dictionary)
        expect(result.pattern).toBe('你好%s')
        expect(result.values).toEqual(['World'])
    })

    test('finds word pattern', () => {
        const result = findDictionaryPattern('Hello World!', dictionary)
        expect(result.pattern).toBe('你好%s')
        expect(result.values).toEqual(['World!'])
    })

    test('finds word pattern', () => {
        const result = findDictionaryPattern('Hello World !', dictionary)
        expect(result.pattern).toBe('你好%s !')
        expect(result.values).toEqual(['World'])
    })

    test('exact number pattern', () => {
        const result = findDictionaryPattern('Count: 42!', dictionary)
        expect(result.pattern).toBe('计数：%d!')
        expect(result.values).toEqual(['42'])
    })

    test('float pattern', () => {
        const result = findDictionaryPattern('Count: 42.36', dictionary)
        expect(result.pattern).toBe('计数：%d')
        expect(result.values).toEqual(['42.36'])
    })

    test('returns null for no match', () => {
        const result = findDictionaryPattern('No match', dictionary)
        expect(result.pattern).toBeNull()
        expect(result.values).toEqual([])
    })
})

describe('translateFormat', () => {
    test('formats word placeholder', () => {
        expect(translateFormat('Hello %s', ['World'])).toBe('Hello World')
    })

    test('formats number placeholder with integer', () => {
        expect(translateFormat('Count: %d', ['42'])).toBe('Count: 42')
    })

    test('formats number placeholder with float', () => {
        expect(translateFormat('Price: %d', ['12.99'])).toBe('Price: 12.99')
    })

    test('handles missing values', () => {
        expect(translateFormat('Hello %s', [])).toBe('Hello ')
    })
})

describe('translate function', () => {
    const dictionary = {
        'I love Mary': '我爱玛丽',
        'I love %s': '我爱%s',
        '%s loves me': '%s爱我',
        'Does %s love me?': '%s爱我吗？',
        'Sex: %s': '性别：%s',
        'Age: %d': '年龄：%d',
        'Price: %d': '价格：%d',
        'Empty string': '',
        '%s first': '%s优先',
        'Alice is a %d years old %s': 'Alice是一个%d岁的%s',
    }

    test('empty string', () => {
        expect(translate('', dictionary)).toBe('')
    })

    test('exact match', () => {
        expect(translate('I love Mary', dictionary)).toBe('我爱玛丽')
    })

    test('exact match pattern ends with %s', () => {
        expect(translate('I love Lucy', dictionary)).toBe('我爱Lucy')
    })


    test('exact match pattern starts with %s', () => {
        expect(translate('Lucy loves me', dictionary)).toBe('Lucy爱我')
    })

    test('exact match pattern contains %s', () => {
        expect(translate('Does Lucy love me?', dictionary)).toBe('Lucy爱我吗？')
    })

    test('pattern contains %s, case different', () => {
        expect(translate('does Lucy love me? i want to know', dictionary)).toBe('Lucy爱我吗？ i want to know')
    })

    test('float placeholder (%d)', () => {
        expect(translate('Price: 12.99', dictionary)).toBe('价格：12.99')
    })

    test('multiple', () => {
        expect(translate('Alice is a 18 years old girl.', dictionary)).toBe('Alice是一个18岁的girl.')
    })
})