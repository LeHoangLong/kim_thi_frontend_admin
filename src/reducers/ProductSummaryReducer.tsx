import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PayloadActionFetchedModel } from "../models/PayloadActionFetchedModel";
import { PayloadActionUpdateModel } from "../models/PayloadActionUpdateModel";
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
        fetched: (state, action : PayloadActionFetchedModel<ProductSummaryModel>) => {
            let outputLength = action.payload.offset + action.payload.objects.length
            for (let i = state.summaries.length; i < outputLength; i++) {
                state.summaries.push(undefined)
            }
            for (let i = action.payload.offset; i < outputLength; i++) {
                state.summaries[i] = action.payload.objects[i - action.payload.offset]
            }
            state.status = {
                status: EStatus.IDLE
            }
        },
        created: (state, action : PayloadAction<ProductSummaryModel>) => {
            state.summaries.unshift(action.payload)
            state.status = {
                status: EStatus.IDLE
            }
        },
        replace: (state, action: PayloadActionUpdateModel<number, ProductSummaryModel>) => {
            let currentSummaryId = action.payload.current
            let newSummary = action.payload.new
            let index = state.summaries.findIndex(e => e?.id === currentSummaryId)
            state.summaries[index] = newSummary
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

export const { clear, replace, fetching, fetched, created, error, setNumberOfProducts } = slice.actions
export default slice.reducer