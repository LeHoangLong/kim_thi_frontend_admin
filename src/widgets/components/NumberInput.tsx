import React from "react"

export interface NumberInputProps {
    value?: number,
    onChange?(value: number) : void,
    id?: string,
    className?: string,
}

export const NumberInput = (props: NumberInputProps) => {
    function onValueChanged(event: React.ChangeEvent<HTMLInputElement>) {
        if (props.onChange) {
            let valueStr = event.target.value
            valueStr = valueStr.replaceAll(',', '')
            let value = parseInt(valueStr)
            if (!isNaN(value)) {
                props.onChange(value)
                return 
            }
            value = parseFloat(valueStr)
            if (!isNaN(value)) {
                props.onChange(value)
                return 
            }

            props.onChange(0)
        }
    }

    return <input className={ props.className } id={ props.id } onChange={ onValueChanged } value={ props.value?.toLocaleString() } type="text"></input>
}