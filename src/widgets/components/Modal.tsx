import React from "react"
import { FormNavigationBar } from "./FormNavigationbar"
import './Modal.scss'

export interface ModalProps {
    onClose() : void,    
    onOk?() : void,
    show: boolean,
    children: React.ReactNode,
    zIndex?: number,
}

export const Modal = ( props: ModalProps ) => {
    let classStr = "modal "
    if (props.show) {
        classStr += "modal-show "
    } else {
        classStr += "modal-hide "
    }

    let zIndex : number = props.zIndex ?? 200

    return <section className={ classStr } style={{ zIndex: zIndex }}>
        <div className="modal-blacken-layer" onClick={ props.onClose }></div>
        <main style={{ zIndex: zIndex + 1  }}>
            <header>
                <FormNavigationBar onOkButtonPressed={ props.onOk } onBackButtonPressed={ props.onClose } closeOrBack={true}></FormNavigationBar>
            </header>
            { props.children }
        </main>
    </section>
}