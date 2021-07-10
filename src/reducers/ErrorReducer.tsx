import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 } from "uuid";
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
            if (action.payload.id === undefined) {
                action.payload.id = v4()
            }
            state = update(state, {
                active: {
                    $push: [action.payload]
                }
            })
            return state
        },
        pop: (state) => {
            if (state.active.length > 0) {
                state = update(state, {
                    active: {
                        $splice: [[-1, 1]]
                    },
                    lastError: {
                        $push: [state.active[state.active.length]]
                    }
                })
            }
            return state
        }

    }
})

export const { push, pop } = slice.actions
export default slice.reducer