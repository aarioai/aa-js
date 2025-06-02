import {
    NormalizedOption,
    normalizeOption,
    normalizeSelectGroupData,
    Option,
    t_selectgroup_data
} from './select_group_fn'
import {cloneArray} from '../aa/atype/clone'
import {safeCast} from '../aa/atype/t_basic'

/**
 * A multi-level select-elements data structure
 */
export default class SelectGroup<V = unknown> {

    /**
     * Multi-level select-elements data
     * [
     *   [{A}, {B}, {C}, ...],                                      // 1st level
     *   [{A1}, {A2}, ..., {B1}, {B2},..., {C1}, ...],              // 2nd level
     *   ...                                                        // other levels
     * ]
     *
     * @example
     *  [
     *    [
     *      {key:0, value:100, text:'Asia', ...},
     *      {key:1, value:101, text:'Europe', ...},
     *      {key:2, value:86, text:'*China', pid:101, ...},
     *    ],
     *    [
     *      {key:0, value:86, text:'China', pid:100, ...},
     *      {key:1, value:85, text:'Japan', pid:100, ...},
     *      {key:0, value:98, text:'UK', pid:101, ...},
     *      {key:1, value:99, text:'France', pid:101, ...}
     *    ]
     *  ]
     */
    readonly data: NormalizedOption<V>[][]
    readonly cast?: (value: unknown) => V

    constructor(data: t_selectgroup_data, cast?: (value: unknown) => V, inherit: boolean = false) {
        this.data = normalizeSelectGroupData(data, cast, inherit)
        this.cast = cast
    }


    * [Symbol.iterator](): IterableIterator<NormalizedOption<V>[]> {
        yield* this.data ?? []
    }

    nthLevel(i: number): NormalizedOption<V>[] | null {
        return this.data.length > i ? this.data[i] : null
    }

    firstLevel(): NormalizedOption<V>[] | null {
        return this.nthLevel(0)
    }

    lastLevel(): NormalizedOption<V>[] | null {
        return this.nthLevel(this.data.length - 1)
    }

    /**
     * Lists children with the same pid in nth level
     *
     * @example
     *  [
     *    [
     *      {key:0, value:100, text:'Asia', ...},
     *      {key:1, value:101, text:'Europe', ...},
     *      {key:2, value:86, text:'*China', pid:101, ...},
     *    ],
     *    [
     *      {key:0, value:86, text:'China', pid:100, ...},
     *      {key:1, value:85, text:'Japan', pid:100, ...},
     *      {key:0, value:98, text:'UK', pid:101, ...},
     *      {key:1, value:99, text:'France', pid:101, ...}
     *    ]
     *  ]
     *
     *  children(1, 100)
     *  // Return [{key:0, value:86, text:'China', pid:100, ...}, {key:1, value:85, text:'Japan', pid:100, ...}]
     */
    children(level: number, pid: V): NormalizedOption<V>[] | null {
        const options = this.nthLevel(level)
        if (!options?.length) {
            return null
        }
        const result: NormalizedOption<V>[] = []
        const typedPid = this.cast ? this.cast(pid) : pid as V
        for (const option of options) {
            if (option.pid === typedPid) {
                result.push(option)
            }
        }
        return result.length > 0 ? result : null
    }

    clone(): SelectGroup {
        const newData = this.data.length > 0 ? cloneArray(this.data) : []
        return new SelectGroup(newData)
    }

    /**
     * Prepends a default option to each level
     */
    unshiftDefaultToEachLevel(option: Option<V>) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].unshift(normalizeOption(option, this.cast))
        }
    }

    shiftDefaultFromEachLevel() {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].shift()
        }
    }

    /**
     * Lookups the hierarchical chain of options for a given value
     *
     * @example
     *  [
     *    [                                                 // 1st level (provinces and special cities)
     *      {value:"深圳", pid:"广东", ...},
     *      {value:"广东",...}, {value:"安徽",...},
     *      ...
     *    ],
     *    [                                                 // 2th level (cities and special districts)
     *      {value:"深圳", pid:"广东", ...},
     *      {value:"上海", pid:"上海"...},
     *      {value:"珠海", pid:"广东"...},
     *      {value:"南山区", pid:"深圳", ...},
     *      {value:"福田区", pid:"深圳", ...},
     *      ...
     *    ],
     *    [                                                 // 3th level (districts and special streets)
     *      {value:"海珠区", pid:"珠海", ...},
     *      {value:"粤海街道", pid:"南山区", ...},
     *      {value:"南头街道", pid:"南山区", ...}
     *    ]
     *  ]
     *
     *  lookupHierarchy("南山区")    // [{value:"深圳", ...}, {value:"南山区", ...}, {value:"粤海街道", pid:"南山区", ...}]
     *  lookupHierarchy("南头街道")  // [{value:"深圳", ...}, {value:"南山区", ...}, {value:"南头街道", pid:"南山区", ...}]
     *  lookupHierarchy(null)      // [{value:"广东", ...}, {value:"珠海", ...}, {value:"海珠区", pid:"珠海", ...}]
     */
    lookupHierarchy(value?: V): NormalizedOption<V>[] {
        if (!this.data.length) {
            return []
        }

        let pid: V = null
        let chain: NormalizedOption<V>[] = []
        let typedValue = safeCast<V>(value, this.cast)


        // Find the selected options chain
        for (let i = this.data.length - 1; i >= 0; i--) {
            const options = this.nthLevel(i)
            if (!options?.length) {
                continue
            }

            for (const option of options) {
                if (!pid) {
                    if (!typedValue || typedValue === option.value) {
                        pid = option.pid
                        chain.unshift(option)
                        break
                    }
                } else {
                    // Found exactly
                    if (typedValue === option.value) {
                        pid = option.pid
                        chain = [option] // reset chain
                        break
                    }

                    // Prepends parent
                    if (option.value === pid) {
                        pid = option.pid
                        chain.unshift(option)
                        break
                    }
                }
            }
        }

        // Fill missing levels with default options
        const firstLevel = this.firstLevel()
        if (chain.length === 0 && firstLevel?.length) {
            chain.push(firstLevel[0])
        }
        const chainLast = chain[chain.length - 1]
        for (let i = chain.length; i < this.data.length; i++) {
            const levelOptions = this.nthLevel(i)
            const parentOption = chain[i - 1]
            const childOption = levelOptions?.find(opt => opt.pid === parentOption.value)
            if (childOption) {
                chain.push(childOption)
            } else {
                // add a virtual child
                chain.push({...chainLast, pid: parentOption.value, virtual: true})
            }
        }

        return chain
    }

    findText(
        value: any,
        showFull: boolean = false,
        separator: string = '',
        prefixHandler?: (obj: NormalizedOption, key: string) => string
    ): { value: any; pid?: any; text: string; prefix: string; suffix: string } {
        const hierOptions = this.lookupHierarchy(value)

        if (!hierOptions?.length || !hierOptions[hierOptions.length - 1].value) {
            return {value, text: "", prefix: "", suffix: ""}
        }

        let pid: any
        let text = ""
        let prefix = ""
        let suffix = ""

        for (const option of hierOptions) {
            if (option.value === option.pid) {
                break
            }

            pid = option.pid
            if (pid === option.value) {
                pid = undefined
            }

            if (prefixHandler) {
                prefix = prefixHandler(option, 'prefix')
                suffix = prefixHandler(option, 'suffix')
            }

            if (showFull && !option.virtual) {
                if (text && separator) text += separator
                text += option.text
            } else {
                text = option.text
            }
        }

        return {value, pid, text, prefix, suffix}
    }


}

