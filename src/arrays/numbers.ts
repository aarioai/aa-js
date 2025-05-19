import {numberArray} from "../aa/atype/func";
import {t_numeric} from "../aa/atype/atype_server";
import {Panic} from "../aa/atype/panic";
import {a_number} from '../aa/atype/types_cast'

export type ComparisonOperator = '<' | '=' | '>' | '>=' | '<=' | '=='

/**
 * Finds the closets numeric value in an array based on the specified comparison operator
 *
 * @example
 * findClosestValue([1, 3, 5], '>', 2); // 3
 * findClosestValue(['10', '20', '30'], '<=', 25); // 20
 * findClosestValue([5, 10, 15], '==', 12); // 10 (closest)
 */
export function findClosestValue(candidates: Array<t_numeric>, operator: ComparisonOperator, target: t_numeric): number {
    const num = a_number(target)
    let cands = numberArray(candidates)
    cands.sort((a, b) => a - b)
    Panic.assertEmptyArray(cands)
    switch (operator) {
        case '=':
        case '==':
            return findClosestMatch(cands, num);
        case '<':
            return findLargestLesser(cands, num);
        case '<=':
            return findLargestLesserOrEqual(cands, num);
        case '>':
            return findSmallestGreater(cands, num);
        case '>=':
            return findSmallestGreaterOrEqual(cands, num);
        default:
            throw new Error(`Invalid operator: ${operator}`);
    }
}

function findClosestMatch(values: number[], target: number): number {
    return values.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
}

function findLargestLesser(values: number[], target: number): number {
    for (let i = values.length - 1; i >= 0; i--) {
        if (values[i] < target) return values[i];
    }
    throw new Error('No value less than target');
}

function findSmallestGreater(values: number[], target: number): number {
    for (let i = 0; i < values.length; i++) {
        if (values[i] > target) return values[i];
    }
    throw new Error('No value greater than target');
}

function findLargestLesserOrEqual(values: number[], target: number): number {
    for (let i = values.length - 1; i >= 0; i--) {
        if (values[i] <= target) return values[i];
    }
    throw new Error('No value less than or equal to target');
}

function findSmallestGreaterOrEqual(values: number[], target: number): number {
    for (let i = 0; i < values.length; i++) {
        if (values[i] >= target) return values[i];
    }
    throw new Error('No value greater than or equal to target');
}