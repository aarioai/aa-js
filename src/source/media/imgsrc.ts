import FileSrc from '../base/filesrc'
import type {t_float64, t_int, t_url_pattern} from '../../aa/atype/a_define'
import type {Image, t_imgsrc, t_size_value} from '../base/define'
import {tabletMainWidth} from '../../browser/detect_device'
import {pxInt, type t_css_size} from '../../browser/pixel'
import defaults from '../base/defaults'
import {floatToInt, safeInt} from '../../aa/atype/t_basic'
import {KB} from '../../aa/atype/a_define_units'
import {findClosestSize} from '../base/fn'
import {replaceAll} from '../../basic/strings/strings'
import type {Dict} from '../../aa/atype/a_define_interfaces'

export class ImgSrc extends FileSrc {
    dpr: number = defaults.imageDPR
    cropDPR: number = defaults.imageDPR * 1.5
    private readonly aspectRatio: t_float64   // width / height

    constructor(src: t_imgsrc) {
        super(src)
        this.set('allowed', src['allowed'] || null)
        this.set('crop_pattern', src['crop_pattern'])
        this.set('height', safeInt(src['height']))
        this.set('width', safeInt(src['width']))
        this.aspectRatio = src.width / src.height   // panic on missing height
    }

    get allowed(): t_size_value[] | null {
        return this.get('allowed') as (t_size_value[] | null)
    }

    // e.g.  https://xxx/img.jpg?width={width:int}&height={height:int}
    get cropPattern(): t_url_pattern {
        return this.get('crop_pattern') as t_url_pattern
    }

    get height(): t_int {
        return this.get('height') as t_int
    }

    get width(): t_int {
        return this.get('width') as t_int
    }

    /**
     * Crop resized image to the closest size
     *
     * @example
     *  // cropDPR=1.2, 1rem=10px, image width=500px, height=400px
     *  crop(100, 100)  // Resize image to 150*120px, then crop to get 120*120px, i.e., 1.2*100px
     *  crop('10rem')  // Same to crop(100, 80), resize and crop to get a 120*96px image
     *  crop(null, '100vh')  // Resize and crop to get an image that has a height equals to 100% device view height
     */
    crop(width: t_css_size | null, height: t_css_size | null): Image | null {
        if (!this.path) {
            return null
        }
        let cssWidth = width ? pxInt(width) : 0
        let cssHeight = height ? pxInt(height) : floatToInt(cssWidth / this.aspectRatio)
        if (!cssWidth && !cssHeight) {
            return null
        }
        if (!cssWidth) {
            cssWidth = floatToInt(cssHeight * this.aspectRatio)
        }
        let realWidth = floatToInt(cssWidth * this.cropDPR)
        let realHeight = floatToInt(cssHeight * this.cropDPR)

        // Small image returns original source URL
        if (this.isSmall(realWidth, realHeight, true)) {
            return {
                url: this.url,
                alterURL: replaceAll(this.alterUrlPattern, this.patternReplacement(this.width, this.height)),
                aspectRatio: this.aspectRatio,
                css: {width: cssWidth, height: cssHeight},
                real: {width: this.width, height: this.height},
            }
        }


        const real = findClosestSize(this.allowed, realWidth, realHeight)
        return {
            url: replaceAll(this.urlPattern, this.patternReplacement(real.width, real.height)),
            alterURL: replaceAll(this.alterUrlPattern, this.patternReplacement(real.width, real.height)),
            aspectRatio: this.aspectRatio,
            css: {width: cssWidth, height: cssHeight},
            real: real,
        }
    }

    isSmall(width: t_int, height: t_int, isCrop: boolean): boolean {
        if (!this.size || !this.width || !width || !height) {
            return false
        }
        if (typeof defaults.smallImageCondition === 'function') {
            return defaults.smallImageCondition(this.size, [this.width, this.height], [width, height], isCrop)
        }
        return isCrop
            ? (this.width < width * 1.5 && this.height < height * 1.5)
            : ((this.size < 500 * KB) || (this.width < width * 1.5))
    }

    /**
     * Stretch the image fit to the maxWidth
     *
     * @example
     *  resize()            // Resize image's width to the device max width
     *  resize("100vw")     // Resize image's width to the 100% device view width
     *  resize("10rem")     // Resize image's width to 10rem
     *  resize(100)         // Resize images' width to 100px
     */
    resize(maxWidth?: t_css_size): Image | null {
        if (!this.path) {
            return null
        }
        let cssWidth = maxWidth ? pxInt(maxWidth) : floatToInt(tabletMainWidth())
        let realWidth = floatToInt(cssWidth * this.dpr)
        if (realWidth > this.width) {
            realWidth = this.width
            cssWidth = floatToInt(realWidth / this.dpr)
        }
        const cssHeight = floatToInt(cssWidth / this.aspectRatio)
        const realHeight = floatToInt(cssHeight * this.dpr)

        // Small image returns original source URL
        if (this.isSmall(realWidth, realHeight, false)) {
            return {
                url: this.url,
                alterURL: replaceAll(this.alterUrlPattern, this.patternReplacement(this.width, this.height)),
                aspectRatio: this.aspectRatio,
                css: {width: cssWidth, height: cssHeight},
                real: {width: this.width, height: this.height},
            }
        }
        const real = findClosestSize(this.allowed, realWidth, realHeight)
        return {
            url: replaceAll(this.urlPattern, this.patternReplacement(real.width, real.height)),
            alterURL: replaceAll(this.alterUrlPattern, this.patternReplacement(real.width, real.height)),
            aspectRatio: this.aspectRatio,
            css: {width: cssWidth, height: cssHeight},
            real: real,
        }
    }

    private patternReplacement(width: t_int, height: t_int): Dict {
        return {
            '{width:int}': width,
            '{height:int}': height,
            '{max_width: int}': width,
            '{max_height: int}': height,
        }
    }

}

export default function imgsrc(src: t_imgsrc | ImgSrc): ImgSrc | null {
    if (!src) {
        return null
    }
    if (src instanceof ImgSrc) {
        return src
    }
    return new ImgSrc(src)
}