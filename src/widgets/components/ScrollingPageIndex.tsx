import React, { createRef, useState } from "react"
import { useRef } from "react"
import { useEffect } from "react"
import './ScrollingPageIndex.scss'

export interface ScrollingPageIndexProps {
    min: number,
    max: number,
    currentIndex: number,
    onSelect(index: number) : void,
}

export const ScrollingPageIndex = (props: ScrollingPageIndexProps) => {
    let [currentCenter, setCurrentCenter] = useState(0)

    useEffect(() => {
        setCurrentCenter(props.min)
    }, [props.min, props.max])


    let root = useRef<HTMLDivElement>(null)

    function displayIndexes() {
        let ret: React.ReactNode[] = []

        for (let i = props.min; i < props.max; i++) {
            ret.push(
                <button onClick={() => props.onSelect(i) } key={i} className={ i === props.currentIndex? 'selected' : 'not-selected' }>
                    { i }
                </button>
            )
        }

        return ret
    }

    function onLeftCaretClicked() {
        if (root.current) {
            root.current!.scroll({
                left: root.current!.scrollLeft - 100, 
                behavior: 'smooth',
            })
        }
    }

    function onRightCaretClicked() {
        if (root.current) {
            root.current!.scroll({
                left: root.current!.scrollLeft + 100, 
                behavior: 'smooth',
            })
        }
    }

    function displayNumberOfPages() {
        let ret: React.ReactNode[] = []

        ret.push(
            <button key='min' onClick={ onLeftCaretClicked }>
                <i className="fas fa-caret-left"></i>
            </button>
        )

        ret.push(
            <div key='list' ref={ root } className="scrolling-page-index">
                { displayIndexes() }
            </div>
        )

        ret.push(
            <button key='max' onClick={ onRightCaretClicked }>
                <i className="fas fa-caret-right"></i>
            </button>
        )
        return ret
    }

    return <div className="scrolling-page">
        { displayNumberOfPages() }
    </div>
}