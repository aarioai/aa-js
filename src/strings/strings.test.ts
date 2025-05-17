import {describe, expect, test} from "@jest/globals"
import {randomString} from "./strings";

describe('randomString', () => {
    let i = (Math.random() * 10) | 0
    for (i; i < 20; i += 2) {
        test(`randomString(${i})`, () => {
            expect(randomString(i).length).toBe(i)
        })
    }
})

