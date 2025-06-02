import {ElementSelector} from './define'
import {a_element} from './doms'
import {Dict} from '../../aa/atype/a_define_interfaces'

export function classListRemove(selector: ElementSelector, ...patterns: (RegExp | string)[]) {
    const ele = a_element(selector)
    if (!ele) {
        return
    }
    ele.classList.forEach(className => {
        patterns.map(pattern => {
            if ((pattern instanceof RegExp && pattern.test(className)) || pattern === className) {
                ele.classList.remove(className)
            }
        })
    })
}

export function parseAttrStyle(eleOrStyle: Element | string, keyHandler?: (key: string) => string): Dict<string> {
    let style = eleOrStyle instanceof Element ? eleOrStyle.getAttribute('style') : eleOrStyle
    if (!style || typeof style !== 'string') {
        return {}
    }
    const parts = style.split(';')
    let styles = {}
    for (const part of parts) {
        const segs = part.trim().split(':')
        const key = keyHandler ? keyHandler(segs[0].trim()) : segs[0].trim()
        styles[key] = segs.slice(1).join(':').trim()
    }
    return styles
}