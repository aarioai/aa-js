import aconfig from '../aconfig/aconfig'
import {joinWith} from '../../basic/strings/strings'
import {ALogStyle} from './style'
import {AError} from '../aerror/error'

export default class log {
    static print(...msgs: unknown[]) {
        if (aconfig.debugger.isAlert()) {
            // @TODO alert
            const s = joinWith(' ', ...msgs)
            alert(s)
            return
        }
        let strs: string[] = []
        let options: unknown[] = []
        for (let i = 0; i < msgs.length; i++) {
            if (typeof msgs[i] === 'object') {
                options = msgs.splice(i)
                break
            }
            strs.push(String(msgs[i]))
        }
        const msg = strs.join('  ')
        if (msg.charAt(0) !== '[') {
            console.log(msg, ...options)
            return
        }

        let handler = console.log
        // console.debug, console.warn ...
        const match = msg.match(/^\[([a-zA-Z]+)]/)
        if (match) {
            const method = match[1] as keyof Console
            if (typeof console[method] === "function") {
                handler = (console[method] as Function).bind(console)
            }
        }

        handler(msg, ...options)
    }

    static printStyle(style: ALogStyle, ...msgs: unknown[]) {
        if (aconfig.debugger.disabled()) {
            return
        }

        if (aconfig.debugger.isAlert()) {
            log.print(...msgs)
            return
        }

        const msg = joinWith('  ', ...msgs)
        console.log(`%c ${msg}`, style.toString())
    }

    /**
     * Prints messages in RBG color
     *
     * @example
     * printColor('#666', 'Hello, World!')
     */
    static printColor(color: string, ...msgs: unknown[]) {
        log.printStyle(new ALogStyle(color), ...msgs)
    }

    static println(first: unknown, ...others: unknown[]) {
        if (aconfig.debugger.disabled()) {
            return
        }
        if (others.length === 0) {
            console.log(first)
            return
        }
        console.log('[0] ' + first)
        for (let i = 0; i < others.length; i++) {
            console.log(`[${i + 1}] ` + others[i])
        }
    }

    static test(err: Error | AError) {
        if (!err) {
            return
        }
        // AError extends Error
        if (err instanceof AError) {
            return err.isNotFound() ? log.debug(err.toString()) : log.error(err.toString())
        }

        log.error(err.toString())
        return
    }

    static error(...msgs: unknown[]) {
        log.print('[error]', ...msgs)
    }

    static debug(...msgs: unknown[]) {
        log.print('[debug]', ...msgs)
    }

    static info(...msgs: unknown[]) {
        log.print('[info]', ...msgs)
    }

    static warn(...msgs: unknown[]) {
        log.print('[warn]', ...msgs)
    }
}