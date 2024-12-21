import Cookies from "js-cookie";
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null, // Load user from cookie
    isAuthenticated: !!Cookies.get("user"), // Set auth status based on cookie existence
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      Cookies.set("user", JSON.stringify(action.payload), { expires: 7 }); // Store user in cookie for 7 days
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      Cookies.remove("user"); // Remove user from cookie
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setError } = authSlice.actions;
export default authSlice.reducer;
