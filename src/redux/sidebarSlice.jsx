// src/redux/sidebarSlice.js
import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    isMinimized: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isMinimized = !state.isMinimized;
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
