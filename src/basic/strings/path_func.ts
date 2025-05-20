import {Panic} from "../../aa/atype/panic";
import {Stringable} from '../../aa/atype/a_define_complex'

export function isWindowsAbsolutePath(path: string): boolean {
    return path ? /^[A-Za-z]:[\/\\]/.test(path) : false
}

export function isAbsolutePath(path: string): boolean {
    return path ? (path.startsWith('/') || isWindowsAbsolutePath(path)) : false
}

/**
 * Splits joint path parts into a path segment array
 *
 * @example
 *  splitPath('/a/','/','b')            //  ['a', 'b']
 *  splitPath('/a', '/b/c', 'd')        //  ['a', 'b', 'c', 'd']
 *  splitPath('/a', ' b c ', 'd')       //  ['a', 'b', 'c', 'd']
 *  splitPath('/a', '.', 'd')           //  ['a', 'b']
 *  splitPath('/a', '../.', 'd')        //  ['d']
 *  splitPath('/a', '../.././..','.', 'd')    //  ['..', '..', 'd']
 */
export function splitPath(...parts: Stringable[]): string[] {
    if (!parts.length) {
        return []
    }
    let segs: string[] = []
    for (let part of parts) {
        const p = String(part)
            .replace(/[\s\\]/g, '/')
            .replace(/\/+/g, '/')
            .replace(/^\/|\/$/g, '')
        if (p === '' || p === '.') {
            continue
        }
        if (p.includes('/')) {
            segs.push(...p.split('/').filter(s => s != '.'))
        } else {
            segs.push(p)
        }
    }
    let parent = 0
    let newSegs: string[] = []
    for (let i = segs.length - 1; i > -1; i--) {
        const seg = segs[i]
        if (seg === '..') {
            parent = parent < 1 ? 1 : (parent + 1)
            continue
        }
        if (parent > 0) {
            parent--
            continue
        }
        newSegs.unshift(seg)
    }
    while ((parent--) > 0) {
        newSegs.unshift('..')
    }

    return newSegs
}

/**
 * Join paths with slash
 *
 * @example
 *  joinPath('a/b','../../../xyz')  // Returns ../xyz
 *  joinPath('a/b','..', '..', '..', '/xyz')  // Returns ../xyz
 *  joinPath('', '//test/file')     // Returns test/file
 *  joinPath('/', '//test/file')    // Returns /test/file
 *  joinPath('/a/b', '/c/d')        // Returns /a/b/c/d
 *  joinPath('C:\\a\\b', '/c/d')    // Returns C:\a\b\c\d
 *  joinPath('C:/a/b', '/c/d')      // Returns C:\a\b\c\d
 *  joinPath('\\a\\b', '..\\c\\d')   // Returns /a/c/d
 *  joinPath('', '')   // Returns ''
 */
export function joinPath(baseDir: string, ...paths: string[]): string {
    let result = baseDir.replaceAll('\\', '/').replace(/\/+/g, '/').trim()

    for (let path of paths) {
        // for safety, sub-paths can't use absolute path
        path = path.replaceAll('\\', '/').replace(/^\/+/, '').replace(/\/+/g, '/').trim()
        if (!path || path === '.' || path === './') {
            continue
        }

        // window absolute path, e.g. C:\abc, d:\etc
        Panic.assert(/^[A-Za-z]:\//.test(path), `illegal to join another absolute windows path ${path}`)

        result = !result || result.endsWith('/') ? result + path : result + '/' + path
    }

    // Process relative path segments (.. and .)
    const parts = result.split('/')
    const newParts: string[] = []
    let isAbsolute = result.startsWith('/')
    let isWindowsAbsolute = isWindowsAbsolutePath(result)

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


/**
 * Normalizes a path to its shortest equivalent form by purely lexical processing.
 *
 * @example
 *  normalizePath('/../a/c/')       // /a/c
 *  normalizePath('a/b/c/..')       // a/b
 *  normalizePath('./a/b/c/..')     // a/b
 *  normalizePath('/./a/b/c/..')    // /a/b
 *  normalizePath('/../a//b/c/d/e/../../../f/.//./g/.//.///./../.././i/./../.')  // /a/b
 *  normalizePath('../a//b/c/d/e/../../../f/.//./g/.//.///./../.././i/./../.')   // ../a/b
 *  normalizePath('C:/a/c/')       // C:\a\c
 */
export function normalizePath(path: string) {
    path = path.trim()
    if (!path || path === '.' || path === './') {
        return ''
    }

    let parts = path.replaceAll('\\', '/').split('/')
    return joinPath(parts[0] === '' ? '/' : parts[0], ...parts.slice(1))
}

/**
 * Return the last element of path, base equals to filename + ext
 *
 * @example
 *  parseBaseName('a')          // {dirname: '', basename: 'a'}
 *  parseBaseName('/a/b.jpg')   //  {dirname: '/a', basename: 'b.jpg'}
 *  parseBaseName('./a/.gitignore')     // {dirname: './a', basename: '.gitignore'}
 *  parseBaseName('C:/a/.gitignore')     // {dirname: 'C:\a', basename: '.gitignore'}
 */
export function parseBaseName(path: string): { dirname: string, basename: string } {
    if (!path || path === '.' || path === './') {
        return {dirname: '', basename: ''}
    }
    path = normalizePath(path)
    const isWindowsAbsolute = isWindowsAbsolutePath(path)
    const separator = isWindowsAbsolute ? '\\' : '/'
    if (isWindowsAbsolute) {
        path = path.replaceAll(separator, '/')
    }
    let parts = path.split('/')
    const basename = parts.pop() || ''
    const dirname = parts.join(separator)
    return {
        dirname: dirname,
        basename: basename,
    }
}

/**
 * Gets the extension name from a path, default returns a lowercase name
 *
 * @example
 *  parseFilename('a')                   //  {dirname:'', basename: 'a', filename: 'a', extension: ''}
 *  parseFilename('C:/test\\a.JPG')     //  {dirname:'C:\\test', basename: 'a.JPG', filename: 'a', extension: '.JPG'}
 *  parseFilename('/tests/a.test.js')    //  {dirname:'/tests', basename: 'a.test.js', filename: 'a.test', extension: '.js'}
 *  parseFilename('./.gitignore')         //  {dirname:'', basename: '.gitignore', filename: '', extension: '.gitignore'}
 */
export function parsePath(path: string): { dirname: string, basename: string, filename: string, extension: string } {
    const {dirname, basename} = parseBaseName(path)
    if (basename === '') {
        return {dirname, basename, filename: '', extension: ''}
    }

    const lastDotIndex = basename.lastIndexOf('.')
    if (lastDotIndex < 0 || lastDotIndex === basename.length - 1) {
        return {dirname, basename, filename: basename, extension: ''}
    }
    return {
        dirname,
        basename,
        filename: basename.slice(0, lastDotIndex),
        extension: basename.slice(lastDotIndex),
    }
}