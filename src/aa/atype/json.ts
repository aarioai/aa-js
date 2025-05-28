import {MapObject, Marshallable} from "./a_define_interfaces";
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
        } catch (error) {
            throw new JsonMarshalError(error, o)
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


