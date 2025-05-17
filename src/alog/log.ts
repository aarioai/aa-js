import {Aconfig} from "../aa/aconfig";
import {ALogStyle} from "./style";
import {joinComplex} from "../aa/format_strings";

/**
 * Escape string formatting placeholders (%s, %d, etc.)
 *
 * console.log("I'm %s.", 'Aario') // Outputs I'm Aario.
 * console.log("I'm %s.") // Outputs I'm
 * console.log(escapeArgument("I'm %s.")) // Outputs I'm %s.
 */
export function escapeArgument(msg: string): string {
    return msg.replaceAll('%', '%%')
}

export function joinArguments(...messages: any[]): string {
    return joinComplex(...messages)
}

export function printRaw(msg: string) {
    if (Aconfig.debugger.isAlert()) {
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

export function log(...messages: any[]) {
    const msg = joinArguments(...messages)
    printRaw(msg)
}

export function prints(style: ALogStyle, ...messages: any[]) {
    if (Aconfig.debugger.disabled()) {
        return
    }
    const msg = joinArguments(...messages)
    if (Aconfig.debugger.isAlert()) {
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
export function printColor(color: string, ...messages: any[]) {
    prints(new ALogStyle(color), ...messages)
}

export function println(first: any, ...others: any[]) {
    if (Aconfig.debugger.disabled()) {
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

export function error(...messages: any[]) {
    log('[error]', ...messages)
}

export function debug(...messages: any[]) {
    log('[debug]', ...messages)
}

export function info(...messages: any[]) {
    log('[info]', ...messages)
}

export function warn(...messages: any[]) {
    log('[warn]', ...messages)
}