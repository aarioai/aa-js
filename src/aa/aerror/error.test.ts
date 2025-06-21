import {expect, test} from '@jest/globals';
import {AError} from './error.ts'
import {code2msg} from './code2msg.ts'
import {aerror} from './fn.ts'

test('AError', () => {
    expect((new AError(200)).toString()).toBe(code2msg(200))
    expect((new AError(code2msg(200))).code).toBe(200)
    expect((new AError("异常错误")).toString()).toBe("异常错误")
})

test('aerror', () => {
    expect((aerror(200)).toString()).toBe(code2msg(200))
    expect((new AError(code2msg(200))).code).toBe(200)
    expect((new AError("异常错误")).toString()).toBe("异常错误")
})