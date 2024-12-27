import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const loadersSlice = createSlice({
  name: 'loader',
  initialState: {
    loading: false,
  },
  reducers: {
    SetLoader: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { SetLoader } = loadersSlice.actions;
export default loadersSlice;