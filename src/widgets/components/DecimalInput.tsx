import React from "react"
import { useState } from "react"
import { useEffect } from "react"

export interface NumberInputProps {
    value?: string,
    onChange?(value: string) : void,
    id?: string,
    className?: string,
}

export const DecimalInput = (props: NumberInputProps) => {
    let [includeDot, setIncludeDot] = useState(false)
    let [valueStr, setValueStr] = useState('0')

    function onValueChanged(event: React.ChangeEvent<HTMLInputElement>) {
        if (props.onChange) {
            let valueStr: string = event.target.value
            if (valueStr[event.target.value.length - 1] === '.') {
                setIncludeDot(true)
            } else if (includeDot) {
                if (valueStr.indexOf('.') === -1) {
                    setIncludeDot(false)
                }
            }
            valueStr = valueStr.replaceAll(',', '')
            let newDecimal = Number(valueStr)
            if (!isNaN(newDecimal)) {
                props.onChange(valueStr)
            }
        }
    }

    useEffect(() => {
        let newValueStr: string;
        if (!props.value) {
            newValueStr = '0'
        } else {
            newValueStr = props.value.toString()
        }
        if (newValueStr.indexOf('.') === -1 && includeDot) {
            newValueStr = newValueStr.concat('.')
        } 
        let dotIndex = 0
        if (newValueStr.indexOf('.') !== -1) {
            dotIndex = newValueStr.indexOf('.')
        } else {
            dotIndex = newValueStr.length
        }

        let digitCounter = 0
        let valueStrWithThousands = ''
        for (let i = dotIndex - 1; i >= 0; i--) {
            if (digitCounter % 3 === 0 && i !== dotIndex - 1) {
                valueStrWithThousands = ','.concat(valueStrWithThousands)
            }
            valueStrWithThousands = newValueStr[i].concat(valueStrWithThousands)
            digitCounter++;
        }
        valueStrWithThousands = valueStrWithThousands.concat(newValueStr.substr(dotIndex, newValueStr.length - dotIndex))
        setValueStr(trimLeadingZeros(valueStrWithThousands))
    }, [props.value])

    function trimLeadingZeros(value: string): string {
        let index = 0
        for (let i = 0; i < value.length; i++) {
            if (value[i] !== '0') {
                index = i
                break
            }
        }
        if (value.length === 1) {
            return value
        } else {
            return value.substr(index, value.length - index)
        }
    }

    return <input className={ props.className } id={ props.id } onChange={ onValueChanged } value={ valueStr } type="text"></input>
}