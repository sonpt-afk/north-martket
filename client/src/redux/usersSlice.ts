import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    user: {} as object | null,
  },
  reducers: {
    SetUser: (state, action: PayloadAction<object | null>) => {
      state.user = action.payload;
    },
  },
});

export const { SetUser } = usersSlice.actions;
export default usersSlice;