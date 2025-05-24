import {AnyMap, MapObject, Marshallable} from "./a_define_interfaces";
import {JsonMarshalError, marshalReviver, unmarshalReviver} from './json_base'


export default class json {
    // Safely converts a Map to JSON strings with BigInt support and without using toJSON method
    static MarshalMap(o: AnyMap): string {
        if (!o) {
            return null
        }
        let data: MapObject = {}
        o.forEach((value: unknown, key: string) => {
            data[key] = value
        })
        return json.Marshal(data)
    }

    /**
     * Safely converts a value to JSON string with BigInt support.
     *
     * @example
     * Marshal({a: 1, b: 2n}) // '{"a":1,"b":"2"}'
     * Marshal(null)           // null
     * Marshal(undefined)      // null
     */
    static Marshal(o: object | Marshallable<string> | undefined): string {
        if (!o) {
            return 'null'
        }

        try {
            if (typeof (o as any).toJSON === 'function') {
                const s = (o as any).toJSON()
                if (typeof s === 'string') {
                    return s
                }
            }
            // Convert bigint into string
            return JSON.stringify(o, marshalReviver)
        } catch (error) {
            throw new JsonMarshalError(error, o)
        }
    }

    /**
     * Safely parses a JSON string or returns the input if already an object
     *
     * @example
     * Unmarshal('{"a":1000000000000000000}') // {a: 1000000000000000000n}
     * Unmarshal({"a":1}) // {a: 1}
     * Unmarshal(null)      // null
     * Unmarshal('invalid') // null
     */
    static Unmarshal(input: string | undefined | MapObject | Array<unknown>): object {
        if (!input || (typeof input === "string" && input.trim().toLowerCase() === "null")) {
            return null
        }
        if (typeof input === 'object') {
            return input
        }

        try {
            return JSON.parse(input.trim(), unmarshalReviver)
        } catch (error) {
            console.error(`json unmarshal error: ${error}`, input)
        }
        return null
    }
}


