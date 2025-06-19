import {describe, expect, test} from "@jest/globals"
import {
    extractValues,
    normalizeDictData,
    normalizeOptionsData,
    normalizeSelectGroupData,
    normalizeTextsData,
    normalizeValueTextPairsData,
    normalizeValueTextTuplesData,
    Option,
    sortAndValidateOptions
} from './select_group_fn'
import type {Dict} from '../aa/atype/a_define_interfaces.ts'

describe('basic functions', () => {
    test(`sortAndValidateOptions`, () => {
        const options: Option[] = [
            {value: 1, text: 'A1', key: 0},
            {value: 22, text: 'C2', pid: 'C', key: 1},
            {value: 13, text: 'B3', pid: 'B', key: 2},
            {value: 3, text: 'A3', key: 2},
            {value: 21, text: 'C1', pid: 'C', key: 0},
            {value: 32, text: 'D2', pid: 'D', key: 1},
            {value: 12, text: 'B2', pid: 'B', key: 1},
            {value: 4, text: 'A4', key: 3},
            {value: 11, text: 'B1', pid: 'B', key: 0},
            {value: 9, text: 'CA', key: -1},
            {value: 19, text: 'CB', pid: 'B', key: 3},
            {value: 31, text: 'D1', pid: 'D', key: 0},
            {value: 2, text: 'A2', key: 1},
        ]
        const got = JSON.stringify(sortAndValidateOptions(options))
        const want = '[{"value":9,"text":"CA","key":0,"pid":null},{"value":1,"text":"A1","key":1,"pid":null},{"value":2,"text":"A2","key":2,"pid":null},{"value":3,"text":"A3","key":3,"pid":null},{"value":4,"text":"A4","key":4,"pid":null},{"value":11,"text":"B1","pid":"B","key":0},{"value":12,"text":"B2","pid":"B","key":1},{"value":13,"text":"B3","pid":"B","key":2},{"value":19,"text":"CB","pid":"B","key":3},{"value":21,"text":"C1","pid":"C","key":0},{"value":22,"text":"C2","pid":"C","key":1},{"value":31,"text":"D1","pid":"D","key":0},{"value":32,"text":"D2","pid":"D","key":1}]'
        expect(got).toBe(want)
    })

    test(`extractValues`, () => {
        expect(extractValues({value: 100, text: "A"})).toEqual([100])
        expect(extractValues([{value: 100, text: "A"}, {value: 1001, text: "A1"}])).toEqual([100, 1001])
    })
})

describe('basic normalize', () => {
    const basicWant = '[[{"value":"female","text":"女","key":0,"pid":null,"prefix":"","suffix":"","inherit":false,"comment":"","virtual":false},{"value":"male","text":"男","key":1,"pid":null,"prefix":"","suffix":"","inherit":false,"comment":"","virtual":false}]]'
    test(`normalizeDictData`, () => {
        const data: Dict<string> = {male: '男', female: '女'}
        expect(JSON.stringify(normalizeDictData(data))).toBe(basicWant)
        expect(JSON.stringify(normalizeSelectGroupData(data))).toBe(basicWant)
    })

    test(`normalizeValueTextPairsData`, () => {
        const data: Dict<string>[] = [{female: '女'}, {male: '男'}]
        expect(JSON.stringify(normalizeValueTextPairsData(data))).toBe(basicWant)
        expect(JSON.stringify(normalizeSelectGroupData(data))).toBe(basicWant)
    })
    test(`normalizeValueTextTuplesData`, () => {
        const data: [unknown, string][] = [['female', '女'], ['male', '男']]
        expect(JSON.stringify(normalizeValueTextTuplesData(data))).toBe(basicWant)
        expect(JSON.stringify(normalizeSelectGroupData(data))).toBe(basicWant)
    })
    test(`normalizeOptionsData`, () => {
        const data = [{value: 'female', text: '女'}, {value: 'male', text: '男'}]
        expect(JSON.stringify(normalizeOptionsData(data))).toBe(basicWant)
        expect(JSON.stringify(normalizeSelectGroupData(data))).toBe(basicWant)
    })

    test(`normalizeOptionsData`, () => {
        const data = [{value: 'female', text: '女'}, {value: 'male', text: '男'}]
        expect(JSON.stringify(normalizeOptionsData(data))).toBe(basicWant)
        expect(JSON.stringify(normalizeSelectGroupData(data))).toBe(basicWant)
    })

    test(`normalizeTextsData`, () => {
        const data = ['女', '男']
        const want = '[[{"value":0,"text":"女","key":0,"pid":null,"prefix":"","suffix":"","inherit":false,"comment":"","virtual":false},{"value":1,"text":"男","key":1,"pid":null,"prefix":"","suffix":"","inherit":false,"comment":"","virtual":false}]]'
        expect(JSON.stringify(normalizeTextsData(data))).toBe(want)
        expect(JSON.stringify(normalizeSelectGroupData(data))).toBe(want)
    })
})
