import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shifts: [{ shiftname: "Shift - A", shiftid: 1 }],
};

export const shiftsSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    setShifts: (state, action) => {
      state.shifts = action.payload;
    },
  },
});

export const { setShifts } = shiftsSlice.actions;

export default shiftsSlice.reducer;
