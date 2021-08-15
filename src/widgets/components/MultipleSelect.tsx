import './MultipleSelect.scss';

export interface SelectElement {
    value: string, // must be unique
    text: string,
}

export interface MultipleSelectProps {
    elements: SelectElement[],
    selected: string[],
    onChange(element: SelectElement, isSelected: boolean) : void,
}

export const MultipleSelect = ( props: MultipleSelectProps ) => {
    let ret : React.ReactNode[] = []
    for (let i = 0; i < props.elements.length; i++) {
        let className = "element "
        let isCurrentlySelected = false
        if ( props.selected.indexOf(props.elements[i].value) !== -1) {
            className += "selected"
            isCurrentlySelected = true
        }
        ret.push(
            <li key={ props.elements[i].value } className={ className } onClick={() => props.onChange(props.elements[i], !isCurrentlySelected)}>
                { props.elements[i].text }
            </li>
        )
    }
    return <ol className="multiple-select">
        { ret }
    </ol>
}