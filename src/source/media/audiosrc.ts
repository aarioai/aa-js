import FileSrc from '../base/filesrc'
import {t_audiosrc} from '../base/define'
import {t_int, t_second} from '../../aa/atype/a_define'
import {safeInt} from '../../aa/atype/t_basic'

export class AudioSrc extends FileSrc {
    constructor(src: t_audiosrc) {
        super(src)
        this.set('bitrate', safeInt(src['bitrate']))
        this.set('duration', safeInt(src['duration']))
        this.set('sample_rate', safeInt(src['sample_rate']))
    }

    get bitrate(): t_int {
        return this.get('bitrate') as t_int
    }

    get duration(): t_second {
        return this.get('duration') as t_second
    }

    get sampleRate(): t_int {
        return this.get('sample_rate') as t_int
    }
}

export default function audiosrc(src: t_audiosrc | AudioSrc): AudioSrc | null {
    if (!src) {
        return null
    }
    if (src instanceof AudioSrc) {
        return src
    }
    return new AudioSrc(src)
}