export class Panic extends Error {

    constructor(message: string) {
        super(message);
        this.name = 'aa-panic'
    }

    /**
     * Throws this error if the condition is false
     *
     * @example
     * Panic.assert(true, 'something wrong')
     *  Panic.assert(input < 0, 'input is out of range', RangeError)
     *  Panic.assert(typeof '100' !== 'number', 'invalid number type', TypeError)
     */
    static assert(when: boolean, message: string, constructor?: new (message: string) => Error) {
        if (!constructor) {
            constructor = Panic
        }
        if (when) {
            throw new constructor(message)
        }
    }

    static assertLessThan(n: number, min: number) {
        Panic.assert(n < min, `input ${n} is less than ${min}`, RangeError)
    }

    static assertEmptyArray(arr: any[]) {
        Panic.assert(!arr || arr.length < 0, `input array is empty`)
    }

    static assertLessThanZero(n: number) {
        Panic.assertLessThan(n, 0)
    }

    static assertTypeof(value: any, types: string[]) {
        Panic.assert(types.includes(typeof value), `input type ${typeof value} is in the type of ${types.join(', ')}`, TypeError)
    }

    static assertNotTypeof(value: any, types: string[]) {
        Panic.assert(!types.includes(typeof value), `input type ${typeof value} is not in the type of ${types.join(', ')}`, TypeError)
    }

}

