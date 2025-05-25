import {Millisecond} from '../../aa/atype/a_define_units'

const defaults = {
    baseURL: '',
    debounceInterval: 400 * Millisecond,
    headers: {
        common: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        'HEAD': {},
        'GET': {},
        'DELETE': {},
        'POST': {},
        'PUT': {},
        'PATCH': {},
    },

}
export default defaults