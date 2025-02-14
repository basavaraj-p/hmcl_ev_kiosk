import React, { useState, useEffect, useMemo } from "react";
import {
  Pagination,
  LinearProgress,
  Box,
  Button,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import colors from "../../style/colors";
import tripleLinearGradient from "../../style/tripleLinearGradient";
import fonts from "../../style/fonts";
import { useSelector } from "react-redux";
import format from "date-fns/format";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import Sweetalert from "../Special Components/Sweetalert";

const ITEMS_PER_PAGE = 5;

function getShift(value) {
  if (value === 1) {
    return "Shift - A";
  } else if (value === 2) {
    return "Shift - B";
  } else {
    return "Shift - C";
  }
}

const ShiftsSchedulerTable = ({ setTableRefresh, tableRefresh }) => {
  const [tableData, setTableData] = useState([]);
  //   console.log("tableData : ", tableData);

  const [page, setPage] = useState(1);
  // const [loading, setLoading] = useState(false);
  // console.log("tableRefresh : ", tableRefresh);
  const adid = useSelector((state) => state.adid.adid);

  const fetchData = async () => {
    try {
      const shiftSchedules = await axios.get(
        "https://hmcl-backend.onrender.com/api/v1/sop-shifts/shift-schedules"
      );
      setTableData(shiftSchedules.data.rowData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch data immediately
    fetchData();

    // Set up interval to fetch data every 30 seconds
    // const intervalId = setInterval(fetchData, 10000 * 30);

    // Clean up interval on component unmount
    // return () => clearInterval(intervalId);
  }, [tableRefresh]);

  const handleSubmit = async (row) => {
    try {
      const result = await Sweetalert(
        "WARNING",
        "Are you sure you want to delete this schedule?",
        "warning",
        "Delete",
        true
      );

      if (result.isConfirmed) {
        // console.log("Delete confirmed for:", row.original);
        await deleteSchedule(row.original.scheduleid);
        await updateShiftHistory(
          adid,
          row.original.scheduledate,
          row.original.shiftid,
          row.original.zones
        );
        await fetchData();

        // Perform delete operation here
        // For example:
        // await deleteSchedule(row.original.id);
        // setTableData(prevData => prevData.filter(item => item.id !== row.original.id));
      } else {
        // console.log("Delete cancelled");
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
    }
  };

  const deleteSchedule = async (scheduleid) => {
    // if (!editingRow) return;

    try {
      const response = await axios.post(
        "https://hmcl-backend.onrender.com/api/v1/sop-shifts/shift-delete-schedule",
        {
          scheduleid: scheduleid,
        }
      );
      // .then(() => console.log("success"))
      // .catch((err) => console.error(err));
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const updateShiftHistory = async (adid, scheduledate, shiftid, zones) => {
    // if (!editingRow) return;

    try {
      const response = await axios.post(
        "https://hmcl-backend.onrender.com/api/v1/sop-shifts-history/create-shift-history-on-delete",
        {
          adid: adid,
          scheduledate: scheduledate,
          shiftid: shiftid,
          zones: zones,
        }
      );
      // .then(() => console.log("success"))
      // .catch((err) => console.error(err));
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const columns = useMemo(
    () => [
      //   { header: "Name", cell: (info) => info.row.index + 1 },
      {
        header: "Schedule Date",
        accessorKey: "scheduledate",
        cell: ({ getValue }) => format(getValue(), "dd-MM-yyyy"),
        width: "25%",
      },
      {
        header: "Shift",
        accessorKey: "shiftid",
        cell: ({ getValue }) => getShift(getValue()),
        width: "25%",
      },
      //   {
      //     header: "Is Enabled",
      //     accessorKey: "isenabled",
      //     cell: ({ getValue }) => getIsEnabled(getValue()),
      //   },
      //   {
      //     header: "Machine",
      //     accessorKey: "machineshortname",
      //     cell: ({ getValue }) => getMachines(getValue()),
      //   },
      {
        header: "Zone",
        accessorKey: "zones",
        cell: ({ getValue }) => getValue(),
        width: "25%",
      },
      {
        header: "Delete",
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
                Delete Shift?
              </Typography>
            }
            placement="right"
          >
            <IconButton
              variant="contained"
              onClick={() => handleSubmit(row)}
              size="small"
              style={{
                fontFamily: fonts.fontStyle7["font-family"],
                fontStyle: fonts.fontStyle7["font-style"],
                fontWeight: fonts.fontStyle7["font-weight"],
                background: "transparent",
              }}
            >
              <DeleteIcon style={{ color: colors.error.main }} />
              {/* View */}
            </IconButton>
          </Tooltip>
        ),
        width: "25%",
      },
    ],
    []
  );

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return tableData.slice(startIndex, endIndex);
  }, [tableData, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const table = useReactTable({
    data: paginatedData,
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
                    paddingLeft: "7.5%",
                    textAlign: "left",
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
                    padding: "10px",
                    paddingLeft: "7.5%",
                    borderTop: "solid 0.5px grey",
                    color: "whitesmoke",
                    textAlign: "left",
                    fontFamily: fonts.fontStyle7["font-family"],
                    fontStyle: fonts.fontStyle7["font-style"],
                    fontWeight: fonts.fontStyle7["font-weight"],
                    width: cell.column.columnDef.width,
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Pagination
          count={Math.ceil(tableData.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          //   shape="rounded"
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
    </div>
  );
};

export default ShiftsSchedulerTable;
