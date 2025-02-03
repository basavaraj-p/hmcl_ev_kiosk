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
import { useState, useEffect } from "react";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import {
  parse,
  format,
  addMinutes,
  isBefore,
  isEqual,
  startOfDay,
  isAfter,
} from "date-fns";
// import "react-date-range/dist/styles.css"; // main css file
// import "react-date-range/dist/theme/default.css"; // theme css file
import "../../style/dateRangePicker.css";
import { DateRangePicker } from "react-date-range";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CustomCheckboxField from "./CustomCheckboxField";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import Sweetalert from "../Special Components/Sweetalert";
import { useSelector } from "react-redux";
import {
  date_range_style,
  chip_style,
  form_control_header,
  grid_style,
  select_style,
  menu_item_style,
  getUniqueValues,
  filterAssetDataByZones,
  getDateRangeString,
  getShiftRangeString,
  getNumberString,
  isDateValid,
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

const ShiftSchedulerCard = ({ setTableRefresh, tableRefresh }) => {
  const [assetIdData, setAssetIdData] = useState([]);
  const [zones, setZones] = useState([3.1]);
  const [shifts, setShifts] = useState([
    {
      shiftid: 1,
      shiftname: "Shift - A",
      shiftfrom: "01:00:01Z",
      shiftto: "09:30:00Z",
    },
  ]);
  const [localDateRange, setLocalDateRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection",
    },
  ]);
  const [localZone, setLocalZone] = useState([zones[0]]);
  const [localShift, setLocalShift] = useState([shifts[0].shiftname]);
  const [screenSize, setScreenSize] = useState(
    Math.round(window.devicePixelRatio * 100)
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const adid = useSelector((state) => state.adid.adid);
  // console.log("adid : ", adid);

  // console.log("localZone : ", localZone);
  // console.log("machines : ", machines);
  // console.log("localShift : ", localShift);
  // console.log("startTime : ", startTime);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/v1/sop-cycletime/data"
        );
        const response2 = await axios.get(
          "http://localhost:7000/api/v1/sop-shifts/shifts"
        );
        const [machineMap, zoneArray] = getUniqueValues(response.data.data);
        setZones(zoneArray);
        // setLocalZone(currentZone);
        setShifts(response2.data.rowData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(Math.round(window.devicePixelRatio * 100));
    };

    // Add the event listener for resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleClose = () => {
    setShowCalendar(false);
  };

  const handleDateSelection = (value) => {
    setLocalDateRange([value.selection]);
  };

  const handleChangeZone = (event) => {
    const newValue = event.target.value;
    if (newValue.includes("all")) {
      setLocalZone(["all"]);
    } else {
      setLocalZone(newValue.filter((v) => v !== "all"));
    }
  };

  const handleChangeShift = (event) => {
    const newValue = event.target.value;
    if (newValue.includes("all")) {
      setLocalShift(["all"]);
    } else {
      setLocalShift(newValue.filter((v) => v !== "all"));
    }
  };

  const handleDeleteZone = (value) => {
    const newValue = localZone.filter((item) => item !== value);
    setLocalZone(newValue);
  };

  const handleDeleteShift = (value) => {
    const newValue = localShift.filter((item) => item !== value);
    setLocalShift(newValue);
  };

  const handleSubmit = async () => {
    // Update Redux state only when Submit is clicked
    // console.log("localDateRange : ", localDateRange);
    // console.log("localZone : ", localZone);
    // console.log("localShift : ", localShift);

    if (localShift.length === 0 || localZone.length === 0) {
      Sweetalert(
        "Error",
        "You need to enter atleast one zone and shift to schedule a shift",
        "error",
        "OK",
        false
      );
      return;
    }

    if (isDateValid(localDateRange[0].startDate, localDateRange[0].endDate)) {
      Sweetalert(
        "Error",
        "You cannot schedule a shift for today or any day before",
        "error",
        "OK",
        false
      );
      return;
    }

    const result = await existingSchedules();
    // console.log("result : ", result);
    // console.log("result : ", getDateRangeString(result.ExistingDates));
    // console.log("result : ", getShiftRangeString(result.ExistingShifts));

    if (result.DateExists === 1) {
      // console.log("Schedule exists");
      Sweetalert(
        "ERROR",
        `Schedule exists from ${getDateRangeString(
          result.ExistingDates
        )} for Shifts ${getShiftRangeString(
          result.ExistingShifts
        )} at Zones ${getNumberString(result.ExistingZones)}`,
        "error",
        "OK",
        false
      );
    } else {
      Sweetalert(
        "Success",
        "Shifts scheduled successfully!",
        "success",
        "OK",
        false
      );
      await scheduleShift().then(() => {
        setTableRefresh(!tableRefresh);
      });
      await updateShiftHistory();
    }
  };

  const scheduleShift = async () => {
    // if (!editingRow) return;

    try {
      await axios.post(
        "http://localhost:7000/api/v1/sop-shifts/schedule-shifts",
        {
          dateRange: localDateRange,
          zone: localZone,
          shift: localShift,
        }
      );
      // .then(() => console.log("success"))
      // .catch((err) => console.error(err));
    } catch (error) {
      console.error("Error scheduling shifts:", error);
    }
  };

  const existingSchedules = async () => {
    // if (!editingRow) return;

    try {
      const response = await axios.post(
        "http://localhost:7000/api/v1/sop-shifts/schedule-shifts-existing",
        {
          dateRange: localDateRange,
          zones: localZone,
          shifts: localShift,
        }
      );
      // .then(() => console.log("success"))
      // .catch((err) => console.error(err));
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const updateShiftHistory = async () => {
    // if (!editingRow) return;

    try {
      const response = await axios.post(
        "http://localhost:7000/api/v1/sop-shifts-history/create-shift-history",
        {
          adid: adid,
          dateRange: localDateRange,
          zones: localZone,
          shifts: localShift,
        }
      );
      // .then(() => console.log("success"))
      // .catch((err) => console.error(err));
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const handleClear = () => {
    // Reset local state
    setLocalShift([]);
    setLocalZone([]);
    setLocalDateRange([
      {
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
        key: "selection",
      },
    ]);
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
          width: screenSize < 150 ? "60%" : "auto",
          background: "rgba(15, 18, 59, 0.2)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
        }}
      >
        <Grid container spacing={1}>
          {/* Date range */}
          <Grid item xs={4} style={grid_style}>
            <FormControl style={{ width: "15.5rem" }}>
              <div style={form_control_header(colors, fonts)}>Calendar</div>
              <OutlinedInput
                value={`${format(
                  localDateRange[0].startDate,
                  "dd-MM-yyyy"
                )} - ${format(localDateRange[0].endDate, "dd-MM-yyyy")}`}
                endAdornment={
                  <IconButton onClick={toggleCalendar}>
                    <CalendarMonthIcon
                      fontSize="small"
                      style={{ color: colors.info.main }}
                    />
                  </IconButton>
                }
                sx={date_range_style(colors, fonts)}
              />
            </FormControl>
          </Grid>
          {/* Zones */}
          <Grid item xs={4} style={grid_style}>
            <FormControl style={{ width: "auto", minWidth: "15rem" }}>
              <div style={form_control_header(colors, fonts)}>Zone</div>
              <Select
                value={localZone}
                onChange={handleChangeZone}
                size="small"
                multiple
                input={<OutlinedInput id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <div
                        key={value}
                        onMouseDown={(event) => event.stopPropagation()}
                      >
                        <Chip
                          label={value === "all" ? "All" : value}
                          onDelete={() => handleDeleteZone(value)}
                          sx={chip_style(colors, fonts)}
                        />
                      </div>
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
                sx={select_style(colors, fonts)}
              >
                <MenuItem value="all">All</MenuItem>
                {zones.map((item, index) => (
                  <MenuItem
                    value={item}
                    key={index}
                    style={menu_item_style(fonts)}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Shifts */}
          <Grid item xs={4} style={grid_style}>
            <FormControl style={{ width: "auto", minWidth: "15rem" }}>
              <div style={form_control_header(colors, fonts)}>Shifts</div>
              <Select
                value={localShift}
                onChange={handleChangeShift}
                size="small"
                multiple
                input={<OutlinedInput id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <div
                        key={value}
                        onMouseDown={(event) => event.stopPropagation()}
                      >
                        <Chip
                          label={value === "all" ? "All" : value}
                          onDelete={() => handleDeleteShift(value)}
                          sx={chip_style(colors, fonts)}
                        />
                      </div>
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
                sx={select_style(colors, fonts)}
              >
                <MenuItem value="all">All</MenuItem>
                {shifts.map((item, index) => (
                  <MenuItem
                    value={item.shiftname}
                    key={index}
                    style={menu_item_style(fonts)}
                  >
                    {item.shiftname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

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
                    Schedule Shifts
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
                  // endIcon={<CheckCircleIcon />}
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
                  // endIcon={<CancelIcon />}
                >
                  <CancelIcon />
                </Button>
              </Tooltip>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      <Dialog
        open={showCalendar}
        onClose={handleClose}
        fullWidth
        maxWidth={"sm"}
      >
        <DialogContent
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            overflow: "unset",
            background:
              "linear-gradient(180deg, #1a1f4d 0%, #23284f 50%, #2d3154 100%)",
          }}
        >
          <DateRangePicker
            onChange={(item) => handleDateSelection(item)}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1} // Render one calendar
            ranges={localDateRange}
            direction="horizontal"
          />
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            background:
              "linear-gradient(180deg, #1a1f4d 0%, #23284f 50%, #2d3154 100%)",
          }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            style={{
              ...fonts.fontStyle7,
              color: colors.white.main,
            }}
          >
            <CheckCircleIcon />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShiftSchedulerCard;
