import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Pagination } from '../../config/Pagination'
import Services from '../../config/Services'
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks'
import { EStatus } from '../../models/StatusModel'
import { createOrigin, insertOrigins, insertOriginToMap, setNumberOfOrigins, setOriginStatusState } from '../../reducers/TransportFeeReducer'
import { ITransportFeeRepository } from '../../repositories/ITransportFeeRepository'
import Locator from '../../services/Locator'
import Loading from '../components/Loading'
import { MultipleSelect, SelectElement } from '../components/MultipleSelect'
import { ScrollingPageIndex } from '../components/ScrollingPageIndex'
import './AddOriginToTransportFee.scss'

export interface AddOriginToTransportFeeProps {
    selectedOriginIds: number[],
    onChange(selectedOriginIds: number, isSelected: boolean) : void,
}

export const AddOriginToTransportFee = (props: AddOriginToTransportFeeProps) => {
    let origins = useAppSelector(state => state.transportFees.origins)
    let numberOfOrigins = useAppSelector(state => state.transportFees.numberOfOrigins)
    let originStatus = useAppSelector(state => state.transportFees.originsOperationStatus)
    let transportFeeRepository = Locator.get<ITransportFeeRepository>(Services.TRANSPORT_FEE_REPOSITORY)
    
    let [pageNumber, setPageNumber] = useState(0)
    let [selectedOriginIds, setSelectedOriginIds] = useState<string[]>([])
    let [originAddress, setOriginAddress] = useState('')

    let dispatch = useAppDispatch()

    async function fetchOrigins(fetchNumberOfTransportFees: boolean = false) {
        if (originStatus.status !== EStatus.IN_PROGRESS) {
            dispatch(setOriginStatusState({
                status: EStatus.IN_PROGRESS
            }))
            try {
                if (fetchNumberOfTransportFees) {
                    let numberOfOrigins = await transportFeeRepository!.fetchNumberOfOrigins()
                    dispatch(setNumberOfOrigins(numberOfOrigins))
                }
                let origins = await transportFeeRepository!.fetchOrigins(Pagination.DEFAULT_PAGE_SIZE, pageNumber * Pagination.DEFAULT_PAGE_SIZE)
                dispatch(insertOrigins({
                    offset: pageNumber * Pagination.DEFAULT_PAGE_SIZE,
                    objects: origins,
                }))
                dispatch(setOriginStatusState({
                    status: EStatus.SUCCESS
                }))
            } catch (exception) {
                let axiosError = exception as AxiosError
                dispatch(setOriginStatusState({
                    status: EStatus.ERROR,
                    message: axiosError.message,
                }))
            } finally {
                dispatch(setOriginStatusState({
                    status: EStatus.IDLE
                }))
            }
        }
    }

    async function _createOrigin() {
        if (originStatus.status !== EStatus.IN_PROGRESS) {
            dispatch(setOriginStatusState({
                status: EStatus.IN_PROGRESS
            }))
            try {
                let newOrigin = await transportFeeRepository!.createOrigin(originAddress)
                dispatch(createOrigin(newOrigin))
                dispatch(setOriginStatusState({
                    status: EStatus.SUCCESS,
                }))
            } catch (exception) {
                let axiosError = exception as AxiosError
                dispatch(setOriginStatusState({
                    status: EStatus.ERROR,
                    message: axiosError.message,
                }))
            } finally {
                dispatch(setOriginStatusState({
                    status: EStatus.IDLE,
                }))
            }
        }
    }

    useEffect(() => {
        if (numberOfOrigins === -1) {
            fetchOrigins(true)
        } else {
            let toFetchOrigins = false
            for (let i = pageNumber * Pagination.DEFAULT_PAGE_SIZE; i < numberOfOrigins && i < (pageNumber + 1) * Pagination.DEFAULT_PAGE_SIZE; i++) {
                if ( !origins[i] ) {
                    toFetchOrigins = true
                    break;
                }
            }

            if (toFetchOrigins) {
                fetchOrigins(false)
            }
        }
    }, [ numberOfOrigins, pageNumber, origins, originStatus ])

    useEffect(() => {
        let newSelecedOriginIds : string[] = []
        for (let i = 0; i < props.selectedOriginIds.length; i++) {
            newSelecedOriginIds.push(props.selectedOriginIds[i].toString())
        }

        setSelectedOriginIds(newSelecedOriginIds)
    }, [props.selectedOriginIds])

    function displayOrigins() {
        let ret: SelectElement[] = []
        for (let i = pageNumber * Pagination.DEFAULT_PAGE_SIZE; i < (pageNumber + 1) * Pagination.DEFAULT_PAGE_SIZE && i < origins.length; i++) {
            let origin = origins[i]
            if (origin) {
                ret.push({
                    value: origin.id.toString(),
                    text: origin.address,
                })
            }
        }

        return <MultipleSelect elements={ret} selected={ selectedOriginIds } onChange={(e, isSelected) => {props.onChange(parseInt(e.value), isSelected)} }></MultipleSelect>
        /*
        return <select multiple={ true } value={ selectedOriginIds } onChange={ onSelectedOriginsChanged }>
            { ret }
        </select>
        */
    }

    function onCreateOriginButtonClicked() {
        _createOrigin()
    }

    if (originStatus.status === EStatus.IN_PROGRESS) {
        return <Loading></Loading>
    }
    return  <section className="add-origin-section">
        {(() => {
            if (numberOfOrigins > 0) {
                return <article>
                    <header>
                        <strong>Chọn kho xuất</strong>
                    </header>
                    { displayOrigins() }
                    <ScrollingPageIndex onSelect={ page => setPageNumber(page - 1) } min={ 1 } max={ Math.ceil(numberOfOrigins / Pagination.DEFAULT_PAGE_SIZE) + 1 } currentIndex={ pageNumber + 1 }></ScrollingPageIndex>
                </article>
            }
        })()}

        <article>
            <header>
                <strong>Tạo kho xuất mới</strong>
            </header>
            <div className="row">
                <input value={ originAddress } onChange={ e => setOriginAddress( e.target.value ) } placeholder="Địa chỉ kho xuất" id="origin-address-input" type="text" className="add-origin-input form-text-input"></input>
                <button disabled={ originAddress.length === 0 } onClick={ onCreateOriginButtonClicked } className="primary-button create-origin-button">Tạo</button>
            </div>
        </article>
    </section>
}