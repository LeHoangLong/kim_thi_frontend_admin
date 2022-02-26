import React, { useState } from "react"
import { useEffect } from "react"

export interface ConditionalRenderingProps {
    display?: boolean,
    displayDelayMs?: number,
    hideDelayMs? : number,
    children: JSX.Element,
}

export const ConditionalRendering = ({
    display = false,
    children,
    displayDelayMs = 0,
    hideDelayMs = 0,
} : ConditionalRenderingProps) => {
    let [show, setShow] = useState(false)
    
    useEffect(() => {
        let timer = setTimeout(() => setShow(display), display? displayDelayMs : hideDelayMs)
        return () => clearTimeout(timer)
    }, [display, displayDelayMs, hideDelayMs])

    if (show) {
        return children
    } else {
        return <div></div>
    }
}