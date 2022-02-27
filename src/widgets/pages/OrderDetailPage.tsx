import React, { useCallback, useEffect, useState } from "react"
import { useContainer } from "../../container"
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { EProductUnitToString } from "../../models/EProductUnit"
import { OrderModel } from "../../models/OrderModel"
import { setOrderDetail } from "../../reducers/OrderReducer"
import { fetchedProductDetail, fetchingProductDetail } from "../../reducers/ProductDetailReducer"
import { HeaderBar } from "../components/HeaderBar"
import Loading from "../components/Loading"
import styles from './OrderDetailPage.module.scss'

export interface OrderDetailPageProps {
    orderId?: number,
    onBack(): void
}

export const OrderDetailPage = (props: OrderDetailPageProps) => {
    let ordersDetail = useAppSelector(state => state.orders.orderDetail)
    let [order, setOrder] = useState<OrderModel | undefined>(undefined)
    let [isFetching, setIsFetching] = useState(false)
    let [isFetchingProducts, setIsFetchingProducts] = useState(false)
    let [isLoading, setIsLoading] = useState(false)
    let {orderRepository, productRepository} = useContainer()[0]
    let productDetails = useAppSelector(state => state.productDetails.products)
    let dispatch = useAppDispatch()

    useEffect(() => {
        async function fetchOrderDetail(orderId: number) {
            if (!isFetching && props.orderId !== undefined) {
                setIsFetching(true)
                try {
                    let newOrder = await orderRepository.fetchOrderDetail(orderId)
                    dispatch(setOrderDetail(newOrder))
                } catch (exception) {
                    props.onBack()
                } finally {
                    setIsFetching(false)
                }
            }
        }

        if (props.orderId !== undefined) {
            if (props.orderId in ordersDetail) {
                setOrder(ordersDetail[props.orderId])
            } else {
                fetchOrderDetail(props.orderId)
            }
        } else {
            props.onBack()
        }
    }, [props, ordersDetail, isFetching, dispatch, orderRepository])

    let isAllProductsFetched = useCallback(() => {
        let isAllProductsFetched = true
        if (order) {
            for (let i = 0; i < order.items.length; i++) {
                let index = productDetails.findIndex(e => e?.id === order?.items[i].productId)
                if (index === -1) {
                    isAllProductsFetched = false
                    break
                }
            }
        }
        return isAllProductsFetched
    }, [order, productDetails])

    useEffect(() => {
        if (isFetching || !isAllProductsFetched()) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [isFetching, order, productDetails, isFetchingProducts, isAllProductsFetched])

    useEffect(() => {
        async function fetchProducts() {
            if (order) {
                setIsFetchingProducts(true)
                try {
                    for (let i = 0; i < order.items.length; i++) {
                        let item = order.items[i]
                        let index = productDetails.findIndex(e => e.id === item.productId)
                        if (index === -1) {
                            dispatch(fetchingProductDetail(item.productId))
                            let productDetail = await productRepository.fetchProductDetailById(item.productId)
                            dispatch(fetchedProductDetail(productDetail))
                        }
                    }
                } finally {
                    setIsFetchingProducts(false)
                }
            }
        }

        if (!isAllProductsFetched()) {
            fetchProducts()
        }
    }, [order, productDetails, dispatch, productRepository, isAllProductsFetched])

    function displayOrderItems() {
        let ret: React.ReactNode[] = []
        let items = order?.items
        if (items && isAllProductsFetched()) {
            for (let i = 0; i < items.length; i++) {
                let productDetail = productDetails.find(e => e.id === items![i].productId)
                if (productDetail) {
                    ret.push(
                        <tr key={ items[i].id }>
                            <td>{ items[i].id }</td>
                            <td>{ productDetail.serialNumber }</td>
                            <td>{ EProductUnitToString(items[i].unit) }</td>
                            <td>{ items[i].price }</td>
                            <td>
                                { items[i].quantity }
                            </td>
                        </tr>
                    )
                }
            }
            return ret
        } else {
            return []
        }
    }

    return <section>
        <HeaderBar onBack={ props.onBack } title="Chi tiết đơn hàng"></HeaderBar>
        {(() => {
            if (isLoading) {
                return <Loading></Loading>
            } else {
                return (
                <React.Fragment>
                    <div>
                        <article className={ styles.order_info_row }>
                            <header>
                                <p className={ styles.order_info_row_header }>ID</p>
                            </header>
                            <p>{ order?.id }</p>
                        </article>
                        <article className={ styles.order_info_row }>
                            <header>
                                <p className={ styles.order_info_row_header }>Thời gian đặt</p>
                            </header>
                            <p>{ order?.orderTime }</p>
                        </article>
                        <article className={ styles.order_info_row }>
                            <header>
                                <p className={ styles.order_info_row_header }>Địa chỉ</p>
                            </header>
                            <p>{ order?.address.address }</p>
                        </article>
                        <article className={ styles.order_info_row }>
                            <header>
                                <p className={ styles.order_info_row_header }>Tổng tiền</p>
                            </header>
                            <p>{ order?.paymentAmount }</p>
                        </article>
                    </div>
                    <div className={ styles.table_container }>
                        <table className={ styles.table }>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Mã sản phẩm</th>
                                    <th>Đơn vị</th>
                                    <th>Giá</th>
                                    <th>Số lượng</th>
                                </tr>
                            </thead>
                            <tbody>
                                { displayOrderItems() }
                            </tbody>
                        </table>
                    </div>
                </React.Fragment>
                )
            }
        })()}
    </section>
}