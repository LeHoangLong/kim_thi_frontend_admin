import Decimal from "decimal.js";
import { Address } from "./Address";
import { AreaTransportFee } from "./TransportFee";
import { CustomerContact } from "./CustomerContact";
import { EProductUnit } from './EProductUnit'

export interface OrderItem {
    id: number,
    productId: number,
    price: string,
    quantity: string,
    unit: EProductUnit,
}

export interface OrderSummary {
    id: number,
    isShipped: boolean,
    isReceived: boolean,
    isPaid: boolean,
    isCancelled: boolean,
    orderTime: string,
    customerMessage: string,
    customerContact: CustomerContact,
    paymentAmount: string,
    address: Address,
}

export interface OrderModel {
    id: number,
    items: OrderItem[],
    isShipped: boolean,
    isReceived: boolean,
    isPaid: boolean,
    isCancelled: boolean,
    orderTime: string,
    paymentTime?: string,
    receivedTime?: string,
    startShippingTime?: string,
    cancellationTime?: string,
    cancellationReason: string,
    customerMessage: string,
    customerContact: CustomerContact,
    paymentAmount: string,
    address: Address,
    areaTransportFee: AreaTransportFee,
}