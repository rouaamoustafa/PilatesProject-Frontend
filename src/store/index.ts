import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import authReducer from './slices/authSlice'
import guestCartReducer from './slices/guestCartSlice'
import { apiSlice } from './api/apiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    guestCart: guestCartReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: gDM => gDM().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
