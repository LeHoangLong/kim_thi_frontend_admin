import { IconButton } from "./IconButton"
import './FormNavigationBar.scss'

export interface FormNavigationBarProps {
    onBackButtonPressed?() : void;
    onOkButtonPressed?(): void;
    closeOrBack? : boolean
}

export const FormNavigationBar = (props: FormNavigationBarProps) => {
    return <div className="form-navigation-bar">
        {(() => {
            if (props.onBackButtonPressed !== undefined) {
                let classStr = "fas fa-arrow-left";
                if (props.closeOrBack === true) {
                    classStr = "fas fa-times"
                }
                return <IconButton onClick={ props.onBackButtonPressed }>
                    <i className={ classStr }></i>
                </IconButton>
            } else {
                return <div/>
            }
        })()}
        {(() => {
            if (props.onOkButtonPressed !== undefined) {
                return <IconButton onClick={ props.onOkButtonPressed }>
                    <i className="fas fa-check"></i>
                </IconButton>
            } else {
                return <div/>
            }
        })()}
    </div>
}