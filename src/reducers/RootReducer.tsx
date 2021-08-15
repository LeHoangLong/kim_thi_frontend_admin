import { configureStore } from '@reduxjs/toolkit'
import ProductSummaryReducer from './ProductSummaryReducer'
import UserReducer from './UserReducer'
import ImageReducer from './ImageReducer'
import ErrorReducer from './ErrorReducer'
import ProductDetailReducer from './ProductDetailReducer'
import ProductCategoryReducer from './ProductCategoryReducer'
import TransportFeeReducer from './TransportFeeReducer'
// ...

export const store = configureStore({
  reducer: {
    users: UserReducer,
    productSummaries: ProductSummaryReducer,
    images: ImageReducer,
    errors: ErrorReducer,
    productCategories: ProductCategoryReducer,
    productDetails: ProductDetailReducer,
    transportFees: TransportFeeReducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch