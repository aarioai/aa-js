/**
 * Converts standard Base64 encoding to URL-safe Base64 by replacing special characters
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-5
 */
export function base64URLSafe(stdBase64: string): string {
    return stdBase64 ? stdBase64.replaceAll('+', '-').replaceAll('/', '_') : ''
}

// Converts a URL-safe Base64 string to standard Base64 encoding
export function base64Std(urlSafeBase64: string): string {
    return urlSafeBase64 ? urlSafeBase64.replaceAll('-', '+').replaceAll('_', '/') : ''
}

// Decodes standard/URL-safe Base64
export function decodeBase64(base64: string): string {
    if (!base64) {
        return ''
    }
    // atob can decode Base64 string with and without padding
    return atob(base64Std(base64))
}

export function encodeBase64(text: string, padding: boolean = true): string {
    if (!text) {
        return ''
    }
    let base64 = btoa(text)
    if (!padding) {
        return base64.replaceAll('=', '')
    }
    return base64
}

export function encodeURLSafeBase64(text: string, padding: boolean = true): string {
    return base64URLSafe(encodeBase64(text, padding))
}

