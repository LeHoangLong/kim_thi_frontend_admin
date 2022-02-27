import React, { useEffect, useState } from "react"
import { useContainer } from "../../container"
import { useAppDispatch } from "../../hooks/Hooks"
import { EStatus } from "../../models/StatusModel"
import { setNumberOfOrders, setNumberOfOrdersStatus, setOrderSummaries   } from "../../reducers/OrderReducer"
import { FilterOrderArg } from "../../repositories/IOrderRepository"
import { ConditionalRendering } from "../background/ConditionalRendering"
import { DateSelectionInput } from "../components/DateSelectionInput"
import { PageTransition } from "../components/PageTransition"
import styles from './OrderPage.module.scss'
import { OrdersListPage } from "./OrdersListPage"

export const OrderPage = () => {
    let { orderRepository } = useContainer()[0]
    let [fromDate, setFromDate] = useState<Date>(new Date())
    let [toDate, setToDate] = useState<Date>(new Date())
    let [orderId, setOrderId] = useState("")
    let [includeOrderedOrders, setIncludeOrderedOrders] = useState(true)
    let [includeCancelledOrders, setIncludeCancelledOrders] = useState(false)
    let [includeReceivedOrders, setIncludeReceivedOrders] = useState(false)
    let [includeShippedOrders, setIncludeShippedOrders] = useState(false)
    let [includePaidOrders, setIncludePaidOrders] = useState(false)
    let [displayOrdersPage, setDisplayOrdersPage] = useState(false)
    let [renderOrdersPage, setRenderOrdersPage] = useState(false)
    let [isChanged, setIsChanged] = useState(true)
    let [filterArg, setFilterArg] = useState<FilterOrderArg>({
        orderTimeStart: fromDate,
        orderTimeEnd: toDate,
        orderId: -1,
        includeOrderedOrders,
        includeCancelledOrders,
        includeReceivedOrders,
        includeShippedOrders,
        includePaidOrders,
    })

    let dispatch = useAppDispatch()

    useEffect(() => {
        let newDate = new Date()
        newDate.setMonth(newDate.getMonth() - 1)
        newDate.setHours(0, 0, 0, 0)
        setFromDate(newDate)
    }, [])

    useEffect(() => {
        setIsChanged(true)
        setFilterArg({
            orderTimeStart: fromDate,
            orderTimeEnd: toDate,
            orderId: isNaN(parseInt(orderId))? -1 : parseInt(orderId),
            includeOrderedOrders,
            includeCancelledOrders,
            includeReceivedOrders,
            includeShippedOrders,
            includePaidOrders,
        })
    }, [fromDate,
        toDate,
        orderId,
        includeOrderedOrders,
        includeCancelledOrders,
        includeReceivedOrders,
        includeShippedOrders,
        includePaidOrders,
    ])

    async function onFormSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setDisplayOrdersPage(true)
        setRenderOrdersPage(true)
        if (isChanged) {
            try {
                dispatch(setNumberOfOrdersStatus({
                    status: EStatus.IN_PROGRESS
                }))
                let numberOfOrders = await orderRepository.fetchNumberOfOrders({
                    orderId: isNaN(parseInt(orderId))? -1 : parseInt(orderId),
                    orderTimeStart: fromDate,
                    orderTimeEnd: toDate,
                    includeCancelledOrders: includeCancelledOrders,
                    includeReceivedOrders: includeReceivedOrders,
                    includeShippedOrders: includeShippedOrders,
                    includePaidOrders: includePaidOrders,
                    includeOrderedOrders: includeOrderedOrders,
                })
                dispatch(setNumberOfOrders(numberOfOrders))
                dispatch(setOrderSummaries([]))
                dispatch(setNumberOfOrdersStatus({
                    status: EStatus.SUCCESS
                }))
            } catch (exception) {
                console.log('exception')
                console.log(exception)
            } finally {
                dispatch(setNumberOfOrdersStatus({
                    status: EStatus.IDLE
                }))
            }
        }
    }

    function onIdChangedHandler(id: string) {
        setOrderId(id)
    }

    return <React.Fragment>
        <PageTransition show={ displayOrdersPage }>
            <ConditionalRendering display={ renderOrdersPage}>
                <OrdersListPage filterArg={ filterArg } onBack={() => setDisplayOrdersPage(false)}></OrdersListPage>
            </ConditionalRendering>
        </PageTransition>
        <section className={ styles.order_page } style={{ overflowY: displayOrdersPage? 'hidden' : 'auto' }}>
            <form onSubmit={ onFormSubmitHandler }>
                <div className={ styles.form }>
                    <div>
                        <label className={styles.from_date_label}>Từ ngày</label>
                    </div>
                    <div className={styles.from_date_input}>
                        <DateSelectionInput value={fromDate} onChanged={ setFromDate }></DateSelectionInput>
                    </div>
                    <div>
                        <label className={styles.from_date_label}>Đến ngày</label>
                    </div>
                    <div className={styles.from_date_input}>
                        <DateSelectionInput value={toDate} onChanged={ setToDate }></DateSelectionInput>
                    </div>

                    <div>
                        <label className={styles.from_date_label}>ID</label>
                    </div>
                    <div className={styles.from_date_input}>
                        <input type="text" placeholder="ID đơn hàng" value={ orderId.toString() } onChange={e => onIdChangedHandler((e.target.value))}></input>
                    </div>

                    <div>
                        <label className={styles.from_date_label}>Tìm đơn đã đặt</label>
                    </div>
                    <div className={styles.from_date_input}>
                        <input type="checkbox" checked={includeOrderedOrders} onChange={e => setIncludeOrderedOrders(e.target.checked)}></input>
                    </div>
                    <div>
                        <label className={styles.from_date_label}>Tìm đơn đã gửi</label>
                    </div>
                    <div className={styles.from_date_input}>
                        <input type="checkbox" checked={includeShippedOrders} onChange={e => setIncludeShippedOrders(e.target.checked)}></input>
                    </div>
                    
                    <div>
                        <label className={styles.from_date_label}>Tìm đơn đã nhận</label>
                    </div>
                    <div className={styles.from_date_input}>
                        <input type="checkbox" checked={includeReceivedOrders} onChange={e => setIncludeReceivedOrders(e.target.checked)}></input>
                    </div>

                    <div>
                        <label className={styles.from_date_label}>Tìm đơn đã thanh toán</label>
                    </div>
                    <div className={styles.from_date_input}>
                        <input type="checkbox" checked={includePaidOrders} onChange={e => setIncludePaidOrders(e.target.checked)}></input>
                    </div>

                    <div>
                        <label className={styles.from_date_label}>Tìm đơn đã hủy</label>
                    </div>
                    <div className={styles.from_date_input}>
                        <input type="checkbox" checked={includeCancelledOrders} onChange={e => setIncludeCancelledOrders(e.target.checked)}></input>
                    </div>
                </div>

                <button className={ styles.search_button }>
                    Tìm kiếm
                </button>
            </form>
        </section>
    </React.Fragment>
}