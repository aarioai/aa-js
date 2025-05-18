import {describe, expect, test} from "@jest/globals"
import {matchLanguage} from "./language"

describe('matchLanguage', () => {
    test("matchLanguage('zh-CN', ['zh-CN', 'zh-TW', 'en-US'])", () => {
        expect(matchLanguage('zh-CN', ['zh-CN', 'zh-TW', 'en-US'])).toBe('zh-CN')
    })

    test("matchLanguage('zh-cn', ['zh-CN', 'zh-TW', 'en-US'])", () => {
        expect(matchLanguage('zh-cn', ['zh-CN', 'zh-TW', 'en-US'])).toBe('zh-CN')
    })

    test("matchLanguage('zh', ['zh-CN', 'zh-TW', 'en-US'])", () => {
        expect(matchLanguage('zh', ['zh-CN', 'zh-TW'])).toBe('zh-CN')
    })

    test("matchLanguage('zh-CN', ['zh', 'zh-TW'])", () => {
        expect(matchLanguage('zh-CN', ['zh', 'zh-TW'])).toBe('zh')
    })

    test("matchLanguage('fr-FR', ['en', 'de'])", () => {
        expect(matchLanguage('fr-FR', ['en', 'de'])).toBe('')
    })
})

