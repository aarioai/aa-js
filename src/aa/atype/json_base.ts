import {isSafeInt} from './type_check'

export interface JsonReviverCtx {
    source: string

    [key: string]: any  // other keys
}

export const marshalReviver = (key: string, value: unknown): any => {
    return typeof value === 'bigint' ? value.toString() : value
}

export const unmarshalReviver = (key: string, value: unknown, ctx?: JsonReviverCtx): any => {
    if (!ctx) {
        return value
    }
    if (typeof value === 'number') {
        // Keep floats as-is
        if (ctx.source.includes('.')) {
            return value
        }
        if (isSafeInt(ctx.source)) {
            return value
        }
        // Bigint
        try {
            return BigInt(ctx.source)
        } catch {
            return value
        }
    }
    return value
}

export class JsonMarshalError extends Error {
    constructor(msg: unknown, object?: unknown) {
        super(`json.Marshal error: ${msg}`)
        console.error('json.Marshal error: ${msg}', object)
    }

}
