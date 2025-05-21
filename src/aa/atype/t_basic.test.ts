import {describe, expect, test} from '@jest/globals';
import {a_array, a_bool, a_func, a_maps, a_number, a_string, floatToInt, uint16, uint8} from "./t_basic";
import {False} from './const_server'

describe('a_array', () => {
    test('a_array null', () => {
        expect(a_array(null)).toEqual([])
    })

    test('a_array undefined', () => {
        expect(a_array(undefined)).toEqual([])
    })

    test('a_array []', () => {
        expect(a_array([])).toEqual([])
    })

    test('a_array [1, 2, 3]', () => {
        expect(a_array([1, 2, 3])).toEqual([1, 2, 3])
    })
    test('a_array {"a":1, "b":2}', () => {
        expect(a_array({"a": 1, "b": 2})).toEqual([1, 2])
    })
})


describe('a_bool', () => {
    test('a_bool null', () => {
        expect(a_bool(null)).toBe(false)
    })

    test('a_bool undefined', () => {
        expect(a_bool(undefined)).toBe(false)
    })

    test('a_bool true', () => {
        expect(a_bool(true)).toBe(true)
    })
    test('a_bool false', () => {
        expect(a_bool(false)).toBe(false)
    })
    test('a_bool 1', () => {
        expect(a_bool(1)).toBe(true)
    })
    test('a_bool 0', () => {
        expect(a_bool(0)).toBe(false)
    })
    test('a_bool True', () => {
        expect(a_bool('True')).toBe(true)
    })
    test('a_bool FALSE', () => {
        expect(a_bool('FALSE')).toBe(false)
    })

    test('a_bool F', () => {
        expect(a_bool('F')).toBe(false)
    })
    test('a_bool off', () => {
        expect(a_bool('off')).toBe(false)
    })
})

describe('a_func', () => {
    test('a_func null', () => {
        expect(typeof a_func(null)).toBe("function")
    })
    test('a_func undefined', () => {
        expect(typeof a_func(undefined)).toBe("function")
    })

    test('a_func f()', () => {
        expect(typeof a_func(() => {
        })).toBe("function")
    })
})

describe('a_dict', () => {
    test('a_dict null', () => {
        expect(a_maps(null)).toEqual({})
    })
    test('a_dict undefined', () => {
        expect(a_maps(undefined)).toEqual({})
    })
    test('a_dict []', () => {
        expect(a_maps([])).toEqual({})
    })
    test('a_dict [a,b,c]', () => {
        expect(a_maps(["a", "b", "c"])).toEqual({0: "a", 1: "b", 2: "c"})
    })
    test('a_dict {}', () => {
        expect(a_maps({})).toEqual({})
    })
    test('a_dict {"a":100,"b":200}', () => {
        expect(a_maps({"a": 100, "b": 200})).toEqual({"a": 100, "b": 200})
    })
})

describe('a_string', () => {
    test('a_string null', () => {
        expect(a_string(null)).toBe('')
    })
    test('a_string undefined', () => {
        expect(a_string(undefined)).toBe('')
    })
    test('a_string false', () => {
        expect(a_string(false)).toBe(String(False))
    })
    test('a_string 1n', () => {
        expect(a_string(1n)).toBe('1')
    })
    test('a_string []', () => {
        expect(a_string([])).toBe('[]')
    })
    test('a_string [a,b,c]', () => {
        expect(a_string(["a", "b", "c"])).toBe('["a","b","c"]')
    })
    test('a_string {}', () => {
        expect(a_string({})).toBe('{}')
    })
    test('a_string {"a":100,"b":200}', () => {
        expect(a_string({"a": 100, "b": 200})).toBe('{"a":100,"b":200}')
    })


    class StringTester {
        toString() {
            return "toString()"
        }

        toJSON() {
            return "toJSON()"
        }
    }

    test('a_string class', () => {
        expect(a_string(new StringTester())).toBe('toJSON()')
    })
})

describe('a_number', () => {
    test('a_number null', () => {
        expect(a_number(null)).toBe(0)
    })
    test('a_number undefined', () => {
        expect(a_number(undefined)).toBe(0)
    })
    test('a_number .300', () => {
        expect(a_number(".300")).toBe(0.3)
    })
    test('a_number .25', () => {
        expect(a_number(.25)).toBe(0.25)
    })
    test('uint8 -1', () => {
        expect(() => uint8(-1)).toThrow(RangeError)
    })
    test('uint16 "-1"', () => {
        expect(() => uint16("-1")).toThrow(RangeError)
    })

})

describe('floatToInt', () => {
    test('floatToInt undefined', () => {
        expect(floatToInt(void 0)).toBe(0)
    })
    test('floatToInt 0.9999999999', () => {
        expect(floatToInt(0.9999999999)).toBe(0)
    })
    test('floatToInt 1.25', () => {
        expect(floatToInt(1.25)).toBe(1)
    })
})