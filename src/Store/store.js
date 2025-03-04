import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../Slice/apiSlice';
import authReducer from '../Slice/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;