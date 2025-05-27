import {floatToInt} from '../../aa/atype/t_basic'
import {t_httpmethod} from '../../aa/atype/a_define_enums'
import {MapObject} from '../../aa/atype/a_define_interfaces'
import {valuesSortedByKeys} from '../../basic/maps/iterates'

function createFileFactor(file: File): string {
    const {size, type, lastModified, name, webkitRelativePath} = file
    return `#${size}|${type}|${lastModified}|${name}|${webkitRelativePath}`
}

function createStringFactor(s: string): string {
    const length = s.length
    if (length < 1024) {
        return `#${length}|${s}`
    }
    const m = floatToInt(length / 2)
    let s2 = s.substring(0, 256) + s.substring(m - 256, m + 256) + s.substring(length - 256)
    return `#${length}>|${s2}`
}

/**
 * Processes FormData entries into a checksum string
 */
function createFormDataFactor(formData: FormData): string {
    const parts: string[] = [];

    for (const [key, value] of formData) {
        const v = value instanceof File
            ? createFileFactor(value)
            : String(value);
        parts.push(`${key}=${v}`);
    }

    const content = parts.join('&');
    return `#${content.length}|${content}`;
}


/**
 * Creates a request checksum factor
 */
export function createRequestFactor(method: t_httpmethod, url: string, headers?: MapObject<string>, body?: File | MapObject | FormData | string | null): string {
    let checksum = `${method} ${url}${valuesSortedByKeys(headers).join('')}`
    if (!body) {
        return checksum
    }

    let content = ''
    if (body instanceof File) {
        content = createFileFactor(body)
    } else if (body instanceof FormData) {
        content = createFormDataFactor(body)
    } else if (typeof body === "string") {
        content = createStringFactor(body)
    } else {
        content = valuesSortedByKeys(body).join('')
    }
    return `${method} ${url} {${content}}`
}