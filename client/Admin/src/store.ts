import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./features/dashboard/dashboardSlice";
import darkModeReducer from "./features/darkMode/darkModeSlice";
import authReducer  from "./hooks/AuthSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    darkMode: darkModeReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
