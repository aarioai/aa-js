import type {t_filetype} from './a_define'

/**
 * Formats a file type string
 */
export function a_filetype(s: string): t_filetype {
    if (s == "") {
        return ""
    }
    if (s.charAt(0) != '.') {
        return '.' + s
    }
    return s
}