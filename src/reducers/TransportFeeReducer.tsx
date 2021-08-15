import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PayloadActionFetchedModel } from "../models/PayloadActionFetchedModel";
import { PayloadActionUpdateModel } from "../models/PayloadActionUpdateModel";
import { EStatus, StatusModel } from "../models/StatusModel";
import { AreaTransportFee, AreaTransportSummary, DistanceBasedTransportFeeOrigin } from "../models/TransportFee";
import { TransportFeeState } from "../states/TransportFeeState";

const initialState : TransportFeeState = {
    origins: [],
    numberOfOrigins: -1,
    originsOperationStatus: {
        status: EStatus.INIT,
    },
    originsMapOperationStatus: {
        status: EStatus.INIT,
    },
    originsMap: {},
    feeDetails: {},
    feeSummaries: [],
    numberOfTransportFees: -1,
    feeSummariesOperationStatus: {
        status: EStatus.INIT,
    },
    feeDetailOperationStatus: {
        status: EStatus.INIT,
    }
}

const slice = createSlice({
    name: 'transport_fee', 
    initialState,
    reducers: {
        setOriginMapStatus: (state, action: PayloadAction<StatusModel>) => {
            state.originsMapOperationStatus = action.payload
        },
        setOriginStatusState: (state, action: PayloadAction<StatusModel>) => {
            state.originsOperationStatus = action.payload
        },
        setNumberOfOrigins: (state, action: PayloadAction<number>) => {
            state.numberOfOrigins = action.payload
        },
        insertOriginToMap: (state, action: PayloadAction<DistanceBasedTransportFeeOrigin>) => {
            state.originsMap[action.payload.id] = action.payload
        },
        insertOrigins: (state, action: PayloadActionFetchedModel<DistanceBasedTransportFeeOrigin>) => {
            let offset = action.payload.offset
            let maxIndex = offset + action.payload.objects.length
            if (maxIndex > state.origins.length) {
                for (let i = state.origins.length; i < maxIndex; i++) {
                    state.origins.push(null)
                }
            }
            for (let i = offset; i < maxIndex; i++) {
                state.origins[i] = action.payload.objects[i - offset]
            }

            for (let i = 0; i < action.payload.objects.length; i++) {
                state.originsMap[action.payload.objects[i].id] = action.payload.objects[i]
            }
        },
        createOrigin: (state, action: PayloadAction<DistanceBasedTransportFeeOrigin>) => {
            state.origins.splice(0, 0, action.payload)
            state.originsMap[action.payload.id] = action.payload
        },
        removeOriginByIndex: (state, action: PayloadAction<number>) => {
            state.numberOfOrigins -= 1
            state.origins.splice(action.payload, 1)
        },

        setTransportFeeSummaryStatus: (state, action: PayloadAction<StatusModel>) => {
            state.feeSummariesOperationStatus = action.payload
        },
        setTransportFeeDetailStatus: (state, action: PayloadAction<StatusModel>) => {
            state.feeDetailOperationStatus = action.payload
        },
        setNumberOfTransportFee: (state, action: PayloadAction<number>) => {
            state.numberOfTransportFees = action.payload
        },
        insertTransportFeeSummaries: (state, action: PayloadActionFetchedModel<AreaTransportSummary>) => {
            let offset = action.payload.offset
            let maxIndex = offset + action.payload.objects.length
            if (maxIndex > state.feeSummaries.length) {
                for (let i = state.feeSummaries.length; i < maxIndex; i++) {
                    state.feeSummaries.push(null)
                }
            }
            for (let i = offset; i < maxIndex; i++) {
                state.feeSummaries[i] = action.payload.objects[i - offset]
            }
        },
        updateTransportFee: (state, action: PayloadActionUpdateModel<number, AreaTransportFee>) => {
            let currentId = action.payload.current
            let index = state.feeSummaries.findIndex(e => e?.id === currentId)
            let newFeeDetail = action.payload.new
            if (index !== -1) {
                state.feeSummaries[index] = {
                    id: newFeeDetail.id,
                    name: newFeeDetail.name,
                    city: newFeeDetail.city,
                }
            }
            state.feeDetails[currentId] = newFeeDetail
        },
        createTransportFee: (state, action: PayloadAction<AreaTransportFee>) => {
            let newFeeDetail = action.payload
            state.feeDetails[newFeeDetail.id] = newFeeDetail
            state.feeSummaries.splice(0, 0, newFeeDetail)
        },
        removeTransportFeeById: (state, action: PayloadAction<number>) => {
            let index = state.feeSummaries.findIndex(e => e?.id === action.payload)
            if (index !== -1) {
                state.feeSummaries.splice(index, 1)
            }
            delete state.feeDetails[action.payload] 
        },
        insertTransportFeeDetail: (state, action: PayloadAction<AreaTransportFee>) => {
            state.feeDetails[action.payload.id] = action.payload
        }
    }
})

export default slice.reducer
export const {
    setOriginStatusState, 
    setNumberOfOrigins,
    insertOrigins,
    createOrigin,
    removeOriginByIndex,
    setTransportFeeSummaryStatus,
    setNumberOfTransportFee,
    insertTransportFeeSummaries,
    updateTransportFee,
    createTransportFee,
    removeTransportFeeById,
    insertTransportFeeDetail,
    setTransportFeeDetailStatus,
    insertOriginToMap,
    setOriginMapStatus,
} = slice.actions