import {describe, expect, test} from "@jest/globals";
import {cloneMaps, sortMaps} from "./func";


describe('func', () => {

    test('clone', () => {
        let source = {"name": "Aario"}
        let target = cloneMaps(source)
        source.name = "Tom"
        expect(target).toEqual({"name": "Aario"})
        expect(source).toEqual({"name": "Tom"})
    })


    test('sortMaps', () => {
        const src = {b: 2, a: 1, c: 3}
        expect(sortMaps(src)).toEqual({a: 1, b: 2, c: 3})
    })
})