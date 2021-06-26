import { IconButton } from "./IconButton"
import './FormNavigationBar.scss'

export interface FormNavigationBarProps {
    onBackButtonPressed?() : void;
    onOkButtonPressed?(): void;
}

export const FormNavigationBar = (props: FormNavigationBarProps) => {
    return <div className="form-navigation-bar">
        {(() => {
            if (props.onBackButtonPressed !== undefined) {
                return <IconButton onClick={ props.onBackButtonPressed }>
                    <i className="fas fa-arrow-left"></i>
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