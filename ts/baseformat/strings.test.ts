import {describe, expect, test} from "@jest/globals";
import {joinWith, joinWithBlank, replaceAll, splitFirst} from "./strings";

describe('splitFirst', ()=> {
    test("splitFirst('hello-world-!', '-')", () => {
        expect(splitFirst('hello-world-!', '-')).toEqual(['hello', 'world-!', true])
    })

    test("splitFirst('hello-world', '_')", () => {
        expect(splitFirst('hello-world', '_')).toEqual(['hello-world', '',false])
    })
})


describe('joinWith', ()=> {
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
        expect(joinWithBlank('2025', '05', '15')).toBe('2025 05 15')
    })

})


describe('replaceAll', ()=> {
    test("replaceAll('I\'m Aario. Hi, Aario!', 'Aario', 'Tom')", () => {
        expect(replaceAll('I\'m Aario. Hi, Aario!', 'Aario', 'Tom')).toBe('I\'m Tom. Hi, Tom!')
    })
    test("replaceAll('I\'m Aario. Hi, Aario!', {\"Aario\":\"Tom\", \"Hi\":\"Hello\"})", () => {
        expect(replaceAll('I\'m Aario. Hi, Aario!', {
            "Aario":"Tom",
            "Hi":"Hello",
        })).toBe('I\'m Tom. Hello, Tom!')
    })

    test("replaceAll('I\'m Aario. Hi, Aario!', [[\"Aario\",\"Tom\"], [\"Hi\",\"Hello\"]])", () => {
        expect(replaceAll('I\'m Aario. Hi, Aario!', [
            ["Aario","Tom"],
            ["Hi","Hello"],
    ])).toBe('I\'m Tom. Hello, Tom!')
    })
})