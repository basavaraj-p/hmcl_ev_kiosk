import React from "react";
import {
  Card,
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Chip,
  Box,
  OutlinedInput,
  IconButton,
  MenuItem,
  FormControl,
  Select,
  Tooltip,
  Typography,
  Checkbox,
} from "@mui/material";
import fonts from "../../style/fonts";
import colors from "../../style/colors";
import { useState, useEffect, useMemo, useCallback } from "react";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import { parse, format, addMinutes, isBefore, isEqual } from "date-fns";
import "../../style/dateRangePicker.css";
import { DateRangePicker } from "react-date-range";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import Sweetalert from "../Special Components/Sweetalert";
import { useSelector, useDispatch } from "react-redux";
import {
  setGraphData,
  setGraphData2,
  setGraphDetails,
} from "../../redux/weeklyMaintenanceSlice";
import {
  date_range_style,
  chip_style,
  form_control_header,
  grid_style,
  select_style,
  menu_item_style,
  getUniqueValues,
  filterAssetDataByZones,
} from "./helperFunctions";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const WMConsoleCard = () => {
  const [assetIdData, setAssetIdData] = useState([]);
  const zones = useMemo(() => ["3.1", "3.2", "4"], []);
  const [localZone, setLocalZone] = useState("");
  const [machines, setMachines] = useState([]);
  const [localMachine, setLocalMachine] = useState("");
  const months = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );
  const [localMonth, setLocalMonth] = useState("");
  const years = useMemo(() => [2025, 2024], []);
  const [localYear, setLocalYear] = useState(new Date().getFullYear());
  const [screenSize, setScreenSize] = useState(
    Math.round(window.devicePixelRatio * 100)
  );
  // const adid = useSelector((state) => state.adid.adid);
  const dispatch = useDispatch();

  // console.log("Console Data :: ", {
  //   localYear,
  //   localMonth,
  //   localZone,
  //   localMachine,
  // });

  // Set current month when component mounts
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    // console.log("currentYear : ", currentYear);

    setLocalMonth(currentMonth);
    setLocalYear(currentYear);
  }, [months, years]);

  // Fetch assets and update assetIdData
  useEffect(() => {
    const getAssets = async () => {
      try {
        const response = await fetchAssets();
        // console.log("response : ", response.data);

        if (response?.data) {
          setAssetIdData(response.data.rowData);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    getAssets();
  }, []);

  // Update machines when zone changes
  useEffect(() => {
    if (localZone && assetIdData.length > 0) {
      const filteredMachines = assetIdData
        .filter((asset) => asset.zone.toString() === localZone)
        .map((asset) => asset.machinename);
      setMachines(Array.from(new Set(filteredMachines))); // Remove duplicates
      setLocalMachine(""); // Reset machine selection when zone changes
    }
  }, [localZone, assetIdData]);

  async function fetchAssets() {
    try {
      const result = await axios.get(
        "https://hmcl-backend.onrender.com/api/v1/sop-rejection-rework/fetch-assets"
      );
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async function fetchDataZoneWise() {
    try {
      const result = await axios.post(
        "https://hmcl-backend.onrender.com/api/v1/sop-weeklymaintenance/zone",
        {
          month: localMonth,
          zone: localZone,
          year: localYear,
        }
      );
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  // async function fetchDataMachineWise() {
  //   try {
  //     const result = await axios.post(
  //       "https://hmcl-backend.onrender.com/api/v1/sop-weeklymaintenance/zone-machine",
  //       {
  //         month: localMonth,
  //         zone: localZone,
  //         machine: localMachine,
  //         year: localYear,
  //       }
  //     );
  //     return result;
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     throw error;
  //   }
  // }

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(Math.round(window.devicePixelRatio * 100));
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChangeZone = useCallback((event) => {
    setLocalZone(event.target.value);
  }, []);

  // const handleChangeMachine = useCallback((event) => {
  //   setLocalMachine(event.target.value);
  // }, []);

  const handleChangeMonth = useCallback((event) => {
    setLocalMonth(event.target.value);
  }, []);

  const handleChangeYear = useCallback((event) => {
    setLocalYear(event.target.value);
  }, []);

  const handleSubmit = async () => {
    try {
      const result = await fetchDataZoneWise();
      // const result2 = await fetchDataMachineWise();

      // Dispatch graph details first
      const graphDetails = {
        month: localMonth,
        zone: localZone,
        machine: localMachine,
      };
      dispatch(setGraphDetails(graphDetails));

      // Then dispatch graph data if result exists
      if (result?.data) {
        dispatch(setGraphData(result.data));
      }

      // if (result2?.data) {
      //   dispatch(setGraphData2(result2.data));
      // }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      // Handle error appropriately
    }
  };

  const handleClear = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    setLocalYear(currentYear);
    setLocalMonth(currentMonth); // Reset to current month
    setLocalZone("");
    // setLocalMachine("");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          borderRadius: "15px",
          width: screenSize < 150 ? "75%" : "auto",
          background: "rgba(15, 18, 59, 0.2)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
        }}
      >
        <Grid container spacing={1}>
          {/* Years */}
          <Grid item xs={4} style={grid_style}>
            <FormControl style={{ width: "auto", minWidth: "15rem" }}>
              <div style={form_control_header(colors, fonts)}>Years</div>
              <Select
                value={localYear}
                onChange={handleChangeYear}
                size="small"
                MenuProps={MenuProps}
                sx={select_style(colors, fonts)}
              >
                {years.map((year, index) => (
                  <MenuItem
                    value={year}
                    key={index}
                    style={menu_item_style(fonts)}
                  >
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Months */}
          <Grid item xs={4} style={grid_style}>
            <FormControl style={{ width: "auto", minWidth: "15rem" }}>
              <div style={form_control_header(colors, fonts)}>Months</div>
              <Select
                value={localMonth}
                onChange={handleChangeMonth}
                size="small"
                MenuProps={MenuProps}
                sx={select_style(colors, fonts)}
              >
                {months.map((month, index) => (
                  <MenuItem
                    value={index}
                    key={index}
                    style={menu_item_style(fonts)}
                  >
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Zones */}
          <Grid item xs={4} style={grid_style}>
            <FormControl style={{ width: "auto", minWidth: "15rem" }}>
              <div style={form_control_header(colors, fonts)}>Zones*</div>
              <Select
                value={localZone}
                onChange={handleChangeZone}
                size="small"
                MenuProps={MenuProps}
                sx={select_style(colors, fonts)}
              >
                {zones.map((zone, index) => (
                  <MenuItem
                    value={zone}
                    key={index}
                    style={menu_item_style(fonts)}
                  >
                    {zone}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Machines */}
          {/* <Grid item xs={3} style={grid_style}>
            <FormControl style={{ width: "auto", minWidth: "15rem" }}>
              <div style={form_control_header(colors, fonts)}>Machines</div>
              <Select
                value={localMachine}
                onChange={handleChangeMachine}
                size="small"
                MenuProps={MenuProps}
                sx={select_style(colors, fonts)}
                disabled={!localZone} // Disable if no zone is selected
              >
                {machines.map((machine, index) => (
                  <MenuItem
                    value={machine}
                    key={index}
                    style={menu_item_style(fonts)}
                  >
                    {machine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}
          {/* Action Buttons */}
          <Grid item xs={12} style={grid_style}>
            <FormControl
              style={{
                width: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginTop: "1.5rem",
              }}
            >
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
                    Fetch MTTR and MTBF?
                  </Typography>
                }
                placement="bottom"
              >
                <Button
                  variant="contained"
                  size="small"
                  style={{
                    margin: "2%",
                    height: "2rem",
                    backgroundColor: colors.info.main,
                  }}
                  onClick={handleSubmit}
                >
                  <CheckCircleIcon />
                </Button>
              </Tooltip>
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
                    Clear the console
                  </Typography>
                }
                placement="bottom"
              >
                <Button
                  variant="contained"
                  size="small"
                  style={{
                    margin: "2%",
                    height: "2rem",
                    backgroundColor: colors.error.main,
                  }}
                  onClick={handleClear}
                >
                  <CancelIcon />
                </Button>
              </Tooltip>
            </FormControl>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default WMConsoleCard;
