import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  graphData: {
    bdMinutes: [{ monthAvg: 0, w1: 0, w2: 0, w3: 0, w4: 0 }],
    bdNumbers: [{ monthAvg: 0, w1: 0, w2: 0, w3: 0, w4: 0 }],
    upTimeVariable: [{ monthAvg: 0, w1: 0, w2: 0, w3: 0, w4: 0 }],
    upTimeConstant: 0,
    mttr: [{ monthAvg: 0, w1: 0, w2: 0, w3: 0, w4: 0 }],
    mtbf: [{ monthAvg: 0, w1: 0, w2: 0, w3: 0, w4: 0 }],
  },
  graphDetails: {
    month: "",
    zone: "",
    machine: "",
  },
  graphData2: {
    bdMinutes: [{ monthAvg: 0, w1: 0, w2: 0, w3: 0, w4: 0 }],
    bdNumbers: [{ monthAvg: 0, w1: 0, w2: 0, w3: 0, w4: 0 }],
    upTimeVariable: [{ monthAvg: 0, w1: 0, w2: 0, w3: 0, w4: 0 }],
    upTimeConstant: 0,
    mttr: [{ monthAvg: 0, w1: 0, w2: 0, w3: 0, w4: 0 }],
    mtbf: [{ monthAvg: 0, w1: 0, w2: 0, w3: 0, w4: 0 }],
  },
};

export const weeklyMaintenanceSlice = createSlice({
  name: "graphData",
  initialState,
  reducers: {
    setGraphData: (state, action) => {
      state.graphData = action.payload;
    },
    setGraphDetails: (state, action) => {
      state.graphDetails = action.payload;
    },
    setGraphData2: (state, action) => {
      state.graphData2 = action.payload;
    },
  },
});

export const { setGraphData, setGraphDetails, setGraphData2 } =
  weeklyMaintenanceSlice.actions;

export default weeklyMaintenanceSlice.reducer;
