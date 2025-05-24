import {t_httpmethod} from '../../aa/atype/a_define_enums'

function fileChecksum(file: File): string {
    const {size, type, lastModified, name, webkitRelativePath} = file
    return `#${size}|${type}|${lastModified}|${name}|${webkitRelativePath}`
}

function stringChecksum(s: string): string {
    const length = s.length
    if (length < 1024) {
        return `#${length}|${s}`
    }
    const m = Math.floor(length / 2)
    let s2 = s.substring(0, 256) + s.substring(m - 256, m + 256) + s.substring(length - 256)
    return `#${length}>|${s2}`
}

/**
 * Processes FormData entries into a checksum string
 */
function formDataChecksum(formData: FormData): string {
    const parts: string[] = [];

    for (const [key, value] of formData) {
        const v = value instanceof File
            ? fileChecksum(value)
            : String(value);
        parts.push(`${key}=${v}`);
    }

    const content = parts.join('&');
    return `#${content.length}|${content}`;
}

/**
 * Generates a request fingerprint
 */
export function generateRequestChecksum(method: t_httpmethod, url: string, body?: File | FormData | string): string {
    let checksum = `${method} ${url}`
    if (!body) {
        return checksum
    }

    let content = ''
    if (body instanceof File) {
        content = fileChecksum(body)
    } else if (body instanceof FormData) {
        content = formDataChecksum(body)
    } else if (typeof body === "string") {
        content = stringChecksum(body)
    }
    return `${method} ${url} {${content}}`
}