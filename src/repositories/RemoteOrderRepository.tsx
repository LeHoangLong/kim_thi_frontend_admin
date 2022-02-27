import 'reflect-metadata'
import axios from "axios";
import { HOST_URL } from "../config/Url";
import { Address } from "../models/Address";
import { CustomerContact } from "../models/CustomerContact";
import { OrderItem, OrderModel, OrderSummary } from "../models/OrderModel";
import { transaction } from "../services/AxiosErrorHandler";
import { FetchOrderSummaryArg, FilterOrderArg, IOrderRepository } from "./IOrderRepository";
import { jsonToTransportFeeDetail } from "./RemoteTransportFeeRepository";
import { stringToEProductUnit } from '../models/EProductUnit';

export function parseCustomerContact(json: any) : CustomerContact {
    return {
        id: json.id,
        name: json.name,
        phoneNumber: json.phoneNumber,
        email: json.email,
        isDeleted: json.isDeleted,
    }
}

export function parseAddress(json: any): Address {
    return {
        id: json.id,
        address: json.address,
        latitude: json.latitude,
        longitude: json.longitude,
        city: json.city,
        isDeleted: json.isDeleted,
    }
}   

export function parseOrderItem(json: any): OrderItem {
    return {
        id: json.id,
        productId: json.productId,
        price: json.price,
        quantity: json.quantity,
        unit: stringToEProductUnit(json.unit),
    }
}

export function parseOrder(json: any): OrderModel {
    let model: OrderModel = {
        id: json.id,
        items: [],
        isShipped: json.isShipped,
        isReceived: json.isReceived,
        isPaid: json.isPaid,
        isCancelled: json.isCancelled,
        orderTime: json.orderTime,
        paymentTime: json.paymentTime,
        receivedTime: json.receivedTime,
        startShippingTime: json.startShippingTime,
        cancellationTime: json.cancellationTime,
        cancellationReason: json.cancellationReason,
        customerMessage: json.customerMessage,
        customerContact: parseCustomerContact(json.customerContact),
        paymentAmount: json.paymentAmount,
        address: parseAddress(json.address),
        areaTransportFee: jsonToTransportFeeDetail(json.areaTransportFee),
    }

    for (let i = 0; i < json.items.length; i++) {
        model.items.push(parseOrderItem(json.items[i]))
    }
    return model
}

export class RemoteOrderRepository implements IOrderRepository {
    async fetchOrderSummaries(arg: FetchOrderSummaryArg) : Promise<OrderSummary[]> {
        let ret: OrderSummary[] = []
        await transaction(async () => {
            let response = await axios.get(`${HOST_URL}/orders/summaries`, {
                params: {
                    startId: arg.startId,
                    limit: arg.limit,
                    offset: arg.offset,
                    orderId: arg.orderId === -1? null: arg.orderId,
                    orderTimeStart: arg.orderTimeStart,
                    orderTimeEnd: arg.orderTimeEnd,
                    includeCancelledOrders: arg.includeCancelledOrders,
                    includeReceivedOrders: arg.includeReceivedOrders,
                    includeShippedOrders: arg.includeShippedOrders,
                    includePaidOrders: arg.includePaidOrders,
                    includeOrderedOrders: arg.includeOrderedOrders,
                }
            })

            for (let i = 0; i < response.data.length; i++) {
                let parsed = parseOrder(response.data[i])
                ret.push(parsed)
            }
        })
        return ret
    }

    async fetchNumberOfOrders(arg: FilterOrderArg) : Promise<number> {
        let count = 0
        await transaction(async () => {
            let response = await axios.get(`${HOST_URL}/orders/summaries/count`, {
                params: {
                    orderId: arg.orderId === -1? null: arg.orderId,
                    orderTimeStart: arg.orderTimeStart,
                    orderTimeEnd: arg.orderTimeEnd,
                    includeCancelledOrders: arg.includeCancelledOrders,
                    includeReceivedOrders: arg.includeReceivedOrders,
                    includeShippedOrders: arg.includeShippedOrders,
                    includePaidOrders: arg.includePaidOrders,
                    includeOrderedOrders: arg.includeOrderedOrders,
                }
            })
            count = response.data
        })
        return count
    }

    // throw NotFound if orderId is not found
    async updateOrderStatus(arg: {orderId: number, isShipped: boolean, isReceived: boolean, isCancelled: boolean, isPaid: boolean}) : Promise<void> {
        await transaction(async () => {
            await axios.put(`${HOST_URL}/orders/${arg.orderId}/status`, {
                body: {
                    isShipped: arg.isShipped,
                    isReceived: arg.isReceived,
                    isPaid: arg.isPaid,
                    isCancelled: arg.isCancelled,
                }
            })
        })
    }

    async fetchOrderDetail(orderId: number) : Promise<OrderModel> {
        let ret: OrderModel
        await transaction(async () => {
            let response = await axios.get(`${HOST_URL}/orders/${orderId}`)
            ret = parseOrder(response.data)
        })

        return ret!
    }
}