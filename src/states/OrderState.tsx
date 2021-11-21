import { OrderModel, OrderSummary } from "../models/OrderModel";
import { StatusModel } from "../models/StatusModel";

export interface OrderState {
    orderDetail: {
        [id: number]: OrderModel,
    },
    orderSummaries: (OrderSummary | undefined)[],
    numberOfOrders: number,
    numberOfOrdersStatus: StatusModel,
}