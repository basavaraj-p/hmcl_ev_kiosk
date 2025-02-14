import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  Grid,
  Button,
  Chip,
  Box,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  Tooltip,
  Typography,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  chip_style,
  form_control_header,
  grid_style,
  select_style,
  menu_item_style,
  validateStrings,
  checkBarcodeDefectCodes,
} from "./helperFunctions";
import colors from "../../style/colors";
import fonts from "../../style/fonts";
import Sweetalert from "../Special Components/Sweetalert";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "40vh",
      width: 250,
    },
  },
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
  getContentAnchorEl: null,
  disableScrollLock: true, // Add this line
};

function getNullAssetBarcodes(data) {
  if (data) {
    return data
      .filter((item) => item.assetId === null)
      .map((item) => item.barcode)
      .join(",");
  } else {
    return [];
  }
}

const RejectionCard2 = ({ refresh, setRefresh }) => {
  const [defectData, setDefectData] = useState([]);
  const [barcodes, setBarcodes] = useState("");
  const [localMachine, setLocalMachine] = useState("");
  const [localDefectCode, setLocalDefectCode] = useState([]);
  const [reason, setReason] = useState("");
  const [screenSize, setScreenSize] = useState(
    Math.round(window.devicePixelRatio * 100)
  );

  const [selectedDefectType, setSelectedDefectType] = useState("");
  const [tableData, setTableData] = useState([]);
  // console.log("tableData : ", tableData);

  const adid = "88880000";
  // const adid = useSelector((state) => state.adid.adid);

  const defectTypes = useMemo(() => ["Reject", "Rework"], []);

  const machines = useMemo(
    () => [
      "Welding integrity",
      "Welding Station",
      "Leak Testing",
      "Insertion",
      "Foam",
      "LaserMarking",
      "EOL",
      "Z Fixation",
    ],
    []
  );

  const fetchData = useCallback(async () => {
    try {
      const [defectResponse, rejectionReworksResponse] = await Promise.all([
        axios.get(
          "https://hmcl-backend.onrender.com/api/v1/sop-rejection-rework/fetch-defects"
        ),
        axios.get(
          "https://hmcl-backend.onrender.com/api/v1/sop-rejection-rework/fetch-rejection-reworks"
        ),
      ]);
      setDefectData(defectResponse.data.rowData);
      setTableData(rejectionReworksResponse.data.rowData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // async function checkBarcodes(barcodes, localMachine) {
  //   try {
  //     const result = axios.post(
  //       "https://hmcl-backend.onrender.com/api/v1/sop-rejection-rework/check-barcodes",
  //       {
  //         barcodes,
  //         machine: localMachine,
  //       }
  //     );
  //     return result;
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }

  const getDefectCodes = useCallback(
    (defectType, machine) => {
      return defectData
        .filter(
          (defect) =>
            defect.defect_type === defectType && defect.station === machine
        )
        .map((defect) => defect.defect_code);
    },
    [defectData]
  );

  const getDefectNameByCode = useCallback(
    (defectCode) => {
      const defect = defectData.find((item) => item.defect_code === defectCode);
      return defect ? defect.defect_name : "Defect code not found";
    },
    [defectData]
  );

  const defectCodes = useMemo(
    () => getDefectCodes(selectedDefectType, localMachine),
    [selectedDefectType, localMachine, getDefectCodes]
  );

  useEffect(() => {
    fetchData();
    setSelectedDefectType(defectTypes[0]);
    setLocalMachine(machines[0]);

    const handleResize = () => {
      setScreenSize(Math.round(window.devicePixelRatio * 100));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [fetchData, defectTypes, machines]);

  const handleChangeMachine = useCallback((event) => {
    setLocalMachine(event.target.value);
    setLocalDefectCode([]);
  }, []);

  const handleChangeDefectCodes = useCallback((event) => {
    const newValue = event.target.value;
    setLocalDefectCode(
      newValue.includes("all") ? ["all"] : newValue.filter((v) => v !== "all")
    );
  }, []);

  const handleChangeDefectType = useCallback((event) => {
    setSelectedDefectType(event.target.value);
    setLocalDefectCode([]);
  }, []);

  const handleDeleteDefectCodes = useCallback((value) => {
    setLocalDefectCode((prev) => prev.filter((item) => item !== value));
  }, []);

  const handleInsert = async (
    adid,
    barcodes,
    machine,
    defectType,
    defectCodes,
    reason
  ) => {
    // Implement your update logic here
    // if (!editingRow) return;

    try {
      await axios.post(
        "https://hmcl-backend.onrender.com/api/v1/sop-rejection-rework/create-rejection-rework",
        {
          adid,
          barcodes,
          machine,
          defectType,
          defectCodes,
          reason,
        }
      );
      // await fetchRejectionData()
      // .then(() => console.log("success"))
      // .catch((err) => console.error(err));
    } catch (error) {
      console.error("Error inserting rejections:", error);
    }
  };

  const handleSubmit = useCallback(async () => {
    const validationResult = validateStrings(barcodes);
    const { validStrings, invalidStrings } = validationResult;
    // console.log("validationResult : ", { validStrings, invalidStrings });

    if (
      barcodes === "" ||
      localDefectCode.length === 0 ||
      localMachine === "" ||
      selectedDefectType === ""
    ) {
      await Sweetalert(
        "ERROR",
        "Please enter all the mandatory feilds",
        "error",
        "ok",
        false
      );
      return;
    }

    if (invalidStrings.length > 0) {
      const errorMessage =
        invalidStrings[0].string === ""
          ? "You have entered either a trailing comma or added only whitespace, please enter only valid barcodes"
          : "Please enter valid barcodes";
      await Sweetalert("ERROR", errorMessage, "error", "ok", false);
      return;
    }

    if (validStrings.length > 20) {
      await Sweetalert(
        "ERROR",
        "Cannot enter more than 20 barcodes",
        "error",
        "ok",
        false
      );
      return;
    }

    // const result = await checkBarcodes(validStrings, localMachine);
    // console.log("Result54321 : ", result);
    // const nullAssetBarcodes = getNullAssetBarcodes(result.data.resultData);
    // console.log("Result12345 : ", nullAssetBarcodes);
    // if (
    //   typeof nullAssetBarcodes === "object" &&
    //   nullAssetBarcodes.length === 0
    // ) {
    //   await Sweetalert(
    //     "ERROR",
    //     `These barcodes ${validStrings} do not exist for machine ${localMachine}`,
    //     "error",
    //     "ok",
    //     false
    //   );
    //   return;
    // }

    const isDuplicate = checkBarcodeDefectCodes(
      tableData,
      validStrings,
      localDefectCode
    );
    if (isDuplicate) {
      await Sweetalert(
        "ERROR",
        "Barcodes with the same defect codes already exist",
        "error",
        "ok",
        false
      );
      return;
    }

    try {
      await handleInsert(
        adid,
        validStrings,
        localMachine,
        selectedDefectType,
        localDefectCode,
        reason
      );
      await fetchData();
      setRefresh(!refresh);
      await Sweetalert(
        "Success",
        `${selectedDefectType} added successfully`,
        "success",
        "ok",
        false
      );
    } catch (error) {
      console.error("Error submitting data:", error);
      await Sweetalert(
        "ERROR",
        "An error occurred while submitting the data",
        "error",
        "ok",
        false
      );
    }
  }, [
    adid,
    barcodes,
    localMachine,
    selectedDefectType,
    localDefectCode,
    reason,
    tableData,
    refresh,
    setRefresh,
    fetchData,
  ]);

  const handleClear = useCallback(() => {
    setBarcodes("");
    setLocalDefectCode([]);
    setReason("");
    setLocalMachine("");
    setSelectedDefectType("");
  }, []);

  const handleCardSize = useCallback((screenSize) => {
    if (screenSize === 135) return "90%";
    if (screenSize === 120) return "75%";
    if (screenSize === 113) return "70%";
    if (screenSize === 100) return "70%";
    return "auto";
  }, []);

  const renderTextField = useCallback(
    (label, value, onChange, placeholder) => (
      <FormControl style={{ width: "100%", minWidth: "15rem" }}>
        <div style={form_control_header(colors, fonts)}>{label}</div>
        <TextField
          placeholder={placeholder}
          fullWidth
          value={value}
          onChange={onChange}
          variant="outlined"
          size="small"
          InputLabelProps={{ shrink: false }}
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
    ),
    []
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "1rem",
        // overflow: "hidden",
      }}
    >
      <Card
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          borderRadius: "15px",
          width: handleCardSize(screenSize),
          background: "rgba(15, 18, 59, 0.2)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
        }}
      >
        <Grid container spacing={1}>
          {/* Barcodes */}
          <Grid item xs={12} style={grid_style}>
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
                  A valid barcode contains 12 characters and all alphanumeric
                  characters(if any) are capitalized
                </Typography>
              }
              placement="bottom"
            >
              {renderTextField(
                "Barcodes*",
                barcodes,
                (e) => setBarcodes(e.target.value),
                "Please do not enter more than 30 barcodes"
              )}
            </Tooltip>
          </Grid>

          {/* Machines */}
          <Grid
            item
            xs={3}
            style={{ ...grid_style, justifyContent: "flex-start" }}
          >
            <FormControl style={{ width: "auto", minWidth: "12.5rem" }}>
              <div style={form_control_header(colors, fonts)}>Machines*</div>
              <Select
                value={localMachine}
                onChange={handleChangeMachine}
                size="small"
                MenuProps={MenuProps}
                sx={select_style(colors, fonts)}
              >
                {machines.map((machine, index) => (
                  <MenuItem
                    value={machine}
                    key={index}
                    style={menu_item_style(fonts)}
                  >
                    {machine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Defect Types */}
          <Grid item xs={3} style={{ ...grid_style, justifyContent: "start" }}>
            <FormControl style={{ width: "auto", minWidth: "10rem" }}>
              <div style={form_control_header(colors, fonts)}>Defect Type*</div>
              <Select
                value={selectedDefectType}
                onChange={handleChangeDefectType}
                size="small"
                MenuProps={MenuProps}
                sx={select_style(colors, fonts)}
              >
                {defectTypes.map((defectType, index) => (
                  <MenuItem
                    value={defectType}
                    key={index}
                    style={menu_item_style(fonts)}
                  >
                    {defectType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Defect Codes */}
          <Grid
            item
            xs={6}
            style={{ ...grid_style, justifyContent: "flex-end" }}
          >
            <FormControl style={{ width: "auto", minWidth: "30rem" }}>
              <div style={form_control_header(colors, fonts)}>
                Defect Names*
              </div>
              <Select
                value={localDefectCode}
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
                            value === "all" ? "All" : getDefectNameByCode(value)
                          }
                          onDelete={() => handleDeleteDefectCodes(value)}
                          sx={chip_style(colors, fonts)}
                        />
                      </div>
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
                sx={select_style(colors, fonts)}
              >
                {/* <MenuItem value="all">All</MenuItem> */}
                {defectCodes.map((item, index) => (
                  <MenuItem
                    value={item}
                    key={index}
                    style={menu_item_style(fonts)}
                  >
                    {getDefectNameByCode(item)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Reason */}
          <Grid item xs={12} style={grid_style}>
            {renderTextField(
              "Reason",
              reason,
              (e) => setReason(e.target.value),
              "Please ensure that the reason is shorter than 20 characters"
            )}
          </Grid>

          {/* Action Buttons */}
          <Grid
            item
            xs={12}
            style={{ ...grid_style, justifyContent: "center" }}
          >
            <FormControl
              style={{
                width: "auto",
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
                    {`Create new ${selectedDefectType}?`}
                  </Typography>
                }
                placement="bottom"
              >
                <Button
                  variant="contained"
                  size="small"
                  style={{
                    margin: "2%",
                    height: "2rem",
                    backgroundColor: colors.info.main,
                  }}
                  onClick={handleSubmit}
                  //   endIcon={<CheckCircleIcon />}
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
                    margin: "2%",
                    height: "2rem",
                    backgroundColor: colors.error.main,
                  }}
                  onClick={handleClear}
                  //   endIcon={<CancelIcon />}
                >
                  <CancelIcon />
                </Button>
              </Tooltip>
            </FormControl>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default RejectionCard2;
