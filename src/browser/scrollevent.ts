import {floatToInt} from '../aa/atype/t_basic'
import {documentHeight} from './detect_device'
import log from '../aa/alog/log'
import {CONTINUE} from '../aa/atype/a_define_enums'

type ScrollEventCallback = (scrollTop: number, prevScrollTop: number, isAuto: boolean) => void
type ScrollEventIgnore = (scrollTop: number, prevScrollTop: number, isAuto: boolean) => boolean

interface ScrollEventConfig {
    ignore?: ScrollEventIgnore | null
    trigger: ScrollEventCallback
    pause?: boolean
}

export default class AaScrollEvent {
    onAutoScrolling: boolean = false
    prevScrollTop: number = 0
    scrollHandler: () => void
    private events: Map<string, {
        ignore: ScrollEventIgnore | null
        trigger: ScrollEventCallback
        pause: boolean
    }> = new Map()

    constructor() {
        this.scrollHandler = this.handleScroll.bind(this)
    }

    listen(): void {
        document.addEventListener('scroll', this.scrollHandler, {passive: true})
    }

    unlisten(): void {
        document.removeEventListener('scroll', this.scrollHandler)
    }

    isAtTop(scrollTop: number, prevScrollTop: number, isAuto: boolean): boolean {
        scrollTop = floatToInt(scrollTop)
        return scrollTop <= 1 && scrollTop <= floatToInt(prevScrollTop)
    }

    isAtBottom(scrollTop: number, prevScrollTop: number, isAuto: boolean): boolean {
        scrollTop = floatToInt(scrollTop)
        const threshold = documentHeight() - window.innerHeight - 200  // close to bottom 200px
        return scrollTop >= threshold && scrollTop >= floatToInt(prevScrollTop)
    }

    isAtClientBottom(scrollTop: number, prevScrollTop: number, scrollHeight: number, clientHeight: number): boolean {
        scrollTop = floatToInt(scrollTop)
        const bottom = scrollHeight - clientHeight
        return scrollTop >= bottom && scrollTop >= floatToInt(prevScrollTop)
    }

    register(name: string, {ignore = null, trigger, pause = false}: ScrollEventConfig): void {
        if (this.events.has(name)) {
            log.error(`scroll event "${name}" already registered`)
            return
        }
        this.events.set(name, {ignore, trigger, pause})
    }

    registerAtBottom(name: string, trigger: ScrollEventCallback, pause: boolean = false): void {
        this.register(name, {
            ignore: this.isAtBottom,
            trigger,
            pause
        })
    }

    registerAtTop(name: string, trigger: ScrollEventCallback, pause: boolean = false): void {
        this.register(name, {
            ignore: this.isAtTop,
            trigger,
            pause
        })
    }

    unregister(name: string): void {
        this.events.delete(name)
    }

    pause(name: string): void {
        this.setPaused(name, true)
    }

    unpause(name: string): void {
        this.setPaused(name, false)
    }

    fire(): void {
        const scrollTop = window.scrollY
        const prevScrollTop = this.prevScrollTop
        this.onAutoScrolling = Math.abs(scrollTop - prevScrollTop) > 10
        const isAuto = this.isAutoScroll(scrollTop, prevScrollTop)

        this.events.forEach((event, name) => {
            if (event.pause) {
                return CONTINUE
            }
            if (event.ignore?.(scrollTop, prevScrollTop, isAuto)) {
                return CONTINUE
            }
            event.trigger(scrollTop, prevScrollTop, isAuto)
        })

        this.prevScrollTop = scrollTop
    }

    // For click events, currentClientY captures the cursor location, but prevClientY is unavailable because onDragStart never runs.
    getDragDistance(currentClientY: number, prevClientY: number | undefined): number {
        return typeof prevClientY === 'number' ? currentClientY - prevClientY : 0
    }

    isDragAtTop(scrollTop: number, distance: number): boolean {
        return distance >= 50 && floatToInt(scrollTop) <= 1
    }

    private setPaused(name: string, paused: boolean = true): void {
        const event = this.events.get(name)
        if (!event) {
            log.debug(`cannot ${paused ? 'pause' : 'unpause'} non-existent scroll event "${name}"`)
            return
        }
        event.pause = paused
    }

    private handleScroll(): void {
        window.requestAnimationFrame(this.fire.bind(this))
    }

    private isAutoScroll(scrollTop: number, prevScrollTop: number): boolean {
        return Math.abs(scrollTop - prevScrollTop) < 5
    }
}