import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Pagination, Box, Typography } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import colors from "../../style/colors";
import fonts from "../../style/fonts";

const ITEMS_PER_PAGE = 10;

const getShift = (value) => {
  const shifts = {
    1: "Shift - A",
    2: "Shift - B",
    3: "Shift - C",
  };
  return shifts[value] || "Unknown Shift";
};

const getMachineName = (assetid, data) => {
  const machine = data.find((item) => item.assetid === assetid);
  if (!machine) return "Machine not found";

  const { machinename, zone } = machine;
  const duplicates = data.filter(
    (item) => item.machinename === machinename && item.assetid !== assetid
  );

  return duplicates.length > 0 ? `${machinename} ${zone}` : machinename;
};

const RejectionTable = (refresh, setRefresh) => {
  const [tableData, setTableData] = useState([]);
  const [assetIdData, setAssetIdData] = useState([]);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    try {
      const [rejectionResponse, assetResponse] = await Promise.all([
        axios.get(
          "https://hmcl-backend.onrender.com/api/v1/sop-rejection-rework/fetch-rejection-reworks"
        ),
        axios.get(
          "https://hmcl-backend.onrender.com/api/v1/sop-rejection-rework/fetch-assets"
        ),
      ]);
      setTableData(rejectionResponse.data.rowData);
      setAssetIdData(assetResponse.data.rowData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refresh]);

  const columns = useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "datetime",
        cell: ({ getValue }) => format(new Date(getValue()), "dd-MM-yyyy"),
      },
      {
        header: "Shift",
        accessorKey: "shiftid",
        cell: ({ getValue }) => getShift(getValue()),
      },
      {
        header: "Barcode",
        accessorKey: "barcode",
      },
      {
        header: "Machine",
        accessorKey: "assetid",
        cell: ({ getValue }) => getMachineName(getValue(), assetIdData),
      },
      {
        header: "Type",
        accessorKey: "defect_type",
      },
      {
        header: "Code",
        accessorKey: "defectcode",
      },
      // {
      //   header: "Charge_Delta",
      //   // header: "Charge_Delta_mV",
      //   accessorKey: "Charge_Delta_mV",
      // },
      // {
      //   header: "Discharge_Delta",
      //   // header: "Discharge_Delta_mV",
      //   accessorKey: "Discharge_Delta_mV",
      // },
      {
        header: "Reason",
        accessorKey: "reason",
      },
    ],
    [assetIdData]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return tableData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [tableData, page]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePageChange = (event, value) => setPage(value);

  return (
    <Box>
      <Box sx={{ maxWidth: "100%" }}>
        <table
          style={{
            width: "100%",
            // minWidth: "1000px", // Adjust this value based on your needs
            borderCollapse: "separate",
            borderSpacing: 0,
            background: "transparent",
            borderRadius: "12px",
            // overflow: "hidden",
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
                      textAlign: "left",
                      ...fonts.fontStyle9,
                      width: `${100 / columns.length}%`, // Evenly distribute column widths
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
                      borderTop: "solid 0.5px grey",
                      color: "whitesmoke",
                      textAlign: "left",
                      ...fonts.fontStyle7,
                      width: `${100 / columns.length}%`, // Evenly distribute column widths
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      <Pagination
        count={Math.ceil(tableData.length / ITEMS_PER_PAGE)}
        page={page}
        onChange={handlePageChange}
        variant="outlined"
        sx={{
          display: "flex",
          justifyContent: "end",
          marginTop: "20px",
          "& .MuiPaginationItem-root": {
            color: colors.info.main,
            borderColor: "whitesmoke",
            ...fonts.fontStyle7,
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
    </Box>
  );
};

export default RejectionTable;
