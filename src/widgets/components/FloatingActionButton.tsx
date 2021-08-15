import './FloatingActionButton.scss';
import { IconButton } from './IconButton';

export interface FloatingActionButtonProps {
    onClick() : void;
    children: React.ReactNode,
}

export const FloatingActionButton = (props : FloatingActionButtonProps) => {
    return <IconButton className="floating-action-button" onClick={ props.onClick }>
        { props.children }
    </IconButton>

}