import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderModel, OrderSummary } from "../models/OrderModel";
import { EStatus, StatusModel } from "../models/StatusModel";
import { OrderState } from "../states/OrderState";

const initialState: OrderState = {
    orderDetail: {},
    orderSummaries: [],
    numberOfOrders: -1,
    numberOfOrdersStatus: {
        status: EStatus.INIT,
    },
}

let slice = createSlice({
    initialState,
    name: 'orders',
    reducers: {
        setOrderSummaries: (state, action: PayloadAction<(OrderSummary | undefined)[]>) => {
            state.orderSummaries = action.payload
        },
        setNumberOfOrders: (state, action: PayloadAction<number>) => {
            state.numberOfOrders = action.payload
        },
        setNumberOfOrdersStatus: (state, action: PayloadAction<StatusModel>) => {
            state.numberOfOrdersStatus = action.payload
        },
        setOrderDetail: (state, action: PayloadAction<OrderModel>) => {
            state.orderDetail[action.payload.id] = action.payload
        },
    }
})

export const { setOrderSummaries, setNumberOfOrders, setNumberOfOrdersStatus, setOrderDetail } = slice.actions
export default slice.reducer