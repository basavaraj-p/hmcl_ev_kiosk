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

const ITEMS_PER_PAGE = 5;

const SSHTable = () => {
  const [tableData, setTableData] = useState([]);
  //   console.log("tableData : ", tableData);

  const [page, setPage] = useState(1);
  // const [loading, setLoading] = useState(false);
  // console.log("tableRefresh : ", tableRefresh);
  const shiftsHistory = useSelector(
    (state) => state.shiftsHistory.shiftsHistory
  );
  // console.log("shiftsHistory : ", shiftsHistory.length);
  useEffect(() => {
    setTableData(shiftsHistory);
  }, [shiftsHistory]);

  const shiftNames = {
    1: "Shift - A",
    2: "Shift - B",
    3: "Shift - C",
  };

  const columns = useMemo(
    () => [
      { header: "Adid", accessorKey: "useradid", width: "20%" },
      {
        header: "Date",
        accessorKey: "updatetime",
        cell: ({ getValue }) => format(getValue(), "dd-MM-yyyy"),
        width: "20%",
      },
      {
        header: "Shift",
        accessorKey: "shiftid",
        cell: ({ getValue }) => shiftNames[getValue()],
        width: "20%",
      },
      {
        header: "Zone",
        accessorKey: "zone",
        cell: ({ getValue }) => getValue(),
        width: "20%",
      },
      {
        header: "Action",
        accessorKey: "actiontype",
        cell: ({ getValue }) => getValue(),
        width: "20%",
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
      {shiftsHistory.length !== 0 ? (
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
      ) : null}
      {shiftsHistory.length !== 0 ? (
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
      ) : null}
    </div>
  );
};

export default SSHTable;
