import FileSrc from '../base/filesrc'
import {t_size_value, t_videosrc} from '../base/define'
import {safeInt} from '../../aa/atype/t_basic'
import {t_int, t_second, t_url} from '../../aa/atype/a_define'
import {ImgSrc} from './imgsrc'

export class VideoSrc extends FileSrc {
    constructor(src: t_videosrc) {
        super(src)
        this.set('allowed', src['allowed'] || null)
        this.set('bitrate', safeInt(src['bitrate']))
        this.set('codec', src['codec'])
        this.set('duration', safeInt(src['duration']))
        this.set('framerate', safeInt(src['framerate']))
        this.set('height', safeInt(src['height']))
        this.set('preview', src['preview'] ? (new ImgSrc(src['preview'])) : null)
        this.set('sample_rate', safeInt(src['sample_rate']))
        this.set('width', safeInt(src['width']))
    }

    get allowed(): t_size_value[] | null {
        return this.get('allowed') as (t_size_value[] | null)
    }

    get bitrate(): t_int {
        return this.get('bitrate') as t_int
    }

    get codec(): string {
        return this.get('codec') as string
    }

    get duration(): t_second {
        return this.get('duration') as t_second
    }

    get framerate(): t_int {
        return this.get('framerate') as t_int
    }

    get height(): t_int {
        return this.get('height') as t_int
    }

    get preview(): ImgSrc | null {
        return this.get('preview') as (ImgSrc | null)
    }

    get sampleRate(): t_int {
        return this.get('sample_rate') as t_int
    }

    get width(): t_int {
        return this.get('width') as t_int
    }

    // @TODO
    getURL(): t_url {
        return this.url
    }

}

export default function videosrc(src: t_videosrc | VideoSrc): VideoSrc | null {
    if (!src) {
        return null
    }
    if (src instanceof VideoSrc) {
        return src
    }
    return new VideoSrc(src)
}