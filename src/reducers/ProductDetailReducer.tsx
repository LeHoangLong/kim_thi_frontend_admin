import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorModel } from "../models/ErrorModel";
import { ProductDetailModel } from "../models/ProductDetailModel";
import { EStatus } from "../models/StatusModel";
import { ProductDetailState } from "../states/ProductDetailState";
import { PayloadActionUpdateModel } from "../models/PayloadActionUpdateModel";

const initialState : ProductDetailState = {
    products: [],
    status: {

    },
}

const slice = createSlice({
    name: "product_detail",
    initialState,
    reducers: {
        fetchingProductDetail(state, action: PayloadAction<number>) {
            state.status[action.payload] = {
                status: EStatus.IN_PROGRESS,
            }
        },
        fetchedProductDetail(state, action: PayloadAction<ProductDetailModel>) {
            if (action.payload.id !== null) {
                state.status[action.payload.id] = {
                    status: EStatus.IDLE,
                }
                let index = state.products.findIndex((e) => e.id === action.payload.id)
                if (index === -1) {
                    state.products.push(action.payload)
                } else {
                    state.products[index] = action.payload
                }
            }
        },
        replaceProductDetailById(state, action: PayloadActionUpdateModel<number, ProductDetailModel>) {
            let index = state.products.findIndex(e => e.id === action.payload.current)
            if (index !== -1) {
                state.products = state.products.splice(index, 1, action.payload.new)
            }
        },
        errorProductDetail(state, action: PayloadAction<string>) {
            state.status = {
                status: EStatus.ERROR,
                message: action.payload,
            }
        }
    }
})

export default slice.reducer
export const { fetchingProductDetail, fetchedProductDetail, errorProductDetail, replaceProductDetailById } = slice.actions
