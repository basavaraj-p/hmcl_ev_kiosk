import React from "react";
import { useState, useEffect } from "react";
import Header from "../Header/Header";
import axios from "axios";
import ZoneCycleTimeTable from "./ZoneCycleTimeTable";
import ZoneCycleTimeHistoryTable from "./ZoneCycleTimeHistoryTable";
import fonts from "../../style/fonts";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { IconButton, Tooltip, Typography, Card, Button } from "@mui/material";
import colors from "../../style/colors";

const LinesAndMachines = () => {
  const [showFilter, SetShowFilter] = useState(false);

  function handleShowFilter() {
    SetShowFilter(!showFilter);
  }

  return (
    <div>
      <Header />
      <Card
        style={{
          // background: "blue",
          background: "transparent",
          padding: "0.5% 0.5% 0.5% 0.5%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
          borderRadius: "12px",
          margin: "5px 0 10px 0",
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
          }}
        >
          Zone Cycle Time
        </div>
        <ZoneCycleTimeTable />
      </Card>
      <Card
        style={{
          // background: "blue",
          background: "transparent",
          padding: "0.5% 0.5% 0.5% 0.5%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
          borderRadius: "12px",
          margin: "5px 0 10px 0",
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Ensures text and icons are centered vertically
            flexDirection: "row",
          }}
        >
          Zone Cycle Time History
          {!showFilter ? (
            <Tooltip
              title={
                <Typography
                  sx={{
                    fontFamily: fonts.fontStyle7["font-family"],
                    fontStyle: fonts.fontStyle7["font-style"],
                    fontWeight: fonts.fontStyle7["font-weight"],
                    fontSize: "0.9rem",
                  }}
                >
                  Show Filter
                </Typography>
              }
              placement="bottom"
            >
              <Button
                onClick={handleShowFilter}
                variant="contained"
                size="small"
                endIcon={
                  <FilterAltIcon
                    fontSize="small"
                    style={{ color: "whitesmoke" }} // Adds space between the text and icon
                  />
                }
                style={{
                  backgroundColor: colors.info.main,
                  fontFamily: fonts.fontStyle7["font-family"],
                  fontStyle: fonts.fontStyle7["font-style"],
                  fontWeight: fonts.fontStyle7["font-weight"],
                }}
              >
                Open
              </Button>
            </Tooltip>
          ) : (
            <Tooltip
              title={
                <Typography
                  sx={{
                    fontFamily: fonts.fontStyle7["font-family"],
                    fontStyle: fonts.fontStyle7["font-style"],
                    fontWeight: fonts.fontStyle7["font-weight"],
                    fontSize: "0.9rem",
                  }}
                >
                  Hide Filter
                </Typography>
              }
              placement="bottom"
            >
              <Button
                onClick={handleShowFilter}
                variant="contained"
                size="small"
                endIcon={
                  <FilterAltOffIcon
                    fontSize="small"
                    style={{ color: "whitesmoke" }} // Adds space between the text and icon
                  />
                }
                style={{
                  backgroundColor: colors.error.main,
                  fontFamily: fonts.fontStyle7["font-family"],
                  fontStyle: fonts.fontStyle7["font-style"],
                  fontWeight: fonts.fontStyle7["font-weight"],
                }}
              >
                Close
              </Button>
            </Tooltip>
          )}
        </div>

        <ZoneCycleTimeHistoryTable showFilter={showFilter} />
      </Card>
    </div>
  );
};

export default LinesAndMachines;
