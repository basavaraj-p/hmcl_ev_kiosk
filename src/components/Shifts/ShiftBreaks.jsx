import React, { useState, useEffect, useMemo } from "react";
import fonts from "../../style/fonts";
import colors from "../../style/colors";
import {
  Button,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  OutlinedInput,
  FormControl,
  Select,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  parse,
  format,
  addMinutes,
  isBefore,
  isEqual,
  parseISO,
} from "date-fns";
import differenceInMinutes from "date-fns/differenceInMinutes";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import Sweetalert from "../Special Components/Sweetalert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  convertTimeVanilla,
  generateTimeSlots,
  getFormattedShifts,
} from "./helperFunctions";

const ShiftBreaks = ({ handleShowDialog, showDialog }) => {
  const [tableData, setTableData] = useState([]);
  console.log("tableData : ", tableData);
  const [description, setDescription] = useState("");
  //   const startTimes = generateTimeSlots("06:30", "15:00");
  //   const endTimes = generateTimeSlots("07:30", "15:00");
  const [startTimes, setStartTimes] = useState([]);
  const [endTimes, setEndTimes] = useState([]);
  const [startTime, setStartTime] = useState("01:00 AM");
  const [endTime, setEndTime] = useState("02:00 AM");

  //   console.log({ startTime, endTime, startTimes, endTimes });
  //   console.log(convertTo24HourFormat(startTime));

  const shifts = useSelector((state) => state.shifts.shifts);
  const adid = useSelector((state) => state.adid.adid);
  // console.log("shifts : ", shifts);

  const fetchData = async () => {
    try {
      const breaks = await axios.get(
        "https://hmcl-backend.onrender.com/api/v1/sop-shifts/shift-breaks"
      );
      // console.log("breaks : ", breaks.data.rowData);
      const currentShiftId = shifts[0].shiftid;
      const filteredBreaks = breaks.data.rowData.filter(
        (item) => item.shiftid === currentShiftId
      );
      setTableData(filteredBreaks);
      setStartTimes(
        generateTimeSlots(
          getFormattedShifts(shifts)[0].shiftfrom,
          getFormattedShifts(shifts)[0].shiftto
        )
      );
      setEndTimes(
        generateTimeSlots(
          getFormattedShifts(shifts)[0].shiftfrom,
          getFormattedShifts(shifts)[0].shiftto
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [shifts]);

  // const handleSubmit = (row) => {
  //   console.log(row.original.breakid);
  // };

  const handleChangeStartTime = (event) => {
    const newValue = event.target.value;
    setStartTime(newValue);
  };

  const handleChangeEndTime = (event) => {
    const newValue = event.target.value;
    setEndTime(newValue);
  };

  const columns = useMemo(
    () => [
      //   { header: "#", cell: (info) => info.row.index + 1, width: "5%" },
      {
        header: "Start(HH:mm)",
        accessorKey: "breakstart",
        cell: ({ getValue }) => {
          // Parse the time string into a Date object
          // Note: We need to add a date part to make it a valid ISO string
          const date = parseISO(`1970-01-01T${getValue()}`);

          // Format the Date object into "06:30 AM" format
          const formattedTime = format(date, "hh:mm a");
          return formattedTime;
        },
        width: "20%",
      },
      {
        header: "End(HH:mm)",
        accessorKey: "breakend",
        cell: ({ getValue }) => {
          // Parse the time string into a Date object
          // Note: We need to add a date part to make it a valid ISO string
          const date = parseISO(`1970-01-01T${getValue()}`);

          // Format the Date object into "06:30 AM" format
          const formattedTime = format(date, "hh:mm a");
          return formattedTime;
        },
        width: "20%",
      },
      {
        header: "Duration(mins)",
        cell: ({ row }) => {
          // Parse the time strings into Date objects
          // Note: We need to add a date part to make them valid ISO strings
          const date1 = parseISO(`1970-01-01T${row.original.breakend}`);
          const date2 = parseISO(`1970-01-01T${row.original.breakstart}`);

          // Calculate the difference in minutes
          const diffInMinutes = differenceInMinutes(date1, date2);
          return diffInMinutes;
        },
        width: "15%",
      },
      {
        header: "Description",
        accessorKey: "breakdescription",
        width: "30%",
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <IconButton
            variant="contained"
            onClick={() => handleDelete(row)}
            size="small"
            style={{
              fontFamily: fonts.fontStyle7["font-family"],
              fontStyle: fonts.fontStyle7["font-style"],
              fontWeight: fonts.fontStyle7["font-weight"],
              background: "transparent",
            }}
          >
            <DeleteIcon style={{ color: colors.error.main }} />
          </IconButton>
        ),
        width: "10%",
      },
    ],
    []
  );

  const handleUpdate = async () => {
    // if (!description) return;
    if (tableData.length === 5) {
      Sweetalert(
        "Error",
        "Cannot insert more than 5 shift breaks per shift!",
        "error",
        "OK",
        false
      );
    }
    try {
      // console.log("tableData.length : ",tableData.length);

      await axios.post(
        "https://hmcl-backend.onrender.com/api/v1/sop-shifts/shift-update-breaks",
        {
          shiftid: shifts[0].shiftid,
          breakstart: convertTimeVanilla(startTime),
          breakend: convertTimeVanilla(endTime),
          breakdescription: description,
        }
      );
      await axios.post(
        "https://hmcl-backend.onrender.com/api/v1/sop-shifts-history/create-shift-break-history",
        {
          adid: adid,
          shiftid: shifts[0].shiftid,
          breakstart: convertTimeVanilla(startTime),
          breakend: convertTimeVanilla(endTime),
          breakdescription: description,
          actiontype: "Create",
        }
      );
      fetchData();
      // .then(() => console.log("success"))
      // .catch((err) => console.error(err));

      handleShowDialog();
    } catch (error) {
      console.error("Error updating shiftBreak:", error);
    }
  };

  async function handleDelete(row) {
    if (!row.original) return;
    // console.log("row.original : ", row.original);

    try {
      const result = await Sweetalert(
        "WARNING",
        "Are you sure you want to delete this shift break?",
        "warning",
        "Delete",
        true
      );

      if (result.isConfirmed) {
        await axios.post(
          "https://hmcl-backend.onrender.com/api/v1/sop-shifts/shift-delete-breaks",
          {
            breakid: row.original.breakid,
          }
        );
        await axios.post(
          "https://hmcl-backend.onrender.com/api/v1/sop-shifts-history/create-shift-break-history",
          {
            adid: adid,
            shiftid: row.original.shiftid,
            breakstart: row.original.breakstart,
            breakend: row.original.breakend,
            breakdescription: row.original.breakdescription,
            actiontype: "Delete",
          }
        );
        fetchData();
      } else {
        // console.log("Delete cancelled");
      }

      // fetchData();
      // .then(() => console.log("success"))
      // .catch((err) => console.error(err));

      //   handleShowDialog();
    } catch (error) {
      console.error("Error deleteing shiftBreak:", error);
    }
  }

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          background: "transparent",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    color: "whitesmoke",
                    padding: "10px",
                    textAlign: "center",
                    fontFamily: fonts.fontStyle9["font-family"],
                    fontStyle: fonts.fontStyle9["font-style"],
                    fontWeight: fonts.fontStyle9["font-weight"],
                    width: header.column.columnDef.width,
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    padding: "0.6",
                    borderTop: "solid 0.5px grey",
                    color: "whitesmoke",
                    textAlign: "center",
                    fontFamily: fonts.fontStyle7["font-family"],
                    fontStyle: fonts.fontStyle7["font-style"],
                    fontWeight: fonts.fontStyle7["font-weight"],
                    width: cell.column.columnDef.width,
                    height: "1rem",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog
        open={showDialog}
        onClose={handleShowDialog}
        fullWidth
        maxWidth="sm"
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
            color: colors.white.main,
            fontFamily: fonts.fontStyle7["font-family"],
            fontStyle: fonts.fontStyle7["font-style"],
            fontWeight: fonts.fontStyle7["font-weight"],
          }}
        >
          Add Shift Break
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "row",
              gap: "16px", // Adds a gap between the TextFields
            }}
          >
            <div
              style={{
                width: "100%", // Adjust as needed
              }}
            >
              <div
                style={{
                  color: `${colors.white.main}`,
                  fontFamily: fonts.fontStyle3["font-family"],
                  fontStyle: fonts.fontStyle3["font-style"],
                  fontWeight: fonts.fontStyle3["font-weight"],
                }}
              >
                Shifts
              </div>
              <TextField
                autoFocus
                // label="Machine Short Name"
                variant="outlined"
                value={shifts[0].shiftname}
                // disabled
                // margin="normal"
                size="small"
                InputLabelProps={{
                  shrink: false, // This hides the label but keeps space for it
                }}
                sx={{
                  width: "100%", // Adjust as needed

                  // Set the text color
                  "& .MuiInputBase-input": {
                    color: colors.white.main, // Change text color
                    fontFamily: fonts.fontStyle3["font-family"],
                    fontStyle: fonts.fontStyle3["font-style"],
                    fontWeight: fonts.fontStyle3["font-weight"],
                  },

                  // Ensure the border is always visible and customizable
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12.5px",

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

            <div
              style={{
                width: "100%", // Adjust as needed
              }}
            >
              <div
                style={{
                  color: `${colors.white.main}`,
                  fontFamily: fonts.fontStyle3["font-family"],
                  fontStyle: fonts.fontStyle3["font-style"],
                  fontWeight: fonts.fontStyle3["font-weight"],
                }}
              >
                Break Description
              </div>
              <TextField
                autoFocus
                // label="Cycle Time"
                type="text"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                // margin="normal"
                size="small"
                InputLabelProps={{
                  shrink: false, // This hides the label but keeps space for it
                }}
                sx={{
                  width: "100%", // Adjust as needed

                  // Set the text color
                  "& .MuiInputBase-input": {
                    color: colors.white.main, // Change text color
                    fontFamily: fonts.fontStyle3["font-family"],
                    fontStyle: fonts.fontStyle3["font-style"],
                    fontWeight: fonts.fontStyle3["font-weight"],
                  },
                  // Ensure the border is always visible and customizable
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12.5px",

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

            <FormControl style={{ width: "100%" }}>
              <div
                style={{
                  color: `${colors.white.focus}`,
                  fontFamily: fonts.fontStyle3["font-family"],
                  fontStyle: fonts.fontStyle3["font-style"],
                  fontWeight: fonts.fontStyle3["font-weight"],
                }}
              >
                Start Time
              </div>
              <Select
                value={startTime}
                onChange={handleChangeStartTime}
                size="small"
                input={<OutlinedInput id="select-multiple-chip" />}
                sx={{
                  borderRadius: "12.5px",
                  minHeight: "2rem",
                  color: `${colors.white.focus}`, // This sets the color of the selected value
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${colors.grey[500]} !important`,
                    borderWidth: "1.5px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${colors.grey[500]} !important`,
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${colors.grey[500]} !important`,
                    borderWidth: "1.5px",
                  },
                  "& .MuiSelect-icon": {
                    color: `${colors.white.focus} !important`,
                  },
                  fontFamily: fonts.fontStyle7["font-family"],
                  fontStyle: fonts.fontStyle7["font-style"],
                  fontWeight: fonts.fontStyle7["font-weight"],
                }}
              >
                {startTimes.map((item, index) => (
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

            <FormControl style={{ width: "100%" }}>
              <div
                style={{
                  color: `${colors.white.focus}`,
                  fontFamily: fonts.fontStyle3["font-family"],
                  fontStyle: fonts.fontStyle3["font-style"],
                  fontWeight: fonts.fontStyle3["font-weight"],
                }}
              >
                End Time
              </div>
              <Select
                value={endTime}
                onChange={handleChangeEndTime}
                size="small"
                input={<OutlinedInput id="select-multiple-chip" />}
                sx={{
                  borderRadius: "12.5px",
                  minHeight: "2rem",
                  color: `${colors.white.focus}`, // This sets the color of the selected value
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${colors.grey[500]} !important`,
                    borderWidth: "1px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${colors.grey[500]} !important`,
                    borderWidth: "1px",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${colors.grey[500]} !important`,
                    borderWidth: "1px",
                  },
                  "& .MuiSelect-icon": {
                    color: `${colors.white.focus} !important`,
                  },
                  fontFamily: fonts.fontStyle7["font-family"],
                  fontStyle: fonts.fontStyle7["font-style"],
                  fontWeight: fonts.fontStyle7["font-weight"],
                }}
              >
                {endTimes.map((item, index) => (
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
          </div>
        </DialogContent>
        <DialogActions
          style={{
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
                Add shift break
              </Typography>
            }
            placement="bottom"
          >
            <Button
              onClick={handleUpdate}
              variant="contained"
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
                Close dialog
              </Typography>
            }
            placement="bottom"
          >
            <Button
              onClick={handleShowDialog}
              variant="contained"
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
    </div>
  );
};

export default ShiftBreaks;
