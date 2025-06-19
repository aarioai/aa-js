import {normalizePath} from "vite";
import {isAbsolutePath, joinPath, parsePath} from "./path_func";

export class Path {
    separator = '/'
    #path: string = ''
    #dirname: string = ''   // path = dirname + '/' + basename
    #basename: string = ''// filename + extname
    #filename: string = ''  // filename without extension name
    #extension: string = ''   // extension name starts with a dot
    #parsed: boolean = false

    constructor(path: string, normalize: boolean = true) {
        if (normalize) {
            path = normalizePath(path)
        }
        this.#path = path
    }

    get dirname(): string {
        this.#parse()
        return this.#dirname
    }

    get basename(): string {
        this.#parse()
        return this.#basename
    }

    get extension(): string {
        this.#parse()
        return this.#extension
    }

    get filename(): string {
        this.#parse()
        return this.#filename
    }

    withSeparator(separator: string): Path {
        this.separator = separator
        return this
    }

    join(...paths: string[]): Path {
        this.#path = joinPath(this.#path, ...paths)
        this.#parsed = false
        return this
    }

    isAbsolute(): boolean {
        return isAbsolutePath(this.#path)
    }

    toString() {
        return this.separator === '/' ? this.#path : this.#path.replaceAll('/', this.separator)
    }

    #parse() {
        if (this.#parsed) {
            return
        }
        this.#parsed = true
        const path = this.#path
        // optimize to pre-parse some paths
        if (path === '' || path === '.' || path === './') {
            return
        }

        if (path === '/') {
            this.#dirname = '/'
            return
        }

        const {dirname, basename, filename, extension} = parsePath(this.#basename)
        this.#dirname = dirname
        this.#basename = basename
        this.#filename = filename
        this.#extension = extension

    }

}