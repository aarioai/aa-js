/**
 * Join paths with slash
 *
 * @example
 *  joinPath('a/b','../../../xyz')  // Returns ../xyz
 *  joinPath('a/b','..', '..', '..', '/xyz')  // Returns ../xyz
 *  joinPath('', '//test/file')     // Returns test/file
 *  joinPath('/', '//test/file')    // Returns /test/file
 *  joinPath('/a/b', '/c/d')        // Returns /a/b/c/d
 *  joinPath('C:\\a\\b', '/c/d')    // Returns C:\\a\\b\\c\\d
 *  joinPath('C:/a/b', '/c/d')      // Returns C:\\a\\b\\c\\d
 *  joinPath('\\a\\b', '..\\c\\d')   // Returns /a/c/d
 *  joinPath('', '')   // Returns ''
 */
export function joinPath(base: string, ...paths: string[]): string {
    let result = base.replaceAll('\\', '/').replace(/\/+/g, '/').trim()

    for (let path of paths) {
        // for safety, sub-paths can't use absolute path
        path = path.replaceAll('\\', '/').replace(/^\/+/, '').replace(/\/+/g, '/').trim()
        if (!path || path === '.' || path === './') {
            continue
        }

        // window absolute path, e.g. C:\abc, d:\etc
        if (/^[A-Za-z]:\//.test(path)) {
            throw new Error(`illegal to join another absolute windows path ${path}`)
        }
        result = !result || result.endsWith('/') ? result + path : result + '/' + path
    }

    // Process relative path segments (.. and .)
    const parts = result.split('/')
    const newParts: string[] = []
    let isAbsolute = result.startsWith('/')
    let isWindowsAbsolute = /^[A-Za-z]:\//.test(result)

    for (const part of parts) {
        if (part === '..') {
            if (newParts.length > 0 && newParts[newParts.length - 1] !== '..') {
                newParts.pop()
            } else if (!isAbsolute && !isWindowsAbsolute) {
                newParts.push(part)
            }
        } else if (part !== '.' && part !== '') {
            newParts.push(part)
        }
    }

    // Rebuild the path
    if (isWindowsAbsolute) {
        result = newParts.join('\\')
        result = result.charAt(0).toUpperCase() + result.slice(1)

    } else if (isAbsolute) {
        result = '/' + newParts.join('/')
    } else {
        result = newParts.join('/')
    }

    return result
}