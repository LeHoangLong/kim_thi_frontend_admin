import { AxiosError } from "axios"
import React, { useCallback, useState } from "react"
import { useEffect } from "react"
import { useContainer } from "../../container"
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { EStatus } from "../../models/StatusModel"
import { AreaTransportFee, BillBasedTransportFee } from "../../models/TransportFee"
import { createTransportFee, insertOriginToMap, insertTransportFeeDetail, setNumberOfTransportFee, setOriginMapStatus, setTransportFeeDetailStatus, updateTransportFee } from "../../reducers/TransportFeeReducer"
import { ConditionalRendering } from "../background/ConditionalRendering"
import { DecimalInput } from "../components/DecimalInput"
import { FormNavigationBar } from "../components/FormNavigationbar"
import Loading from "../components/Loading"
import { Modal } from "../components/Modal"
import { AddOriginToTransportFee } from "../fragments/AddOriginToTransportFee"
import { NewBillBasedTransportFee } from "../fragments/NewBillBasedTransportFee"
import './TransportFeeDetailPage.scss'

export interface TransportFeeDetailPageProps {
    onBack?() : void;
    onFeeUpdated(updatedFee: AreaTransportFee) : void,
    feeId: number | null;
}

export const TransportFeeDetailPage = (props: TransportFeeDetailPageProps) => {
    let onBack = props.onBack

    let feeDetails = useAppSelector(state => state.transportFees.feeDetails)
    let { transportFeeRepository } = useContainer()[0]
    let feeDetailStatus = useAppSelector(state => state.transportFees.feeDetailOperationStatus)
    let originsMapStatus = useAppSelector(state => state.transportFees.originsMapOperationStatus)
    let originsMap = useAppSelector(state => state.transportFees.originsMap)
    let numberOfTransportFees = useAppSelector(state => state.transportFees.numberOfTransportFees)

    let dispatch = useAppDispatch()


    let [name, setName] = useState('')
    let [city, setCity] = useState('')
    let [basicFee,setBasicFee] = useState('0')
    let [billBasedFees, setBillBasedFees] = useState<BillBasedTransportFee[]>([])
    let [feePerKm, setFeePerKm] = useState('0')
    let [originIds, setOriginIds] = useState<number[]>([])
    let [editingOriginIds, setEditingOriginIds] = useState<number[]>([])
    let [isLoading, setIsLoading] = useState(false)
    let [showAddBillBasedFee, setShowAddBillBasedFee] = useState(false)
    let [showAddOrigin, setShowAddOrigin] = useState(false)
    let [editingNewBillBasedFee, setEditingNewBillBasedFee] = useState<BillBasedTransportFee>({
        minBillValue: '0',
        basicFee: '0',
        fractionOfBill: '0',
        fractionOfTotalTransportFee: '0',
    })
    
    let fetchFeeDetail = useCallback(async (feeId: number) : Promise<AreaTransportFee> => {
        dispatch(setTransportFeeDetailStatus({
            status: EStatus.IN_PROGRESS
        }))
        try {
            let ret = await transportFeeRepository!.fetchTransportFee(feeId)
            dispatch(insertTransportFeeDetail(ret))
            dispatch(setTransportFeeDetailStatus({
                status: EStatus.SUCCESS
            }))
            return ret
        } catch (exception) {
            let axioError = exception as AxiosError
            dispatch(setTransportFeeDetailStatus({
                status: EStatus.ERROR,
                message: axioError.message
            }))
            throw exception
        } finally {
            dispatch(setTransportFeeDetailStatus({
                status: EStatus.IDLE
            }))
        }
    }, [dispatch, transportFeeRepository])

    function setFeeForm(feeDetail: AreaTransportFee | null) {
        if (feeDetail) {
            setName(feeDetail.name)
            setCity(feeDetail.city)
            setBasicFee(feeDetail.basicFee)
            setBillBasedFees(feeDetail.billBasedTransportFee)
            setFeePerKm(feeDetail.distanceFeePerKm)
            setOriginIds(feeDetail.originIds)
        } else {
            setName('')
            setCity('')
            setBasicFee('0')
            setBillBasedFees([])
            setFeePerKm('0')
            setOriginIds([])
        }
    }

    useEffect(() => {
        if (feeDetailStatus.status === EStatus.IN_PROGRESS ||
            originsMapStatus.status === EStatus.IN_PROGRESS) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [feeDetailStatus, originsMapStatus])

    useEffect(() => {
        if (props.feeId !== null) {
            let feeDetail = feeDetails[props.feeId]
            if (feeDetail !== undefined) {
                setFeeForm(feeDetail)
            } else {
                if (feeDetailStatus.status !== EStatus.IN_PROGRESS) {
                    fetchFeeDetail(props.feeId!).then((feeDetail) => {
                        setFeeForm(feeDetail)
                    }).catch((error) => {
                        if (onBack) {
                            onBack()
                        }
                    })
                }
            }
        } else {
            setFeeForm(null)
        }
    }, [props.feeId, onBack, feeDetails, feeDetailStatus, transportFeeRepository, fetchFeeDetail])
    
    let fetchOrigins = useCallback(async (missingOriginIds: number[]) => {
        dispatch(setOriginMapStatus({
            status: EStatus.IN_PROGRESS
        }))
        try {
            let origins = await transportFeeRepository!.fetchOriginsById(missingOriginIds);
            for (let i = 0; i < origins.length; i++) {
                dispatch(insertOriginToMap(origins[i]))
            }
            dispatch(setOriginMapStatus({
                status: EStatus.SUCCESS
            }))
        } catch (exception) {
            let axiosError = exception as AxiosError
            dispatch(setOriginMapStatus({
                status: EStatus.ERROR,
                message: axiosError.message
            }))
        } finally {
            dispatch(setOriginMapStatus({
                status: EStatus.IDLE
            }))
        }
    }, [dispatch, transportFeeRepository])

    useEffect(() => {
        let missingOriginIds = []
        for (let i = 0; i < originIds.length; i++) {
            if (!(originIds[i] in originsMap)) {
                missingOriginIds.push(originIds[i])
            }
        }

        if (missingOriginIds.length > 0 && originsMapStatus.status !== EStatus.IN_PROGRESS) {
            fetchOrigins(missingOriginIds)
        }
    }, [originIds, originsMapStatus, transportFeeRepository, fetchOrigins, originsMap])


    function goBack() {
        if (props.onBack) {
            props.onBack()
        }
    }

    function removeBillBasedFee(index: number) {
        let newBillBasedFees = [...billBasedFees]
        newBillBasedFees.splice(index, 1)
        setBillBasedFees(newBillBasedFees)
    }

    function displayBillBasedTransportFees() {
        let ret : React.ReactNode[] = []
        for (let i = 0; i < billBasedFees.length; i++) {
            let billBasedFee = billBasedFees[i];
            ret.push(
                <li key={ i } className="card bill-based-fee-card">
                    <button className="remove-bill-based-fee-button" onClick={() => removeBillBasedFee(i)}>
                        <i className="fas fa-times"></i>
                    </button>
                    <article>
                        <header>
                            <strong>Gi?? tr??? ????n h??ng t???i thi???u</strong>
                        </header>
                        <p> { billBasedFee.minBillValue } </p>
                    </article>

                    <article>
                        <header>
                            <strong>Ph?? c?? b???n</strong>
                        </header>
                        <p> { billBasedFee.basicFee } </p>
                    </article>

                    <article>
                        <header>
                            <strong>Ph???n tr??m gi?? tr??? ho?? ????n</strong>
                        </header>
                        <p> { billBasedFee.fractionOfBill } </p>
                    </article>

                    <article>
                        <header>
                            <strong>Ph???n tr??m t???ng ph?? giao h??ng</strong>
                        </header>
                        <p> { billBasedFee.fractionOfTotalTransportFee } </p>
                    </article>
                </li>
            )
        }
        return ret
    }

    function onRemoveOriginClicked(index: number) {
        originIds.splice(index, 1)
        setOriginIds([...originIds])
    }

    function displayDistanceBasedTransportFeeOrigins() {
        let ret : React.ReactNode[] = []
        for (let i = 0; i < originIds.length; i++) {
            let origin = originsMap[originIds[i]]
            if (origin) {
                ret.push(
                    <div className="origins" key={ origin.id } >
                        <button className="icon-button" onClick={() => onRemoveOriginClicked( i ) }>
                            <i className="fas fa-times"></i>
                        </button>
                        <p>
                            { origin.address }
                        </p>
                    </div>
                )
            }
        }
        return ret
    }

    function onNewBilLBasedFeeAdded() {
        if (editingNewBillBasedFee) {
            let newFees = [...billBasedFees, editingNewBillBasedFee]
            setBillBasedFees(newFees)
            setShowAddBillBasedFee(false)
        }
    }

    async function _createOrUpdateTransportFee(feeId: number | null) {
        dispatch(setTransportFeeDetailStatus({
            status: EStatus.IN_PROGRESS
        }))
        try {
            if (feeId === null) {
                let createdFee = await transportFeeRepository!.createTransportFee({
                    name: name,
                    city: city,
                    basicFee: basicFee,
                    originIds: originIds,
                    billBasedTransportFees: billBasedFees,
                    distanceFeePerKm: feePerKm,
                })
                dispatch(createTransportFee(createdFee))
                dispatch(setNumberOfTransportFee(numberOfTransportFees + 1))
            } else {
                let updatedFee = await transportFeeRepository!.updateTransportFee(feeId, {
                    name: name,
                    city: city,
                    basicFee: basicFee,
                    originIds: originIds,
                    billBasedTransportFees: billBasedFees,
                    distanceFeePerKm: feePerKm,
                })
                dispatch(updateTransportFee({current: feeId, new: updatedFee}))
                props.onFeeUpdated(updatedFee)
            }
            dispatch(setTransportFeeDetailStatus({
                status: EStatus.SUCCESS
            })) 
        } catch (exception) {
            let axiosError = exception as AxiosError
            dispatch(setTransportFeeDetailStatus({
                status: EStatus.ERROR,
                message: axiosError.message,
            }))
        } finally {
            dispatch(setTransportFeeDetailStatus({
                status: EStatus.IDLE
            })) 
        }
    }

    function onOkButtonPressed() { 
        _createOrUpdateTransportFee(props.feeId).then( props.onBack )
    }

    function onAddOriginButtonClicked() {
        setEditingOriginIds([...originIds])
        setShowAddOrigin(true)
    }

    function onOriginsAdded() {
        setOriginIds(editingOriginIds)
        setShowAddOrigin(false)
    }

    function onEditingOriginIdChanged(changedOriginId: number, isSelected: boolean) {
        let index = editingOriginIds.indexOf(changedOriginId)
        if (index === -1) {
            editingOriginIds.push(changedOriginId)
        } else {
            editingOriginIds.splice(index, 1)
        }
        setEditingOriginIds([...editingOriginIds])
    }

    if (isLoading) {
        return <Loading></Loading>
    }
    return <React.Fragment>
        <ConditionalRendering display={ props.onBack !== undefined }>
            <FormNavigationBar onBackButtonPressed={ goBack } onOkButtonPressed={ onOkButtonPressed }></FormNavigationBar>
        </ConditionalRendering>
        <Modal show={ showAddBillBasedFee } onOk={ onNewBilLBasedFeeAdded } onClose={() => setShowAddBillBasedFee(false)}>
            <NewBillBasedTransportFee fee={ editingNewBillBasedFee } onChange={ setEditingNewBillBasedFee }></NewBillBasedTransportFee>
        </Modal>
        <Modal show={showAddOrigin} onOk={ onOriginsAdded } onClose={() => setShowAddOrigin(false) }>
            <AddOriginToTransportFee selectedOriginIds={ editingOriginIds } onChange={ onEditingOriginIdChanged }></AddOriginToTransportFee>
        </Modal>
        <section className="transport-fee-detail-page-section">
            <header>
                <h3 className="title">Th??ng tin chung</h3>
            </header>
            <div className="body">
                <label className="" htmlFor="basic-fee">
                    <strong>
                        T??n ph??
                    </strong>
                </label>
                <input className="body-text-1 form-text-input" type="text" id="basic-fee" value={name} onChange={e => setName(e.target.value)}></input>

                <label className="" htmlFor="city">
                    <strong>
                        Th??nh ph???
                    </strong>
                </label>
                <input className="body-text-1  form-text-input" type="text" id="city" value={city} onChange={e => setCity(e.target.value)}></input>

                <label className="" htmlFor="basic-fee">
                    <strong>
                        Ph?? c?? b???n
                    </strong>
                </label>
                <div className="row">
                    <DecimalInput className="body-text-1  form-text-input" id="basic-fee" value={basicFee} onChange={ setBasicFee }></DecimalInput>
                    <p>??</p>
                </div>
            </div>
        </section>
        
        <section className="transport-fee-detail-page-section">
            <header>
                <h3 className="title">Ph?? theo gi?? tr??? ????n h??ng</h3>
            </header>
            
            <div className="body">
                { displayBillBasedTransportFees() }
                <button className="add-button" onClick={ () => setShowAddBillBasedFee(true) }> 
                    <i className="fas fa-plus"></i>
                    <p>Th??m ph??</p> 
                </button>
            </div>
        </section>

        <section className="transport-fee-detail-page-section">
            <header>
                <h4 className="title">Kho xu???t</h4>
            </header>
            <div className="body">
                {/* Temporarily remove fee by distance from origin for now */}
                <label style={{ display: 'none' }} htmlFor="address" ><strong>Ph?? theo km</strong></label>
                <div style={{ display: 'none' }} className="row">
                    <DecimalInput value={ feePerKm } onChange={ setFeePerKm } className="body-text-1 form-text-input" id="address"></DecimalInput>
                    <p>?? / km</p>
                </div>

                { displayDistanceBasedTransportFeeOrigins() }

                <button className="add-button" onClick={ onAddOriginButtonClicked }> 
                    <i className="fas fa-plus"></i>
                    <p>Th??m kho xu???t</p> 
                </button>
            </div>
        </section>
    </React.Fragment>
}