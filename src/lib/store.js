// lib/store.js
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from './features/uiSlice';
import userReducer from "./features/authSlice";

const store = configureStore({
  reducer: {
    user: userReducer, // authSlice is now named "user"
    ui: uiReducer,
  },
});

export default store;