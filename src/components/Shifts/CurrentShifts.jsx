import React,{useState} from "react";
import Header from "../Header/Header";
import fonts from "../../style/fonts";
import colors from "../../style/colors";
import { Card, Grid, Tooltip, Typography, IconButton } from "@mui/material";
import ShiftScheduler from "./ShiftScheduler";
import ShiftBreaks from "./ShiftBreaks";
import ShiftConfiguration from "./ShiftConfiguration";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";

const CurrentShifts = () => {
  const shifts = useSelector((state) => state.shifts.shifts);
    // console.log("shifts : ", shifts[0].shiftname);

  const [showDialog, SetShowDialog] = useState(false);

  function handleShowDialog() {
    
    SetShowDialog(!showDialog);
  }

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
          Shift Scheduler
        </div>

        <ShiftScheduler />
      </Card>

      <Grid
        container
        spacing={2}
        // sx={{ height: "10rem", backgroundColor: "lightgray" }}
      >
        <Grid item xs={5}>
          <Card
            style={{
              background: "transparent",
              padding: "0.5% 0.5% 0.5% 0.5%",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
              borderRadius: "12px",
              margin: "5px 0 10px 0",
              width: "auto",
              minHeight: "15rem",
              // minHeight:"42vh"
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
              Shift Configuration
            </div>

            <ShiftConfiguration />
          </Card>
        </Grid>

        <Grid item xs={7}>
          <Card
            style={{
              background: "transparent",
              padding: "0.5% 0.5% 0.5% 0.5%",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
              borderRadius: "12px",
              margin: "5px 0 10px 0",
              width: "auto",
              minHeight: "15rem",
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
              Shift Breaks for {shifts[0].shiftname}
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
                    Add Break
                  </Typography>
                }
                placement="bottom"
              >
                <IconButton onClick={handleShowDialog}>
                  <AddIcon
                    fontSize="small"
                    style={{ marginLeft: "10px", color: "whitesmoke" }} // Adds space between the text and icon
                  />
                </IconButton>
              </Tooltip>
            </div>

            <ShiftBreaks
              showDialog={showDialog}
              handleShowDialog={handleShowDialog}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CurrentShifts;
