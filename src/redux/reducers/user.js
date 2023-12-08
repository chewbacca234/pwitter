import { createSlice } from '@reduxjs/toolkit';

const initialState = { token: null, username: null, firstName: null };

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.firstName = action.payload.firstName;
    },
    logout: state => {
      state.token = null;
      state.username = null;
      state.firstName = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
