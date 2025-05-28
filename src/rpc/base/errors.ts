import {AError} from '../../basic/aerror/error'
import {E_ClientThrow} from '../../basic/aerror/code'

export const E_ClientDenyDebounce = new AError(E_ClientThrow, 'request denied due to debounce').lock()