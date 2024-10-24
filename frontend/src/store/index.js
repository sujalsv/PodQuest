// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth"; // Import from auth.js
import playerReducer from "./player";

const store = configureStore({
  reducer: {
    auth: authReducer,
    player: playerReducer,
  },
});

export default store;
