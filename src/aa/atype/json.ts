import {Dict, Marshallable} from "./a_define_interfaces";
import {convertJSONMap, JsonMarshalError, marshalReviver, unmarshalReviver} from './json_base'


export default class json {
    /**
     * Safely converts a value to JSON string with BigInt support.
     *
     * @example
     *  Marshal({a: 1, b: 2n}) // '{"a":1,"b":"2"}'
     *  Marshal(null)           // null
     *  Marshal(undefined)      // null
     */
    static Marshal(o: object | Marshallable<string> | undefined): string | null {
        if (o === undefined || o === null) {
            return null
        }
        // JSON stringify not support Map, convert it to a map object
        if (o instanceof Map) {
            o = convertJSONMap(o)
            if (o === undefined || o === null) {
                return null
            }
        }

        try {
            return JSON.stringify(o, marshalReviver)
        } catch (err) {
            throw new JsonMarshalError(err, o)
        }
    }

    /**
     * Safely parses a JSON string or returns the input if already an object
     *
     * @example
     *  Unmarshal('{"a":1000000000000000000}') // {a: 1000000000000000000n}
     *  Unmarshal({"a":1})      // {a: 1}
     *  Unmarshal(null)         // null
     *  Unmarshal('invalid')    // null
     */
    static Unmarshal(input: string | undefined | Dict | Array<unknown>): object {
        if (!input) {
            return null
        }
        if (typeof input !== 'string') {
            return input
        }
        input = input.trim()

        // null is the most common case
        if (input === 'null' || input.toUpperCase() === 'NULL') {
            return null
        }
        try {
            return JSON.parse(input, unmarshalReviver)
        } catch (err) {
            console.error(`json unmarshal error: ${err}`, input)
        }
        return null
    }
}


