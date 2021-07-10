import React, { useEffect, useState } from "react"

export interface DelayProps {
    delayMs: number,
    children: React.ReactNode,
}

export const Delay = (props : DelayProps) => {
    let [isDelayExpired, setIsDelayExpired] = useState(false)
    useEffect(() => {
        let timer = setTimeout(() => {
            setIsDelayExpired(true)
        }, props.delayMs)
        return () => clearTimeout(timer)
    }, [])

    if (isDelayExpired) {
        return <div>
            { props.children }
        </div>
    } else {
        return <div></div>
    }
}