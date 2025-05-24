import {ALogStyle} from "./style";
import {joinWith} from "../aa/format/strings";
import AConfig from '../aa/aconfig/aconfig'


export function printRaw(msg: string) {
    if (AConfig.debugger.isAlert()) {
        return
    }

    if (msg.charAt(0) !== '[') {
        console.log(msg)
        return
    }

    let handler = console.log
    // console.debug, console.warn ...
    const match = msg.match(/^\[([a-zA-Z]+)]/)
    if (match && typeof console[match[1]] === "function") {
        handler = console[match[1]]
    }
    handler(msg)
}

export function log(...messages: unknown[]) {
    const msg = joinWith(' ', ...messages)
    printRaw(msg)
}

export function prints(style: ALogStyle, ...messages: unknown[]) {
    if (AConfig.debugger.disabled()) {
        return
    }
    const msg = joinWith(' ', ...messages)
    if (AConfig.debugger.isAlert()) {
        printRaw(msg)
        return
    }
    console.log(`%c ${msg}`, style.toString())
}

/**
 * Prints messages in RBG color
 *
 * @example
 * printColor('#666', 'Hello, World!')
 */
export function printColor(color: string, ...messages: unknown[]) {
    prints(new ALogStyle(color), ...messages)
}

export function println(first: unknown, ...others: unknown[]) {
    if (AConfig.debugger.disabled()) {
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

export function error(...messages: unknown[]) {
    log('[error]', ...messages)
}

export function debug(...messages: unknown[]) {
    log('[debug]', ...messages)
}

export function info(...messages: unknown[]) {
    log('[info]', ...messages)
}

export function warn(...messages: unknown[]) {
    log('[warn]', ...messages)
}