import FileSrc from '../base/filesrc'
import {t_docsrc} from '../base/define'

export class DocSrc extends FileSrc {
    constructor(src: t_docsrc) {
        super(src)

    }


}

export default function docsrc(src: t_docsrc | DocSrc): DocSrc | null {
    if (!src) {
        return null
    }
    if (src instanceof DocSrc) {
        return src
    }
    return new DocSrc(src)
}