import React, { useState, useEffect, useMemo } from "react";
import fonts from "../../style/fonts";
import colors from "../../style/colors";
import { Button } from "@mui/material";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import differenceInMinutes from "date-fns/differenceInMinutes";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import { useSelector, useDispatch } from "react-redux";
import { setShifts } from "../../redux/shiftsSlice";

const ShiftConfiguration = () => {
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();

  // console.log("tableData : ", [tableData[0]]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shifts = await axios.get(
          "https://hmcl-backend.onrender.com/api/v1/sop-shifts/shifts"
        );
        setTableData(shifts.data.rowData);
        dispatch(setShifts([shifts.data.rowData[0]]));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data immediately
    fetchData();

    // Set up interval to fetch data every 30 seconds
    // const intervalId = setInterval(fetchData, 10000 * 30);

    // Clean up interval on component unmount
    // return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = (row) => {
    // console.log(row);
    dispatch(setShifts([row.original]));
  };

  const columns = useMemo(
    () => [
      { header: "Name", accessorKey: "shiftname" },
      {
        header: "Start(HH:mm)",
        accessorKey: "shiftfrom",
        cell: ({ getValue }) => {
          // Parse the time string into a Date object
          // Note: We need to add a date part to make it a valid ISO string
          const date = parseISO(`1970-01-01T${getValue()}`);

          // Format the Date object into "06:30 AM" format
          const formattedTime = format(date, "hh:mm a");
          return formattedTime;
        },
      },
      {
        header: "End(HH:mm)",
        accessorKey: "shiftto",
        cell: ({ getValue }) => {
          // Parse the time string into a Date object
          // Note: We need to add a date part to make it a valid ISO string
          const date = parseISO(`1970-01-01T${getValue()}`);

          // Format the Date object into "06:30 AM" format
          const formattedTime = format(date, "hh:mm a");
          return formattedTime;
        },
      },
      {
        header: "Breaks",
        cell: ({ row }) => (
          <Button
            variant="contained"
            onClick={() => handleSubmit(row)}
            size="small"
            style={{
              fontFamily: fonts.fontStyle7["font-family"],
              fontStyle: fonts.fontStyle7["font-style"],
              fontWeight: fonts.fontStyle7["font-weight"],
              background: colors.info.main,
            }}
          >
            {/* <FreeBreakfastIcon fontSize="small" /> */}
            View
          </Button>
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
    <div>
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
                    padding: "12px 10px 12px 10px",
                    textAlign: "center",
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
                    padding: "0.6%",
                    // padding: "0.6% 0.6% 0.6% 0.6%",
                    borderTop: "solid 0.5px grey",
                    color: "whitesmoke",
                    // backgroundColor: "whitesmoke",
                    textAlign: "center",
                    fontFamily: fonts.fontStyle7["font-family"],
                    fontStyle: fonts.fontStyle7["font-style"],
                    fontWeight: fonts.fontStyle7["font-weight"],
                    width: "25%", // Adjust width for Actions column
                    height: "3rem",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftConfiguration;
