export function isSnakeCase(s: string): boolean {
    return !!s && /^[a-z](?:[a-z0-9]+)?(?:_[a-z0-9]+)*$/.test(s)
}

// Converts to UPPER_UNDERSCORE_CASE/PascalCase/camelCase/kebab-case to snake_case (or underscore_case)
export function snakeCase(s: string): string {
    s = s.trim()
    if (!s || isSnakeCase(s)) {
        return s
    }
    return s
        .replace(/[\s-]/g, '_')
        .replace(/[A-Z]+/g, m => "_" + m.toLowerCase())
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
}


export function isUpperCase(s: string): boolean {
    return !!s && /^[A-Z](?:[A-Z0-9]+)?(?:_[A-Z0-9]+)*$/.test(s)
}


// Converts to snake_case/PascalCase/camelCase/kebab-case to UPPER_UNDERSCORE_CASE
export function upperCase(s: string): string {
    s = s.trim()
    if (!s || isUpperCase(s)) {
        return s
    }
    return s
        .replace(/[\s-]/g, '_')
        .replace(/([A-Z]+)/g, '_$1')
        .toUpperCase()
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
}

/**
 * Checks if a string si in camelCase format
 * @param s
 * @param strict - No consecutive uppercase
 */
export function isCamelCase(s: string, strict: boolean = false): boolean {
    const pattern = strict ? /^[a-z]+(?:[A-Z][a-z0-9]+)*$/ : /^[a-z][a-z0-9]*([A-Z][a-z0-9]+)*$/
    return !!s && pattern.test(s)
}

export function isPascalOrCamel(s: string, strict: boolean = false): boolean {
    const pattern = strict ? /^[a-zA-Z]+(?:[A-Z][a-z0-9]+)*$/ : /^[a-zA-Z][a-z0-9]*([A-Z][a-z0-9]+)*$/
    return !!s && pattern.test(s)
}

// Converts UPPER_UNDERSCORE_CASE/snake_case/PascalCase/kebab-case to camelCase
export function camelCase(s: string): string {
    s = s.trim()
    if (!s) {
        return s
    }
    if (isPascalOrCamel(s)) {
        return s[0] >= 'a' && s[0] <= 'z' ? s : s[0].toLowerCase() + s.substring(1)
    }
    return s
        .toLowerCase()
        .replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase())
}

/**
 * Checks if a string si in PascalCase format
 * @param s
 * @param strict - No consecutive uppercase
 */
export function isPascalCase(s: string, strict: boolean = false): boolean {
    const pattern = strict ? /^[A-Z]+(?:[a-z][a-z0-9]*)*$/ : /^[A-Z][a-z0-9]*([A-Z][a-z0-9]+)*$/
    return !!s && pattern.test(s)
}


// Converts UPPER_UNDERSCORE_CASE/snake_case/camelCase/kebab-case to PascalCase
export function pascalCase(s: string): string {
    s = s.trim()
    if (!s) {
        return s
    }
    if (isPascalOrCamel(s)) {
        return s[0] >= 'A' && s[0] <= 'Z' ? s : s[0].toUpperCase() + s.substring(1)
    }
    return s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/(?:^|\s)(\w)/g, (_, c) => c.toUpperCase())
}

/**
 * Converts a string to sentence case (first letter capitalized, rest lowercase).
 * Optionally normalizes other case formats (camelCase, snake_case, etc.) to words first.
 */
export function sentenceCase(s: string, deep?: boolean): string {
    s = s.trim()
    if (!s) {
        return s
    }
    if (deep) {
        s = snakeCase(s).replaceAll('_', ' ')
    }
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

// Capitalizes All Words
export function titleCase(s: string, deep?: boolean): string {
    s = s.trim()
    if (!s) {
        return ""
    }
    if (deep) {
        s = snakeCase(s).replaceAll('_', ' ')
    }
    return s
        .replace(/\b\w/g, char => char.toUpperCase())
        .replace(/'([a-z])/g, match => `'${match[1].toUpperCase()}`)
}

