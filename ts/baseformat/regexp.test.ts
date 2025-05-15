import {describe, expect, test} from "@jest/globals";
import {escapeRegExp, escapeRegExpChars} from "./regexp";

describe('escapeRegExp', ()=>{
    test('escapeRegExpChars \\d+', ()=>{
        expect(escapeRegExpChars(/\d+/.source)).toBe('\\\\d\\+')
    })

    test('escapeRegExpChars /^\\w+/ig', ()=>{
        expect(escapeRegExpChars(/^\w+/ig.source)).toBe('\\^\\\\w\\+')
    })

    // test('escapeRegExp \\d+', ()=>{
    //     expect(escapeRegExp(/\d+/.source).source).toBe(/\d+/.source)
    // })
    // test('escapeRegExp /^\\w+/ig', ()=>{
    //     expect(escapeRegExp('/^\\w+/ig').source).toBe(/^\w+/ig.source)
    // })


})

