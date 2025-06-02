import {Dict} from '../aa/atype/a_define_interfaces'
import {ASCEND, SortFunc} from '../aa/atype/a_define_funcs'
import log from '../aa/alog/log'
import {safeCast} from '../aa/atype/t_basic'


export type Option<V = unknown> = {
    value: V
    text: string
    key?: number
    pid?: V | null    // parent value
    prefix?: any  // text or icon prefix, e.g., <f8 f803> is alias to <i class="f8 f803"></i>
    suffix?: any
    inherit?: boolean // set true will copy itself to its child
    comment?: any
    virtual?: boolean   // hide on virtual
}

export type NormalizedOption<V = unknown> = {
    value: V
    text: string
    key: number
    pid: V | null
    prefix: any
    suffix: any
    inherit: boolean
    comment: any
    virtual: boolean   // hide on virtual
}

export type t_select_1d_data = Dict<string>[]                   // ValueTextPairs, [{$value:$text},{$value:$text}, ...]
    | string[]                                                  // Texts, [$text, $text, ...]
    | [unknown, string][]                                       // ValueTextTuples, [[$value, $text],[$value, $text], ...]
    | Option[]                                                  // Options, [{value:$value, text:$text}, {value:$value, text:$text}, ...]
export type t_select_data = t_select_1d_data | Dict<string>     // Dict, {$value:$text, $value:$text, ...}
export type t_selects_data = t_select_1d_data[]

export type t_selectgroup_data = t_select_data | t_selects_data

export function extractValues<V = unknown>(options: Option<V> | Option<V>[]): V[] {
    if (!options) {
        return []
    }
    if (!Array.isArray(options)) {
        return [options.value]
    }
    return options.map(option => option.value)
}

export function normalizeOption<V = unknown>(option: Option, cast?: (value: unknown) => V): NormalizedOption<V> {
    return {
        value: safeCast<V>(option.value, cast),
        text: option.text,
        key: option.key,
        pid: safeCast<V>(option.pid, cast),
        prefix: option.prefix ?? '',
        suffix: option.suffix ?? '',
        inherit: option.inherit ?? false,
        comment: option.comment ?? '',
        virtual: option.virtual ?? false,
    }
}

/**
 * Multilevel select-elements data
 * [
 *   [{A}, {B}, {C}, ...],                                      // 1st level
 *   [{A1}, {A2}, ..., {B1}, {B2},..., {C1}, ...],              // 2nd level
 *   ...                                                        // other levels
 * ]
 *
 * @example
 *  [
 *    [{key:0, value:100, text:'Asia'}, {key:1, value:101, text:'Europe'}, {key:2, value:86, text:'*China', pid:101}],
 *    [
 *      {key:0, value:86, text:'China', pid:100},
 *      {key:1, value:85, text:'Japan', pid:100}
 *      {key:0, value:98, text:'UK', pid:101},
 *      {key:1, value:99, text:'France', pid:101}
 *    ]
 *  ]
 *  // renders to:
 *      // first level
 *      <select>
 *          <option key="0" value="101">Europe</option>
 *          <option key="1" value="100">Asia</option>
 *          <option key="2" value="86" pid="100">*China</option>
 *      </select>
 *
 *      // second level, when first level selected value=100
 *      <select>
 *          <option value="86" data-pid="100">China</option>
 *          <option value="85" data-pid="100">Japan</option>
 *      </select>
 *
 *      // second level, when first level selected value=101
 *     <select>
 *          <option value="98" data-pid="101">UK</option>
 *          <option value="99" data-pid="101">France</option>
 *      </select>
 */
export function normalizeSelectGroup<V = unknown>(levels: Option[][], cast?: (value: unknown) => V, enableInherit: boolean = false): NormalizedOption<V>[][] {
    const l = levels?.length
    if (!l) {
        return []
    }
    const lastIndex = l - 1
    const result: NormalizedOption<V>[][] = new Array(l)
    for (let i = 0; i < l; i++) {
        const options = sortAndValidateOptions<V>(levels[i], cast) // options of one select
        let normalizedOptions: NormalizedOption<V>[] = new Array(options.length)
        for (let j = 0; j < options.length; j++) {
            const option = options[j]
            const opt = normalizeOption<V>(option)

            if (enableInherit && opt.inherit && i < lastIndex) {
                opt.inherit = false
                levels[i + 1].unshift({
                    ...opt,
                    pid: opt.value,
                    key: -1, // key will re-index by sortAndValidateOptions
                })
            }
            normalizedOptions[j] = opt
        }
        result[i] = normalizedOptions

    }
    return result
}

export function normalizeSelectGroupData<V = unknown>(data: t_selectgroup_data, cast?: (value: unknown) => V, enableInherit: boolean = false): NormalizedOption<V>[][] {
    if (!data) {
        return []
    }
    // Handle Dict format data, {$value:$text, $value:$text...}
    if (!Array.isArray(data)) {
        return normalizeDictData<V>(data, cast, enableInherit)
    }
    if (data.length === 0) {
        return []
    }
    const first = data[0]
    // Handle ValueTextPairs, Texts, Options format data
    if (!Array.isArray(first)) {

        // Handle Texts format data
        if (typeof first === 'string') {
            return normalizeTextsData(data as string[], cast, enableInherit)
        }
        // Handle ValueTextPairs format data
        if (Object.keys(first).length === 1) {
            return normalizeValueTextPairsData(data as Dict<string>[], cast, enableInherit)
        }
        // Handle Options format data
        return normalizeOptionsData(data as Option[], cast, enableInherit)
    }

    if (first.length === 0) {
        return []
    }

    // Handle ValueTextTuples
    if (!Array.isArray(first[0])) {
        return normalizeValueTextTuplesData(data as [unknown, string][], cast, enableInherit)
    }

    // Handle selects data
    const selects = []
    for (const select of data) {
        selects.push(normalizeSelectGroupData(select as t_select_1d_data, cast, enableInherit))
    }
    return selects
}

/**
 * Sorts keys and validates options in one select group level
 *
 * @example
 *  [
 *    [{key:0, value:100, text:'Asia'}, {key:1, value:101, text:'Europe'}, {key:2, value:86, text:'*China', pid:101}],
 *    [
 *      {key:0, value:86, text:'China', pid:100},
 *      {key:1, value:85, text:'Japan', pid:100}
 *      {key:0, value:98, text:'UK', pid:101},
 *      {key:1, value:99, text:'France', pid:101}
 *    ]
 *  ]
 */
export function sortAndValidateOptions<V = unknown>(options: Option[], cast?: (value: unknown) => V): Option[] {
    if (!options?.length) {
        return []
    }
    let optionGroup: Dict<Option[]> = {}

    for (let i = 0; i < options.length; i++) {
        // cast value
        options[i].value = safeCast<V>(options[i].value, cast)
        options[i].pid = safeCast<V>(options[i].pid, cast)

        if (typeof options[i].key !== 'number') {
            options[i].key = 0
        }

        const pid = String(options[i].pid || '')
        optionGroup[pid] = optionGroup[pid] || []
        optionGroup[pid].push(options[i])

        // validate
        const {value, text} = options[i]

        for (let j = 0; j < i; j++) {
            const t = options[j].text
            if (value === options[j].value && text !== t) {
                log.warn(`option text ${text} and ${t} are conflicted with same value ${value}`)
            }
        }
    }

    return Object.keys(optionGroup).sort().flatMap(pid => {
        return optionGroup[pid]
            .sort((a, b) => a.key - b.key)
            .map((option, index) => ({
                ...option,
                key: index,
            }))
    })
}


/**
 * Normalizes Dict format data to NormalizedOption<V>[][]
 * a.w.a., converts {$value:$text, $value:$text...} to [[{value:$value, text:$text, ...}, ...]]
 * a.w.a., this select groups contains one select
 *
 * @example
 *  {male:'男', female:'女'} // [{value:'female', text:'女', ...}, {value:'male', text:'男', ...}]
 *  // renders to:
 *      <select><option value="male">男</option><option value="female">女</option></select>
 */
export function normalizeDictData<V = unknown>(data: Dict<string>, cast?: (value: unknown) => V, enableInherit: boolean = false, sortFn: SortFunc = ASCEND): NormalizedOption<V>[][] {
    const keys = data ? Object.keys(data).sort(sortFn) : []
    if (keys.length === 0) {
        return []
    }
    const result: Option[] = []
    for (let i = 0; i < keys.length; i++) {
        const value = keys[i]
        result.push({
            value: value,
            text: data[value],
            key: i,
        })
    }
    return normalizeSelectGroup<V>([result], cast, enableInherit)
}

/**
 * Normalizes ValueTextPairs format data to NormalizedOption<V>[][]
 * a.w.a., converts [{$value:$text},{$value:$text}...] to [[{value:$value, text:$text, ...}, ...]]
 * a.w.a., this select groups contains one select
 *
 * @example
 *  [{male:'男'}, {female:'女'}] // [{value:'female', text:'女', ...}, {value:'male', text:'男', ...}]
 *  // renders to:
 *      <select><option value="male">男</option><option value="female">女</option></select>
 */
export function normalizeValueTextPairsData<V = unknown>(data: Dict<string>[], cast?: (value: unknown) => V, enableInherit: boolean = false): NormalizedOption<V>[][] {
    if (!data?.length) {
        return []
    }
    const result: Option[] = []
    for (let i = 0; i < data.length; i++) {
        for (const [value, text] of Object.entries(data[i])) {
            result.push({
                value: value,
                text: text,
                key: i,
            })
        }
    }
    return normalizeSelectGroup<V>([result], cast, enableInherit)
}


/**
 * Normalizes ValueTextTuples format data to NormalizedOption<V>[][]
 * a.w.a., converts [[$value, $text],[$value, $text], ...] to [[{value:$value, text:$text, ...}, ...]]
 * a.w.a., this select groups contains one select
 *
 * @example
 * [['female', '女'], ['male', '男']]  // [{value:'female', text:'女', ...}, {value:'male', text:'男', ...}]
 *  // renders to:
 *      <select><option value="male">男</option><option value="female">女</option></select>
 */
export function normalizeValueTextTuplesData<V = unknown>(data: [unknown, string][], cast?: (value: unknown) => V, enableInherit: boolean = false): NormalizedOption<V>[][] {
    if (!data?.length) {
        return []
    }
    const result: Option[] = []
    for (const [value, text] of data) {
        result.push({
            value: value,
            text: text,
        })
    }
    return normalizeSelectGroup<V>([result], cast, enableInherit)
}


/**
 * Normalizes Options format data to NormalizedOption<V>[][]
 * a.w.a., converts [{value:$value, text:$text}, {value:$value, text:$text}, ...] to [[{value:$value, text:$text, ...}, ...]]
 * a.w.a., this select groups contains one select
 *
 * @example
 * [{value:'female', text:'女'}, {value:'male', text:'男'}]  // [{value:'female', text:'女', ...}, {value:'male', text:'男', ...}]
 *  // renders to:
 *      <select><option value="male">男</option><option value="female">女</option></select>
 */
export function normalizeOptionsData<V = unknown>(data: Option[], cast?: (value: unknown) => V, enableInherit: boolean = false): NormalizedOption<V>[][] {
    if (!data?.length) {
        return []
    }
    return normalizeSelectGroup<V>([data], cast, enableInherit)
}


/**
 * Normalizes a list of text format data to NormalizedOption<V>[][]
 * a.w.a., converts [$text, $text, ...] to [[{value:$value, text:$text, ...}, ...]]
 * a.w.a., this select groups contains one select
 *
 * @example
 *  ['女', '男']    // [{value:0, text:'女', ...}, {value:1, text:'男', ...}]
 *  // renders to:
 *      <select><option value="0">男</option><option value="1">女</option></select>
 */
export function normalizeTextsData<V = unknown>(data: string[], cast?: (value: unknown) => V, enableInherit: boolean = false): NormalizedOption<V>[][] {
    if (!data?.length) {
        return []
    }
    const result: Option[] = []
    for (let i = 0; i < data.length; i++) {
        result.push({
            value: i,
            text: data[i],
        })
    }
    return normalizeSelectGroup<V>([result], cast, enableInherit)
}