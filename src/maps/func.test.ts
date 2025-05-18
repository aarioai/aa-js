import {describe, expect, test} from "@jest/globals";
import {clone} from "./func";


describe('func', () => {

    test('clone', () => {
        let source = {"name": "Aario"}
        let target = clone(source)
        source.name = "Tom"
        expect(target).toEqual({"name": "Aario"})
        expect(source).toEqual({"name": "Tom"})
    })
})