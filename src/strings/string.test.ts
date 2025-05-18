import {describe, expect, test} from "@jest/globals"
import {randomString} from "./string";
import {floatToInt} from "../aa/atype/type_cast";

describe('randomString', () => {
    let i = floatToInt(Math.random() * 10)
    for (i; i < 20; i += 2) {
        test(`randomString(${i})`, () => {
            expect(randomString(i).length).toBe(i)
        })
    }
})

