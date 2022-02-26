import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageModel } from "../models/ImageModel";
import { EStatus } from "../models/StatusModel";
import { ImageState } from "../states/ImageState";

const initialState : ImageState = {
    images: [],
    status: {
        status: EStatus.INIT
    },
    numberOfImages: -1,
}

const slice = createSlice({
    name: "image",
    initialState,
    reducers: {
        clear(state) {
            state.images = []
            state.numberOfImages = -1
        },
        addImages(state, action: PayloadAction<ImageModel[]>) {
            state.images = [
                ...state.images,
                ...action.payload,
            ]
        },
        fetching(state) {
            state.status = {
                status: EStatus.IN_PROGRESS
            }
        },
        fetched(state, action: PayloadAction<ImageModel[]>) {
            state.status = {
                status: EStatus.IDLE
            }
            state.images = [
                ...state.images,
                ...action.payload,
            ]
        },
        creating(state) {
            state.status = {
                status: EStatus.IN_PROGRESS
            }
        },
        created(state, action: PayloadAction<ImageModel>) {
            state.status = {
                status: EStatus.IDLE
            }
            state.images = [
                ...state.images,
                action.payload,
            ]
        },
        setNumberOfImages(state, action: PayloadAction<number>) {
            state.numberOfImages = action.payload
        },
        error(state, action: PayloadAction<string>) {
            state.status = {
                status: EStatus.ERROR,
                message: action.payload,
            }
        }
    }
})

export const { clear, addImages, fetching, fetched, creating, created, setNumberOfImages, error } = slice.actions
export default slice.reducer
