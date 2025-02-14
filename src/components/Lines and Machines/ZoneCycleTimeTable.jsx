import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Chip, Card, IconButton, Tooltip, Typography } from "@mui/material";
import fonts from "../../style/fonts";
import colors from "../../style/colors";
// import UpdateIcon from "@mui/icons-material/Update";
import { FaEdit } from "react-icons/fa";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const ZoneCycleTimeTable = () => {
  const [tableData, setTableData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editCycletime, setEditCycletime] = useState("");
  // console.log("heloooooooooooooooooooooooooooooooooooooo");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://hmcl-backend.onrender.com/api/v1/sop-cycletime/data"
        );
        // console.log("Fetched data:", response.data);
        setTableData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleOpenDialog = (row) => {
    // console.log("Opening dialog for row:", row.original);
    if (row && row.original && row.original.cycletime !== undefined) {
      setEditingRow(row.original);
      setEditCycletime(row.original.cycletime.toString());
      setOpenDialog(true);
    } else {
      console.error("Invalid row data:", row);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRow(null);
    setEditCycletime("");
  };

  const handleUpdate = async () => {
    if (!editingRow) return;

    try {
      await axios.post("https://hmcl-backend.onrender.com/api/v1/sop-cycletime/update", {
        machineshortname: editingRow.machineshortname,
        cycletime: parseFloat(editCycletime),
      });
      // .then(() => console.log("success"))
      // .catch((err) => console.error(err));

      setTableData((prevData) =>
        prevData.map((row) =>
          row.machineshortname === editingRow.machineshortname
            ? { ...row, cycletime: parseFloat(editCycletime) }
            : row
        )
      );
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating cycletime:", error);
    }
  };

  // !Pending
  // !The machineshortname must not be visible to the user
  const columns = React.useMemo(
    () => [
      { header: "Machine Name", accessorKey: "machinename" },
      //   { header: "Asset Id", accessorKey: "assetid" },
      { header: "Zone", accessorKey: "zone" },
      {
        header: "Cycle Time(ms)",
        accessorKey: "cycletime",
        // cell: ({ getValue }) => getValue().toFixed(2),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
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
                Update Zone Cycletime
              </Typography>
            }
            placement="right"
          >
            <IconButton
              variant="contained"
              onClick={() => handleOpenDialog(row)}
              size="small"
              style={{
                fontFamily: fonts.fontStyle7["font-family"],
                fontStyle: fonts.fontStyle7["font-style"],
                fontWeight: fonts.fontStyle7["font-weight"],
                background: "transparent",
              }}
            >
              <FaEdit style={{ color: colors.info.main }} fontSize="medium" />
              {/* update */}
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          //   border: `1px solid ${colors.info.main}`,
          background: "transparent",
          borderRadius: "12px",
          overflow: "hidden",
          // boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
                    paddingLeft: "7.5%",
                    textAlign: "left",
                    fontFamily: fonts.fontStyle9["font-family"],
                    fontStyle: fonts.fontStyle9["font-style"],
                    fontWeight: fonts.fontStyle9["font-weight"],
                    width: "25%", // Adjust width for Actions column
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
                    padding: "10px",
                    paddingLeft: "7.5%",
                    borderTop: "solid 0.5px grey",
                    color: "whitesmoke",
                    // backgroundColor: "whitesmoke",
                    textAlign: "left",
                    fontFamily: fonts.fontStyle7["font-family"],
                    fontStyle: fonts.fontStyle7["font-style"],
                    fontWeight: fonts.fontStyle7["font-weight"],
                    width: "25%", // Adjust width for Actions column
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
        open={openDialog}
        onClose={handleCloseDialog}
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
          Update Cycle Time
        </DialogTitle>
        <DialogContent>
          {editingRow && (
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
                  Machine
                </div>
                <TextField
                  autoFocus
                  // label="Machine Short Name"
                  variant="outlined"
                  value={editingRow.machinename}
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
                  Zone
                </div>
                <TextField
                  autoFocus
                  // label="Zone"
                  variant="outlined"
                  value={editingRow.zone}
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
                  Cycle Time
                </div>
                <TextField
                  autoFocus
                  // label="Cycle Time"
                  type="number"
                  variant="outlined"
                  value={editCycletime}
                  onChange={(e) => setEditCycletime(e.target.value)}
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
                Update Cycletime
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
                Close the dialog
              </Typography>
            }
            placement="bottom"
          >
            <Button
              onClick={handleCloseDialog}
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
    </>
  );
};

export default ZoneCycleTimeTable;
