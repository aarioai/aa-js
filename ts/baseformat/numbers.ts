/**
 * Formats a number or numeric string by trimming unnecessary trailing decimal zeros.
 * Optionally rounds to specified decimal places before trimming.
 *
 * @param {number|string} value - The numeric value to format (can be number or string)
 * @param {number} [digits] - Optional number of decimal places to round to before trimming
 * @returns {string} The formatted number string without trailing decimal zeros
 *
 * @example
 * trimFloat(1.2000, 4)  -->  '1.2'
 * trimFloat(1.2340, 4) --> '1.234'
 */
export function trimFloat(value :number|string, digits ?:number):string{
    const v =digits !== undefined ?  Number(value).toFixed(digits): String(value)
    return v.replace(/\.?0*$/, '')
}

/**
 * Formats a number with specified precision and a thousand separators
 *
 * @example
 * formatNumber(1234567.89, 2)      // Returns "1,234,567.89"
 * formatNumber('1234567', 0, ' ')  // Returns "1 234 567"
 */
export function formatNumber(value:number|string, precision=0, separator =','):string{
    const v =Number(value)
    if (!Number.isFinite(v)) {
        return '0'
    }

    const [int, dec] = v.toFixed(precision).split('.');
    const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return dec ? `${formattedInt}.${dec}` : formattedInt;
}