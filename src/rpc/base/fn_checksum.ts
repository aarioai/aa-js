import {floatToInt} from '../../aa/atype/t_basic'
import {t_httpmethod} from '../../aa/atype/a_define_enums'
import {valuesSortedByKeys} from '../../basic/maps/iterates'
import {t_requestdata} from './define_interfaces'

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

function createBlobFactor(blob: Blob): string {
    return `#${blob.size}|${blob.type}>|${blob.slice(0, 32)}`
}

function marshalHeaders(headers?: Headers): string {
    if (!headers) {
        return ''
    }

    const keys = Array.from(headers.keys()).sort()
    const values = new Array(keys.length)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        values.push(headers.get(key))
    }
    return values.join('')
}

/**
 * Creates a request checksum factor
 */
export function createRequestFactor(method: t_httpmethod, url: string, headers?: Headers, body?: t_requestdata): string {

    let checksum = `${method} ${url}${marshalHeaders(headers)}`
    if (!body) {
        return checksum
    }

    let content = ''
    if (typeof body === "string") {
        content = createStringFactor(body)
    } else if (body instanceof Blob) {
        content = createBlobFactor(body)
    } else if (body instanceof File) {
        content = createFileFactor(body)
    } else if (body instanceof FormData) {
        content = createFormDataFactor(body)
    } else {
        content = valuesSortedByKeys(body).join('')
    }
    return `${method} ${url} {${content}}`
}