import React, { useState, useEffect } from "react";
import {
  Card,
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
} from "@mui/material";
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
import { useDispatch } from "react-redux";
import {
  setCurrentMachine2,
  setCurrentZone2,
  setDateRange2,
  reset2,
} from "../../redux/formControlSlice";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../../style/dateRangePicker.css";
import { DateRangePicker } from "react-date-range";
import { addDays, format } from "date-fns";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import axios from "axios";
import colors from "../../style/colors";
import tripleLinearGradient from "../../style/tripleLinearGradient";
import fonts from "../../style/fonts";
import { useSelector } from "react-redux";
import "./FilterCard.css";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

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

const FilterCard = () => {
  const { gradients } = colors;
  const { currentMachine, currentZone, dateRange } = useSelector(
    (state) => state.formControl1
  );
  const [machineZone, setMachineZone] = useState([]);
  const [filteredMachinesData, setFilteredMachinesData] = useState([]);

  // console.log("Parent component values:", {
  //   currentMachine,
  //   currentZone,
  //   dateRange,
  // });

  const dispatch = useDispatch();
  // Local state to hold temporary values
  const [localDateRange, setLocalDateRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection",
    },
  ]);
  const [localMachine, setLocalMachine] = useState([]);
  const [localZone, setLocalZone] = useState([]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [zones, setZones] = useState([]);
  const [machines, setMachines] = useState([]);
  const [mounted, setMounted] = useState(false);

  const getUniqueValues = (arr) => {
    const machineArray = [];
    const zoneSet = new Set();

    arr.forEach((obj) => {
      // console.log("Obj ",obj.machinename," ",obj.zone)
      // const machineName =  obj.machinename === "Insertion"         || obj.machinename === "BMS"               || obj.machinename === "Foam"
      //                   || obj.machinename === "Insertion Drum A"  || obj.machinename === "Insertion Drum B"  || obj.machinename === "Welding integrity"
      //                   || obj.machinename === "Welding Station 1" || obj.machinename === "Welding Station 2" || obj.machinename === "Welding Station 3"
      //                   || obj.machinename === "Welding Station 4" || obj.machinename === "Z Fixation"        || obj.machinename === "Leak Testing"
      //                   || obj.machinename === "Thermal"           || obj.machinename === "Foaming Drum A"    || obj.machinename === "Foaming Drum B"
      //                   || obj.machinename === "Thermal Drum A"    || obj.machinename === "Thermal Drum B"
      //   ? `${obj.machinename} ${obj.zone}` : obj.machinename;
      const machineName = `${obj.machinename}`;
      machineArray.push(machineName);
      zoneSet.add(obj.zone);
    });

    return [machineArray, [...zoneSet]];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://hmcl-backend.onrender.com/api/v1/sop-cycletime/data2"
        );
        // console.log("reponse in filter 1 ", response.data.data);
        setMachineZone(response.data.data);
        const [machineMap, zoneArray] = getUniqueValues(response.data.data);
        // console.log("machineMap ",machineMap)
        // console.log("machineMap ",zoneArray)
        setMachines(machineMap);
        setZones(zoneArray);
        setLocalZone(currentZone);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // console.log("Machine Zone ",machineZone," ",localZone);
    if (localZone != "all") {
      const filteredMachines = machineZone.filter((data) => {
        if (localZone == data.zone) return data.machinename;
      });
      setFilteredMachinesData(filteredMachines);
    } else {
      const filteredMachines = machineZone.filter((data) => {
        if (localZone == data.zone) return data.machinename;
      });
      setFilteredMachinesData(filteredMachines);
    }
  }, [localZone]);

  // console.log("Filtered machines ",filteredMachinesData.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChangeMachine = (event) => {
    const newValue = event.target.value;
    // console.log("handleChange machine ", newValue);
    setLocalMachine(newValue);
  };

  const handleChangeZone = (event) => {
    const newValue = event.target.value;
    // setLocalZone(newValue.filter((v) => v !== "all"));
    // console.log("Handlechange zone ", newValue);
    setLocalZone(newValue);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleClose = () => {
    setShowCalendar(false);
  };

  const handleDeleteMachine = (value) => {
    const newValue = localMachine.filter((item) => item !== value);
    setLocalMachine(newValue);
  };

  const handleDeleteZone = (value) => {
    const newValue = localZone.filter((item) => item !== value);
    setLocalZone(newValue);
  };

  const handleDateSelection = (value) => {
    setLocalDateRange([value.selection]);
  };

  const handleSubmit = () => {
    // Update Redux state only when Submit is clicked
    // console.log(
    //   "Handle Submit in filter ",
    //   localMachine,
    //   " ",
    //   localZone,
    //   " ",
    //   localDateRange
    // );
    dispatch(setCurrentMachine2(localMachine));
    dispatch(setCurrentZone2(localZone));
    dispatch(setDateRange2(localDateRange));
  };

  const handleClear = () => {
    // Reset local state
    setLocalMachine([]);
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
    <div
      className={`filter-card ${mounted ? "mounted" : ""}`}
      // style={{
      //   display: "flex",
      //   justifyContent: "center",
      //   transition: "ease-in",
      // }}
    >
      <Dialog open={showCalendar} onClose={handleClose}>
        <DialogContent
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
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
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Card
        style={{
          // backgroundImage: `url(${cardBackground})`,
          // backgroundSize: "cover",
          // backgroundRepeat: "no-repeat",

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          //   border: `1px solid ${colors.info.main}`,
          borderRadius: "15px",
          width: "auto",
          //   backgroundColor:"whitesmoke",
          background: "rgba(15, 18, 59, 0.2)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Calendar */}
        <FormControl style={{ marginRight: "16px", width: "15.5rem" }}>
          <div
            style={{
              color: `${colors.white.focus}`,
              fontFamily: fonts.fontStyle3["font-family"],
              fontStyle: fonts.fontStyle3["font-style"],
              fontWeight: fonts.fontStyle3["font-weight"],
            }}
          >
            Date Selection
          </div>
          <OutlinedInput
            value={`${format(
              localDateRange[0].startDate,
              "dd-MM-yyyy"
            )} - ${format(localDateRange[0].endDate, "dd-MM-yyyy")}`}
            endAdornment={
              <IconButton onClick={toggleCalendar}>
                <CalendarMonthIcon
                  fontSize="small"
                  style={{ color: `${colors.info.main}` }}
                />
              </IconButton>
            }
            sx={{
              color: `${colors.white.focus} !important`,
              height: "3rem",
              borderRadius: "12.5px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.grey[600]} !important`,
                borderWidth: "1px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.grey[600]} !important`,
                borderWidth: "1px",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.grey[600]} !important`,
                borderWidth: "1px",
              },
              "& .MuiSelect-icon": {
                color: `${colors.info.main} !important`,
              },
              fontFamily: fonts.fontStyle3["font-family"],
              fontStyle: fonts.fontStyle3["font-style"],
              fontWeight: fonts.fontStyle3["font-weight"],
            }}
          />
        </FormControl>

        {/* Zone */}
        <FormControl style={{ marginRight: "16px", width: "15.5rem" }}>
          <div style={form_control_header(colors, fonts)}>Zone</div>
          <Select
            value={localZone}
            onChange={handleChangeZone}
            size="small"
            MenuProps={MenuProps}
            sx={{
              color: `${colors.white.focus} !important`,
              height: "3rem",
              borderRadius: "12.5px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.grey[600]} !important`,
                borderWidth: "1px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.grey[600]} !important`,
                borderWidth: "1px",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.grey[600]} !important`,
                borderWidth: "1px",
              },
              "& .MuiSelect-icon": {
                color: `${colors.info.main} !important`,
              },
              fontFamily: fonts.fontStyle3["font-family"],
              fontStyle: fonts.fontStyle3["font-style"],
              fontWeight: fonts.fontStyle3["font-weight"],
            }}
          >
            {zones.map((item, index) => (
              <MenuItem
                value={item}
                key={index}
                style={{
                  fontFamily: fonts.fontStyle7["font-family"],
                  fontStyle: fonts.fontStyle7["font-style"],
                  fontWeight: fonts.fontStyle7["font-weight"],
                }}
              >
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Machine */}
        <FormControl style={{ marginRight: "16px", width: "15rem" }}>
          <div
            style={{
              color: `${colors.white.focus}`,
              fontFamily: fonts.fontStyle3["font-family"],
              fontStyle: fonts.fontStyle3["font-style"],
              fontWeight: fonts.fontStyle3["font-weight"],
            }}
          >
            Machine
          </div>
          <Select
            value={localMachine}
            onChange={handleChangeMachine}
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
                      onDelete={() => handleDeleteMachine(value)}
                      sx={{
                        color: "black",
                        backgroundColor: "whitesmoke",
                        "& .MuiChip-deleteIcon": {
                          color: "black",
                        },
                        fontFamily: fonts.fontStyle7["font-family"],
                        fontStyle: fonts.fontStyle7["font-style"],
                        fontWeight: fonts.fontStyle7["font-weight"],
                      }}
                    />
                  </div>
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
            sx={{
              borderRadius: "12.5px",
              minHeight: "3rem",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.grey[600]} !important`,
                borderWidth: "1px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.grey[600]} !important`,
                borderWidth: "1px",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.grey[600]} !important`,
                borderWidth: "1px",
              },
              "& .MuiSelect-icon": {
                color: `${colors.info.main} !important`,
              },
              fontFamily: fonts.fontStyle7["font-family"],
              fontStyle: fonts.fontStyle7["font-style"],
              fontWeight: fonts.fontStyle7["font-weight"],
            }}
          >
            <MenuItem value="all">All</MenuItem>
            {filteredMachinesData.map((data) => (
              // console.log("data ",data.machinename)
              <MenuItem
                value={data.machinename}
                key={data.machinename}
                style={{
                  fontFamily: fonts.fontStyle7["font-family"],
                  fontStyle: fonts.fontStyle7["font-style"],
                  fontWeight: fonts.fontStyle7["font-weight"],
                }}
              >
                {data.machinename}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Machine */}
        {/* <FormControl style={{ marginRight: "16px", width: "15.5rem" }}>
          <div style={form_control_header(colors, fonts)}>Machine</div>
          <Select
            value={localMachine}
            onChange={handleChangeMachine}
            size="small"
            MenuProps={MenuProps}
            readOnly={!localZone}
            sx={{
              color: `${colors.white.focus} !important`,
              height: "3rem",
              borderRadius: "12.5px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.grey[600]} !important`,
                borderWidth: "1px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.grey[600]} !important`,
                borderWidth: "1px",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.grey[600]} !important`,
                borderWidth: "1px",
              },
              "& .MuiSelect-icon": {
                color: `${colors.info.main} !important`,
              },
              fontFamily: fonts.fontStyle3["font-family"],
              fontStyle: fonts.fontStyle3["font-style"],
              fontWeight: fonts.fontStyle3["font-weight"],
            }}
          >
            {filteredMachinesData.map((data) => (
              // console.log("data ",data.machinename)
              <MenuItem
                value={data.machinename}
                key={data.machinename}
                style={{
                  fontFamily: fonts.fontStyle7["font-family"],
                  fontStyle: fonts.fontStyle7["font-style"],
                  fontWeight: fonts.fontStyle7["font-weight"],
                }}
              >
                {data.machinename}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        {/* Buttons */}
        <FormControl
          style={{
            // marginRight: "10px",
            width: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginTop: "1rem",
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
                Submit
              </Typography>
            }
            placement="bottom"
          >
            <Button
              variant="contained"
              size="small"
              style={{
                margin: "2%",
                height: "3rem",
                backgroundColor: `${colors.info.main}`,
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
                Clear
              </Typography>
            }
            placement="bottom"
          >
            <Button
              variant="contained"
              size="small"
              style={{
                margin: "2%",
                height: "3rem",
                backgroundColor: `${colors.error.main}`,
              }}
              onClick={handleClear}
            >
              <CancelIcon />
            </Button>
          </Tooltip>
        </FormControl>
      </Card>
    </div>
  );
};

export default FilterCard;
