// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth"; // Import from auth.js

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
