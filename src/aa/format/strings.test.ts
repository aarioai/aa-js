import {describe, expect, test} from "@jest/globals";
import {joinWith, joinWithSpace, replace, splitFirst, tidySplit, trim, trimLeft, trimRight} from "./strings";

describe('splitFirst', () => {
    test("splitFirst('hello-world-!', '-')", () => {
        expect(splitFirst('hello-world-!', '-')).toEqual(['hello', 'world-!', true])
    })

    test("splitFirst('hello-world', '_')", () => {
        expect(splitFirst('hello-world', '_')).toEqual(['hello-world', '', false])
    })
})


describe('joinWith', () => {
    test("joinWith(', ', ' apple', null, 'banana ', 100, '', undefined)", () => {
        expect(joinWith(', ', ' apple', null, 'banana ', 100, '', undefined)).toBe('apple, banana, 100')
    })

    test("joinWith(',', ' apple', null, 'banana ', 100, '', undefined)", () => {
        expect(joinWith(',', ' apple', null, 'banana ', 100, '', undefined)).toBe('apple,banana,100')
    })
    test("joinWith('/', '2025', '05', '15')", () => {
        expect(joinWith('/', '2025', '05', '15')).toBe('2025/05/15')
    })

    test("joinWithBlank('/', '2025', '05', '15')", () => {
        expect(joinWithSpace('2025', '05', '15')).toBe('2025 05 15')
    })

})


describe('replace', () => {
    test("replace('I\'m Aario. Hi, Aario!', {\"Aario\":\"Tom\", \"Hi\":\"Hello\"})", () => {
        expect(replace('I\'m Aario. Hi, Aario!', {
            "Aario": "Tom",
            "Hi": "Hello",
        })).toBe('I\'m Tom. Hello, Tom!')
    })

    test("replace('I\'m Aario. Hi, Aario!', [[\"Aario\",\"Tom\"], [\"Hi\",\"Hello\"]])", () => {
        expect(replace('I\'m Aario. Hi, Aario!', [
            ["Aario", "Tom"],
            ["Hi", "Hello"],
        ])).toBe('I\'m Tom. Hello, Tom!')
    })
})

describe('tidySplit', () => {
    test("tidySplit('a, b , , c')", () => {
        expect(tidySplit('a, b , , c')).toEqual(['a', 'b', 'c'])
    })
    test("tidySplit('  one  two  three  ', /\s+/)", () => {
        expect(tidySplit('  one  two  three  ', /\s+/)).toEqual(['one', 'two', 'three'])
    })
})

describe('trim', () => {
    test("trimLeft('   Aario   ')", () => {
        expect(trimLeft('   Aario   ')).toBe('Aario   ')
    })
    test("trimLeft('000  Aario   ', '0')", () => {
        expect(trimLeft('000  Aario   ', '0')).toBe('  Aario   ')
    })
    test("trimLeft('010101  Aario   ', '01')", () => {
        expect(trimLeft('010101  Aario   ', '01')).toBe('  Aario   ')
    })
    test("trimRight('   Aario   ')", () => {
        expect(trimRight('   Aario   ')).toBe('   Aario')
    })
    test("trimRight('   Aario  1010')", () => {
        expect(trimRight('   Aario   1010', '10')).toBe('   Aario   ')
    })
    test("trim('  Aario   ')", () => {
        expect(trim('  Aario   ')).toBe('Aario')
    })
})