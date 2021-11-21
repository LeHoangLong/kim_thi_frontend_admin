import React, { useEffect, useState } from "react"
import { Pagination } from "../../config/Pagination"
import { Symbols } from "../../config/Symbols"
import myContainer from "../../container"
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { EStatus } from "../../models/StatusModel"
import { setOrderSummaries } from "../../reducers/OrderReducer"
import { FilterOrderArg, IOrderRepository } from "../../repositories/IOrderRepository"
import { HeaderBar } from "../components/HeaderBar"
import Loading from "../components/Loading"
import styles from './OrdersListPage.module.scss'
import { ScrollingPageIndex } from '../components/ScrollingPageIndex'
import { OrderSummary } from "../../models/OrderModel"
import { PageTransition } from "../components/PageTransition"
import { OrderDetailPage } from "./OrderDetailPage"
import { ConditionalRendering } from "../background/ConditionalRendering"

export interface OrdersListPageProps {
    onBack(): void,
    filterArg: FilterOrderArg,
}

export const OrdersListPage = (props: OrdersListPageProps) => {
    let [pageNumber, setPageNumber] = useState(0)
    let numberOfOrders = useAppSelector(state => state.orders.numberOfOrders)
    let numberOfOrdersStatus = useAppSelector(state => state.orders.numberOfOrdersStatus)
    let orderSummaries = useAppSelector(state => state.orders.orderSummaries)
    let [isLoading, setIsLoading] = useState(false)
    let orderRepository = myContainer.get<IOrderRepository>(Symbols.ORDER_REPOSITORY)
    let dispatch = useAppDispatch()
    let [fetchingPageSet, setFetchingPageSet] = useState<Set<number>>(new Set<number>())

    let [renderDetailPage, setRenderDetailPage] = useState(false)
    let [showOrderDetailPage, setShowOrderDetailPage] = useState(false)
    let [orderId, setOrderId] = useState<number | undefined>()

    useEffect(() => {
        let minIndex = pageNumber * Pagination.DEFAULT_PAGE_SIZE
        let maxIndex = (pageNumber + 1) * Pagination.DEFAULT_PAGE_SIZE
        if (maxIndex > numberOfOrders) {
            maxIndex = numberOfOrders
        }
        let toFetch = false
        if (orderSummaries.length < maxIndex) {
            toFetch = true
        } else {
            for (let i = minIndex; i < maxIndex; i++) {
                if (orderSummaries[i] === undefined) {
                    toFetch = true
                    break
                }
            }
        }

        async function fetchOrders() {
            fetchingPageSet.add(pageNumber)
            setFetchingPageSet(fetchingPageSet)
            let lastKnowIndex = minIndex - 1
            for (let i = minIndex; i > 0; i--) {
                if (orderSummaries[i] === undefined && 
                    orderSummaries[i - 1] !== undefined
                ) {
                    lastKnowIndex = i - 1
                    break
                }
            }

            let orderSummary = orderSummaries[lastKnowIndex]
            let startId = 0
            if (orderSummary !== undefined) {
                startId = orderSummary.id + 1
            }

            let firstUnknownIndex = lastKnowIndex + 1
            console.log('offset')
            console.log(minIndex - firstUnknownIndex)

            let fetchedOrders = await orderRepository.fetchOrderSummaries({
                ...props.filterArg,
                offset: minIndex - firstUnknownIndex,
                limit: maxIndex - minIndex,
                startId: startId,
            })

            console.log('fetchedOrders')
            console.log(fetchedOrders)
            let newOrderSummaries = [...orderSummaries]
            for (let i = newOrderSummaries.length; i < maxIndex ; i++) {
                newOrderSummaries.push(undefined)
            }
            for (let i = minIndex; i < maxIndex; i++) {
                newOrderSummaries[i] = fetchedOrders[i - minIndex]
            }
            dispatch(setOrderSummaries(newOrderSummaries))

            let newFetchingPageSet = new Set<number>(fetchingPageSet)
            newFetchingPageSet.delete(pageNumber)
            setFetchingPageSet(newFetchingPageSet)
        }

        if (toFetch && !fetchingPageSet.has(pageNumber)) {
            fetchOrders()
        }
    }, [orderSummaries, pageNumber])

    async function updateOrder(orderId: number, arg: {
        isShipped: boolean,
        isPaid: boolean,
        isCancelled: boolean,
        isReceived: boolean,
    }) {
        let index = orderSummaries.findIndex(e => e?.id === orderId)
        if (index !== -1) {
            let summary = orderSummaries[index]
            if (summary) {
                let newSummaries : (OrderSummary | undefined)[] = [...orderSummaries]
                newSummaries[index] = {
                    ...summary,
                    isShipped: arg.isShipped,
                    isPaid: arg.isPaid,
                    isCancelled: arg.isCancelled,
                    isReceived: arg.isReceived,
                }
                dispatch(setOrderSummaries(newSummaries))

                try {
                    await orderRepository.updateOrderStatus({
                        orderId: orderId,
                        isShipped: arg.isShipped,
                        isPaid: arg.isPaid,
                        isCancelled: arg.isCancelled,
                        isReceived: arg.isReceived,
                    })
                } catch (exception) {
                    // revert back
                    dispatch(setOrderSummaries(orderSummaries))
                } 
            }
        }
    }

    function onOrderClickHandler(orderId: number) {
        setOrderId(orderId)
        setRenderDetailPage(true)
        setShowOrderDetailPage(true)
    }

    function displayOrders() {
        let ret: React.ReactNode[] = []
        let minIndex = pageNumber * Pagination.DEFAULT_PAGE_SIZE
        let maxIndex = (pageNumber + 1) * Pagination.DEFAULT_PAGE_SIZE
        if (maxIndex > numberOfOrders) {
            maxIndex = numberOfOrders
        }
        if (orderSummaries.length < maxIndex || fetchingPageSet.has(pageNumber)) {
            return []
        } else {
            for (let i = minIndex; i < maxIndex; i++) {
                let orderSummary = orderSummaries[i]
                if (orderSummary === undefined) {
                    return []
                } else {
                    ret.push(
                        <tr key={ orderSummary.id }>
                            <td className={ styles.order_detail_link} onClick={ () => onOrderClickHandler(orderSummary!.id) }>{ orderSummary.id }</td>
                            <td>{ new Date(orderSummary.orderTime).toLocaleDateString() }</td>
                            <td>{ orderSummary.address.address }</td>
                            <td>{ orderSummary.customerContact.name ?? '-' }</td>
                            <td>{ orderSummary.customerContact.phoneNumber ?? '-' }</td>
                            <td>{ orderSummary.customerMessage }</td>
                            <td>{ orderSummary.paymentAmount }</td>
                            <td>
                                <input type="checkbox"
                                    checked={ orderSummary.isShipped } 
                                    onChange={e => updateOrder(orderSummary!.id, {
                                        isShipped: e.target.checked,
                                        isPaid: orderSummary!.isPaid,
                                        isCancelled: orderSummary!.isCancelled,
                                        isReceived: orderSummary!.isReceived,
                                    }) }
                                ></input>
                            </td>
                            <td>
                                <input type="checkbox"
                                    checked={ orderSummary.isReceived } 
                                    onChange={e => updateOrder(orderSummary!.id, {
                                        isShipped: orderSummary!.isShipped,
                                        isPaid: orderSummary!.isPaid,
                                        isCancelled: orderSummary!.isCancelled,
                                        isReceived: e.target.checked,
                                    }) }
                                ></input>
                            </td>
                            <td>
                                <input type="checkbox"
                                    checked={ orderSummary.isPaid } 
                                    onChange={e => updateOrder(orderSummary!.id, {
                                        isShipped: orderSummary!.isShipped,
                                        isPaid: e.target.checked,
                                        isCancelled: orderSummary!.isCancelled,
                                        isReceived: orderSummary!.isReceived,
                                    }) }
                                ></input>
                            </td>
                            <td>
                                <input type="checkbox"
                                    checked={ orderSummary.isCancelled } 
                                    onChange={e => updateOrder(orderSummary!.id, {
                                        isShipped: orderSummary!.isShipped,
                                        isPaid: orderSummary!.isPaid,
                                        isCancelled: e.target.checked,
                                        isReceived: orderSummary!.isReceived,
                                    }) }
                                ></input>
                            </td>
                        </tr>
                    )
                }
            }
            return ret
        }
    }

    useEffect(() => {
        if (numberOfOrdersStatus.status === EStatus.SUCCESS) {
            setPageNumber(0)
        }
    }, [numberOfOrdersStatus])

    useEffect(() => {
        if (numberOfOrdersStatus.status === EStatus.IN_PROGRESS) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [numberOfOrdersStatus])


    return <React.Fragment>
        <PageTransition show={ showOrderDetailPage }>
            <ConditionalRendering display={ renderDetailPage }>
                <OrderDetailPage orderId={ orderId } onBack={() => setShowOrderDetailPage(false)}></OrderDetailPage>
            </ConditionalRendering>
        </PageTransition>
        <section style={{ overflow: showOrderDetailPage? 'none' : 'auto'}}>
            <HeaderBar title='Hóa đơn' onBack={ props.onBack }></HeaderBar>
            {(() => {
                if (isLoading) {
                    return <Loading></Loading>
                } else {
                    return <div className={ styles.table_container }><table className={ styles.table }>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Thời gian đặt</th>
                                <th>Địa chỉ</th>
                                <th>Tên khách</th>
                                <th>Số điện thoại</th>
                                <th>Lời nhắn</th>
                                <th>Tổng tiền</th>
                                <th>Đã gửi</th>
                                <th>Đã nhận</th>
                                <th>Đã thanh toán</th>
                                <th>Đã hủy</th>
                            </tr>
                        </thead>
                        <tbody>
                            { displayOrders() }
                        </tbody>
                    </table>
                    </div>
                }
            })()}
            {(() => {
                if (fetchingPageSet.has(pageNumber)) {
                    return <Loading></Loading>
                }
            })()}
            <ScrollingPageIndex 
                min={1} 
                max={ Math.ceil(numberOfOrders / Pagination.DEFAULT_PAGE_SIZE) + 1 }
                currentIndex={ pageNumber + 1 }
                onSelect={index => setPageNumber(index - 1)}
            />
        </section>
    </React.Fragment>
}