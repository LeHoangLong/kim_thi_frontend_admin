import React from "react";
import './PageTransition.scss';

export interface PageTransitionProps {
    show: boolean,
    children: React.ReactNode,
    zIndex?: number,
}
export const PageTransition = (props: PageTransitionProps) => {
    let className: string = "page-transition ";
    if (props.show) {
        className += "page-transition-show"
    } else {
        className += "page-transition-hide"
    }
    return <div className={ className } style={{ zIndex: props.zIndex }}>
        { props.children }
    </div>
} 