import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { DateTime } from "luxon";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Sweetalert from "../Special Components/Sweetalert";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Pagination from "@mui/material/Pagination";
import Header from "../Header/Header";
import "./StoppageReasons.css";
import fonts from "../../style/fonts";
import colors from "../../style/colors";
import UpdateIcon from "@mui/icons-material/Update";
import { FaEdit } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import { Tooltip, Typography, Card } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import tableStyle from "./StoppageReasonsStyles";
import FilterCard1 from "./FilterCard1";
import {
  setCurrentMachine1,
  setCurrentZone1,
  setDateRange1,
  reset1,
} from "../../redux/formControlSlice";
import {
  ConstructionOutlined,
  DataArrayRounded,
  DateRange,
} from "@mui/icons-material";
import { current } from "@reduxjs/toolkit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
// import { toggleSidebar } from "../../redux/sidebarSlice";

var Id = 2; // ID that fetches last 10 days data
const StoppageReasons = () => {
  const [tableData, setTableData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [modalTable, setModalTable] = useState({
    stopid: "",
    starttime: "",
    endtime: "",
    duration: "",
    machinename: "",
    zone: "",
    reason: "",
    lossid: "",
  });

  const [filteredTable, setFilteredTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [editDropdown, setEditDropdown] = useState(false);
  const [showFilter, SetShowFilter] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reset1());
  }, []);

  const ITEMS_PER_PAGE = 10;

  var totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  var currentData = tableData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  var totalPages2 = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  var defaultData = tableData.slice(
    (currentPage2 - 1) * ITEMS_PER_PAGE,
    currentPage2 * ITEMS_PER_PAGE
  );

  const filteredData = useSelector((state) => state.formControl1);
  const filterDateNTime = filteredData.dateRange[0].startDate;
  const filterMachine = filteredData.currentMachine;
  const filterZone = filteredData.currentZone;

  // console.log("Filter data stoppage : ", filteredData  );
  // console.log("filterDateNTime ", filterDateNTime);
  // console.log("filterMachine ", filterMachine);
  // console.log("filterZone ", filterZone);
  var filterTable = "1";
  var filterZoneDate = [];

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

      // console.log("Row : ", filterRowDate,  " ",  rowData.zone,  " ",  rowData.machinename," ",rowData.starttime);     // console.log("Filter condition : ",modDate,  " ",  filterZone,  " ",  filterMachine);
      // console.log("filterMachine == rowData.machinename ", filterMachine == rowData.machinename);                      // console.log("filterZone == rowData.zone ", filterZone == rowData.zone);
      // console.log("filterRowDate >= modDate ", filterRowDate >= modDate);                                              // console.log("filterMachine ",filterMachine);

      if (
        filterMachine.length >= 1 &&
        filterZone == rowData.zone &&
        filterRowDate >= modDate
      ) {
        // console.log("********** Stoppage filter ");

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
      }
    });
    // console.log("Filter applied ********* ", filterTable);

    // console.log("pages ",filterTable.length);
    totalPages = Math.ceil(filterTable.length / ITEMS_PER_PAGE);
    currentData = filterTable.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  } else {
    // console.log("non filtered table");
  }

  useEffect(() => {
    if (
      currentData.length <= 0 &&
      showFilter &&
      filterDateNTime.length != 0 &&
      filterMachine.length != "" &&
      filterZone.length != 0
    )
      Swal.fire({
        title: "",
        text: "No data is available ",
        icon: "warning",
        confirmButtonText: "Okay",
      });
  }, [filterTable]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handlePageChange2 = (event, value) => {
    setCurrentPage2(value);
  };

  const handleDropdown = () => {
    setEditDropdown(!editDropdown);
  };

  const handleUpdate = async (stopid, lossid, reason) => {
    const updateStoppageData = {
      stopid: stopid,
      lossid: lossid,
      reason: reason[0],
    };
    if (updateStoppageData.lossid != "" && updateStoppageData.reason != "") {
      try {
        const response = await fetch(
          "https://hmcl-backend.onrender.com/api/v1/sop-stopage-reason/update",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateStoppageData),
          }
        );
        // console.log(
        //   "response stop ",
        //   response,
        //   " ",
        //   response.ok,
        //   " ",
        //   response.status
        // );

        if (response.status != "200") {
          Swal.fire({
            title: "",
            text: "Something went wrong while updating ",
            icon: "warning",
            confirmButtonText: "Retry",
          });
        } else {
          Swal.fire({
            title: "",
            text: "Stoppage reason updated successfully",
            icon: "success",
            confirmButtonText: "Okay",
          });
        }
        const data = await response.json();
        // console.log('Success : ', data);
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      Swal.fire({
        title: "",
        text: "Loss type and reason cannot be empty  ",
        icon: "warning",
        confirmButtonText: "Okay",
      });
    }

    setModalShow(false);
    setEditDropdown(!editDropdown);
    // dispatch(toggleSidebar());   // To toggle the sidebar
  };

  useEffect(() => {
    const fetchData = async () => {
      var response;
      if (showFilter) {
        Id = 1;
      }
      // console.log("Show in stop ", showFilter);

      try {
        response = await axios.get(
          `https://hmcl-backend.onrender.com/api/v1/sop-stopage-reason/count2`,
          {
            params: {
              defaultId: Id,
            },
          }
        );
        // console.log("stop res ", response.data[0].recordset);
        setTableData(response.data);
      } catch (error) {
        console.error("Error while fetching data ", error);
      }
    };
    fetchData();
  }, [modalShow, showFilter]);

  // Labels for each number value
  // Don't change the format of the loss type .
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

  const handleModalOpen = (data) => {
    setModalShow(true);
    // dispatch(toggleSidebar());   // To toggle the sidebar
    const selectedData = tableData.find((tdata) => tdata.stopid === data);
    if (selectedData) {
      // console.log("handleModleOpen  ", lossTypesMap[selectedData.lossid] || "0 : None")
      const LossType = lossTypesMap[selectedData.lossid] || "None";
      setSelectedValue(LossType);
      setModalTable({
        stopid: selectedData.stopid,
        starttime: selectedData.starttime,
        endtime: selectedData.endtime,
        duration: selectedData.duration,
        machinename: selectedData.machinename,
        zone: selectedData.zone,
        reason: selectedData.reason,
        lossid: lossTypesMap[selectedData.lossid] || "None",
      });
    }
  };

  const handleModalClose = () => {
    setModalShow(false);
    // dispatch(toggleSidebar());       // To toggle the sidebar
  };

  const handleShowFilter = () => {
    SetShowFilter(!showFilter);
  };

  // console.log("filter table ", filterTable.length);

  return (
    <>
      <Header />
      {/* Modal */}
      <Dialog
        open={modalShow}
        maxWidth="md"
        style={{ backgroundColor: "rgba(15, 18, 59, 0.7)" }}
        PaperProps={{
          style: {
            // background: "white",
            background:
              "linear-gradient(180deg, #1a1f4d 0%, #23284f 50%, #2d3154 100%)",
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
            marginBottom: "0px",
            fontSize: "x-large",
            // marginTop : "-15px"
          }}
        >
          Update Stoppage Reason
        </DialogTitle>
        <DialogContent>
          {true && (
            <div
              style={{
                color: "white",
                height: "300px",
                width: "470px",
                display: "grid",
                justifyContent: "center",
                flexDirection: "column",
                gridTemplateColumns: "210px 210px",
                gridTemplateRows: "70px 70px",
                columnGap: "20px",
                rowGap: "auto",
              }}
            >
              {/* Zone */}
              <div
                style={{
                  width: "100%",
                  marginTop: "0.2rem",
                  // marginTop: "-20px",
                }}
              >
                <div
                  style={{
                    color: "white", // Label Color
                    fontFamily: fonts.fontStyle3["font-family"],
                    fontStyle: fonts.fontStyle3["font-style"],
                    fontWeight: fonts.fontStyle3["font-weight"],
                    marginBottom: "0.6rem",
                  }}
                >
                  {/* Zone */}
                </div>
                <TextField
                  readOnly
                  fullWidth
                  id="standard-multiline-flexible"
                  value={"Zone : " + modalTable.zone}
                  variant="standard"
                  size="small"
                  InputLabelProps={{
                    shrink: false, // Keeps space for the label
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "white", // Change text color
                      fontFamily: fonts.fontStyle3["font-family"],
                      fontStyle: fonts.fontStyle3["font-style"],
                      fontWeight: fonts.fontStyle3["font-weight"],
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "white", // Border color before focus
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "white", // Border color when focused
                    },
                    // Remove hover styles
                    "& .MuiInput-underline:hover:before": {
                      borderBottomColor: "white", // No color on hover
                    },
                  }}
                />
              </div>

              {/* Machine */}
              <div
                style={{
                  width: "100%",
                  marginTop: "0.2rem",
                }}
              >
                <div
                  style={{
                    color: "white", // Label Color
                    fontFamily: fonts.fontStyle3["font-family"],
                    fontStyle: fonts.fontStyle3["font-style"],
                    fontWeight: fonts.fontStyle3["font-weight"],
                    marginBottom: "0.5rem",
                  }}
                >
                  {/* Machine  */}
                </div>
                <TextField
                  fullWidth
                  readOnly
                  id="standard-multiline-flexible"
                  value={"Machine : " + modalTable.machinename}
                  variant="standard"
                  size="small"
                  InputLabelProps={{
                    shrink: false, // Keeps space for the label
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "white", // Change text color
                      fontFamily: fonts.fontStyle3["font-family"],
                      fontStyle: fonts.fontStyle3["font-style"],
                      fontWeight: fonts.fontStyle3["font-weight"],
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "white", // Border color before focus
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "white", // Border color when focused
                    },
                    // Remove hover styles
                    "& .MuiInput-underline:hover:before": {
                      borderBottomColor: "white", // No color on hover
                    },
                  }}
                />
              </div>

              {/* Start time*/}
              <div
                style={{
                  width: "100%",
                  marginTop: "0.2rem",
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
                  {/* Start Time   */}
                </div>
                <TextField
                  readOnly
                  fullWidth
                  id="standard-multiline-flexible"
                  value={
                    "Start : " +
                    DateTime.fromISO(
                      modalTable.starttime.substr(0, 19)
                    ).toLocaleString(DateTime.DATETIME_MED)
                  }
                  variant="standard"
                  size="small"
                  InputLabelProps={{
                    shrink: false, // Keeps space for the label
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "white", // Change text color
                      fontFamily: fonts.fontStyle3["font-family"],
                      fontStyle: fonts.fontStyle3["font-style"],
                      fontWeight: fonts.fontStyle3["font-weight"],
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "white", // Border color before focus
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "white", // Border color when focused
                    },
                    "& .MuiInput-underline:hover:before": {
                      borderBottomColor: "white",
                    },
                  }}
                />
              </div>

              {/* End time*/}
              <div
                style={{
                  width: "100%",
                  marginTop: "0.2rem",
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
                  {/* End Time     id="standard-multiline-flexible"*/}
                </div>
                <TextField
                  readOnly
                  fullWidth
                  id="standard-multiline-flexible"
                  value={
                    "End : " +
                    DateTime.fromISO(
                      modalTable.endtime.substr(0, 19)
                    ).toLocaleString(DateTime.DATETIME_MED)
                  }
                  variant="standard"
                  size="small"
                  InputLabelProps={{
                    shrink: false, // Keeps space for the label
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "white", // Change text color
                      fontFamily: fonts.fontStyle3["font-family"],
                      fontStyle: fonts.fontStyle3["font-style"],
                      fontWeight: fonts.fontStyle3["font-weight"],
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "white", // Border color before focus
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "white", // Border color when focused
                    },
                    // Remove hover styles
                    "& .MuiInput-underline:hover:before": {
                      borderBottomColor: "white", // No color on hover
                    },
                  }}
                />
              </div>

              {/* Loss time*/}
              <div
                style={{
                  width: "100%",
                  marginTop: "0rem",
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
                  {/* Loss Time*/}
                </div>
                <TextField
                  fullWidth
                  readOnly
                  variant="standard"
                  id="standard-multiline-flexible"
                  value={"Duration: " + modalTable.duration.substr(11, 8)}
                  size="small"
                  InputLabelProps={{
                    shrink: false, // Keeps space for the label
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "white", // Change text color
                      fontFamily: fonts.fontStyle3["font-family"],
                      fontStyle: fonts.fontStyle3["font-style"],
                      fontWeight: fonts.fontStyle3["font-weight"],
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "white", // Border color before focus
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "white", // Border color when focused
                    },
                    // Remove hover styles
                    "& .MuiInput-underline:hover:before": {
                      borderBottomColor: "white", // No color on hover
                    },
                  }}
                />
              </div>

              {/* Loss types */}
              <div
                style={{
                  width: "100%",
                  marginTop: "-0.8rem",
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
                  {/* Loss Types */}
                </div>
                {!editDropdown ? (
                  <TextField
                    variant="outlined"
                    id="outlined"
                    value={modalTable.lossid}
                    onClick={handleDropdown}
                    autoFocus
                    size="small"
                    InputLabelProps={{
                      shrink: false, // This hides the label but keeps space for it
                      readonly: true,
                    }}
                    sx={{
                      width: "100%", // Adjust as needed

                      // Set the text color
                      "& .MuiInputBase-input": {
                        // color: `${colors.info.main}`, // To change text color
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
                      },
                    }}
                  />
                ) : (
                  <TextField
                    select
                    variant="outlined"
                    id="outlined"
                    value={selectedValue}
                    onChange={(event) => setSelectedValue(event.target.value)}
                    autoFocus
                    size="small"
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
                      },

                      ".MuiSelect-icon": {
                        color: "white", // Change this to your desired color
                      },
                    }}
                  >
                    {LossTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label.substring(4, 40)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </div>

              {/* Reasons */}
              <div
                style={{
                  width: "210%",
                  marginTop: "-2.5rem",
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
                  Reason
                </div>
                <TextField
                  id="outlined "
                  value={modalTable.reason}
                  inputProps={{ maxLength: 30 }}
                  // helperText="Max 30 characters allowed !"
                  FormHelperTextProps={{
                    style: { color: "#FFC255" },
                  }}
                  onChange={(event) =>
                    setModalTable({
                      ...modalTable,
                      reason: [event.target.value],
                    })
                  }
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: false, // This hides the label but keeps space for it
                  }}
                  sx={{
                    width: "100%", // Adjust as needed

                    // Set the text color
                    "& .MuiInputBase-input": {
                      // color: `${colors.info.main}`, // Change text color
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
                    },
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions
          style={{
            marginTop: "-62px",
            marginBottom: "20px",
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
                Update Stoppage Reason ?
              </Typography>
            }
            placement="bottom"
          >
            <Button
              onClick={() =>
                handleUpdate(
                  modalTable.stopid,
                  selectedValue,
                  modalTable.reason
                )
              }
              variant="contained"
              // endIcon={<CheckCircleIcon />}
              style={{
                backgroundColor: `${colors.info.main}`,
                fontFamily: fonts.fontStyle1["font-family"],
                fontStyle: fonts.fontStyle1["font-style"],
                fontWeight: fonts.fontStyle1["font-weight"],
              }}
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
              // endIcon={<CancelIcon />}
              style={{
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

      {/* Table to display stoppage reasons */}
      <TableContainer
        className="custom-table"
        component={Paper}
        style={{
          marginTop: "1rem",
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
              marginTop: "0.8rem",
              color: "whitesmoke",
              fontSize: "20px",
              textAlign: "left",
              fontFamily: fonts.fontStyle9["font-family"],
              fontStyle: fonts.fontStyle9["font-style"],
              fontWeight: fonts.fontStyle9["font-weight"],
            }}
          >
            Stoppage Reasons
          </p>

          {/* Filter symbol */}
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
                onClick={handleShowFilter}
              >
                Open
              </Button>
              {/* <IconButton onClick={handleShowFilter}>
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
                color="error"
                size="small"
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
                onClick={handleShowFilter}
              >
                Close
              </Button>

              {/*<IconButton onClick={handleShowFilter}>
                <FilterAltOffIcon
                  fontSize="medium"
                  style={{ marginLeft: "10px", color: "whitesmoke" }} // Adds space between the text and icon
                />
              </IconButton> */}
            </Tooltip>
          )}
        </div>

        {/* Filter component */}
        <div className={`filter-card-container ${showFilter ? "show" : ""}`}>
          {showFilter && <FilterCard1 />}
        </div>
        {/* defaultData */}
        {showFilter ? (
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
                    Start Time
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    Loss Time(h:m:s){" "}
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    Machine
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    Zone
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    Loss Type{" "}
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
                    Reason
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((rowData) => {
                  // const startTime = DateTime.fromISO(
                  //   rowData.starttime.substr(0, 19)
                  // ).toLocaleString(DateTime.DATETIME_MED);
                  // const duration = rowData.duration.substr(11, 8);
                  // console.log("rowData duration cur", rowData.duration);
                  return (
                    <TableRow key={rowData.stopid}>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.starttime}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.duration}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.machinename}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.zone}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {lossTypesMap[rowData.lossid] || "None"}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.reason}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {/* <Button onClick={() => handleModalOpen(rowData.stopid)} variant="contained" size="small" style={{background: colors.info.main,}}>
                       <UpdateIcon fontSize="small"/>
                   </Button> */}

                        <IconButton
                          variant="contained"
                          aria-label="update"
                          color="primary"
                          // style={{background: colors.info.main , color : "white"}}
                          onClick={() => handleModalOpen(rowData.stopid)}
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
                    Start Time
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    Loss Time(h:m:s){" "}
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    Machine
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    Zone
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    Loss Type{" "}
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
                    Reason
                  </TableCell>
                  <TableCell style={tableStyle.tableCell.cellStyle}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {defaultData.map((rowData) => {
                  // const startTime = DateTime.fromISO(
                  //   rowData.starttime.substr(0, 19)
                  // ).toLocaleString(DateTime.DATETIME_MED);
                  // const endTime = DateTime.fromISO(
                  //   rowData.endtime.substr(0, 19)
                  // ).toLocaleString(DateTime.DATETIME_MED);
                  // const duration = rowData.duration.substr(11, 8);
                  // console.log(
                  //   "rowData duration def",
                  //   rowData.duration.substr(11, 8)
                  // );
                  return (
                    <TableRow key={rowData.stopid}>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.starttime}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.duration}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.machinename}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.zone}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {lossTypesMap[rowData.lossid] || "None"}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {rowData.reason}
                      </TableCell>
                      <TableCell style={tableStyle.tableRow.rowStyle}>
                        {/* <Button onClick={() => handleModalOpen(rowData.stopid)} variant="contained" size="small" style={{background: colors.info.main,}}>
                            <UpdateIcon fontSize="small"/>
                        </Button> */}

                        <IconButton
                          variant="contained"
                          aria-label="update"
                          color="primary"
                          // style={{background: colors.info.main , color : "white"}}
                          onClick={() => handleModalOpen(rowData.stopid)}
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

export default StoppageReasons;
