import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false }, // Use the initialState defined above
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true; 
      state.user = action.payload;
      localStorage.setItem("auth", JSON.stringify(state));
    },
    logoutSuccess: (state) => {
      state.isLoggedIn = false; 
      state.user = null; 
      localStorage.removeItem("auth");
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions; // Export actions
export default authSlice.reducer; // Export the reducer

export const authActions = authSlice.actions; // Export authActions for potential use in components
