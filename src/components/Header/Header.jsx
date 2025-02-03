import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import fonts from "../../style/fonts";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../redux/sidebarSlice";
import EngineeringIcon from "@mui/icons-material/Engineering";
import colors from "../../style/colors";
import tripleLinearGradient from "../../style/tripleLinearGradient";
import Herologo from "/favicon.ico";
import vidaLogo from "/vida_logo.jpeg";
import vidaLogo2 from "/vida_white_logo_croped.png";
import vidaLogo3 from "/vida_orange_logo_croped.png";

const Header = () => {
  const { gradients } = colors;
  const color = "white";
  const location = useLocation();
  const routes = useSelector((state) => state.routes.routes);
  const isMinimized = useSelector((state) => state.sidebar.isMinimized);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const adid = useSelector((state) => state.adid.adid);
  // console.log("adid : ", adid);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getPathDetails = (routes) => {
    // Check main routes
    let currentRoute = routes.find(
      (route) => route.route === location.pathname
    );

    // If not found in main routes, check subcomponents
    if (!currentRoute) {
      routes.forEach((route) => {
        if (route.subcomponent) {
          const subRoute = route.subcomponent.find(
            (sub) => sub.route === location.pathname
          );
          if (subRoute) {
            currentRoute = subRoute;
          }
        }
      });
    }

    return currentRoute;
  };

  const currentPathDetails = getPathDetails(routes);

  function handleSubmit() {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("adid");
    navigate("/");
    navigate(0);
  }

  return (
    <Card
      style={{
        position: "sticky",
        top: 10,
        width: "auto", // Make the header take up the full width of its container
        zIndex: 1000, // Ensure the header stays on top of all content
        // background:
        //   "linear-gradient(159.02deg, #0f123b 14.25%, #090d2e 56.45%, #020515 86.14%)",
        background: isScrolled
          ? "rgba(15, 18, 59, 0.9)" // Semi-transparent when scrolled
          : tripleLinearGradient(
              gradients.cover.main,
              gradients.cover.state,
              gradients.cover.stateSecondary,
              gradients.cover.angle
            ), // Opaque when not scrolled
        boxShadow: "none",
        // border: "1px solid lightblue",
        borderRadius: "12.5px",
        padding: "0 1% 0 1%",
        marginBottom: "10px",
        // color:color
        // marginLeft: "auto", // Center the header by setting left and right margins to auto
        // marginRight: "auto",
        // marginBottom:"10%"
      }}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={4}
          container
          justifyContent="flex-start"
          alignItems="center"
        >
          {/* <div> */}
          {currentPathDetails && (
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                // justifyContent:"center",
                fontSize: "1.3rem",
                fontFamily: fonts.fontStyle7["font-family"],
                fontStyle: fonts.fontStyle7["font-style"],
                fontWeight: fonts.fontStyle7["font-weight"],
                color: color,
              }}
              color="text.primary"
            >
              {React.cloneElement(currentPathDetails.icon, {
                style: {
                  marginRight: "4px",
                  marginTop: "2.5%",
                  fontSize: "1.3rem",
                  color: colors.info.main,
                  verticalAlign: "middle", // Add this line
                },
              })}
              <Divider
                orientation="vertical"
                flexItem
                style={{ backgroundColor: "whitesmoke", marginRight: "10px" }}
              />
              {["Periodic", "Time Based"].includes(currentPathDetails.name)
                ? `${currentPathDetails.name} Maintenance`
                : currentPathDetails.name}
            </Typography>
          )}
          {/* <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.1rem",
                fontFamily: fonts.fontStyle7["font-family"],
                fontStyle: fonts.fontStyle7["font-style"],
                fontWeight: fonts.fontStyle7["font-weight"],
              }}
            >
              User : G0006525
            </Typography> */}
          {/* </div> */}
        </Grid>

        <Grid item xs={4} container justifyContent="center" alignItems="center">
          <div
            style={{
              // color: "whitesmoke",
              color: colors.orange.main,
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              fontFamily: fonts.fontStyle7["font-family"],
              fontStyle: fonts.fontStyle7["font-style"],
              fontWeight: fonts.fontStyle7["font-weight"],
              fontSize: "1.4rem",
              // padding:"0"
            }}
          >
            EV BPA KIOSK
          </div>
        </Grid>

        <Grid
          item
          xs={4}
          container
          justifyContent="flex-end"
          alignItems="center"
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
                Notification
              </Typography>
            }
            placement="bottom"
          >
            <IconButton>
              <NotificationsActiveIcon
                fontSize="small"
                sx={{ color: colors.info.main }}
              />
            </IconButton>
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
                {!isMinimized ? "Minimize" : "Expand"}
              </Typography>
            }
            placement="bottom"
          >
            <IconButton onClick={() => dispatch(toggleSidebar())}>
              {isMinimized ? (
                <MenuOpenIcon sx={{ color: color }} />
              ) : (
                <MenuIcon sx={{ color: colors.info.main }} />
              )}
            </IconButton>
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
                User : {adid}
              </Typography>
            }
            placement="bottom"
          >
            <IconButton
              // onClick={() => handleSubmit()}
              style={{ cursor: "pointer" }}
            >
              <EngineeringIcon
                fontSize="small"
                sx={{ color: colors.info.main }}
              />
            </IconButton>
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
                Logout
              </Typography>
            }
            placement="bottom"
          >
            <IconButton
              onClick={() => handleSubmit()}
              style={{ cursor: "pointer" }}
            >
              <LogoutIcon fontSize="small" sx={{ color: color }} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Header;
