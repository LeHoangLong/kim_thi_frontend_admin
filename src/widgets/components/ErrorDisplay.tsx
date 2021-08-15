import { Fragment, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { EErrorLevel, ErrorModel } from "../../models/ErrorModel"
import { Modal } from "./Modal"
import './ErrorDisplay.scss'
import { pop } from "../../reducers/ErrorReducer"

export interface ErrorDisplayProps {
    children: React.ReactNode
}

// TODO: log to file
export const ErrorDisplay = (props : ErrorDisplayProps) => {
    let [showError, setShowError] = useState(false)
    let [currentError, setCurrentError] = useState<ErrorModel | null>(null)
    
    let activeErrors = useAppSelector(state => state.errors.active)
    let dispatch = useAppDispatch()

    useEffect(() => {
        console.log("activeErrors")
        console.log(activeErrors)
        if (activeErrors.length > 0) {
            let latestError = activeErrors[activeErrors.length - 1] // currently, error, warning and info are treated the same
            if (currentError === null || currentError.id !== latestError.id) {
                setCurrentError(latestError) // latest error
            }
        } else {
            setCurrentError(null)
        }
    }, [activeErrors])

    let icon = ""
    let titleStr = ""
    let messageType = ""
    if (currentError?.level === EErrorLevel.ERROR) {
        icon = "fas fa-exclamation-circle "
        messageType = "error"
        titleStr = "Lỗi"
    } else if (currentError?.level === EErrorLevel.WARNING) {
        icon = "fas fa-exclamation-triangle "
        messageType = "warning"
        titleStr = "Cảnh báo"
    } else {
        icon = "fas fa-info-circle "
        messageType = "info"
        titleStr = "Thông tin"
    }

    function onOk() : void {
        dispatch(pop())
    }

    useEffect(() => {
        if (currentError === null) {
            setShowError(false)
        } else {
            setShowError(true)
        }
    }, [currentError])

    return <Fragment>
        <Modal zIndex={ 500 } show={showError} onClose={ onOk }>
            <div className="error-modal">
                {(() => {
                    if (currentError !== null) {
                        return <article>
                            <header>
                                <i className={ icon + " " + messageType }></i>
                                <h4 className={ messageType }>
                                    { titleStr }
                                </h4>
                            </header>
                            <p>
                                { currentError.message }
                            </p>
                        </article>
                    } else {
                        return <div/>
                    }
                })()}
            </div>
        </Modal>
        { props.children }
    </Fragment>
}