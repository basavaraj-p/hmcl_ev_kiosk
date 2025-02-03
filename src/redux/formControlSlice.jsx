// formControlSlice.js
import { createSlice } from "@reduxjs/toolkit";
// import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";

const initialState = {
  currentMachine: [],
  currentZone: ["all"],
  dateRange: [
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection",
    },
  ],
};

const formControlSlice = createSlice({
  name: "formControl",
  initialState,
  reducers: {
    setCurrentMachine: (state, action) => {
      state.currentMachine = action.payload;
    },
    setCurrentZone: (state, action) => {
      state.currentZone = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
  },
});

const formControlSlice1 = createSlice({
  name: "formControl1",
  initialState,
  reducers: {
    setCurrentMachine1: (state, action) => {
      state.currentMachine = action.payload;
    },
    setCurrentZone1: (state, action) => {
      state.currentZone = action.payload;
    },
    setDateRange1: (state, action) => {
      state.dateRange = action.payload;
    },
    reset1: (state) => {
      return initialState; // Reset state to initialState
    },
  },
});

const formControlSlice2 = createSlice({
  name: "formControl2",
  initialState,
  reducers: {
    setCurrentMachine2: (state, action) => {
      state.currentMachine = action.payload;
    },
    setCurrentZone2: (state, action) => {
      state.currentZone = action.payload;
    },
    setDateRange2: (state, action) => {
      state.dateRange = action.payload;
    },
    reset2: (state) => {
      return initialState; // Reset state to initialState
    },
  },
});

const formControlSlice3 = createSlice({
  name: "formControl3",
  initialState,
  reducers: {
    setCurrentMachine3: (state, action) => {
      state.currentMachine = action.payload;
    },
    setCurrentZone3: (state, action) => {
      state.currentZone = action.payload;
    },
    setDateRange3: (state, action) => {
      state.dateRange = action.payload;
    },
    reset3: (state) => {
      return initialState; // Reset state to initialState
    },
  },
});

export const { setCurrentMachine, setCurrentZone, setDateRange } =
  formControlSlice.actions;
export const { setCurrentMachine1, setCurrentZone1, setDateRange1, reset1 } =
  formControlSlice1.actions;
export const { setCurrentMachine2, setCurrentZone2, setDateRange2, reset2 } =
  formControlSlice2.actions;
export const { setCurrentMachine3, setCurrentZone3, setDateRange3, reset3 } =
  formControlSlice3.actions;

export const FormControlSlice = formControlSlice.reducer;
export const FormControlSlice1 = formControlSlice1.reducer;
export const FormControlSlice2 = formControlSlice2.reducer;
export const FormControlSlice3 = formControlSlice3.reducer;
