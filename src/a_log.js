/**
 * @typedef {Object} LoggerStyleOptions
 * @property {string} [color] - CSS color value
 * @property {string} [background] - CSS background value
 * @property {number} [fontWeight] - CSS font-weight value
 */
class AaLoggerStyle {
    name = 'aa-logger-style'

    /** @type {string} */
    #color;
    /** @type {string} */
    #background;
    /** @type {number} */
    #fontWeight;

    /**
     *
     * @param {string} color
     * @param {string}[background]
     * @param {number} [fontWeight]
     */
    constructor(color, background, fontWeight) {
        this.color = color
        this.fontWeight = fontWeight
        this.background = background;
    }

    toString() {
        let styles = []
        if (this.color) {
            styles.push(`color:${this.color}`)
        }
        if (this.background) {
            styles.push(`background:${this.background};width:100%`)
        }
        if (this.fontWeight && this.fontWeight !== 400) {
            styles.push(`font-weight:${this.fontWeight}`)
        }
        return styles.join(";")
    }
}

class log {
    name = 'aa-log'

    /** @type {(s:string)=>void} */
    static alertHandler = s => alert(s)
    static _breakpointIncr = 0

    static alert(...args) {
        log.alertHandler(args.join(' '))
    }

    static breakpoint(...args) {
        log._breakpointIncr++
        // args 可能是 object
        args.unshift("%c· brk " + log._breakpointIncr + '  ', 'color:#f00;font-weight:700;')
        log.print(...args)
    }

    static error(...args) {
        log.print('[error]', ...args)
    }

    /**
     * Debug 浏览器默认不显示，需要在调试右上角打开 level:verbose
     * @param args
     */
    static debug(...args) {
        log.print('[debug]', ...args)
    }

    // console.log with color
    static draw(rgb, ...args) {
        log.print(new AaLoggerStyle(rgb), ...args)
    }


    static info(...args) {
        log.print('[info]', ...args)
    }

    /**
     *
     * @param {AaLoggerStyle|*} style
     * @param args
     */
    static print(style = "", ...args) {
        const dbg = _aaDebug
        if (dbg.disabled()) {
            return
        }
        if (!(style instanceof AaLoggerStyle)) {
            args.unshift(style)
        }
        if (args.length === 0) {
            return
        }
        if (dbg.isAlert()) {
            log.alert(...args)
            return
        }

        let fn = console.log
        if (typeof args[0] === "string") {
            // 保留这个标签，方便知道报错由哪里发出
            const match = args[0].match(/^\[([a-zA-Z]+)]/)
            if (match && typeof console[match[1]] === "function") {
                fn = console[match[1]]
            }
        }
        if (!(style instanceof AaLoggerStyle)) {
            fn(...args)
            return
        }

        let sty = style.toString()
        let s = ''
        for (let i = 0; i < args.length; i++) {
            let v = args[i]
            if (typeof v.valueOf === 'function') {
                v = v.valueOf()
            } else if (types.toStringCallable(args[i])) {
                v = v.toString()
            } else if (typeof v === "object") {
                if (s) {
                    fn("%c" + s, sty)
                    s = ''
                }
                fn(v)
                continue
            }
            s += v + ' '
        }
        if (s) {
            fn("%c" + s, sty)
        }
    }

    static println(...args) {
        const dbg = _aaDebug
        if (dbg.disabled()) {
            return
        }
        if (args.length === 1) {
            console.log(args[0])
            return
        }
        console.log('')
        for (let i = 0; i < args.length; i++) {
            console.log(`[${i}]`, args[i])
        }
    }

    static strong(...args) {
        log.print(new AaLoggerStyle('#000', 700), ...args)
    }

    static warn(...args) {
        log.print('[warn]', ...args)
    }

    static when(condition, ...args) {
        if (bool(condition)) {
            loge(...args)
        }
    }
}

function loge(...args) {
    if (len(args) === 1) {
        const err = args[0]

        // AError extends Error
        if (err instanceof AError) {
            return err.noMatched() ?  log.debug(err.toString()) : log.error(err.toString())
        }

        if (err instanceof Error) {
            log.error(err.toString())
            return
        }

        return log.print(...args)
    }
    for (let i = 0; i < args.length; i++) {
        if ((typeof args[i] === 'object' && args[i] !== null) || typeof args[i] === 'function') {
            return log.println(...args)
        }
    }
    return log.print(...args)
}
