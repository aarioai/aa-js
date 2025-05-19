import {describe, expect, test} from "@jest/globals";
import {joinWith, joinWithSpace, replace, splitFirst, tidySplit, trim, trimLeft, trimRight} from "./strings";


describe('strings', () => {
    test("splitFirst", () => {
        expect(splitFirst('hello-world-!', '-')).toEqual(['hello', 'world-!', true])
        expect(splitFirst('hello-world', '_')).toEqual(['hello-world', '', false])
    })
    test('joinWith', () => {
        expect(joinWith(', ', 'apple', null, 'banana', 100, '', undefined)).toBe('apple, banana, 100')
        expect(joinWith(',', 'apple', null, 'banana', 100, '', undefined)).toBe('apple,banana,100')
        expect(joinWith('/', '2025', '05', '15')).toBe('2025/05/15')
        expect(joinWithSpace('2025', '05', '15')).toBe('2025 05 15')
    })

    test('replace', () => {
        expect(replace('I\'m Aario. Hi, Aario!', {
            "Aario": "Tom",
            "Hi": "Hello",
        })).toBe('I\'m Tom. Hello, Tom!')

        expect(replace('I\'m Aario. Hi, Aario!', [
            ["Aario", "Tom"],
            ["Hi", "Hello"],
        ])).toBe('I\'m Tom. Hello, Tom!')
    })

    test('tidySplit', () => {
        expect(tidySplit('a, b , , c')).toEqual(['a', 'b', 'c'])
        expect(tidySplit('  one  two  three  ', /\s+/)).toEqual(['one', 'two', 'three'])
    })

    test('trim', () => {
        expect(trimLeft('   Aario   ')).toBe('Aario   ')
        expect(trimLeft('000  Aario   ', '0')).toBe('  Aario   ')
        expect(trimLeft('010101  Aario   ', '01')).toBe('  Aario   ')
        expect(trimRight('   Aario   ')).toBe('   Aario')
        expect(trimRight('   Aario   1010', '10')).toBe('   Aario   ')
        expect(trim('  Aario   ')).toBe('Aario')
    })
})