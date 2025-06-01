import {test} from '@jest/globals'
import aa, {Aa} from './aa'

test("aa-js", () => {
    expect(aa).toBeInstanceOf(Aa)
})