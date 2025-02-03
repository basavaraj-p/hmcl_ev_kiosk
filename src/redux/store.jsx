// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import routesSlice from "./routesSlice";
import sidebarSlice from "./sidebarSlice";
import {
  FormControlSlice,
  FormControlSlice1,
  FormControlSlice2,
  FormControlSlice3,
} from "./formControlSlice";
import shiftsSlice from "./shiftsSlice";
import loginSlice from "./loginSlice";
import shiftsHistorySlice from "./shiftsHistorySlice";
import rejectionSlice from "./rejectionSlice";
import weeklyMaintenanceSlice from "./weeklyMaintenanceSlice";

const store = configureStore({
  reducer: {
    routes: routesSlice,
    sidebar: sidebarSlice,
    formControl: FormControlSlice,
    formControl1: FormControlSlice1,
    formControl2: FormControlSlice2,
    formControl3: FormControlSlice3,
    shifts: shiftsSlice,
    adid: loginSlice,
    shiftsHistory: shiftsHistorySlice,
    rejection: rejectionSlice,
    graphData: weeklyMaintenanceSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["routes.routes"],
      },
    }),
});

export default store;
