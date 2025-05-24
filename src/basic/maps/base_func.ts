export function isMeaningfulValue(value: unknown): boolean {
    const useless = value === undefined || (typeof value === 'number' && isNaN(value))
    return !useless
}