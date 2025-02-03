import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  zone: "3.1",
  machine: "Insertion",
  assetid : 31010
};

export const rejectionSlice = createSlice({
  name: "rejection",
  initialState,
  reducers: {
    setGlobalZone: (state, action) => {
      state.zone = action.payload;
    },
    setGlobalMachine: (state, action) => {
      state.machine = action.payload;
    },
    setGlobalAssetid: (state, action) => {
      state.assetid = action.payload;
    },
  },
});

export const { setGlobalZone, setGlobalMachine, setGlobalAssetid } =
  rejectionSlice.actions;

export default rejectionSlice.reducer;
