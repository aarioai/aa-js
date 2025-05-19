/**
 * format arguments, abundant undefined arguments at tail
 * @param args
 */
export function formatArguments<T = unknown>(...args: T[]): T[] {
    const lastDefinedIndex = args.findLastIndex(arg => arg !== undefined)
    return lastDefinedIndex === -1 ? [] : args.slice(0, lastDefinedIndex + 1)
}