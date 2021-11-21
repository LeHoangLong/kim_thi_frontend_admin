import { OrderModel, OrderSummary } from "../models/OrderModel";

export interface FilterOrderArg {
    orderId: number, // -1 for ignore
    orderTimeStart?: Date,
    orderTimeEnd?: Date,
    includeCancelledOrders?: boolean,
    includeReceivedOrders?: boolean,
    includeShippedOrders?: boolean,
    includePaidOrders?: boolean,
    includeOrderedOrders?: boolean,
}

export interface FetchOrderSummaryArg extends FilterOrderArg {
    limit: number,
    offset: number,
    startId: number,
}

export interface IOrderRepository {
    fetchOrderSummaries(arg: FetchOrderSummaryArg) : Promise<OrderSummary[]>
    fetchNumberOfOrders(arg: FilterOrderArg) : Promise<number>
    // throw NotFound if orderId is not found
    updateOrderStatus(arg: {orderId: number, isShipped: boolean, isReceived: boolean, isCancelled: boolean, isPaid: boolean}) : Promise<void>

    fetchOrderDetail(orderId: number) : Promise<OrderModel>
}