import React, { useEffect, useState } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
} from "@mui/material";
import { Tooltip, Typography, Card } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { CardContent, CardActions } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import FilterCard2 from "./FilterCard2";
import FilterCard3 from "./FilterCard3";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import UpdateIcon from "@mui/icons-material/Update";
import { FaEdit } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import Header from "../Header/Header";
import tableStyle from "./StoppageReasonsStyles";
import { Grid } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import Sweetalert from "../Special Components/Sweetalert";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import colors from "../../style/colors";
import fonts from "../../style/fonts";
import "./StoppageReasons.css";
import { useSelector, useDispatch } from "react-redux";
import { reset2, reset3 } from "../../redux/formControlSlice";

// Labels for each number value
const LossTypes = [
  { value: "0", label: "00 : None" },
  { value: "1", label: "01 : Breakdown Loss" },
  { value: "2", label: "02 : Setup and Adjustment Loss" },
  { value: "3", label: "03 : Cutting Tool Replacement Loss" },
  { value: "4", label: "04 : Startup Time Loss" },
  { value: "8", label: "08 : Shutdown Loss" },
  { value: "9", label: "09 : Waiting for Material" },
  { value: "9A", label: "9A : Waiting for Man" },
  { value: "19", label: "19 : Not Used" },
];

const lossTypesMap = LossTypes.reduce((acc, option) => {
  acc[option.value] = option.label.substring(4, 40);
  return acc;
}, {});

var CLId = 2;
const ConsolidatedLosses = () => {
  const [tableData, setTableData] = useState([]);
  const [unfilledTable, setUnfilledTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [page, setPage] = useState(1);
  const [page2, setPage2] = useState(1);
  const [rowsPerPage] = useState(5);
  const [showBreakdownFilter, setShowBreakdownFilter] = useState(false);
  const [showUnfilledFilter, setShowUnfilledFilter] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();
  const [screenSize, setScreenSize] = useState(
    Math.round(window.devicePixelRatio * 100)
  );
  const [unitCode, setUnitCode] = useState([]);
  const [phenomenonCode, setPhenomenonCode] = useState([]);
  const [causeCode, setCauseCode] = useState([]);
  const [breakdownReasonDialog, setBreakdownReasonDialog] = useState({
    stopid: "",
    unitCodeValue: "",
    phenomenonCodeValue: "",
    causeCodeValue: "",
    resolutionDetails: "",
  });
  const [breakdownReasonForm, setBreakdownReasonForm] = useState({
    stopid: "",
    unitCodeValue: "",
    phenomenonCodeValue: "",
    causeCodeValue: "",
    resolutionDetails: "",
  });

  useEffect(() => {
    dispatch(reset2());
    dispatch(reset3());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (showBreakdownFilter) CLId = 1;

      try {
        const Id = 1;
        const response = await axios.get(
          `http://localhost:7000/api/v1/sop-stopage-reason/consolidate-loss`,
          {
            params: {
              lossid: Id,
              defaultId: CLId,
            },
          }
        );
        // console.log("Fetching ConsolidatedLosses ", response.data.response);
        setTableData(response.data.response);
      } catch (error) {
        console.error("Error while fetching data ", error);
      }
    };
    fetchData();
  }, [showBreakdownFilter]);

  useEffect(() => {
    const fetchData = async () => {
      if (showUnfilledFilter) CLId = 1;
      try {
        const response2 = await axios.get(
          "http://localhost:7000/api/v1/sop-stopage-reason/count2",
          {
            params: {
              defaultId: CLId,
            },
          }
        );
        // console.log("unfilled res ", response2);

        setUnfilledTable(response2.data[0].recordset);
      } catch (error) {
        console.error("Error while fetching data ", error);
      }
    };
    fetchData();
  }, [showUnfilledFilter]);

  // Fetches data from db for unit, cause and phenomenon code
  useEffect(() => {
    const fetchData = async () => {
      try {
        const unitResponse = await axios.get(
          "http://localhost:7000/api/v1/bd/unit"
        );
        // console.log("unitResponse ", unitResponse.data.result)
        setUnitCode(unitResponse.data.result);

        const phenomenonResponse = await axios.get(
          "http://localhost:7000/api/v1/bd/phenomena"
        );
        // console.log("phenomenonResponse ", phenomenonResponse.data.result)
        setPhenomenonCode(phenomenonResponse.data.result);

        const causeResponse = await axios.get(
          "http://localhost:7000/api/v1/bd/cause"
        );
        // console.log("causeResponse ", causeResponse.data.result)
        setCauseCode(causeResponse.data.result);
      } catch (error) {
        console.error("Error while fetching bd data ", error);
      }
    };
    fetchData();
  }, []);

  function isAlphanumericAndSymbols(str) {
    if (str == null) return false;
    const pattern = /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]|\\:;'"<>,.?/~`-]+$/;
    return pattern.test(str);
  }

  function isInvalidString(str) {
    // Check if input is null, 'NULL', empty or consists only of whitespace
    return (
      str === null ||
      str.toLowerCase() == "null" ||
      typeof str !== "string" ||
      str.trim() === ""
    );
  }

  const unfilledData = unfilledTable.filter((data) => {
    if (
      data.lossid != 1 &&
      !isAlphanumericAndSymbols(data.reason) &&
      isInvalidString(data.reason)
    ) {
      return data;
    }
  });
  // console.log("unfill lenght ",unfilledData.length)

  const ITEMS_PER_PAGE = 5;
  var totalPages = Math.ceil(unfilledData.length / ITEMS_PER_PAGE);
  var totalPages2 = Math.ceil(unfilledData.length / ITEMS_PER_PAGE);

  var currentData = unfilledData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  var currentData2 = unfilledData.slice(
    (currentPage2 - 1) * ITEMS_PER_PAGE,
    currentPage2 * ITEMS_PER_PAGE
  );

  // console.log("Cur data ", currentData);
  // console.log("unfilled data ", unfilledData);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handlePageChange2 = (event, value) => {
    setCurrentPage2(value);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  var pagesInBreakdown = Math.ceil(tableData.length / rowsPerPage);
  var pagesInBreakdown2 = Math.ceil(tableData.length / rowsPerPage);

  var paginatedData = tableData.slice(startIndex, endIndex);

  var paginatedData2 = tableData.slice(startIndex, endIndex);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleShowBreakdownFilter = () => {
    setShowBreakdownFilter(!showBreakdownFilter);
  };

  const handleShowUnfilledFilter = () => {
    setShowUnfilledFilter(!showUnfilledFilter);
  };

  const filteredData = useSelector((state) => state.formControl2);
  const filterDateNTime = filteredData.dateRange[0].startDate;
  const filterMachine = filteredData.currentMachine;
  const filterZone = filteredData.currentZone;

  // console.log("filteredData in breakdown",filteredData.currentMachine," ",filteredData.dateRange[0].startDate," ",filteredData.currentZone);
  // console.log("Filter condition ", filteredData.currentMachine);

  var filterTable = "";
  if (filterDateNTime && filterMachine && filterZone) {
    // console.log(
    //   "filtered table ",
    //   filterDateNTime,
    //   " ",
    //   filterMachine,
    //   " ",
    //   filterZone
    // );

    filterTable = tableData.filter((rowData) => {
      const modDate = new Date(filterDateNTime);
      const filterRowDate = new Date(rowData.starttime);

      if (
        filterMachine.length >= 1 &&
        filterZone == rowData.zone &&
        filterRowDate >= modDate
      ) {
        // console.log("************ Breakdown");

        if (filterMachine[0] != "all") {
          for (var i = 0; i < filterMachine.length; i++) {
            if (rowData.machinename == filterMachine[i]) {
              // console.log("rowData ", rowData.machinename == filterMachine[i]);
              return rowData;
            }
          }
        }

        if (filterMachine[0] == "all") {
          return rowData;
        }

        // return rowData;
      }
    });

    // console.log("Filter applied ", filterTable);
    // totalPages = Math.ceil(filterTable.length / ITEMS_PER_PAGE);
    // console.log("pages ",filterTable.length);
    // currentData = filterTable.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    pagesInBreakdown = Math.ceil(filterTable.length / rowsPerPage);
    paginatedData = filterTable.slice(startIndex, endIndex);
  } else {
    // console.log("non filtered table");
  }

  // Unfilled Filter
  const unfilledFilteredData = useSelector((state) => state.formControl3);

  const unfilledFilterDateNTime = unfilledFilteredData.dateRange[0].startDate;
  const unfilledFilterMachine = unfilledFilteredData.currentMachine;
  const unfilledFilterZone = unfilledFilteredData.currentZone;

  // console.log("unfilled filteredData ", unfilledFilteredData);
  var unfilledFilterTable = "";
  if (unfilledFilterDateNTime && unfilledFilterMachine && unfilledFilterZone) {
    // console.log(
    //   "filtered table ",
    //   filterDateNTime,
    //   " ",
    //   filterMachine,
    //   " ",
    //   filterZone
    // );

    unfilledFilterTable = unfilledData.filter((rowData) => {
      const unfilledModDate = new Date(unfilledFilterDateNTime);
      const unfilledFilterRowDate = new Date(rowData.starttime);

      if (
        unfilledFilterMachine.length >= 1 &&
        unfilledFilterZone == rowData.zone &&
        unfilledFilterRowDate >= unfilledModDate
      ) {
        if (unfilledFilterMachine[0] != "all") {
          for (var i = 0; i < unfilledFilterMachine.length; i++) {
            if (rowData.machinename == unfilledFilterMachine[i]) {
              // console.log(
              //   "rowData ",
              //   rowData.machinename == unfilledFilterMachine[i]
              // );
              return rowData;
            }
          }
        }

        if (unfilledFilterMachine[0] == "all") {
          return rowData;
        }
      }
    });

    // console.log("Filter applied ", unfilledFilterTable);

    totalPages = Math.ceil(unfilledFilterTable.length / ITEMS_PER_PAGE);
    currentData = unfilledFilterTable.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  } else {
    // console.log("non filtered table");
  }

  const handleModalOpen = (stopid) => {
    // console.log("Stopid ",stopid)
    setBreakdownReasonForm({ ...breakdownReasonForm, stopid: stopid });
    setModalShow(true);
  };

  const handleModalClose = () => {
    setBreakdownReasonDialog({
      stopid: "",
      unitCodeValue: "",
      phenomenonCodeValue: "",
      causeCodeValue: "",
      resolutionDetails: "",
    });
    setModalShow(false);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  if (filterDateNTime && filterMachine && filterZone) CLId = 2;

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(Math.round(window.devicePixelRatio * 100));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDialogSubmit = async () => {
    // console.log("submit data ", breakdownReasonForm);

    if (
      breakdownReasonForm.stopid != "" &&
      breakdownReasonForm.unitCodeValue != "" &&
      breakdownReasonForm.phenomenonCodeValue != "" &&
      breakdownReasonForm.causeCodeValue != "" &&
      breakdownReasonForm.resolutionDetails != "" &&
      breakdownReasonForm.resolutionDetails.length <= 30
    ) {
      // console.log(
      //   "Resolution length ",
      //   breakdownReasonForm.resolutionDetails.length
      // );
      // console.log("submit capture breakdown reasons  ", breakdownReasonForm);
      const response = await axios.post(
        "http://localhost:7000/api/v1/bd/event",
        {
          breakdownReasonForm: breakdownReasonForm,
        }
      );

      // console.log("response console ",response," ",response.status);
      if (response.status == "200") {
        Swal.fire({
          title: "",
          text: "Caputure breakdown reason applied successfully",
          icon: "success",
          confirmButtonText: "Okay",
        });
      } else {
        Swal.fire({
          title: "",
          text: "Something went wrong while updating ",
          icon: "warning",
          confirmButtonText: "Retry",
        });
      }
    } else {
      Swal.fire({
        title: "",
        text: "All fields are required ! ",
        icon: "warning",
        confirmButtonText: "Close",
      });
    }
    setBreakdownReasonDialog({
      stopid: "",
      unitCodeValue: "",
      phenomenonCodeValue: "",
      causeCodeValue: "",
      resolutionDetails: "",
    });
    setBreakdownReasonForm({
      stopid: "",
      unitCodeValue: "",
      phenomenonCodeValue: "",
      causeCodeValue: "",
      resolutionDetails: "",
    });
    setModalShow(false);
  };

  const handleChangeBreakdownReasonDialog = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setBreakdownReasonDialog({
      ...breakdownReasonDialog,
      [name]: value,
    });
    // console.log(name,value)

    if (name == "unitCodeValue") {
      unitCode.filter((data) => {
        if (data.unit_name == value) {
          setBreakdownReasonForm({
            ...breakdownReasonForm,
            [name]: data.unit_id,
          });
        }
      });
    }

    if (name == "phenomenonCodeValue") {
      phenomenonCode.filter((data) => {
        if (data.phenomenon_name == value) {
          setBreakdownReasonForm({
            ...breakdownReasonForm,
            [name]: data.phenomenon_id,
          });
        }
      });
    }

    if (name == "causeCodeValue") {
      causeCode.filter((data) => {
        if (data.cause_name == value) {
          setBreakdownReasonForm({
            ...breakdownReasonForm,
            [name]: data.cause_id,
          });
        }
      });
    }

    if (name == "resolutionDetails") {
      setBreakdownReasonForm({
        ...breakdownReasonForm,
        [name]: value,
      });
    }
    // console.log("setBreakdownReasonForm ", breakdownReasonForm);
  };

  useEffect(() => {
    if (
      paginatedData.length <= 0 &&
      showBreakdownFilter &&
      filterDateNTime.length != 0 &&
      filterZone.length != 0 &&
      filterMachine.length != ""
    )
      Swal.fire({
        title: "",
        text: "No data is available ",
        icon: "warning",
        confirmButtonText: "Okay",
      });
  }, [filterTable]);

  useEffect(() => {
    if (
      currentData.length <= 0 &&
      showUnfilledFilter &&
      unfilledFilterMachine.length != "" &&
      unfilledFilterDateNTime.length != 0 &&
      unfilledFilterZone.length != 0
    )
      Swal.fire({
        title: "",
        text: "No data is available ",
        icon: "warning",
        confirmButtonText: "Okay",
      });
  }, [unfilledFilterTable]);

  return (
    <>
      <Header />
      {/* Modal */}
      <Dialog
        open={modalShow}
        // fullWidth
        maxWidth="xl"
        style={{ backgroundColor: "rgba(15, 18, 59, 0.7)" }}
        PaperProps={{
          style: {
            // background: "white",
            background:
              "linear-gradient(180deg, #1a1f4d 0%, #23284f 50%, #2d3154 100%)",
            height: "47%",
            width: "50%",
          },
        }}
      >
        <DialogTitle
          textAlign={"center"}
          style={{
            color: "white",
            fontFamily: fonts.fontStyle7["font-family"],
            fontStyle: fonts.fontStyle7["font-style"],
            fontWeight: fonts.fontStyle7["font-weight"],
            fontSize: "x-large",
            padding: "0px",
            marginTop: "-1rem",
            marginBottom: "-2rem",
          }}
        >
          <h4>Capture Breakdown Reasons</h4>
        </DialogTitle>
        <DialogContent>
          {true && (
            <div
              style={{
                height: "10%",
                width: "100%",
              }}
            >
              {/* Dropdowns */}
              <div
                style={{
                  color: "white",
                  height: "12%",
                  width: "100%",
                  display: "grid",
                  justifyContent: "start",
                  flexDirection: "column",
                  gridTemplateColumns: "26.5% 26.5% 26.5%",
                  gridTemplateRows: "100px 100px 100px",
                  columnGap: "8%",
                  rowGap: "4rem",
                  marginTop: "1.5rem",
                  padding: "-10px",
                }}
              >
                {/* Unit Code */}
                <div
                  style={{
                    width: "120%", // Adjust as needed
                  }}
                >
                  <div
                    style={{
                      color: "white", // Label Color
                      fontFamily: fonts.fontStyle3["font-family"],
                      fontStyle: fonts.fontStyle3["font-style"],
                      fontWeight: fonts.fontStyle3["font-weight"],
                    }}
                  >
                    Unit Code
                  </div>

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
                        {breakdownReasonDialog.unitCodeValue}
                      </Typography>
                    }
                    placement="bottom"
                  >
                    <TextField
                      select
                      name="unitCodeValue"
                      value={breakdownReasonDialog.unitCodeValue}
                      onChange={(event) =>
                        handleChangeBreakdownReasonDialog(event)
                      }
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      autoFocus
                      InputLabelProps={{
                        shrink: false, // This hides the label but keeps space for it
                      }}
                      sx={{
                        width: "100%", // Adjust as needed

                        // Set the text color
                        "& .MuiInputBase-input": {
                          color: "white",
                          fontFamily: fonts.fontStyle3["font-family"],
                          fontStyle: fonts.fontStyle3["font-style"],
                          fontWeight: fonts.fontStyle3["font-weight"],
                        },

                        // Ensure the border is always visible and customizable
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: `${colors.grey[500]} !important`, // Ensure the border color is applied
                          },
                          "&:hover fieldset": {
                            borderColor: `${colors.grey[500]} !important`, // Change border color on hover
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: `${colors.grey[500]} !important`, // Change border color when focused
                          },
                          "& .MuiSelect-icon": {
                            color: "white",
                          },
                        },
                      }}
                    >
                      {unitCode.map((option) => (
                        <MenuItem key={option.unit_id} value={option.unit_name}>
                          {option.unit_name}
                        </MenuItem>
                        // console.log(option.unit_id," ",option.unit_name)
                      ))}
                    </TextField>
                  </Tooltip>
                </div>

                {/* Phenomenon Code */}
                <div
                  style={{
                    width: "120%", // Adjust as needed
                  }}
                >
                  <div
                    style={{
                      color: "white", // Label Color
                      fontFamily: fonts.fontStyle3["font-family"],
                      fontStyle: fonts.fontStyle3["font-style"],
                      fontWeight: fonts.fontStyle3["font-weight"],
                    }}
                  >
                    Phenomenon Code
                  </div>
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
                        {breakdownReasonDialog.phenomenonCodeValue}
                      </Typography>
                    }
                    placement="bottom"
                  >
                    <TextField
                      select
                      name="phenomenonCodeValue"
                      value={breakdownReasonDialog.phenomenonCodeValue}
                      onChange={(event) =>
                        handleChangeBreakdownReasonDialog(event)
                      }
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      autoFocus
                      InputLabelProps={{
                        shrink: false, // This hides the label but keeps space for it
                      }}
                      sx={{
                        width: "100%", // Adjust as needed

                        // Set the text color
                        "& .MuiInputBase-input": {
                          color: "white",
                          fontFamily: fonts.fontStyle3["font-family"],
                          fontStyle: fonts.fontStyle3["font-style"],
                          fontWeight: fonts.fontStyle3["font-weight"],
                        },

                        // Ensure the border is always visible and customizable
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: `${colors.grey[500]} !important`, // Ensure the border color is applied
                          },
                          "&:hover fieldset": {
                            borderColor: `${colors.grey[500]} !important`, // Change border color on hover
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: `${colors.grey[500]} !important`, // Change border color when focused
                          },
                          "& .MuiSelect-icon": {
                            color: "white",
                          },
                        },
                      }}
                    >
                      {phenomenonCode.map((option) => (
                        <MenuItem
                          key={option.phenomenon_id}
                          value={option.phenomenon_name}
                        >
                          {option.phenomenon_name}
                        </MenuItem>
                        // console.log(option.phenomenon_id," ",option.phenomenon_name)
                      ))}
                    </TextField>
                  </Tooltip>
                </div>

                {/* Cause Code */}
                <div
                  style={{
                    width: "120%", // Adjust as needed
                  }}
                >
                  <div
                    style={{
                      color: "white", // Label Color
                      fontFamily: fonts.fontStyle3["font-family"],
                      fontStyle: fonts.fontStyle3["font-style"],
                      fontWeight: fonts.fontStyle3["font-weight"],
                    }}
                  >
                    Cause Code
                  </div>

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
                        {breakdownReasonDialog.causeCodeValue}
                      </Typography>
                    }
                    placement="bottom"
                  >
                    <TextField
                      select
                      name="causeCodeValue"
                      value={breakdownReasonDialog.causeCodeValue}
                      onChange={(event) =>
                        handleChangeBreakdownReasonDialog(event)
                      }
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      autoFocus
                      InputLabelProps={{
                        shrink: false, // This hides the label but keeps space for it
                      }}
                      sx={{
                        width: "100%", // Adjust as needed

                        // Set the text color
                        "& .MuiInputBase-input": {
                          color: "white",
                          fontFamily: fonts.fontStyle3["font-family"],
                          fontStyle: fonts.fontStyle3["font-style"],
                          fontWeight: fonts.fontStyle3["font-weight"],
                        },

                        // Ensure the border is always visible and customizable
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: `${colors.grey[500]} !important`, // Ensure the border color is applied
                          },
                          "&:hover fieldset": {
                            borderColor: `${colors.grey[500]} !important`, // Change border color on hover
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: `${colors.grey[500]} !important`, // Change border color when focused
                          },
                          "& .MuiSelect-icon": {
                            color: "white",
                          },
                        },
                      }}
                    >
                      {causeCode.map((option) => (
                        <MenuItem
                          key={option.cause_id}
                          value={option.cause_name}
                        >
                          {option.cause_name}
                        </MenuItem>
                        // console.log(option.cause_id," ",option.cause_name)
                      ))}
                    </TextField>
                  </Tooltip>
                </div>
              </div>

              {/* Resolution */}
              <div>
                <h5
                  style={{
                    color: "white",
                    fontFamily: fonts.fontStyle7["font-family"],
                    fontStyle: fonts.fontStyle7["font-style"],
                    fontWeight: fonts.fontStyle7["font-weight"],
                    fontSize: "large",
                    marginTop: "5rem",
                  }}
                >
                  Breakdonwn Resolution
                </h5>
              </div>

              {/* Resolution Details*/}
              <div
                style={{
                  width: "101%", // Adjust as needed
                  marginLeft: "0rem",
                  marginTop: "-1rem",
                }}
              >
                <div
                  style={{
                    color: "white", // Label Color
                    fontFamily: fonts.fontStyle3["font-family"],
                    fontStyle: fonts.fontStyle3["font-style"],
                    fontWeight: fonts.fontStyle3["font-weight"],
                  }}
                >
                  Resolution Details
                </div>
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
                      Please enter details less than 30 characters
                    </Typography>
                  }
                  placement="bottom"
                >
                  <TextField
                    name="resolutionDetails"
                    value={breakdownReasonDialog.resolutionDetails}
                    inputProps={{ maxLength: 30 }}
                    // helperText="Max 30 characters allowed !"
                    FormHelperTextProps={{
                      style: { color: "#FFC255" },
                    }}
                    onChange={(event) =>
                      handleChangeBreakdownReasonDialog(event)
                    }
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: false, // This hides the label but keeps space for it
                    }}
                    sx={{
                      width: "100%", // Adjust as needed

                      // Set the text color
                      "& .MuiInputBase-input": {
                        color: "white", // Change text color
                        fontFamily: fonts.fontStyle3["font-family"],
                        fontStyle: fonts.fontStyle3["font-style"],
                        fontWeight: fonts.fontStyle3["font-weight"],
                      },

                      // Ensure the border is always visible and customizable
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: `${colors.grey[500]} !important`, // Ensure the border color is applied
                        },
                        "&:hover fieldset": {
                          borderColor: `${colors.grey[500]} !important`, // Change border color on hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: `${colors.grey[500]} !important`, // Change border color when focused
                        },
                      },
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
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
                Apply capture breakdown reason ?
              </Typography>
            }
            placement="bottom"
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: `${colors.info.main}`,
                fontFamily: fonts.fontStyle1["font-family"],
                fontStyle: fonts.fontStyle1["font-style"],
                fontWeight: fonts.fontStyle1["font-weight"],
              }}
              onClick={handleDialogSubmit}
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
                Cancel
              </Typography>
            }
            placement="bottom"
          >
            <Button
              onClick={handleModalClose}
              variant="contained"
              style={{
                // marginRight : "15px",
                backgroundColor: `${colors.error.main}`,
                fontFamily: fonts.fontStyle1["font-family"],
                fontStyle: fonts.fontStyle1["font-style"],
                fontWeight: fonts.fontStyle1["font-weight"],
              }}
            >
              <CancelIcon />
            </Button>
          </Tooltip>
        </DialogActions>
      </Dialog>

      {/* Breakdown Table */}
      <TableContainer
        className="custom-table"
        component={Paper}
        style={{
          marginBottom: "10px",
          backgroundColor: "transparent",
          borderRadius: "12px",
          boxShadow: "1px 1px 4px 1px",
          fontFamily: fonts.fontStyle9["font-family"],
          fontStyle: fonts.fontStyle9["font-style"],
          fontWeight: fonts.fontStyle9["font-weight"],
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
              marginTop: "0.8rem",
              color: "whitesmoke",
              fontSize: "20px",
              textAlign: "left",
              fontFamily: fonts.fontStyle9["font-family"],
              fontStyle: fonts.fontStyle9["font-style"],
              fontWeight: fonts.fontStyle9["font-weight"],
            }}
          >
            Breakdown
          </p>
          {!showBreakdownFilter ? (
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
                variant="contained"
                size="small"
                style={{
                  fontFamily: fonts.fontStyle7["font-family"],
                  fontStyle: fonts.fontStyle7["font-style"],
                  fontWeight: fonts.fontStyle7["font-weight"],
                }}
                endIcon={
                  <FilterAltIcon
                    fontSize="medium"
                    style={{ color: "whitesmoke" }}
                  />
                }
                onClick={handleShowBreakdownFilter}
              >
                Open
              </Button>
              {/* <IconButton onClick={handleShowBreakdownFilter}>
                <FilterAltIcon
                  fontSize="medium"
                  style={{ marginLeft: "10px", color: "whitesmoke" }} // Adds space between the text and icon
                />
              </IconButton> */}
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
                variant="contained"
                size="small"
                color="error"
                style={{
                  fontFamily: fonts.fontStyle7["font-family"],
                  fontStyle: fonts.fontStyle7["font-style"],
                  fontWeight: fonts.fontStyle7["font-weight"],
                }}
                endIcon={
                  <FilterAltOffIcon
                    fontSize="medium"
                    style={{ color: "whitesmoke" }}
                  />
                }
                onClick={handleShowBreakdownFilter}
              >
                Close
              </Button>

              {/* <IconButton onClick={handleShowBreakdownFilter}>
                <FilterAltOffIcon
                  fontSize="medium"
                  style={{ marginLeft: "10px", color: "whitesmoke" }} // Adds space between the text and icon
                />
              </IconButton>  */}
            </Tooltip>
          )}
        </div>

        <div
          className={`filter-card-container ${
            showBreakdownFilter ? "show" : ""
          }`}
        >
          {showBreakdownFilter && <FilterCard2 />}
        </div>

        {showBreakdownFilter ? (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      color: "whitesmoke",
                      textAlign: "left",
                      fontSize: "14px",
                      padding: "7px",
                      paddingLeft: "5rem",
                      fontFamily: fonts.fontStyle9["font-family"],
                      fontStyle: fonts.fontStyle9["font-style"],
                      fontWeight: fonts.fontStyle9["font-weight"],
                      width: "600px",
                    }}
                  >
                    <b>Start Time</b>
                  </TableCell>
                  {/* <TableCell style={tableStyle.tableCell.cellStyle}>
                <b>End Time</b>
              </TableCell> */}
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Loss Time(h:m:s)</b>
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Loss Type</b>
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Zone</b>
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Machine</b>
                  </TableCell>
                  <TableCell
                    style={{
                      color: "whitesmoke",
                      textAlign: "left",
                      fontSize: "14px",
                      padding: "7px",
                      paddingLeft: "5rem",
                      fontFamily: fonts.fontStyle9["font-family"],
                      fontStyle: fonts.fontStyle9["font-style"],
                      fontWeight: fonts.fontStyle9["font-weight"],
                      width: "400px",
                    }}
                  >
                    <b>Reason</b>
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ marginBottom: "5rem" }}>
                {paginatedData.map((rowData) => {
                  const startTime = DateTime.fromISO(
                    rowData.starttime.substr(0, 19)
                  ).toLocaleString(DateTime.DATETIME_MED);
                  const endTime = DateTime.fromISO(
                    rowData.endtime.substr(0, 19)
                  ).toLocaleString(DateTime.DATETIME_MED);
                  const duration = rowData.duration.substr(11, 8);
                  return (
                    <TableRow key={rowData.stopid}>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {startTime}
                      </TableCell>
                      {/* <TableCell style={tableStyle.tableRow.rowStyle}>
                     {endTime}
                   </TableCell> */}
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {duration}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {lossTypesMap[rowData.lossid] || "None"}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.zone}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.machinename}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.reason}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {/* <Button  variant="contained" size="small" style={{background: colors.info.main,}}> 
                         <UpdateIcon fontSize='small'/>
                     </Button> */}

                        <IconButton
                          variant="contained"
                          aria-label="update"
                          color="primary"
                          onClick={() => handleModalOpen(rowData.stopid)}
                          // style={{background: colors.info.main , color : "white"}}
                        >
                          {/* <UpdateIcon fontSize="small" /> */}
                          <FaEdit style={{ margin: "-2px" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div style={{ marginBottom: "1rem" }}>
              <Pagination
                count={pagesInBreakdown}
                page={page}
                onChange={handleChangePage}
                color="primary"
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
                    "&:hover": {
                      backgroundColor: colors.info.light,
                    },
                    "&.Mui-selected": {
                      backgroundColor: colors.info.main,
                      color: "white",
                      "&:hover": {
                        backgroundColor: colors.info.dark,
                      },
                    },
                  },
                }}
              />
            </div>
          </>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      color: "whitesmoke",
                      textAlign: "left",
                      fontSize: "14px",
                      padding: "7px",
                      paddingLeft: "5rem",
                      fontFamily: fonts.fontStyle9["font-family"],
                      fontStyle: fonts.fontStyle9["font-style"],
                      fontWeight: fonts.fontStyle9["font-weight"],
                      width: "600px",
                    }}
                  >
                    <b>Start Time</b>
                  </TableCell>
                  {/* <TableCell style={tableStyle.tableCell.cellStyle}>
                  <b>End Time</b>
                </TableCell> */}
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Loss Time(h:m:s)</b>
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Loss Type</b>
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Zone</b>
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Machine</b>
                  </TableCell>
                  <TableCell
                    style={{
                      color: "whitesmoke",
                      textAlign: "left",
                      fontSize: "14px",
                      padding: "7px",
                      paddingLeft: "5rem",
                      fontFamily: fonts.fontStyle9["font-family"],
                      fontStyle: fonts.fontStyle9["font-style"],
                      fontWeight: fonts.fontStyle9["font-weight"],
                      width: "400px",
                    }}
                  >
                    <b>Reason</b>
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ marginBottom: "5rem" }}>
                {paginatedData2.map((rowData) => {
                  const startTime = DateTime.fromISO(
                    rowData.starttime.substr(0, 19)
                  ).toLocaleString(DateTime.DATETIME_MED);
                  const endTime = DateTime.fromISO(
                    rowData.endtime.substr(0, 19)
                  ).toLocaleString(DateTime.DATETIME_MED);
                  const duration = rowData.duration.substr(11, 8);
                  return (
                    <TableRow key={rowData.stopid}>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {startTime}
                      </TableCell>
                      {/* <TableCell style={tableStyle.tableRow.rowStyle}>
                    {endTime}
                  </TableCell> */}
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {duration}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {lossTypesMap[rowData.lossid] || "None"}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.zone}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.machinename}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.reason}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {/* <Button  variant="contained" size="small" style={{background: colors.info.main,}}> 
                        <UpdateIcon fontSize='small'/>
                    </Button> */}

                        <IconButton
                          variant="contained"
                          aria-label="update"
                          color="primary"
                          onClick={() => handleModalOpen(rowData.stopid)}
                          // style={{background: colors.info.main , color : "white"}}
                        >
                          {/* <UpdateIcon fontSize="small" /> */}
                          <FaEdit style={{ margin: "-2px" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div style={{ marginBottom: "1rem" }}>
              <Pagination
                count={pagesInBreakdown2}
                page={page2}
                onChange={handleChangePage2}
                color="primary"
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
                    "&:hover": {
                      backgroundColor: colors.info.light,
                    },
                    "&.Mui-selected": {
                      backgroundColor: colors.info.main,
                      color: "white",
                      "&:hover": {
                        backgroundColor: colors.info.dark,
                      },
                    },
                  },
                }}
              />
            </div>
          </>
        )}
      </TableContainer>

      {/* Unfilled Table */}
      <TableContainer
        className="custom-table"
        component={Paper}
        style={{
          marginTop: "1rem",
          backgroundColor: "transparent",
          borderRadius: "12px",
          boxShadow: "1px 1px 4px 1px",
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
              marginTop: "0.8rem",
              color: "whitesmoke",
              fontSize: "20px",
              textAlign: "left",
              fontFamily: fonts.fontStyle9["font-family"],
              fontStyle: fonts.fontStyle9["font-style"],
              fontWeight: fonts.fontStyle9["font-weight"],
            }}
          >
            Unfilled
          </p>
          {!showUnfilledFilter ? (
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
                variant="contained"
                size="small"
                style={{
                  fontFamily: fonts.fontStyle7["font-family"],
                  fontStyle: fonts.fontStyle7["font-style"],
                  fontWeight: fonts.fontStyle7["font-weight"],
                }}
                endIcon={
                  <FilterAltIcon
                    fontSize="medium"
                    style={{ color: "whitesmoke" }}
                  />
                }
                onClick={handleShowUnfilledFilter}
              >
                Open
              </Button>

              {/* <IconButton onClick={handleShowUnfilledFilter}>
                <FilterAltIcon
                  fontSize="medium"
                  style={{ marginLeft: "10px", color: "whitesmoke" }} // Adds space between the text and icon
                />
              </IconButton> */}
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
                variant="contained"
                size="small"
                color="error"
                style={{
                  fontFamily: fonts.fontStyle7["font-family"],
                  fontStyle: fonts.fontStyle7["font-style"],
                  fontWeight: fonts.fontStyle7["font-weight"],
                }}
                endIcon={
                  <FilterAltOffIcon
                    fontSize="medium"
                    style={{ color: "whitesmoke" }}
                  />
                }
                onClick={handleShowUnfilledFilter}
              >
                Close
              </Button>

              {/* <IconButton onClick={handleShowUnfilledFilter}>
                <FilterAltOffIcon
                  fontSize="medium"
                  style={{ marginLeft: "10px", color: "whitesmoke" }} // Adds space between the text and icon
                />
              </IconButton> */}
            </Tooltip>
          )}
        </div>

        <div
          className={`filter-card-container ${
            showUnfilledFilter ? "show" : ""
          }`}
        >
          {showUnfilledFilter && <FilterCard3 />}
        </div>

        {showUnfilledFilter ? (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      color: "whitesmoke",
                      textAlign: "left",
                      fontSize: "14px",
                      padding: "7px",
                      paddingLeft: "5rem",
                      fontFamily: fonts.fontStyle9["font-family"],
                      fontStyle: fonts.fontStyle9["font-style"],
                      fontWeight: fonts.fontStyle9["font-weight"],
                      width: "500px",
                    }}
                  >
                    <b>Start Time</b>
                  </TableCell>
                  {/* <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>End Time</b>
                  </TableCell> */}
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Loss Time(h:m:s)</b>
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Loss Type</b>
                  </TableCell>
                  <TableCell
                    style={{
                      color: "whitesmoke",
                      textAlign: "left",
                      fontSize: "14px",
                      padding: "7px",
                      paddingLeft: "5rem",
                      fontFamily: fonts.fontStyle9["font-family"],
                      fontStyle: fonts.fontStyle9["font-style"],
                      fontWeight: fonts.fontStyle9["font-weight"],
                      width: "100px",
                    }}
                  >
                    <b>Zone</b>
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Machine</b>
                  </TableCell>
                  <TableCell
                    style={{
                      color: "whitesmoke",
                      textAlign: "left",
                      fontSize: "14px",
                      padding: "7px",
                      paddingLeft: "5rem",
                      fontFamily: fonts.fontStyle9["font-family"],
                      fontStyle: fonts.fontStyle9["font-style"],
                      fontWeight: fonts.fontStyle9["font-weight"],
                      width: "400px",
                    }}
                  >
                    <b>Reason</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((data) => {
                  const startTime = DateTime.fromISO(
                    data.starttime.substr(0, 19)
                  ).toLocaleString(DateTime.DATETIME_MED);
                  const endTime = DateTime.fromISO(
                    data.endtime.substr(0, 19)
                  ).toLocaleString(DateTime.DATETIME_MED);
                  const duration = data.duration.substr(11, 8);
                  return (
                    <TableRow
                      key={data.stopid}
                      style={tableStyle.tableRowMargin.margin}
                    >
                      <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {startTime}
                      </TableCell>
                      {/* <TableCell style={tableStyle.tableRow2.rowStyle}>
                      {endTime}
                    </TableCell> */}
                      <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {duration}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {lossTypesMap[data.lossid] || "None"}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {data.zone}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {data.machinename}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {data.reason}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div style={{ marginBottom: "1rem" }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                color="primary"
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
                    "&:hover": {
                      backgroundColor: colors.info.light,
                    },
                    "&.Mui-selected": {
                      backgroundColor: colors.info.main,
                      color: "white",
                      "&:hover": {
                        backgroundColor: colors.info.dark,
                      },
                    },
                  },
                }}
              />
            </div>
          </>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      color: "whitesmoke",
                      textAlign: "left",
                      fontSize: "14px",
                      padding: "7px",
                      paddingLeft: "5rem",
                      fontFamily: fonts.fontStyle9["font-family"],
                      fontStyle: fonts.fontStyle9["font-style"],
                      fontWeight: fonts.fontStyle9["font-weight"],
                      width: "500px",
                    }}
                  >
                    <b>Start Time</b>
                  </TableCell>
                  {/* <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>End Time</b>
                  </TableCell> */}
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Loss Time(h:m:s)</b>
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Loss Type</b>
                  </TableCell>
                  <TableCell
                    style={{
                      color: "whitesmoke",
                      textAlign: "left",
                      fontSize: "14px",
                      padding: "7px",
                      paddingLeft: "5rem",
                      fontFamily: fonts.fontStyle9["font-family"],
                      fontStyle: fonts.fontStyle9["font-style"],
                      fontWeight: fonts.fontStyle9["font-weight"],
                      width: "100px",
                    }}
                  >
                    <b>Zone</b>
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    <b>Machine</b>
                  </TableCell>
                  <TableCell
                    style={{
                      color: "whitesmoke",
                      textAlign: "left",
                      fontSize: "14px",
                      padding: "7px",
                      paddingLeft: "5rem",
                      fontFamily: fonts.fontStyle9["font-family"],
                      fontStyle: fonts.fontStyle9["font-style"],
                      fontWeight: fonts.fontStyle9["font-weight"],
                      width: "400px",
                    }}
                  >
                    <b>Reason</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData2.map((data) => {
                  const startTime = DateTime.fromISO(
                    data.starttime.substr(0, 19)
                  ).toLocaleString(DateTime.DATETIME_MED);
                  const endTime = DateTime.fromISO(
                    data.endtime.substr(0, 19)
                  ).toLocaleString(DateTime.DATETIME_MED);
                  const duration = data.duration.substr(11, 8);
                  return (
                    <TableRow
                      key={data.stopid}
                      style={tableStyle.tableRowMargin.margin}
                    >
                      <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {startTime}
                      </TableCell>
                      {/* <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {endTime}
                      </TableCell> */}
                      <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {duration}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {lossTypesMap[data.lossid] || "None"}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {data.zone}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {data.machinename}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow2.rowStyle}>
                        {data.reason}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div style={{ marginBottom: "1rem" }}>
              <Pagination
                count={totalPages2}
                page={currentPage2}
                onChange={handlePageChange2}
                variant="outlined"
                color="primary"
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
                    "&:hover": {
                      backgroundColor: colors.info.light,
                    },
                    "&.Mui-selected": {
                      backgroundColor: colors.info.main,
                      color: "white",
                      "&:hover": {
                        backgroundColor: colors.info.dark,
                      },
                    },
                  },
                }}
              />
            </div>
          </>
        )}
      </TableContainer>
    </>
  );
};

export default ConsolidatedLosses;
