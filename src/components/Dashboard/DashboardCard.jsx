import React from "react";
import { Card, Grid, Typography, Icon } from "@mui/material";
import fonts from "../../style/fonts";
import EngineeringIcon from "@mui/icons-material/Engineering";
import colors from "../../style/colors";
import { FaStop } from "react-icons/fa";
import tripleLinearGradient from "../../style/tripleLinearGradient";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ name, icon, data, path }) => {
  const navigate = useNavigate();

  function handleSubmit(path) {
    navigate(path);
  }

  const { gradients } = colors;
  return (
    <Card
      sx={{
        width: "auto",
        background: tripleLinearGradient(
          gradients.cover.main,
          gradients.cover.state,
          gradients.cover.stateSecondary,
          gradients.cover.angle
        ),
        borderRadius: "12.5px",
        padding: "4%",
        marginBottom: "10px",
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
          background:
            "linear-gradient(180deg, #1a1f4d 0%, #23284f 50%, #2d3154 100%)",
        },
      }}
      onClick={() => handleSubmit(path)}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={9}
          container
          justifyContent="flex-start"
          alignItems="center"
        >
          <div>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.5rem",
                fontFamily: fonts.fontStyle7["font-family"],
                fontStyle: fonts.fontStyle7["font-style"],
                fontWeight: fonts.fontStyle7["font-weight"],
              }}
              color={colors.info.main}
            >
              {name}
            </Typography>

            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.1rem",
                fontFamily: fonts.fontStyle7["font-family"],
                fontStyle: fonts.fontStyle7["font-style"],
                fontWeight: fonts.fontStyle7["font-weight"],
              }}
              color="whitesmoke"
            >
              Today : {data}
            </Typography>

            {/* <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.1rem",
                fontFamily: fonts.fontStyle8["font-family"],
                fontStyle: fonts.fontStyle8["font-style"],
                fontWeight: fonts.fontStyle8["font-weight"],
              }}
              color={colors.info.main}
            >
              Total : {data_total}
            </Typography> */}
          </div>
        </Grid>
        <Grid
          item
          xs={3}
          container
          justifyContent="flex-end"
          alignItems="center"
        >
          {/* <EngineeringIcon fontSize="large" sx={{ color: colors.info.main ,backgroundColor:"black"}} /> */}
          <div
            style={{
              backgroundColor: colors.info.main,
              padding: "0.5rem",
              borderRadius: "5px",
            }}
          >
            <Icon fontSize="small" style={{ color: "white" }}>
              {icon}
            </Icon>
            {/* <FaStop fontSize="small" style={{ color: "white" }} /> */}
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

export default DashboardCard;
