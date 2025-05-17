/**
 * Finds the best matching language
 *
 * @example
 * matchLanguage('zh-CN', ['zh-CN', 'zh-TW', 'en-US'])  // Returns zh-CN
 * matchLanguage('zh-cn', ['zh-CN', 'zh-TW', 'en-US'])  // Returns zh-CN
 * matchLanguage('zh', ['zh-CN', 'zh-TW'])  // Returns zh-CN
 * matchLanguage('zh-CN', ['zh', 'zh-TW'])  // Returns zh
 * matchLanguage('fr-FR', ['en', 'de'])               // Returns ''
 */
export function matchLanguage(lang: string, availableLangs: string[]): string {
    if (!lang || !availableLangs?.length) {
        return ''
    }
    const langLower = lang.toLowerCase()
    // 1. Try exact match first
    const exactMatch = availableLangs.find(lang => lang.toLowerCase() === langLower)
    if (exactMatch) {
        return exactMatch
    }

    // 2. Extract base language (part before '-')
    const baseLang = langLower.split('-')[0]
    const matches = availableLangs.filter(lang =>
        lang.split('-')[0].toLowerCase() === baseLang
    )
    if (matches.length > 0) {
        const genericMatch = matches.find(lang => !lang.includes('-'))
        return genericMatch || matches[0]
    }

    return ''
}

/**
 * Detects the best matched language
 * @param availableLangs
 */
export function language(availableLangs?: string[]): string {
    let lang: string = document.documentElement.lang   // <html lang="">
    if (!availableLangs?.length) {
        return lang ? lang : navigator.language || ''
    }

    if (lang) {
        let matched = matchLanguage(lang, availableLangs)
        if (matched) {
            return matched
        }
    }
    if (navigator.languages?.length) {
        for (const lang of navigator.languages) {
            let matched = matchLanguage(lang, availableLangs)
            if (matched) {
                return matched
            }
        }
    }
    if (navigator.language) {
        let matched = matchLanguage(lang, availableLangs)
        if (matched) {
            return matched
        }
    }
    return ''
}
