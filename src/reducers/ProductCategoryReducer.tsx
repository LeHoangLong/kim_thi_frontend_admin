import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductCategoryModel } from "../models/ProductCategoryModel";
import { EStatus, StatusModel } from "../models/StatusModel";
import { ProductCategoryState } from "../states/ProductCategoryState";

const initialState : ProductCategoryState = {
    categories: [],
    status: {
        status: EStatus.INIT,
    },
    numberOfCategories: -1,
}

const slice = createSlice({
    name: "product_category",
    initialState,
    reducers: {
        clearCategories(state) {
            state.categories = []
            state.numberOfCategories = -1
        },
        updateCategoryStateStatus: (state, action: PayloadAction<StatusModel>) => {
            state.status = action.payload
        },
        setNumberOfCategories: (state, action: PayloadAction<number>) => {
            state.numberOfCategories = action.payload
        },
        addCategories: (state, action: PayloadAction<ProductCategoryModel[]>) => {
            state.categories = state.categories.concat(action.payload)
        },
        deleteCategory: (state, action: PayloadAction<ProductCategoryModel>) => {
            let index = state.categories.findIndex(e => e.category === action.payload.category)
            if (index !== -1) {
                state.categories.splice(index, 1)
            }
        }
    },
})

export default slice.reducer
export const { clearCategories, updateCategoryStateStatus, setNumberOfCategories, addCategories, deleteCategory } = slice.actions