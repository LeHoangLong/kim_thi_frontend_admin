import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorModel } from "../models/ErrorModel";
import { ErrorState } from "../states/ErrorState";
const update = require('update-immutable').default

const initialState : ErrorState = {
    cleared: [],
    active: [],
}

const slice = createSlice({
    name: "error",
    initialState,
    reducers: {
        push: (state, action: PayloadAction<ErrorModel>) => {
            state = update(state, {
                active: {
                    $push: [action.payload]
                }
            })
        },
        pop: (state) => {
            if (state.active.length > 0) {
                state = update(state, {
                    active: {
                        $splice: [-1, 1]
                    },
                    lastError: {
                        $push: [state.active[state.active.length]]
                    }
                })
            }
        }

    }
})