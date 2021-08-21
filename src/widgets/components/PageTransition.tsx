import React from "react";
import './PageTransition.scss';

export interface PageTransitionProps {
    show: boolean,
    children: React.ReactNode,
    zIndex?: number,
    className?: string,
}
export const PageTransition = (props: PageTransitionProps) => {
    let className: string = "page-transition ";
    if (props.show) {
        className += "page-transition-show "
    } else {
        className += "page-transition-hide "
    }
    
    if (props.className) {
        className += props.className
    }

    return <div className={ className } style={{ zIndex: props.zIndex }}>
        { props.children }
    </div>
} 