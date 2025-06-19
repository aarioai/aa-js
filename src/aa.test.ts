import {test} from '@jest/globals'
import aa, {Aa} from './aa'

test("aa-ts", () => {
    expect(aa).toBeInstanceOf(Aa)
})