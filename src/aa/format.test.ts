import {describe, expect, test} from "@jest/globals";
import {formatArguments, sprintf} from "./format";

describe('formatArguments', () => {
    test("formatArguments(1,2,undefined, null, undefined)", () => {
        expect(formatArguments(1, 2, undefined, null, undefined)).toEqual([1, 2, undefined, null])
    })


})

describe('sprintf', () => {
    test("sprintf('Hello %s!', 'World')", () => {
        expect(sprintf('Hello %s!', 'World')).toBe('Hello World!')
    })
    test("sprintf('%s %s %s', 'a', 'b', 'c')", () => {
        expect(sprintf('%s %s %s', 'a', 'b', 'c')).toBe('a b c')
    })

})