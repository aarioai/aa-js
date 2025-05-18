import {describe, expect, test} from "@jest/globals"
import * as fmt from "./namings"

describe('cases', () => {

    const snakeTester = {
        '--how-are_you': 'how_are_you',
        'how-are_you': 'how_are_you',
        'how-are-you': 'how_are_you',
        'how_are_you': 'how_are_you',
        'howAreYou': 'how_are_you',
        'HOW_ARE_YOU': 'how_are_you',
        'How are you': 'how_are_you',
        'How are you  ': 'how_are_you',
    }
    for (const [k, v] of Object.entries(snakeTester)) {
        test("snakeCase " + k, () => {
            expect(fmt.snakeCase(k)).toBe(v)
        })
    }

    const upperTester = {
        '--how-are_you__': 'HOW_ARE_YOU',
        'how-are_you': 'HOW_ARE_YOU',
        'how-are-you': 'HOW_ARE_YOU',
        'how_are_you': 'HOW_ARE_YOU',
        'howAreYou': 'HOW_ARE_YOU',
        'HOW_ARE_YOU': 'HOW_ARE_YOU',
        'How are you': 'HOW_ARE_YOU',
        'How are you  ': 'HOW_ARE_YOU',
    }
    for (const [k, v] of Object.entries(upperTester)) {
        test("upperCase " + k, () => {
            expect(fmt.upperCase(k)).toBe(v)
        })
    }

    const camelTester = {
        'how-are-you': 'howAreYou',
        'how_are_you': 'howAreYou',
        'howAreYou': 'howAreYou',
        'HOW_ARE_YOU': 'howAreYou',
        'how are you': 'howAreYou',
        'How are you': 'howAreYou',
    }
    for (const [k, v] of Object.entries(camelTester)) {
        test("camelCase " + k, () => {
            expect(fmt.camelCase(k)).toBe(v)
        })
    }

    const pascalTester = {
        'how-are-you': 'HowAreYou',
        'how_are_you': 'HowAreYou',
        'howAreYou': 'HowAreYou',
        'HOW_ARE_YOU': 'HowAreYou',
        'How are you': 'HowAreYou',
    }
    for (const [k, v] of Object.entries(pascalTester)) {
        test("pascalCase " + k, () => {
            expect(fmt.pascalCase(k)).toBe(v)
        })
    }

    const sentenceTester = {
        'how_are_you': 'How_are_you',
        'howAreYou': 'Howareyou',
        'HOW_ARE_YOU': 'How_are_you',
        'How are you': 'How are you',
    }
    for (const [k, v] of Object.entries(sentenceTester)) {
        test("sentenceCase " + k, () => {
            expect(fmt.sentenceCase(k)).toBe(v)
        })
    }

    const deepSentenceTester = {
        'how_are_you': 'How are you',
        'howAreYou': 'How are you',
        'HOW_ARE_YOU': 'How are you',
        'How are you': 'How are you',
    }
    for (const [k, v] of Object.entries(deepSentenceTester)) {
        test("sentenceCase deep " + k, () => {
            expect(fmt.sentenceCase(k, true)).toBe(v)
        })
    }

    const titleCaseTester = {
        'how_are_you': 'How_are_you',
        'howAreYou': 'HowAreYou',
        'HOW_ARE_YOU': 'HOW_ARE_YOU',
        'How are you': 'How Are You',
    }
    for (const [k, v] of Object.entries(titleCaseTester)) {
        test("titleCase " + k, () => {
            expect(fmt.titleCase(k)).toBe(v)
        })
    }

    const deepTitleCaseTester = {
        'how_are_you': 'How Are You',
        'howAreYou': 'How Are You',
        'HOW_ARE_YOU': 'How Are You',
        'How are you': 'How Are You',
    }
    for (const [k, v] of Object.entries(deepTitleCaseTester)) {
        test("titleCase deep " + k, () => {
            expect(fmt.titleCase(k, true)).toBe(v)
        })
    }
})