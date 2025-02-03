import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shiftsHistory: [],
  shiftsBreaksHistory: [],
};

export const shiftsHistorySlice = createSlice({
  name: "shiftsHistory",
  initialState,
  reducers: {
    setShiftsHistory: (state, action) => {
      state.shiftsHistory = action.payload;
    },
    setShiftsBreaksHistory: (state, action) => {
      state.shiftsBreaksHistory = action.payload;
    },
  },
});

export const { setShiftsHistory, setShiftsBreaksHistory } =
  shiftsHistorySlice.actions;

export default shiftsHistorySlice.reducer;
