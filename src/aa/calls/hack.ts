import {Panic} from "../atype/panic";

/**
 * Safely instantiates a class by name
 *
 * @example
 * // Browser:
 * class MyClass {}
 * window.MyClass = MyClass;
 * instantiateClass('MyClass'); // Returns new MyClass()
 *
 * // Direct reference:
 * instantiateClass('Date'); // Returns new Date()
 */
export function instantiateClass(className: string): object {
    // Try browser window
    if (typeof window === 'object' && className in window) {
        const constructor = (window as any)[className]
        if (typeof constructor === 'function' && constructor.prototype) {
            return new constructor()
        }
    }

    // Fallback to Function constructor
    try {
        const constructor = new Function(`return (typeof ${className} === 'function' ? ${className} : null)`)();
        if (typeof constructor === 'function' && constructor?.prototype) {
            return new constructor()
        }
    } catch {

    }

    throw new TypeError(`Class "${className}" not found in any available scope`);
}

/**
 * Checks if a static method exists and is callable on a class
 *
 * @example
 * class MathUtils {
 *   static add(a: number, b: number) { return a + b }
 * }
 *
 * hasStaticMethod('MathUtils', 'add') // returns true
 * hasStaticMethod('MathUtils', 'foo') // returns false
 * hasStaticMethod('NonExistentClass', 'any') // returns false
 */
export function hasStaticMethod(className: string, methodName: string): boolean {
    try {
        let c = instantiateClass(className)
        return typeof (c as any)[methodName] === 'function'
    } catch {
        return false
    }
}

/**
 * Calls a static method on a class by name with the provided arguments
 *
 * @param className - Name of the target class
 * @param methodName - Name of the static method to call
 * @param args - Arguments to pass to the method
 * @returns The result of the static method call
 * @throws {TypeError} When the class or method doesn't exist or isn't callable
 *
 * @example
 * class MathUtils {
 *   static sum(a: number, b: number) { return a + b }
 * }
 *
 * // Call static method
 * invokeStaticMethod('MathUtils', 'sum', 2, 3); // returns 5
 *
 * // Throws TypeError if method doesn't exist
 * invokeStaticMethod('MathUtils', 'nonexistent');
 */
export function invokeStaticMethod<T = unknown>(
    className: string,
    methodName: string,
    ...args: unknown[]
): T {
    const c = instantiateClass(className).constructor
    Panic.assertNotTypeof((c as any)[methodName], ['function'])
    return (c as any)[methodName](...args) as T;
}