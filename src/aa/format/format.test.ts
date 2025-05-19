import {describe, expect, test} from "@jest/globals";
import {formatArguments} from "./format";

describe('formatArguments', () => {
    test("formatArguments(1,2,undefined, null, undefined)", () => {
        expect(formatArguments(1, 2, undefined, null, undefined)).toEqual([1, 2, undefined, null])
    })


})

