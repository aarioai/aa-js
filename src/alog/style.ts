export class ALogStyle {
    name = 'aa-logger-style'

    readonly color: string
    readonly background: string
    readonly fontWeight: number


    constructor(color?: string, background?: string, fontWeight?: number) {
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
