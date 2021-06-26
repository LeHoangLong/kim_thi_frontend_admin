import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductSummaryModel } from "../models/ProductSummaryModel";
import { EStatus } from "../models/StatusModel";
import { ProductSummaryState } from "../states/ProductSummaryState";

const initialState : ProductSummaryState = {
    summaries: [],
    status: {
        status: EStatus.INIT,
    },
    numberOfProducts: -1,
} 

const slice = createSlice({
    name: "product",
    initialState,
    reducers: {
        clear: (state) => {
            state.summaries = []
            state.numberOfProducts = -1
        },
        fetching: (state) => {
            state.status = {
                status: EStatus.IN_PROGRESS
            }
        },
        fetched: (state, action : PayloadAction<ProductSummaryModel[]>) => {
            state.summaries = state.summaries.concat(action.payload)
            state.status = {
                status: EStatus.IDLE
            }
        },
        error: (state, payload: PayloadAction<string>) => {
            state.status = {
                status: EStatus.ERROR,
                message: payload.payload,
            }
        },
        setNumberOfProducts: (state, action: PayloadAction<number>) => {
            state.numberOfProducts = action.payload
        }
    }
})

export const { clear, fetching, fetched, error, setNumberOfProducts } = slice.actions
export default slice.reducer