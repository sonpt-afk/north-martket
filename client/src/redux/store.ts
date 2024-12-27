import { configureStore } from '@reduxjs/toolkit'
import loadersSlice from './loadersSlice'
import usersSlice from './loadersSlice'

export const store = configureStore({
  reducer: {
    loaders: loadersSlice.reducer,
    users: usersSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch