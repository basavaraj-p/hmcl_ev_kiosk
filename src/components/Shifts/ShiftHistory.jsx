import React, { useState } from "react";
import Header from "../Header/Header";
import fonts from "../../style/fonts";
import colors from "../../style/colors";
import { Card, Grid, Tooltip, Typography, IconButton } from "@mui/material";
import ShiftScheduleHistory from "./ShiftScheduleHistory";
import ShiftBreakHistory from "./ShiftBreakHistory";
import { useSelector, useDispatch } from "react-redux";

const ShiftHistory = () => {
  return (
    <div>
      <Header />

      <Card
        style={{
          background: "transparent",
          padding: "0.5% 0.5% 0.5% 0.5%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
          borderRadius: "12px",
          margin: "5px 0 10px 0",
          width: "auto",
        }}
      >
        <div
          style={{
            color: "whitesmoke",
            fontFamily: fonts.fontStyle9["font-family"],
            fontStyle: fonts.fontStyle9["font-style"],
            fontWeight: fonts.fontStyle9["font-weight"],
            fontSize: "20px",
            padding: "0 0 1% 2%",
            // display: "flex",
            // justifyContent: "space-between",
            // alignItems: "center", // Ensures text and icons are centered vertically
            // flexDirection: "row",
          }}
        >
          Shift Schedule History
        </div>

        <ShiftScheduleHistory />
      </Card>

      <Card
        style={{
          background: "transparent",
          padding: "0.5% 0.5% 0.5% 0.5%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
          borderRadius: "12px",
          margin: "5px 0 10px 0",
          width: "auto",
        }}
      >
        <div
          style={{
            color: "whitesmoke",
            fontFamily: fonts.fontStyle9["font-family"],
            fontStyle: fonts.fontStyle9["font-style"],
            fontWeight: fonts.fontStyle9["font-weight"],
            fontSize: "20px",
            padding: "0 0 1% 2%",
            // display: "flex",
            // justifyContent: "space-between",
            // alignItems: "center", // Ensures text and icons are centered vertically
            // flexDirection: "row",
          }}
        >
          Shift Breaks History
        </div>

        <ShiftBreakHistory />
      </Card>
    </div>
  );
};

export default ShiftHistory;
