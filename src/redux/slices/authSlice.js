import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('adminToken'),
  isAuthenticated: !!localStorage.getItem('adminToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('adminToken', action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('adminToken');
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer; 