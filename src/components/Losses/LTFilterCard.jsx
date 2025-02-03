import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { DateTime } from "luxon";
import Pagination from "@mui/material/Pagination";
import tableStyle from "./StoppageReasonsStyles";
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
  TextField,
} from "@mui/material";
import fonts from "../../style/fonts";
import colors from "../../style/colors";
import { useState, useEffect, useCallback } from "react";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { parse, format, addMinutes, isBefore, isEqual } from "date-fns";
import "../../style/dateRangePicker.css";
import { DateRangePicker } from "react-date-range";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import Sweetalert from "../Special Components/Sweetalert";
import { useSelector, useDispatch } from "react-redux";
import { setShiftsHistory } from "../../redux/shiftsHistorySlice";
import {
  date_range_style,
  chip_style,
  form_control_header,
  grid_style,
  grid_style2,
  select_style,
  menu_item_style,
  getUniqueValues,
  filterAssetDataByZones,
  getMachineName,
} from "./helperFunctions";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

const ITEMS_PER_PAGE = 5;
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

const LTFilterCard = () => {
  const [dropdown, setDropdown] = useState([]);
  const [reason, setReason] = useState([]);
  const [defectNameCode, setDefectNameCode] = useState([]);
  const [defectLookup, setDefectLookup] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableFilter, setTableFilter] = useState([]);
  const [filteredMachinesData, setFilteredMachinesData] = useState([
    "Leak Testing",
    "Insertion",
  ]);
  const [localMachine, setLocalMachine] = useState([]);
  const [shiftsData, setShiftsData] = useState(["A", "B", "C"]);
  const [shift, setShift] = useState([]);

  const [zones, setZones] = useState([3.1, 3.2, 4]);
  // const [shifts, setShifts] = useState([
  //   {
  //     shiftid: 1,
  //     shiftname: "Shift - A",
  //     shiftfrom: "01:00:01Z",
  //     shiftto: "09:30:00Z",
  //   },
  // ]);
  const [localDateRange, setLocalDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [localZone, setLocalZone] = useState([]);
  const [localShift, setLocalShift] = useState([]);
  const [screenSize, setScreenSize] = useState(
    Math.round(window.devicePixelRatio * 100)
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const adid = useSelector((state) => state.adid.adid);

  const options = [
    { value: "Reject", label: "Reject" },
    { value: "Rework", label: "Rework" },
  ];
  let toggle = !false;

  let totalPages = Math.ceil(tableFilter.length / ITEMS_PER_PAGE);

  let currentData = tableFilter.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      // console.log(
      //   "getting defect ***** localMachine ",
      //   localMachine,
      //   "dropdown ",
      //   dropdown
      // );
      try {
        const response = await axios.post(
          `http://localhost:7000/api/v1/defect/lookup`,
          {
            params: { machine: localMachine, defect_type: dropdown },
          }
        );
        // console.log(
        //   "$$$$ resp ",
        //   response,
        //   " ",
        //   response.data.length == undefined
        // );

        if (response.data.length == undefined)
          setDefectLookup(response.data.result);
        else setDefectLookup([]);
      } catch (error) {
        console.error("Error while fetching defect lookup data:", error);
      }
    };
    if (localMachine != "" && dropdown != "") {
      fetchData();
    }
  }, [selectAll, selectedRows, dropdown]);

  useEffect(() => {}, [defectLookup]);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(Math.round(window.devicePixelRatio * 100));
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    toggle = true;
  };

  const handleClose = () => {
    setShowCalendar(false);
    toggle = false;
  };

  const handleDateSelection = (value) => {
    setLocalDateRange([value.selection]);
  };

  const handleChangeDefectNameCode = (event) => {
    const newValue = event.target.value;
    // console.log("handleChangeDefectNameCode ", newValue);
    setDefectNameCode(newValue);
  };

  const handleChangeReason = (event) => {
    const newValue = event.target.value;
    // console.log("handleChangeReason ", newValue);
    setReason(newValue);
  };

  const handleChangeZone = (event) => {
    const newValue = event.target.value;
    // console.log("Handlechange zone ", newValue);
    setLocalZone(newValue);
    if (newValue == 3.1 || newValue == 3.2)
      setFilteredMachinesData(["Leak Testing", "Insertion"]);
    if (newValue == 4) setFilteredMachinesData(["EOL", "LaserMarking"]);
  };
  // console.log("filteredMachinesData ", filteredMachinesData);

  const handleChangeMachine = (event) => {
    const newValue = event.target.value;
    // console.log("handleChange machine ", newValue);
    setLocalMachine(newValue);
  };

  const handleChangeShift = (event) => {
    const newValue = event.target.value;
    // console.log("handleChange shift ", newValue);
    setShift(newValue);
  };

  const handleDeleteZone = (value) => {
    const newValue = localZone.filter((item) => item !== value);
    setLocalZone(newValue);
  };

  const handleDeleteShift = (value) => {
    const newValue = localShift.filter((item) => item !== value);
    setLocalShift(newValue);
  };

  const handleAddRejectionRework = async () => {
    // let responseData =["b1 : b123", "d1 : d123","b2 : b456", "d2 : d456"]
    //   for(let i=0;i<responseData.length;i++){
    //         Swal.fire({
    //           title: "",
    //           text: `The following duplicates were found :  ${responseData.join(", ")}`,
    //           icon: "warning",
    //           confirmButtonText: "Okay",
    //         });
    //     }
    // ------------------------------------------------------------------
    if (dropdown != "" && defectNameCode != "") {
      let response;
      // console.log(
      //   "handle Add Rej/Rew ",
      //   dropdown,
      //   " ",
      //   defectNameCode,
      //   " ",
      //   reason,
      //   " ",
      //   localZone,
      //   " ",
      //   shift,
      //   " ",
      //   selectedRows,
      //   " ",
      //   adid
      // );

      try {
        response = await axios.put(
          `http://localhost:7000/api/v1/leak-test/update`,
          {
            params: {
              defect_type: dropdown,
              defect_code: defectNameCode,
              reason: reason,
              zone: localZone,
              shift: shift,
              Rows: selectedRows,
              user: adid,
            },
          }
        );
        // console.log("update rejection rework >>>>>>>>>>> ", response);

        let responseData = response.data.res.duplicates;
        let defectName = [];
        let defectBarcode = [];

        // console.log("responseData ", responseData, " ", responseData.length);

        if (responseData.length > 0) {
          for (let i = 0; i < responseData.length; i++) {
            defectLookup.map((defect) => {
              if (defect.defect_code == responseData[i].code) {
                defectName.push(defect.defect_name);
                defectBarcode.push(responseData[i].barcode);
              }
            });
            // console.log("defName * ", defectName.join(", "));
            // console.log("defectBarcode * ", defectBarcode.join(", "));
          }
          Swal.fire({
            title: "",
            text: `For barcode ${defectBarcode.join(
              ", "
            )} and machine defect "${defectName.join(
              ", "
            )}" already exists respectively !!`,
            icon: "warning",
            confirmButtonText: "Okay",
          });
          // console.log("************* Duplicates exists !!");
        } else {
          if (response.status == 200) {
            setTimeout(() => {
              Swal.fire({
                title: "",
                text: `${dropdown} added successfully !`,
                icon: "success",
                confirmButtonText: "Okay",
              });
            }, 1500); // 1500 milliseconds = 1.5 seconds
          } else {
            setTimeout(() => {
              Swal.fire({
                title: "",
                text: "Unable to add / Some of the barcode with defect code already exist in past 7 days",
                icon: "warning",
                confirmButtonText: "Retry",
              });
            }, 1500); // 1500 milliseconds = 1.5 seconds
          }
        }
      } catch (error) {
        // console.log("Error while in handleAddRejectionRework ", error);
        Swal.fire({
          title: "",
          text: "Something went wrong !",
          icon: "warning",
          confirmButtonText: "Retry",
        });
      }
    } else {
      Swal.fire({
        title: "",
        text: "Defect Types and Defect Names are  mandatory !",
        icon: "warning",
        confirmButtonText: "Okay",
      });
    }
  };

  const handleRejectionRework = (event) => {
    // console.log("handleRejectionRework ", event.target.value);
    let value = event.target.value;
    if (value != "") {
      setDropdown(event.target.value);
      setDefectNameCode([]);
    }
  };

  const handleSubmitLT = async () => {
    // console.log("HandleSubmit in Leak test ");
    // console.log("Submitted data to fetch from test_leaktesting **** ");
    // console.log(
    //   localDateRange[0],
    //   " localZone : ",
    //   localZone,
    //   " localMachine : ",
    //   localMachine,
    //   " localShift : ",
    //   shift
    // );

    let response;
    if (
      localDateRange[0].startDate != "" &&
      localZone != "" &&
      localMachine != "" &&
      shift != ""
    ) {
      // console.log("In try");

      try {
        response = await axios.post(`http://localhost:7000/api/v1/leak-test`, {
          params: {
            date: {
              startDate: localDateRange[0].startDate,
              endDate: localDateRange[0].endDate,
            },
            zone: localZone,
            machine: localMachine,
            shift: shift,
          },
        });
        // console.log(
        //   "submit resp LT **** ",
        //   response.data.filterArr,
        //   " ",
        //   response.data.filterArr.length
        // );
        if (response.status != 200 || response.data.filterArr.length <= 0) {
          Swal.fire({
            title: "",
            text: "No data available !",
            icon: "warning",
            confirmButtonText: "Okay",
          });
          setTableFilter([]);
        } else {
          setTableFilter(response.data.filterArr);
        }
      } catch (error) {
        console.error("Error while fetching data ", error);
      }
    }
  };

  const handleSelectedRow = (event, rowData) => {
    // console.log("Row Selected ", event, rowData);
  };

  const handleClearCard2 = () => {
    setReason("");
    setDropdown("");
    setDefectNameCode([]);
    setDefectLookup([]);
  };
  const handleClear = () => {
    // Reset local state
    setSelectedRows([]);
    setLocalShift([]);
    setShift([]);
    setLocalZone([]);
    setLocalMachine([]);
    setLocalDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentData);
      // setSelectedRows(tableFilter);

      // currentData.map(data => console.log("sel data ",data))
    }
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleChangeDefectCodes = useCallback((event) => {
    const newValue = event.target.value;
    setDefectNameCode(
      newValue.includes("all") ? ["all"] : newValue.filter((v) => v !== "all")
    );
  }, []);

  const handleDeleteDefectCodes = useCallback((value) => {
    setDefectNameCode((prev) => prev.filter((item) => item !== value));
  }, []);

  const getDefectNamebyCode = (value) => {
    const defectName = defectLookup.map((data) => {
      if (data.defect_code == value) {
        // console.log("data.defect_name ",typeof (data.defect_name), " ",typeof value );
        return data.defect_name;
      }
    });
    return defectName;
  };
  // console.log("Select All  ",selectAll,selectedRows )
  // console.log("Select Row ",selectedRows )

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          marginTop: "-1rem",
        }}
      >
        <Card
          style={{
            marginRight: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
            borderRadius: "15px",
            // width: screenSize < 150 ? "60%" : "auto",
            width: "60%",
            background: "rgba(15, 18, 59, 0.2)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
          }}
        >
          <Grid container spacing={1}>
            {/* Row 1 */}
            {/* Zones */}
            <Grid item xs={6} style={grid_style}>
              <FormControl style={{ width: "100%", marginLeft: "1rem" }}>
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
            </Grid>
            {/* Machine */}
            <Grid item xs={6} style={grid_style}>
              <FormControl style={{ width: "90%", marginLeft: "1rem" }}>
                <div style={form_control_header(colors, fonts)}>Machine</div>
                <Select
                  value={localMachine}
                  onChange={handleChangeMachine}
                  size="small"
                  MenuProps={MenuProps}
                  disabled={!localZone}
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
                    <MenuItem
                      value={data}
                      key={data}
                      style={{
                        fontFamily: fonts.fontStyle7["font-family"],
                        fontStyle: fonts.fontStyle7["font-style"],
                        fontWeight: fonts.fontStyle7["font-weight"],
                      }}
                    >
                      {data}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Row 2 */}
            {/* Date range */}
            <Grid item xs={6} style={grid_style}>
              <FormControl style={{ width: "100%", marginLeft: "1rem" }}>
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
            </Grid>
            {/* Shifts */}
            <Grid item xs={6} style={grid_style}>
              <FormControl style={{ width: "90%", marginLeft: "1rem" }}>
                <div style={form_control_header(colors, fonts)}>Shifts</div>
                <Select
                  value={localZone && localMachine ? shift : ""}
                  onChange={handleChangeShift}
                  size="small"
                  disabled={!localMachine}
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
                  {localMachine &&
                    localZone &&
                    shiftsData.map((item, index) => (
                      <MenuItem
                        value={item}
                        key={index}
                        style={{
                          fontFamily: fonts.fontStyle7["font-family"],
                          fontStyle: fonts.fontStyle7["font-style"],
                          fontWeight: fonts.fontStyle7["font-weight"],
                        }}
                      >
                        Shift - {item}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Action Buttons */}
            <Grid item xs={12} style={grid_style}>
              <FormControl
                style={{
                  width: "100%",
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
                      Filter Leak Testing ?
                    </Typography>
                  }
                  placement="bottom"
                >
                  <Button
                    variant="contained"
                    size="small"
                    style={{
                      height: "2rem",
                      backgroundColor: colors.info.main,
                    }}
                    onClick={handleSubmitLT}
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
                      marginLeft: "2rem",
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
        {(selectAll || selectedRows.length > 0) && (
          <Card
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              borderRadius: "15px",
              // width: screenSize < 150 ? "60%" : "auto",
              width: "72%",
              background: "rgba(15, 18, 59, 0.2)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
            }}
          >
            <Grid container spacing={1}>
              {/* Defect Types */}
              <Grid item xs={6} style={grid_style}>
                <FormControl style={{ width: "60%", marginLeft: "1rem" }}>
                  <div style={form_control_header(colors, fonts)}>
                    Defect Types*
                  </div>
                  <Select
                    value={dropdown || " "}
                    onChange={handleRejectionRework}
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
                    {options.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        style={{
                          fontFamily: fonts.fontStyle7["font-family"],
                          fontStyle: fonts.fontStyle7["font-style"],
                          fontWeight: fonts.fontStyle7["font-weight"],
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/*  Defect Names */}
              <Grid item xs={6} style={grid_style}>
                <FormControl style={{ width: "140%", marginLeft: "-7rem" }}>
                  <div style={form_control_header(colors, fonts)}>
                    Defect Names*
                  </div>
                  <Select
                    value={defectNameCode}
                    onChange={handleChangeDefectCodes}
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
                              label={
                                value === "all"
                                  ? "All"
                                  : getDefectNamebyCode(value)
                              }
                              onDelete={() => handleDeleteDefectCodes(value)}
                              sx={chip_style(colors, fonts)}
                            />
                          </div>
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                    sx={{
                      borderRadius: "12.5px",
                      minHeight: "3rem",
                      color: "white",
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
                    {defectLookup != undefined &&
                      defectLookup.map((data) => (
                        <MenuItem
                          value={data.defect_code}
                          key={data.defect_code}
                          style={menu_item_style(fonts)}
                        >
                          {data.defect_name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Reason */}
              <Grid item width="100%" style={grid_style}>
                <FormControl style={{ width: "100%", marginLeft: "1rem" }}>
                  <div style={form_control_header(colors, fonts)}>Reason</div>
                  <TextField
                    id="outlined"
                    value={reason}
                    onChange={(event) => handleChangeReason(event)}
                    inputProps={{ maxLength: 30 }}
                    placeholder="Please enter reason less than 30 characters"
                    FormHelperTextProps={{
                      style: { color: "#FFC255" },
                    }}
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: false, // This hides the label but keeps space for it
                    }}
                    sx={{
                      width: "100%",
                      borderRadius: "12.5px",
                      minHeight: "3rem",
                      "& .MuiInputBase-input": {
                        color: colors.white.main,
                        fontFamily: fonts.fontStyle3["font-family"],
                        fontStyle: fonts.fontStyle3["font-style"],
                        fontWeight: fonts.fontStyle3["font-weight"],
                        minHeight: "2rem",
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12.5px",
                        "& fieldset": {
                          borderColor: `${colors.grey[500]} !important`,
                        },
                        "&:hover fieldset": {
                          borderColor: `${colors.grey[500]} !important`,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: `${colors.grey[500]} !important`,
                        },
                      },
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12} style={grid_style}>
                <FormControl
                  style={{
                    width: "100%",
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
                        Add {dropdown} ?
                      </Typography>
                    }
                    placement="bottom"
                  >
                    <Button
                      variant="contained"
                      size="small"
                      style={{
                        height: "2rem",
                        backgroundColor: colors.info.main,
                      }}
                      onClick={handleAddRejectionRework}
                    >
                      <CheckCircleIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    title={
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontFamily: fonts.fontStyle7["font-family"],
                          fontStyle: fonts.fontStyle7["font-style"],
                          fontWeight: fonts.fontStyle7["font-weight"],
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
                        marginLeft: "2rem",
                        height: "2rem",
                        backgroundColor: colors.error.main,
                      }}
                      onClick={handleClearCard2}
                    >
                      <CancelIcon />
                    </Button>
                  </Tooltip>
                </FormControl>
              </Grid>
            </Grid>
          </Card>
        )}

        <Dialog
          open={showCalendar}
          onClose={handleClose}
          width="45%"
          maxWidth={"md"}
        >
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        {tableFilter.length > 0 && (
          <TableContainer
            size="small"
            className="custom-table"
            component={Paper}
            style={{
              marginTop: "1.5rem",
              // paddingTop : '-2rem',

              // width : "61.5%",
              width: "100%",
              color: "white",
              backgroundColor: "transparent",
              borderRadius: "12px",
              boxShadow: "1px 1px 4px 1px black",
            }}
          >
            <div
              style={{
                color: "whitesmoke",
                fontFamily: fonts.fontStyle9["font-family"],
                fontStyle: fonts.fontStyle9["font-style"],
                fontWeight: fonts.fontStyle9["font-weight"],
                fontSize: "20px",
                padding: "0 0 0% 2%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center", // Ensures text and icons are centered vertically
                flexDirection: "row",
              }}
            >
              <p
                variant="head"
                colSpan={8}
                style={{
                  marginTop: "-1rem",
                  color: "whitesmoke",
                  fontSize: "18px",
                  textAlign: "left",
                  fontFamily: fonts.fontStyle9["font-family"],
                  fontStyle: fonts.fontStyle9["font-style"],
                  fontWeight: fonts.fontStyle9["font-weight"],
                }}
              >
                {/* Name of the table if req. */}
              </p>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={tableStyle.tableCell2.cellStyle}
                    sx={{ width: "250px" }}
                  >
                    <Checkbox
                      color="primary"
                      checked={
                        selectAll || selectedRows.length == ITEMS_PER_PAGE
                      }
                      onChange={handleSelectAll}
                      inputProps={{
                        "aria-label": "select all desserts",
                      }}
                      sx={{
                        marginTop: "-10px",
                        color: "white",
                        "&.Mui-checked": { color: "white" },
                      }}
                    />
                    Select All
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "left",
                      color: "whitesmoke",
                      fontSize: "16px",
                      padding: "5px",
                      paddingLeft: "-5px",
                      fontFamily: fonts.fontStyle9["font-family"],
                      fontStyle: fonts.fontStyle9["font-style"],
                      fontWeight: fonts.fontStyle9["font-weight"],
                      width: "400px",
                    }}
                  >
                    DateTime
                  </TableCell>
                  <TableCell
                    style={tableStyle.tableCell2.cellStyle}
                    sx={{ width: "350px" }}
                  >
                    Barcode
                  </TableCell>
                  <TableCell style={tableStyle.tableCell2.cellStyle}>
                    Result
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((rowData) => {
                  return (
                    <TableRow key={rowData.data.DateTime}>
                      <TableCell style={tableStyle.tableRow3.rowStyle}>
                        <Checkbox
                          color="primary"
                          checked={selectedRows.includes(rowData)}
                          onChange={() => handleRowSelect(rowData)}
                          inputProps={{
                            "aria-label": "select all desserts",
                          }}
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "white" },
                          }}
                        />
                      </TableCell>
                      <TableCell style={tableStyle.tableRow3.rowStyle}>
                        {DateTime.fromISO(
                          rowData.data.DateTime.substr(0, 19)
                        ).toLocaleString(DateTime.DATETIME_MED)}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow3.rowStyle}>
                        {rowData.data.Battery_Pack_Barcode}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow3.rowStyle}>
                        {rowData.data.LeakTestResult == 0 ? "NG" : ""}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div style={{ marginBottom: "1rem" }}>
              <Pagination
                color="primary"
                variant="outlined"
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "20px",
                  "& .MuiPaginationItem-root": {
                    color: colors.info.main,
                    borderColor: "whitesmoke",
                    fontFamily: fonts.fontStyle7["font-family"],
                    fontStyle: fonts.fontStyle7["font-style"],
                    fontWeight: fonts.fontStyle7["font-weight"],
                    backgroundColor: "whitesmoke",
                    "&:hover": { backgroundColor: colors.info.light },
                    "&.Mui-selected": {
                      backgroundColor: colors.info.main,
                      color: "white",
                      "&:hover": { backgroundColor: colors.info.dark },
                    },
                  },
                }}
              />
            </div>
          </TableContainer>
        )}
      </div>
    </>
  );
};

export default LTFilterCard;
