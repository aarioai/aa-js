/**
 * format arguments, abundant undefined arguments at tail
 * @param args
 */
export function formatArguments(...args: any[]): any[] {
    const lastDefinedIndex = args.findLastIndex(arg => arg !== undefined)
    return lastDefinedIndex === -1 ? [] : args.slice(0, lastDefinedIndex + 1)
}

/**
 * Formats string similar to C's sprintf
 * * @example
 *  * sprintf('Hello %s!', 'World') // 'Hello World!'
 *  * sprintf('%s %s %s', 'a', 'b', 'c') // 'a b c'
 *  * sprintf('Missing: %s') // Throws TypeError
 */
export function sprintf(format: string, ...args: any[]) {
    return format.replace(/%s/ig, () => args.shift())
}