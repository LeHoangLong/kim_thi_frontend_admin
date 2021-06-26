import React from "react"
import { FormNavigationBar } from "./FormNavigationbar"
import './Modal.scss'

export interface ModalProps {
    onClose?() : void,    
    show: boolean,
    children: React.ReactNode
}

export const Modal = ( props: ModalProps ) => {
    let classStr = "modal "
    if (props.show) {
        classStr += "modal-show "
    } else {
        classStr += "modal-hide "
    }

    return <section className={ classStr }>
        <div className="modal-blacken-layer" onClick={ props.onClose }></div>
        <main>
            <header>
                <FormNavigationBar onBackButtonPressed={ props.onClose } closeOrBack={true}></FormNavigationBar>
            </header>
            { props.children }
        </main>
    </section>
}