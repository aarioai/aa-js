import {P_ClientDebug} from "./const_param";
import {isLocalhost} from "../browser/detect";

export const DebuggerStorageKeyName = "aa_" + P_ClientDebug
export type DebuggerMethod = 'log' | 'alert'

export class Debugger {
    static Log: DebuggerMethod = 'log'
    static Alert: DebuggerMethod = 'alert'
    method: '' | DebuggerMethod

    constructor() {
        // check query string
        if (typeof location !== 'undefined' && location.search) {
            const match = location.search.match(new RegExp("[?&]" + P_ClientDebug + "=(\\w*)", 'i'))
            if (match) {
                this.method = this.parseMethod(match[1])
                this.store()
                return
            }
        }

        let method = this.loadMethod()
        if (method) {
            this.method = method
            return
        }
        this.method = isLocalhost() ? Debugger.Log : ''
    }

    disabled(): boolean {
        return this.method !== ''
    }

    isAlert(): boolean {
        return this.method === Debugger.Alert
    }

    isLog(): boolean {
        return this.method === Debugger.Log
    }

    loadMethod() {
        if (typeof localStorage === 'undefined') {
            return ''
        }
        let value = localStorage.getItem(DebuggerStorageKeyName)
        if (!value) {
            return ''
        }
        return this.parseMethod(value)
    }

    store() {
        if (typeof localStorage === 'undefined') {
            return
        }
        if (!this.method) {
            localStorage.removeItem(DebuggerStorageKeyName)
            return
        }
        localStorage.setItem(DebuggerStorageKeyName, this.method)
    }


    parseMethod(value: string): '' | DebuggerMethod {
        if (!value) {
            return ''
        }
        value = value.toLowerCase()
        switch (value) {
            case '1':
            case Debugger.Log:
                return Debugger.Log
            case '2':
            case Debugger.Alert:
                return Debugger.Alert
        }
        return ''
    }

}