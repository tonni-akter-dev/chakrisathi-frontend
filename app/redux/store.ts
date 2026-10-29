import { configureStore } from '@reduxjs/toolkit'
import baseApi from './baseApi'
import { rootReducer } from './rootReducer'

const store = configureStore({
  reducer: rootReducer,
  middleware: defaultMiddleware => defaultMiddleware().concat(baseApi.middleware)
})

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
