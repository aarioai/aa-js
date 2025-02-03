/**  @typedef  {number|string|{[key:number|string]:ResponsiveSize}} ResponsiveSize */

/**
 * Special mathematics
 */
class maths {
    name = 'aa-maths'

    static #CHINESE_NUMBERS = Object.freeze({
        default: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
        financial: ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    });

    static #UNITS = Object.freeze({
        default: ['个', '万', '亿', '万亿', '兆'],
        suffix: ['', '十', '百', '千'],
        financial: {
            suffix: ['', '拾', '佰', '仟']
        }
    });



    /**
     * Get the value of the closest key in a setting
     * @param {struct} settings
     * @param {ComparisonSymbol} symbol
     *      >           the closest and greater value
     *      <           the closest and lesser value
     *      = or ==     the closest value, may be lesser, equal to or greater
     *      >=          the closest and greater value or equal value
     *      <=          the closest and lesser value or equal value
     * @param {number} value
     * @return {*}
     */
    static closestSetting(settings, symbol, value) {
        let keys = Object.keys(settings)
        keys.sort() // Ascending order 字符串和数字都一样能排序
        value = number(value)

        const key = math.closest(keys, symbol, value)
        if (typeof key !== "undefined") {
            return maths.pixel(settings[key])
        }

        return undefined
    }

    /**
     * Format bytes to B/KB/MB/GB/TB/PB/EB/ZB/YB
     * @param {number} bytes
     * @param {number} decimals
     * @returns {[number, string]}
     */
    static formatBytes(bytes, decimals = 0) {
        if (!+bytes) {
            return [0, 'B']
        }
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return [parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), sizes[i]]
    }

    /**
     * Convert responsive size to pixel, now support rem only.
     * @param {ResponsiveSize} vv
     * @param {string} [vk]
     * @param {ResponsiveSize} [defaultV]
     * @param {ResponsiveSize} [relativeBase]
     * @return {number|undefined}
     * @example
     *  maths.pixel(100) = maths.pixel("100 PX") = maths.pixel("100px")   ===> 100
     *  maths.pixel("1rem")   ===> rem to pixel
     *  maths.pixel({767:"1rem", 768:"2rem"}) = maths.pixel({767:"1rem", 768:"2rem"}, undefined, undefined, AaEnv.maxWidth())
     *  maths.pixel("20%") = maths.pixel("20%", undefined, undefined, AaEnv.maxWidth())
     */
    static pixel(vv, vk, defaultV, relativeBase) {
        vv = defval(...arguments)
        if (!vv || (typeof vv === "string" && vv.indexOf("auto") > -1)) {
            return void 0
        }
        if (typeof vv === "number") {
            return Math.floor(vv)
        }

        const isSettings = typeof vv === 'object'       // @example {320:"5rem", 640:1080, 1280: 2048}
        let isRelative = false  // @example 20%  .5%

        if (typeof vv === 'string') {
            vv = vv.replaceAll(' ', '').toLowerCase()
            isRelative = /^[\d.]+%$/.test(vv)
        }

        if (isSettings || isRelative) {
            relativeBase = !relativeBase ? AaEnv.mainWidth() : maths.pixel(relativeBase)
            return isSettings ? maths.closestSetting(vv, '<=', relativeBase) : Math.floor(relativeBase * parseFloat(vv) / 100)
        }
        if (typeof vv !== "string") {
            return void 0
        }
        let value
        try {
            if (vv.indexOf("rem") > 0) {
                // 计算1rem对应px
                const rem = parseFloat(window.getComputedStyle(document.documentElement)["fontSize"])  // 1rem 对应像素
                value = Number(vv.trimEnd("rem")) * rem
            } else {
                value = Number(vv.trimEnd("px"))
            }
        } catch (err) {
            log.error(`invalid pixel: ${vv}`)
            return void 0
        }
        return Math.floor(value)
    }

    /**
     * 千分位表示法
     * @param {number|string} num
     * @param {number} n
     * @param {string} separator
     * @returns {string}
     */
    static thousands(num, n = 3, separator = ',') {
        num = string(num)
        if (!n || !separator || num.length <= n) {
            return num
        }
        const neg = num[0] === '-' ? 1 : 0
        let s2 = ""
        let j = 0
        for (let i = num.length - 1; i >= neg; i--) {
            if (j > 0 && j % n === 0) {
                s2 = separator + s2
            }
            s2 = num[i] + s2
            j++
        }
        return s2
    }
    /**
     * 缩写的近似中文表达的数字，如 1.8万、2.44亿
     * @param {number|string} num
     * @param {(number)=>number} round
     * @param {number} decimalPlaces
     * @return {{appr: string, unit: string, text: string, value:number}}
     */
    static toAbbrNumberInChinese(num, round=Math.round, decimalPlaces = 1) {
        if (!num || num ==="0") {
            return  {
                appr: "0",
                unit:"",
                text:"0",
            }
        }
        num = typeof num ==="string" ? parseFloat(num) : num
        num = round(num)
        let unit=''
        let x = 0
        let mantissa = 0
        while (num > math.Wan && x < this.#UNITS.default.length) {
            mantissa = num % math.Wan
            num /= math.Wan
            x++
        }
        let s = String(num)
        if (mantissa >0 && decimalPlaces > 0) {
            s += "."+ String(mantissa).substring(0, decimalPlaces)
        }
        if (x>0){
            unit = this.#UNITS.default[x]
        }
        return {
            appr: s,
            unit:unit,
            text:s+unit,
        }
    }
    /**
     * 将数字转换为中文数字
     * @param {number|string} num
     * @param {boolean} financial 使用大写数字
     * @returns {string}
     */
    static toChineseNumber(num, financial = false) {
        // 参数验证和特殊情况处理
        if (!num || num ==="0") {
            return '零'
        }
        const numStr = String(num)

        if (numStr.includes('.')) {
            const [integer, decimal] = numStr.split('.')
            const decimalChinese = Array.from(decimal)
                .map(d => this.#CHINESE_NUMBERS[financial ? 'financial' : 'default'][d])
                .join('')
            return `${this.toChineseNumber(integer, financial)}点${decimalChinese}`
        }

        if (!/^\d+$/.test(numStr)) {
            throw new Error('Not a number')
        }
        if (numStr.length > 20) {
            throw new Error('Number is too large')
        }

        // 获取配置
        const numbers = this.#CHINESE_NUMBERS[financial ? 'financial' : 'default']
        const units = this.#UNITS.default
        const suffix = financial ? this.#UNITS.financial.suffix : this.#UNITS.suffix

        // 数字分组处理
        const groups = this.#splitNumberIntoGroups(numStr, 4)

        // 转换为中文
        let result = this.#convertGroupsToChinese(groups, numbers, units, suffix)

        // 后处理
        result = this.#postProcessChineseNumber(result, units)

        return result
    }

    /**
     * 将数字分组
     * @private
     */
    static #splitNumberIntoGroups(numStr, unitLength = 3) {
        const digits = numStr.split('').reverse();
        const groups = [];
        while (digits.length) {
            groups.push(digits.splice(0, unitLength));
        }
        return groups;
    }

    /**
     * 将分组转换为中文
     * @private
     */
    static #convertGroupsToChinese(groups, numbers, units, suffix) {
        return groups.map((group, groupIndex) => {
            const groupChinese = group.map((digit, digitIndex) =>
                numbers[digit] + suffix[digitIndex]
            ).reverse().join('');
            return groupChinese + units[groupIndex % 6];
        }).reverse().join('');
    }

    /**
     * 中文数字后处理（处理零的显示等）
     * @private
     */
    static #postProcessChineseNumber(result, units) {
        // 处理连续的零
        result = result.replace(/零+/g, '零')
            .replace(/零+$/, '')
            .replace(/^一十/, '十')
            .replace(/个$/, '');

        // 处理单位
        for (let i = units.length - 1; i >= 0; i--) {
            const unit = units[i];
            result = result.replace(
                new RegExp(`(零+)${unit}`, 'g'),
                (_, zeros) => zeros.length === 4 ? '' : unit
            );
        }

        return result;
    }



}