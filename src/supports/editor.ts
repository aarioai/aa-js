import {parseHTMLBody} from '../browser/doms/doms'
import {forEachDescendantNodes, transferChildNodes} from '../browser/doms/dom_descendants'
import type {NodeSelector} from '../browser/doms/define'
import {ImgSrc} from '../source/media/imgsrc'
import {replaceAll} from '../basic/strings/strings'
import {AudioSrc} from '../source/media/audiosrc'
import {VideoSrc} from '../source/media/videosrc'
import log from '../aa/alog/log'
import {parseAttrStyle} from '../browser/doms/attributes'
import type {Dict} from '../aa/atype/a_define_interfaces.ts'


export type AudioSrcBuilder = (path: string) => AudioSrc
export type ImgSrcBuilder = (path: string) => ImgSrc
export type VideoSrcBuilder = (path: string) => VideoSrc

export default class AaEditor {
    anchorHrefHandler?: (href: string) => string

    submittableAttributeWhitelist: Dict<string[]> = {
        default: ['class', 'contenteditable', 'style'],
        IMG: ['alt', 'data-path', 'width', 'height'],
        TABLE: [],
        TD: ['data-row', 'nowrap'],
        PRE: ['data-language'],
    }

    temporaryAttributeWhitelist: Dict<string[]> = {
        default: ['title'],
        IMG: ['src'],
    }

    classWhitelist: RegExp[] = [/^e-/]
    styleWhitelist: string[] = ['background', 'background-color', 'color', 'zoom']
    textAlignWhitelist: string[] = ['center', 'right']
    emptyableElements: string[] = ['DD', 'DT', 'P', 'TD']
    srcElements: string[] = ['AUDIO', 'IMG', 'VIDEO']
    audiosrcBuilder?: AudioSrcBuilder
    imgsrcBuilder?: ImgSrcBuilder
    videosrcBuilder?: VideoSrcBuilder

    decodeTemplate = {
        "&#62;": '>',
        '&gt;': '>',
        "&#60;": '<',
        '&lt;': '<',
        "&#39;": "'",
        "&#34;": '"',
        '&quot;': '"',
        '&#38;': '&',
        '&amp;': '&',
    }

    fuzzyTag = '<i class="fuzzy"></i>'

    constructor() {
    }

    // @TODO
    decodeAudio(audio: HTMLAudioElement) {
        console.error("unimplemented decodeAudio", audio)
        return
    }

    decodeImage(img: HTMLImageElement) {
        const src = img.getAttribute('src')
        const path = img.dataset.path

        if ((!src && !path) || !this.imgsrcBuilder) {
            return
        }

        const imgsrc = this.imgsrcBuilder(path || src!)
        if (!imgsrc) {
            return
        }

        img.dataset.path = imgsrc.path
        const fa = imgsrc.resize()!
        img.setAttribute("src", fa.url)
        if (!img.hasAttribute('width')) {
            img.setAttribute("width", String(fa.css.width))
        }
        if (!img.hasAttribute('height')) {
            img.setAttribute("height", String(fa.css.height))
        }
        return
    }

    // @TODO
    decodeVideo(video: HTMLVideoElement) {
        console.error("unimplemented decodeVideo", video)
    }

    decodeContent(
        content: string | HTMLElement,
        appendTo?: NodeSelector | null,
        hook?: (node: Node) => Node | null
    ): HTMLElement | null {
        const source = parseHTMLBody(content, 'text/html')
        if (!source) {
            return null
        }

        forEachDescendantNodes(source, node => {
            if (!node) {
                return
            }

            const processedNode = hook ? hook(node) : node
            if (!processedNode || processedNode.nodeType !== Node.ELEMENT_NODE) {
                return
            }
            const element = processedNode as HTMLElement
            switch (element.tagName) {
                case 'A':
                    element.setAttribute('target', '_blank')
                    break
                case 'AUDIO':
                    this.decodeAudio(element as HTMLAudioElement)
                    break
                case 'IMG':
                    this.decodeImage(element as HTMLImageElement)
                    break
                case 'VIDEO':
                    this.decodeVideo(element as HTMLVideoElement)
                    break
                case 'LI':
                    if (element.dataset.list === 'unchecked') {
                        const checkbox = document.createElement('span')
                        checkbox.classList.add('e-ui')
                        checkbox.contentEditable = 'true'
                        element.insertBefore(checkbox, element.firstChild)
                    }
                    break
            }

            if (element.hasAttribute('data-privacy-key')) {
                element.innerHTML = this.fuzzy(element.innerHTML)
            }
        })

        return appendTo ? transferChildNodes(source, appendTo) as HTMLElement : source
    }


    decodeSelector(selector: string | HTMLElement): HTMLElement | null {
        return this.decodeContent(selector, null,)
    }

    encodeContent(content: HTMLElement | string): string {
        const parsedContent = parseHTMLBody(content, 'text/html')
        if (!parsedContent) return ''

        const formattedContent = this.formatContent(parsedContent, true)
        return formattedContent ? formattedContent.innerHTML.trim() : ''
    }

    formatContent(
        content: HTMLElement | string,
        beforeSubmit?: boolean,
        hook?: (node: Node) => Node | null
    ): HTMLElement | null {
        const parsedContent = parseHTMLBody(content, 'text/html')
        if (!parsedContent) return null

        forEachDescendantNodes(parsedContent, node => {
            if (!node) return

            let processedNode = hook ? hook(node) : node
            if (!processedNode) {
                return
            }

            const parent = processedNode.parentNode

            switch (processedNode.nodeType) {
                case Node.COMMENT_NODE:
                    parent?.removeChild(processedNode)
                    break
                case Node.ELEMENT_NODE:
                    this.cleanHtmlElement(processedNode as HTMLElement, beforeSubmit)
                    break
                case Node.TEXT_NODE:
                    const value = processedNode.nodeValue
                    if (!value) {
                        if (parent && parent.parentNode && (parent as HTMLElement).innerHTML === '' &&
                            !this.emptyableElements.includes((parent as HTMLElement).tagName)) {
                            parent.parentNode.removeChild(parent)
                        }
                    }
                    break
            }
        })

        return parsedContent
    }

    fuzzy(s: string, tag: string = this.fuzzyTag): string {
        if (!s) {
            return s
        }

        s = replaceAll(s, [
            ["\r\n", "<br>"],
            ["\r", "<br>"],
            ["\n", "<br>"],
        ])

        return s.replace(/<fuzzy>\s*\d+\s*:\s*(\d+)\s*<\/fuzzy>/ig, (_, l) => tag.repeat(parseInt(l)))
    }


    isWhiteAttribute(tagName: string, attr: Attr | { name: string; value: string }, beforeSubmit?: boolean): boolean {
        if (/(initial|[()])/i.test(attr.value)) return false

        const whitelist = beforeSubmit ? this.submittableAttributeWhitelist : {
            ...this.submittableAttributeWhitelist,
            ...this.temporaryAttributeWhitelist
        }

        return whitelist.default?.includes(attr.name) || whitelist[tagName]?.includes(attr.name) || false
    }

    textToHtml(s: string): string {
        if (!s) return ""

        let result = String(s)
        for (const [k, v] of Object.entries(this.decodeTemplate)) {
            if (result.includes(k)) {
                result = result.replaceAll(k, v)
            }
        }

        result = result.replace(/&#(\d{1,3});/gi, (_, numStr) =>
            String.fromCharCode(parseInt(numStr, 10)))

        return replaceAll(result, [
            ["\r\n", "<br>"],
            ["\r", "<br>"],
            ["\n", "<br>"],
        ])
    }

    private cleanAnchor(node: HTMLAnchorElement): HTMLAnchorElement | null {
        if (!this.anchorHrefHandler) return node

        const href = this.anchorHrefHandler(node.href)
        if (!href) {
            node.parentNode?.removeChild(node)
            return null
        }

        if (href !== node.href) node.href = href
        node.rel = 'nofollow'
        return node
    }

    private cleanAttrs(node: HTMLElement, beforeSubmit?: boolean): void {
        this.cleanAttrStyle(node)

        const toRemove = Array.from(node.attributes)
            .filter(attr => !this.isWhiteAttribute(node.tagName, attr, beforeSubmit))
            .map(attr => attr.name)

        toRemove.forEach(attr => node.removeAttribute(attr))
    }

    private cleanClassList(node: HTMLElement): void {
        if (node.classList.length === 0) return

        node.classList.remove("e-align-left", "e-align-justify")
        Array.from(node.classList).forEach(c => {
            if (!this.classWhitelist.some(re => re.test(c))) {
                node.classList.remove(c)
            }
        })

        if (node.classList.length === 0) node.removeAttribute('class')
    }

    private cleanAttrStyle(node: HTMLElement): void {
        const styles = parseAttrStyle(node)
        const align = styles?.['text-align'] || node.getAttribute('align')

        node.classList.remove("e-align-left", "e-align-justify", "e-align-center", "e-align-right")
        node.removeAttribute('align')

        if (align && this.textAlignWhitelist.includes(align)) {
            node.classList.add('e-align-' + align)
        }

        if (!styles) {
            node.removeAttribute('style')
            return
        }

        const validStyles = Object.fromEntries(
            Object.entries(styles).filter(([name]) => this.styleWhitelist.includes(name))
        )

        if (Object.keys(validStyles).length > 0) {
            node.setAttribute('style', Object.entries(validStyles)
                .map(([k, v]) => `${k}:${v}`).join(';'))
        } else {
            node.removeAttribute('style')
        }
    }

    private cleanHtmlElement(node: HTMLElement, beforeSubmit?: boolean): HTMLElement | null {
        let processedNode: HTMLElement | null = node

        if (this.srcElements.includes(node.tagName)) {
            processedNode = this.cleanSrcElement(node)
        } else if (node.tagName === 'A') {
            processedNode = this.cleanAnchor(node as HTMLAnchorElement)
        }

        if (!processedNode) return null

        if (/^H\d$/.test(processedNode.tagName)) {
            Array.from(processedNode.attributes).forEach(attr =>
                processedNode!.removeAttribute(attr.name))
        } else {
            this.cleanAttrs(processedNode, beforeSubmit)
            this.cleanClassList(processedNode)
            return this.cleanHtmlTag(processedNode)
        }

        return processedNode
    }

    private cleanHtmlTag(node: HTMLElement): HTMLElement | null {
        if (/[^A-Z\d]/.test(node.tagName)) {
            if (node.innerHTML === '') {
                node.parentNode?.removeChild(node)
                return null
            }

            const newNode = document.createElement('span')
            newNode.innerHTML = node.innerHTML
            node.parentNode?.insertBefore(newNode, node)
            return newNode
        }

        if (node.childNodes.length === 1) {
            const first = node.childNodes[0]
            if (first.nodeType === Node.ELEMENT_NODE && (first as HTMLElement).tagName === 'SPAN') {
                node.innerHTML = (first as HTMLElement).innerHTML
            }
        }

        return node
    }

    private cleanSrcElement(node: HTMLElement): HTMLElement | null {
        let path = node.dataset.path
        const src = node.getAttribute('src')

        if (src) {
            let newSrc: string = ''
            let srcPath: string = ''
            switch (node.tagName) {
                case 'AUDIO':
                    if (this.audiosrcBuilder) {
                        const audio = this.audiosrcBuilder(src)
                        srcPath = audio.path
                        newSrc = audio.getURL()
                    }
                    break
                case 'IMG':
                    if (this.imgsrcBuilder) {
                        const imgsrc = this.imgsrcBuilder(src)
                        srcPath = imgsrc.path
                        newSrc = imgsrc.resize()!.url
                    }
                    break
                case 'VIDEO':
                    if (this.videosrcBuilder) {
                        const videosrc = this.videosrcBuilder(src)
                        srcPath = videosrc.path
                        newSrc = videosrc.getURL()
                    }
                    break
            }

            if (srcPath) {
                if (path && path !== srcPath) {
                    log.warn(`data-path overwrite: ${path} ---> ${srcPath}`)
                }
                node.dataset.path = srcPath
                path = srcPath
                node.setAttribute('src', newSrc)
            }
        }

        if (!path) {
            node.parentNode?.removeChild(node)
            return null
        }

        return node
    }
}