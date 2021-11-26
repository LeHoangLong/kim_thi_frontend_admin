import 'reflect-metadata'
import Decimal from "decimal.js";
import { inject, injectable } from "inversify";
import { OrderModel, OrderSummary } from "../models/OrderModel";
import { FetchOrderSummaryArg, FilterOrderArg, IOrderRepository } from "./IOrderRepository";
import { Symbols } from '../config/Symbols';
import { ITransportFeeRepository } from './ITransportFeeRepository';
import myContainer from '../container';
import { NotFound } from '../exceptions/NotFound';
import { EProductUnit } from '../models/EProductUnit';

@injectable()
export class MockOrderRepository implements IOrderRepository {
    public orders: OrderModel[] = []
    
    async init(numberOfOrders: number) {
        let yesterday = new Date()
        try {
            for (let i = 0; i < numberOfOrders; i++) {
                yesterday.setDate(yesterday.getDate() - 1)
                let fee = await this.repository!.fetchTransportFee(i)
                this.orders.push({
                    id: i,
                    isShipped: i % 3 == 0,
                    isReceived: i % 4 == 0,
                    isPaid: i % 5 == 2,
                    isCancelled: i % 5 == 0,
                    orderTime: yesterday.toISOString(),
                    customerMessage: `message-${i}`,
                    customerContact: {
                        id: 0,
                        phoneNumber: '12345',
                        isDeleted: false,
                    },
                    paymentAmount: '1000',
                    address: {
                        id: 0,
                        address: 'address-1',
                        latitude: '10.0001',
                        longitude: '20.0001',
                        city: 'city-1',
                        isDeleted: false,
                    },
                    items: [
                        {
                            id: i * 2,
                            productId: 0,
                            price: '100000',
                            unit: EProductUnit.KG,
                            quantity: i.toString(),
                        },
                        {
                            id: i * 2 + 1,
                            productId: 1,
                            price: '200000',
                            unit: EProductUnit.KG,
                            quantity: i.toString(),
                        },
                    ],
                    areaTransportFee: fee,
                    cancellationReason: '',
                })
            }
        } catch (exception) {
            console.log('exception')
            console.log(exception)
        }
    }

    
    constructor(
        private repository: ITransportFeeRepository,
        numberOfOrders: number,
    ) {
        this.init(numberOfOrders)
    }

    filter(arg: FilterOrderArg) : OrderModel[] {
        let filtered = this.orders.filter(e => 
            ((e.isCancelled && arg.includeCancelledOrders) ||
            (e.isPaid && arg.includePaidOrders) ||
            (e.isReceived && arg.includeReceivedOrders) ||
            (e.isShipped && arg.includeShippedOrders) ||
            arg.includeOrderedOrders === true) && 
            (arg.orderId === -1 || e.id === arg.orderId) &&
            (arg.orderTimeEnd === undefined || new Date(e.orderTime) <= arg.orderTimeEnd) &&
            (arg.orderTimeStart === undefined || new Date(e.orderTime) >= arg.orderTimeStart)
        )
        return filtered
    }

    async fetchOrderSummaries(arg: FetchOrderSummaryArg) : Promise<OrderSummary[]> {
        let ret: OrderSummary[] = []
        let filtered = this.filter(arg)
        filtered = filtered.filter(e => e.id >= arg.startId)
        for (let i = arg.offset; i < filtered.length && i < arg.offset + arg.limit; i++) {
            ret.push(filtered[i])
        }

        return ret
    }

    async fetchNumberOfOrders(arg: FilterOrderArg) : Promise<number> {
        let filtered = this.filter(arg)
        return filtered.length
    }

    async updateOrderStatus(arg: {
        orderId: number, 
        isShipped: boolean, 
        isReceived: boolean, 
        isCancelled: boolean, 
        isPaid: boolean
    }) : Promise<void> {
        let index = this.orders.findIndex(e => e.id === arg.orderId)
        if (index === -1) {
            throw new NotFound("Order", "id", arg.orderId.toString())
        } else {
            this.orders[index] = {
                ...this.orders[index],
                isShipped: arg.isShipped,
                isReceived: arg.isReceived,
                isCancelled: arg.isCancelled,
                isPaid: arg.isPaid,
            }
        }
    }


    async fetchOrderDetail(orderId: number) : Promise<OrderModel> {
        let order = this.orders.find(e => e.id == orderId)
        if (order !== undefined) {
            return order
        } else {
            throw new NotFound('OrderDetailModel', 'id', orderId.toString())
        }
    }
}