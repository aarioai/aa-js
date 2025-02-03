// 基础static class
class fmt {
    name = 'aa-fmt'


    /**
     * 优化参数处理，移除尾部的 undefined 参数
     * @param {any[]} args 
     * @returns {any[]}
     */
    static args(...args) {
        const lastDefinedIndex = args.findLastIndex(arg => arg !== undefined);
        return lastDefinedIndex === -1 ? [] : args.slice(0, lastDefinedIndex + 1);
    }

    /**
     * Capitalize the first letter of each word and leave the other letters lowercase
     * @param {string} s  separate words with spaces, underscore(_) or hyphen(-)
     * @param {boolean} handleCases
     */
    static capitalizeEachWord(s, handleCases = false) {
        if (handleCases) {
            s = fmt.toSnakeCase(s).replaceAll('_', ' ')
        }
        s = s.replace(/(^|[\s_-])([a-z])/g, function (x, y, z) {
            return y + z.toUpperCase()
        })
        return s
    }

    /**
     * 字符串格式化
     * @param {string} format 
     * @param  {...any} args 
     * @returns {string}
     */
    static sprintf(format, ...args) {
        const matches = format.match(/%s/ig)?.length ?? 0;

        if (matches !== args.length) {
            log.error(`fmt.sprintf("${format}", ${args}) invalid number of arguments, expected ${matches}, but got ${args.length}.`);
        }

        return format.replace(/%s/ig, () => args.shift());
    }

    /**
     * Translate formatted string
     * @param {?struct} dict
     * @param args
     * @return {string}
     * @example fmt.translate({'I LOVE %s':'我爱%s'}, "I LOVE %s", "你")    ===>   我爱你
     */
    static translate(dict, ...args) {
        if (len(dict) === 0 || args.length < 1) {
            return ""
        }
        let format = dict && dict[args[0]] ? dict[args[0]] : args[0]
        return fmt.sprintf(format, ...args.slice(1))
    }

    /**
     * 转换为驼峰命名  convert UPPER_UNDERSCORE_CASE/snake_case/PascalCase/kebab-case to  camelCase
     * @param {string } s
     * @return {string}
     */
    static toCamelCase(s) {
        return s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    }
    /**
        * 转换为Pascal命名
        * @param {string} s
        * @return {string}
        */
    static toPascalCase(s) {
        return this.toCamelCase(s).replace(/^[a-z]/, c => c.toUpperCase());
    }

    /**
     * 转换为下划线命名  convert UPPER_UNDERSCORE_CASE/PascalCase/camelCase/kebab-case to lower-case snake case(underscore_case)
     * @param {string} s
     * @return {string}
     */
    static toSnakeCase(s) {
        s = s.replaceAll('-', '_')  // kebab-case
        const isPascal = s && (s[0] >= 'A' && s[0] <= 'Z')
        s = s.replace(/_?([A-Z]+)/g,  (_, y) => "_" + y.toLowerCase())
        return isPascal ? s.trimStart('_', 1) : s
    }
    /**
     * Convert to sentence-case
     * @param {string} s
     * @param {boolean} handleCases
     * @return {string}
     */
    static toSentenceCase(s, handleCases = false) {
        if (handleCases) {
            s = fmt.toSnakeCase(s).replaceAll('_', ' ')
        }
        return !s ? "" : s[0].toUpperCase() + s.substring(1)
    }
}