import { UnrecognizedEnumValue } from "../exceptions/UnrecognizedEnumValue"

export enum EProductUnit {
    KG = 0,
}

export function EProductUnitToString(unit: EProductUnit) {
    switch (unit) {
        case EProductUnit.KG:
            return 'kg'
        default:
            throw new UnrecognizedEnumValue( unit ) 
    }
}