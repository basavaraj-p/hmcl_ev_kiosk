import React, { useState, useEffect, useCallback, useMemo } from "react";
import Header from "../components/Header/Header";
import { Grid, Skeleton, FormControl, TextField, Button } from "@mui/material";
import Marquee from "react-fast-marquee";
import fonts from "../style/fonts";
import colors from "../style/colors";
import tripleLinearGradient from "../style/tripleLinearGradient";
import DashboardCard from "../components/Dashboard/DashboardCard";
import { MdOutlineHourglassTop } from "react-icons/md";
import { FaBellSlash } from "react-icons/fa6";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import Sweetalert from "../components/Special Components/Sweetalert";

const Dashboard = () => {
  const { gradients } = colors;
  const [shiftHighlights, setShiftHighlights] = useState("");
  const [edit, setEdit] = useState(true);
  const [cardData, setCardData] = useState([
    {
      name: "Machine Stoppages",
      icon: <MdOutlineHourglassTop />,
      data: "0/0",
      path: "/losses/stoppage-reasons",
    },
    {
      name: "Machine Alarms",
      icon: <FaBellSlash />,
      data: 0,
      path: "/machine-alarms",
    },
  ]);
  const [loading, setLoading] = useState(true);

  const renderTextField = useCallback(
    (value, onChange) => (
      <FormControl style={{ width: "100%", minWidth: "15rem" }}>
        <TextField
          fullWidth
          placeholder={value}
          value={value}
          onChange={onChange}
          variant="outlined"
          size="small"
          InputLabelProps={{ shrink: false }}
          sx={{
            width: "100%",
            borderRadius: "12.5px",
            minHeight: "2.5rem",
            marginBottom: "10px",
            "& .MuiInputBase-input": {
              color: colors.white.main,
              fontFamily: fonts.fontStyle3["font-family"],
              fontStyle: fonts.fontStyle3["font-style"],
              fontWeight: fonts.fontStyle3["font-weight"],
              minHeight: "2rem",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12.5px",
              height: "2.7rem",
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

  const fetchData = useCallback(async () => {
    try {
      const [
        alarmResponseToday,
        stopageReasonResponseToday,
        alarmResponseTotal,
        stopageReasonResponseTotal,
        shiftHighLights,
      ] = await Promise.all([
        axios.get("http://localhost:7000/api/v1/sop-alarm/today-count"),
        axios.get(
          "http://localhost:7000/api/v1/sop-stopage-reason/today-count"
        ),
        axios.get("http://localhost:7000/api/v1/sop-alarm/count"),
        axios.get("http://localhost:7000/api/v1/sop-stopage-reason/count"),
        axios.get(
          "http://localhost:7000/api/v1/sop-shifts/fetch-shift-highlights"
        ),
      ]);

      setShiftHighlights(
        shiftHighLights.data.rowData
      );

      setCardData((prevData) =>
        prevData.map((obj) =>
          obj.name === "Machine Stoppages"
            ? {
                ...obj,
                data: `${stopageReasonResponseToday.data.count}/${stopageReasonResponseTotal.data.count}`,
              }
            : obj.name === "Machine Alarms"
            ? {
                ...obj,
                data: `${alarmResponseToday.data.count}/${alarmResponseTotal.data.count}`,
              }
            : obj
        )
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = useCallback(() => setEdit((prev) => !prev), []);

  const handleShiftHighlights = useCallback(async () => {
    try {
      if (shiftHighlights === "") {
        await Sweetalert(
          "ERROR",
          "Please enter a shift highlight in the text box",
          "error",
          "ok",
          false
        );
        return;
      }

      if (shiftHighlights.length > 50) {
        await Sweetalert(
          "ERROR",
          "The shift highlights must not exceed 50 characters",
          "error",
          "ok",
          false
        );
        return;
      }

      await axios.post(
        "http://localhost:7000/api/v1/sop-shifts/create-shift-highlights",
        { reason: shiftHighlights }
      );
      await fetchData(); // Refetch data after insertion
      setEdit(true);
      await Sweetalert(
        "Success",
        "Shift highlight updated successfully",
        "success",
        "ok",
        false
      );
    } catch (error) {
      console.error("Error inserting shift highlights:", error);
      await Sweetalert(
        "ERROR",
        "Error inserting shift highlights",
        "error",
        "ok",
        false
      );
    }
  }, [shiftHighlights, fetchData]);

  const marqueeStyle = useMemo(
    () => ({
      borderRadius: "10px",
      width: "auto",
      position: "sticky",
      fontFamily: fonts.fontStyle7["font-family"],
      fontStyle: fonts.fontStyle7["font-style"],
      fontWeight: fonts.fontStyle7["font-weight"],
      height: "2.5rem",
      marginBottom: "10px",
      color: "whitesmoke",
      background: tripleLinearGradient(
        gradients.cover.main,
        gradients.cover.state,
        gradients.cover.stateSecondary,
        gradients.cover.angle
      ),
    }),
    [gradients]
  );

  return (
    <div>
      <Header />
      <Grid container spacing={1}>
        <Grid item xs={11}>
          {edit ? (
            <Marquee
              className="dashboard-marquee"
              pauseOnHover
              style={marqueeStyle}
            >
              {shiftHighlights}
            </Marquee>
          ) : (
            renderTextField(shiftHighlights, (e) =>
              setShiftHighlights(e.target.value)
            )
          )}
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="text"
            style={{ height: "2.5rem" }}
            fullWidth
            onClick={edit ? handleEdit : handleShiftHighlights}
          >
            {edit ? (
              <EditIcon fontSize="small" style={{ color: colors.info.main }} />
            ) : (
              <SaveIcon fontSize="small" style={{ color: colors.info.main }} />
            )}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        {loading
          ? cardData.map((item) => (
              <Grid item xs={6} key={item.name}>
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  sx={{
                    background:
                      "linear-gradient(180deg, #1a1f4d 0%, #23284f 50%, #2d3154 100%)",
                  }}
                  width={"auto"}
                  height={140}
                />
              </Grid>
            ))
          : cardData.map((item) => (
              <Grid item xs={6} key={item.name}>
                <DashboardCard
                  name={item.name}
                  icon={item.icon}
                  data={item.data}
                  path={item.path}
                />
              </Grid>
            ))}
      </Grid>
    </div>
  );
};

export default Dashboard;
