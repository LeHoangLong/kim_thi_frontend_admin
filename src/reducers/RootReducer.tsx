import { configureStore } from '@reduxjs/toolkit'
import ProductSummaryReducer from './ProductSummaryReducer'
import UserReducer from './UserReducer'
// ...

export const store = configureStore({
  reducer: {
    users: UserReducer,
    productSummaries: ProductSummaryReducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch