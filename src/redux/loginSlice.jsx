import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adid: sessionStorage.getItem("adid"),
};

export const loginSlice = createSlice({
  name: "adid",
  initialState,
  reducers: {
    setGlobalAdid: (state, action) => {
      state.adid = action.payload;
    },
  },
});

export const { setGlobalAdid } = loginSlice.actions;

export default loginSlice.reducer;
