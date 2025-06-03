export enum PathParam {
    ':bool',
    ':int8',
    ':int16',  // no :int24 and :uint24, floats
    ':int32',
    ':int',
    ':int64',
    ':uint8',
    ':uint16',
    ':uint32',
    ':uint',
    ':uint64',
    ':string',
    ':uuid',
    ':alphabetical',
    ':email',
    ':mail',     // mail is same to email, but mail without server domain validation
    ':weekday',
}

export type t_path_param = keyof typeof PathParam
export const path_param_string_t: t_path_param = ':string'
export const JOINT_PATH_PARAMS = Object.keys(PathParam).join('|')
export const PATH_PARAM_TESTER = new RegExp(`^({|%7B)([_a-z]\\w*)(${JOINT_PATH_PARAMS})?(}|%7D)$`, 'i')  // %7B is encodeURIComponent('{')
export const PATH_PARAMS_MATCHER = new RegExp(`({|%7B)([_a-z]\\w*)(${JOINT_PATH_PARAMS})?(}|%7D)`, 'ig')   // {<key>} or {<key><type>}
