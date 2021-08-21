import { AxiosError } from "axios"
import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Pagination } from "../../config/Pagination"
import Services from "../../config/Services"
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { EStatus } from "../../models/StatusModel"
import { insertTransportFeeSummaries, setNumberOfTransportFee, setTransportFeeSummaryStatus } from "../../reducers/TransportFeeReducer"
import { ITransportFeeRepository } from "../../repositories/ITransportFeeRepository"
import Locator from "../../services/Locator"
import { ConditionalRendering } from "../background/ConditionalRendering"
import Loading from "../components/Loading"
import { ScrollingPageIndex } from "../components/ScrollingPageIndex"
import './TransportFeeSummariesPage.scss'

export interface TransportFeeSummariesPageProps {
    onFeeSelected(index: number): void;
}  

export const TransportFeeSummariesPage = (props: TransportFeeSummariesPageProps) => {
    let feeSummaries = useAppSelector(state => state.transportFees.feeSummaries)
    let numberOfFees = useAppSelector(state => state.transportFees.numberOfTransportFees)
    let feeSummariesOperationStatus = useAppSelector(state => state.transportFees.feeSummariesOperationStatus)
    
    let [pageNumber, setPageNumber] = useState(0)
    let [isLoading, setIsLoading] = useState(true)
    let [showPageNumber, setShowPageNumber] = useState(true)
    let transportFeeRepository = Locator.get<ITransportFeeRepository>(Services.TRANSPORT_FEE_REPOSITORY)
    let dispatch = useAppDispatch()

    async function fetchSummaries(offset: number, fetchNumberOfFees: boolean) {
        dispatch(setTransportFeeSummaryStatus({
            status: EStatus.IN_PROGRESS,
        }))
        try {
            let numberOfFees: number = 0
            if (fetchNumberOfFees) {
                numberOfFees = await transportFeeRepository!.fetchNumberOfTransportFees()
            }
            let feeSummaries = await transportFeeRepository!.fetchTransportFeeSummaries(Pagination.DEFAULT_PAGE_SIZE, offset)
            if (fetchNumberOfFees) {
                dispatch(setNumberOfTransportFee(numberOfFees))
            }
            dispatch(insertTransportFeeSummaries({
                offset: offset,
                objects: feeSummaries,
            }))
            dispatch(setTransportFeeSummaryStatus({
                status: EStatus.SUCCESS,
            }))
        } catch (exception) {
            let axioError = exception as AxiosError
            dispatch(setTransportFeeSummaryStatus({
                status: EStatus.ERROR,
                message: axioError.message,
            }))
        } finally {
            dispatch(setTransportFeeSummaryStatus({
                status: EStatus.IDLE,
            }))
        }
    }

    useEffect(() => {
        if (numberOfFees !== -1) {
            setShowPageNumber(true)
        } else {
            setShowPageNumber(false)
        }
    }, [numberOfFees])

    // set isloading effect
    useEffect(() => {
        if (numberOfFees === -1) {
            setIsLoading(true)
        } else {
            let needFetch = false
            for (let i = pageNumber * Pagination.DEFAULT_PAGE_SIZE; i < (pageNumber + 1) * Pagination.DEFAULT_PAGE_SIZE && i < numberOfFees; i++) {
                if (i >= feeSummaries.length || !feeSummaries[i]) {
                    needFetch = true
                    break
                }
            }

            if (needFetch) {
                setIsLoading(true)
            } else {
                setIsLoading(false)
            }
        }

    }, [numberOfFees, feeSummaries, pageNumber])

    // Fetch summaries effect
    useEffect(() => {
        if (numberOfFees === -1 && feeSummariesOperationStatus.status === EStatus.INIT) {
            fetchSummaries(0, true)
        } else {
            let needFetch = false
            if (numberOfFees !== -1 && feeSummariesOperationStatus.status === EStatus.IDLE) {
                for (let i = pageNumber * Pagination.DEFAULT_PAGE_SIZE; i < (pageNumber + 1) * Pagination.DEFAULT_PAGE_SIZE && i < numberOfFees; i++) {
                    if (i >= feeSummaries.length || !feeSummaries[i]) {
                        needFetch = true
                        break
                    }
                }
            }
    
            if (needFetch) {
                fetchSummaries(pageNumber * Pagination.DEFAULT_PAGE_SIZE, false)
            }
        }
    }, [numberOfFees, feeSummaries, pageNumber, feeSummariesOperationStatus, transportFeeRepository])

    function displaySummaryCards() {
        let summariesElement : React.ReactNode[] = []
        for (let i = pageNumber * Pagination.DEFAULT_PAGE_SIZE; i < (pageNumber + 1) * Pagination.DEFAULT_PAGE_SIZE && i < feeSummaries.length; i++) {
            if (feeSummaries[i]) {
                summariesElement.push(
                    <li onClick={ () => props.onFeeSelected(feeSummaries[i]!.id) } className="card" key={ feeSummaries[i]!.id }>
                        <article>
                            <h4>{ feeSummaries[i]!.name }</h4>
                            <p> { feeSummaries[i]!.city } </p>
                        </article>
                    </li>
                )
            }
        }
        return summariesElement
    }

    let numberOfPages = Math.ceil(numberOfFees / Pagination.DEFAULT_PAGE_SIZE)
    if (numberOfFees === 0) {
        return <article className="no-fee-page">
            <h5>Chưa có phí vận chuyển nào được tạo</h5>
        </article>
    }
    return <React.Fragment>
        {(() => {
            if (isLoading) {
                return <Loading></Loading>
            } else {
                return <ul className="fee-summaries">
                    { displaySummaryCards() }
                </ul>
            }
        })()}
        <ConditionalRendering display={showPageNumber}>
            <div className="scrolling-page-container">
                <ScrollingPageIndex min={0} max={numberOfPages} currentIndex={pageNumber} onSelect={ setPageNumber }></ScrollingPageIndex>
            </div>
        </ConditionalRendering>
    </React.Fragment>
}