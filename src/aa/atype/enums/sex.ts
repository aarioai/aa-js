export enum Sex {
    NilSex = 0,    // no sex or invalid sex
    Male = 1,
    Female = 2,
    OtherSex = 255,
}

export const Sexes = new Set(Object.values(Sex))
export type t_sex = Sex


export function a_sex(sex: number | string): t_sex {
    if (!sex) {
        return Sex.NilSex
    }

    if (typeof sex === 'number') {
        return Sexes.has(sex) ? sex : Sex.NilSex
    }
    switch (sex.toUpperCase()) {
        case String(Sex.Male):
        case 'M':
        case 'MALE':
        case 'MAN':
        case '男':
            return Sex.Male
        case String(Sex.Female):
        case 'F':
        case 'FEMALE':
        case 'WOMAN':
        case '女':
            return Sex.Female
        case String(Sex.OtherSex):
        case 'Other':
            return Sex.OtherSex
        default:
            return Sex.NilSex
    }
}

