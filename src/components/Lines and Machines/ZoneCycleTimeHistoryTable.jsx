import React, { useState, useEffect, useMemo } from "react";
import { Pagination, LinearProgress, Box } from "@mui/material";
import axios from "axios";
import colors from "../../style/colors";
import tripleLinearGradient from "../../style/tripleLinearGradient";
import fonts from "../../style/fonts";
import FilterCard from "./FilterCard";
import { useSelector } from "react-redux";
import "./ZoneCycleTimeHistoryTable.css"; // Create this CSS file
import format from "date-fns/format";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const ITEMS_PER_PAGE = 10;

const ZoneCycleTimeHistoryTable = ({ showFilter }) => {
  const { gradients } = colors;
  const { currentMachine, currentZone, dateRange } = useSelector(
    (state) => state.formControl
  );
  const [tableData, setTableData] = useState([]);
  // console.log("tableData : ", tableData);

  const [page, setPage] = useState(1);
  // const [loading, setLoading] = useState(false);

  // console.log("Parent component values:", {
  //   currentMachine,
  //   currentZone,
  //   dateRange,
  // });

  async function fetchFilteredCycletimes(startDate, endDate) {
    try {
      const response = await axios.get(
        "https://hmcl-backend.onrender.com/api/v1/sop-cycletime/filtered",
        {
          params: {
            startDate,
            endDate,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async function getData() {
    try {
      const data = await fetchFilteredCycletimes(
        format(dateRange[0].startDate, "yyyy-MM-dd"),
        format(dateRange[0].endDate, "yyyy-MM-dd")
      );

      const filteredData = data.filter((row) => {
        // If "all" is in either array or both arrays are empty, return all rows
        if (
          currentMachine.includes("all") ||
          currentZone.includes("all") ||
          (currentMachine.length === 0 && currentZone.length === 0)
        ) {
          return true;
        }

        let isMachineMatch = false;
        let isZoneMatch = false;

        // Check if currentMachine array is not empty and perform machine filtering
        if (currentMachine.length > 0) {
          currentMachine.forEach((machine) => {
            if (machine.startsWith("Insertion at")) {
              const [name, zone] = machine.split(" at ");
              if (row.machinename === name && row.zone === zone) {
                isMachineMatch = true;
              }
            } else if (row.machinename === machine) {
              isMachineMatch = true;
            }
          });
        } else {
          // If currentMachine array is empty, consider all machines as a match
          isMachineMatch = true;
        }

        // Check if currentZone array is not empty and perform zone filtering
        if (currentZone.length > 0) {
          currentZone.forEach((zone) => {
            if (row.zone === zone.toString()) {
              isZoneMatch = true;
            }
          });
        } else {
          // If currentZone array is empty, consider all zones as a match
          isZoneMatch = true;
        }

        // Return rows that match both machine and zone criteria
        return isMachineMatch && isZoneMatch;
      });

      setTableData(filteredData);
      setPage(1); // Reset to first page when new data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    getData();
  }, [dateRange, currentMachine, currentZone]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return tableData.slice(startIndex, endIndex);
  }, [tableData, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const columns = useMemo(
    () => [
      { header: "Machine Name", accessorKey: "machinename" },
      { header: "Zone", accessorKey: "zone" },
      {
        header: "Cycle Time(ms)",
        accessorKey: "value",
        cell: ({ getValue }) => parseInt(getValue()),
      },
      {
        header: "Date",
        accessorKey: "time",
        cell: ({ getValue }) => format(getValue(), "dd-MM-yyyy"),
      },
    ],
    []
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // if (loading) {
  //   return (
  //     <Box sx={{ width: "100%" }}>
  //       <LinearProgress />
  //     </Box>
  //   );
  // }

  return (
    <div>
      <div className={`filter-card-container ${showFilter ? "show" : ""}`}>
        {showFilter && <FilterCard />}
      </div>

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

export default ZoneCycleTimeHistoryTable;
