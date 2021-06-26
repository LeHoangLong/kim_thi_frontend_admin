import React from "react"

export interface IconButtonProps {
    onClick() : void;
    className?: string,
    children?: React.ReactNode,
}

export const IconButton = ({ onClick, className, children}: IconButtonProps) => {
    return <button className={ className === undefined? `icon-button` : className} onClick={ onClick }>
        { children }
    </button>
}