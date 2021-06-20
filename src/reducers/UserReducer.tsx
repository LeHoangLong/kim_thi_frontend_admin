import { UserState } from "../states/UserState";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserModel } from "../models/UserModel";
import { EStatus } from "../models/StatusModel";

const initialState: UserState = {
    user: null,
    status: {
        status: EStatus.INIT,
    }
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        fetchingUser: (state) => {
            state.status = {
                status: EStatus.IN_PROGRESS,
            }
        },
        loggingIn: (state) => {
            state.status = {
                status: EStatus.IN_PROGRESS,
            }
        },
        error: (state, payload: PayloadAction<string>) => {
            state.status = {
                status: EStatus.ERROR,
                message: payload.payload,
            }
        },
        loggedIn: (state, action: PayloadAction<UserModel>) => {
            state.user = action.payload
            state.status = {
                status: EStatus.IDLE,
            }
        },
        loggedOut: (state) => {
            state.user = null
            state.status = {
                status: EStatus.IDLE,
            }
        },
    }
});

export const { loggingIn, error, loggedIn, loggedOut, fetchingUser } = userSlice.actions
export default userSlice.reducer