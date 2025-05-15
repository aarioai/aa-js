import {describe, expect, test} from '@jest/globals';
import {a_array, a_bool, a_dict, a_func, a_string} from "./types_extend";

describe('a_array', ()=>{
    test('a_array null', ()=>{
        expect(a_array(null)).toEqual([])
    })

    test('a_array undefined', ()=>{
        expect(a_array(undefined)).toEqual([])
    })

    test('a_array []', ()=>{
        expect(a_array([])).toEqual([])
    })

    test('a_array [1, 2, 3]', ()=>{
        expect(a_array([1,2,3])).toEqual([1,2,3])
    })
    test('a_array {"a":1, "b":2}', ()=>{
        expect(a_array({"a":1, "b":2})).toEqual([1,2])
    })
    test('a_array string', ()=>{
        expect(()=>a_array("string")).toThrow(TypeError)
    })
    test('a_array 1', ()=>{
        expect(()=>a_array(1)).toThrow(TypeError)
    })
    test('a_array false', ()=>{
        expect(()=>a_array(false)).toThrow(TypeError)
    })
})


describe('a_bool', ()=>{
    test('a_bool null', ()=>{
        expect(a_bool(null)).toBe(false)
    })

    test('a_bool undefined', ()=>{
        expect(a_bool(undefined)).toBe(false)
    })

    test('a_bool []', ()=>{
        expect(a_bool([])).toBe(true)
    })

    test('a_bool true', ()=>{
        expect(a_bool(true)).toBe(true)
    })
    test('a_bool false', ()=>{
        expect(a_bool(false)).toBe(false)
    })
    test('a_bool 1', ()=>{
        expect(a_bool(1)).toBe(true)
    })
    test('a_bool 0', ()=>{
        expect(a_bool(0)).toBe(false)
    })
    test('a_bool True', ()=>{
        expect(a_bool('True')).toBe(true)
    })
    test('a_bool FALSE', ()=>{
        expect(a_bool('FALSE')).toBe(false)
    })

    test('a_bool F', ()=>{
        expect(a_bool('F')).toBe(false)
    })
    test('a_bool off', ()=>{
        expect(a_bool('off')).toBe(false)
    })
})

describe('a_func', ()=>{
    test('a_func null', ()=>{
        expect(typeof a_func(null)).toBe("function")
    })
    test('a_func undefined', ()=>{
        expect(typeof a_func(undefined)).toBe("function")
    })

    test('a_func f()', ()=>{
        expect(typeof a_func(()=>{})).toBe("function")
    })
})

describe('a_dict', ()=>{
    test('a_dict null', ()=>{
        expect(a_dict(null)).toEqual({})
    })
    test('a_dict undefined', ()=>{
        expect(a_dict(undefined)).toEqual({})
    })
    test('a_dict []', ()=>{
        expect(a_dict([])).toEqual({})
    })
    test('a_dict [a,b,c]', ()=>{
        expect(a_dict(["a","b","c"])).toEqual({0:"a",1:"b",2:"c"})
    })
    test('a_dict {}', ()=>{
        expect( a_dict({})).toEqual({})
    })
    test('a_dict {"a":100,"b":200}', ()=>{
        expect( a_dict({"a":100,"b":200})).toEqual({"a":100,"b":200})
    })
})

describe('a_string', ()=>{
    test('a_string null', ()=>{
        expect(a_string(null)).toBe('')
    })
    test('a_string undefined', ()=>{
        expect(a_string(undefined)).toBe('')
    })
    test('a_string false', ()=>{
        expect( a_string(false)).toBe('false')
    })
    test('a_string 1', ()=>{
        expect( a_string(1)).toBe('1')
    })
    test('a_string []', ()=>{
        expect(a_string([])).toBe('[]')
    })
    test('a_string [a,b,c]', ()=>{
        expect(a_string(["a","b","c"])).toBe('["a","b","c"]')
    })
    test('a_string {}', ()=>{
        expect( a_string({})).toBe('{}')
    })
    test('a_string {"a":100,"b":200}', ()=>{
        expect( a_string({"a":100,"b":200})).toBe('{"a":100,"b":200}')
    })
})

describe('a_number', ()=>{
    test('a_string null', ()=>{
        expect(a_string(null)).toBe('')
    })
    test('a_string undefined', ()=>{
        expect(a_string(undefined)).toBe('')
    })
    test('a_string false', ()=>{
        expect( a_string(false)).toBe('false')
    })
    test('a_string 1', ()=>{
        expect( a_string(1)).toBe('1')
    })
    test('a_string []', ()=>{
        expect(a_string([])).toBe('[]')
    })
    test('a_string [a,b,c]', ()=>{
        expect(a_string(["a","b","c"])).toBe('["a","b","c"]')
    })
    test('a_string {}', ()=>{
        expect( a_string({})).toBe('{}')
    })
    test('a_string {"a":100,"b":200}', ()=>{
        expect( a_string({"a":100,"b":200})).toBe('{"a":100,"b":200}')
    })
})