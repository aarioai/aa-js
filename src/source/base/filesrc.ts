import AaMap from '../../basic/maps/map'
import {Provider, t_filesrc} from './define'
import {t_url_pattern} from '../../basic/urls/base'
import {t_int, t_url} from '../../aa/atype/a_define'
import {safeInt} from '../../aa/atype/t_basic'

export default class FileSrc extends AaMap {

    constructor(src: t_filesrc) {
        super(src)
        this.set('provider', src['provider'])
        this.set('url', src['url'])
        this.set('url_pattern', src['url_pattern'])
        this.set('alter_url_pattern', src['alter_url_pattern'])
        this.set('base_url', src['base_url'])
        this.set('path', src['path'])
        this.set('filetype', src['filetype'])
        this.set('size', safeInt(src['size']))
        this.set('info', src['info'])
        this.set('checksum', src['checksum'])
        this.set('jsonkey', src['jsonkey'] || 'path')
    }

    get provider(): Provider {
        return this.get('provider') as Provider
    }

    get url(): t_url {
        return this.get('url') as t_url
    }

    get urlPattern(): t_url_pattern {
        return this.get('url_pattern') as t_url_pattern
    }

    get alterUrlPattern(): t_url_pattern {
        return this.get('alter_url_pattern') as t_url_pattern
    }

    get baseURL(): string {
        return this.get('base_url') as string
    }

    get path(): string {
        return this.get('path') as string
    }

    get filetype(): string {
        return this.get('filetype') as string
    }

    get size(): t_int {
        return this.get('size') as t_int
    }

    get info(): string {
        return this.get('info') as string
    }

    get checksum(): string {
        return this.get('checksum') as string
    }

    get jsonkey(): string {
        return this.get('jsonkey') as string
    }
}