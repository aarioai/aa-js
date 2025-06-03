import log from '../../aa/alog/log'
import {ElementSelector, NodeSelector} from './define'

export function a_node(selector: NodeSelector): Node | Element | null {
    if (!selector) {
        return null
    }

    // Avoid document.querySelector(document)
    if (selector instanceof Node) {
        return selector
    }
    try {
        return document.querySelector(selector)
    } catch (err) {
        log.error(`invalid selector: "${selector}"`, err);
        return null
    }
}

export function a_element(selector: ElementSelector): Element | null {
    if (!selector) {
        return null
    }
    if (selector instanceof Element) {
        return selector
    }
    return document.querySelector(selector)
}

export function parseHTMLBody(s: HTMLElement | string, type: DOMParserSupportedType = 'text/html'): HTMLElement | null {
    if (!s) {
        return null
    }
    if (typeof s === 'string') {
        return new DOMParser().parseFromString(s, type).body
    }
    return s
}
