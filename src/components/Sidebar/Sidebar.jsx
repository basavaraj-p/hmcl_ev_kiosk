import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import tripleLinearGradient from "../../style/tripleLinearGradient";
import colors from "../../style/colors";
import fonts from "../../style/fonts";
import { useSelector } from "react-redux";
import Herologo from "/favicon.ico";
import vidaLogo from "/vida_logo.jpeg";
import vidaLogo2 from "/vida_white_logo_croped.png";
import vidaLogo3 from "/vida_orange_logo_croped.png";
import senseopsLogo from "/ourlogo.png";

const Sidebar = ({ routes }) => {
  const [open, setOpen] = useState({});
  const [selected, setSelected] = useState("");
  const location = useLocation();
  const { gradients, secondary } = colors;
  const isMinimized = useSelector((state) => state.sidebar.isMinimized);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentRoute =
      routes.find((route) => route.route === currentPath) ||
      routes.find((route) => route.subcomponent?.some((sub) => sub.route === currentPath));
    if (currentRoute) {
      setSelected(
        currentRoute.route ||
          currentRoute.subcomponent?.find((sub) => sub.route === currentPath)?.route
      );
    }
  }, [location, routes]);

  const handleClick = (name) => {
    if (!isMinimized) {
      setOpen((prevOpen) => ({ ...prevOpen, [name]: !prevOpen[name] }));
    }
  };

  const listItemStyle = (isSelected) => ({
    marginBottom: "4px",
    //   border: isSelected ? "1px solid #e0e0e0" : "",
    borderRadius: "15px",
    overflow: "hidden",
    background: isSelected ? colors.sidenav.button : "",
  });

  const listItemButtonStyle = (isSelected) => ({
    // background: isSelected ? colors.info.main : colors.sidenav.button,
    color: isSelected ? "#ffffff" : "inherit",
    "&:hover": {
      backgroundColor: isSelected ? "red" : "rgba(255, 255, 255, 0.1)",
    },
    justifyContent: isMinimized ? "center" : "flex-start",
    padding: isMinimized ? "10px 0" : "5px 16px",
  });

  const listItemIconStyle = (isSelected) => ({
    minWidth: isMinimized ? "auto" : "auto",
    padding: isMinimized ? "8px" : "8px",
    marginRight: isMinimized ? "0" : "8px",
    background: isSelected ? colors.error.main : colors.sidenav.button,
    color: isSelected ? "#ffffff" : colors.orange.main,
    fontSize: "17px",
    borderRadius: "12.5px",
  });

  const listItemTextStyle = (isSelected, isSubItem) => ({
    marginLeft: isSubItem ? "15px" : "15px", // Adjust margin based on sub-item
    padding: "0",
    color: isSelected ? "" : "white",
    ...(isSubItem ? fonts.fontStyle2 : fonts.fontStyle1), // Apply different font styles
    "& .MuiTypography-root": {
      ...(isSelected ? fonts.fontStyle1 : isSubItem ? fonts.fontStyle5 : fonts.fontStyle1),
      fontSize: isSubItem ? "0.9rem" : "1rem",
    },
    display: isMinimized ? "none" : "block",
  });

  // const listItemTextStyle = (isSelected, route) => {
  //   console.log("route", route);

  //   return {
  //     marginLeft: "15px",
  //     padding: "0",
  //     color: "white",
  //     ...fonts.fontStyle1,
  //     "& .MuiTypography-root": {
  //       ...(isSelected ? fonts.fontStyle1 : fonts.fontStyle1),
  //     },
  //     display: isMinimized ? "none" : "block",
  //   };
  // };

  const renderListItem = (route, isSubItem = false) => (
    <ListItem
      key={route.name}
      disablePadding
      sx={{
        ...listItemStyle(selected === route.route),
        ...(isSubItem && !isMinimized && { pl: 2 }),
      }}>
      <Tooltip title={isMinimized ? route.name : ""} placement="right">
        <ListItemButton
          component={route.onClick ? "button" : Link}
          to={route.route || "#"}
          onClick={() => {
            if (route.onClick) {
              route.onClick();
            } else {
              setSelected(route.route);
              if (route.subcomponent && !isMinimized) handleClick(route.name);
            }
          }}
          selected={selected === route.route}
          sx={listItemButtonStyle(selected === route.route)}>
          <ListItemIcon sx={listItemIconStyle(selected === route.route)}>{route.icon}</ListItemIcon>
          <ListItemText
            primary={route.name}
            sx={listItemTextStyle(selected === route.route, isSubItem)}
          />
          {!isMinimized && route.subcomponent && (
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClick(route.name);
              }}
              size="small">
              {open[route.name] ? (
                <ExpandLessIcon style={{ color: "white" }} />
              ) : (
                <ExpandMoreIcon style={{ color: colors.orange.main }} />
              )}
            </IconButton>
          )}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isMinimized ? 80 : 300,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMinimized ? 80 : 300,
          height: "100vh",
          position: "sticky",
          boxSizing: "border-box",
          padding: "16px",
          background: tripleLinearGradient(
            gradients.cover.main,
            gradients.cover.state,
            gradients.cover.stateSecondary,
            gradients.cover.angle
          ),
          transition: "width 0.2s",
        },
      }}>
      <List>
        <ListItem
          style={{
            color: colors.error.main,
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            fontFamily: fonts.fontStyle7["font-family"],
            fontStyle: fonts.fontStyle7["font-style"],
            fontWeight: fonts.fontStyle7["font-weight"],
            fontSize: "1.25rem",
            // padding:"0"
          }}>
          {isMinimized ? (
            <img src={senseopsLogo} height={"30px"} width={"30px"} style={{ margin: "5px" }} />
          ) : (
            <div style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
              {/* <img
                src={vidaLogo3}
                height={"30px"}
                width={"100px"}
                style={{ paddingRight: "10px", borderRight: "1px solid white" }}
              /> */}
              <span>SENSEOPS</span>
              {/* <Divider
                orientation="vertical"
                flexItem
                style={{ backgroundColor: "whitesmoke" }}
              /> */}
              <img
                src={senseopsLogo}
                height={"30px"}
                width={"40px"}
                style={{ marginLeft: "10px" }}
              />
            </div>
          )}
        </ListItem>
        {/* <ListItem
          style={{
            color: colors.error.main,
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            fontFamily: fonts.fontStyle7["font-family"],
            fontStyle: fonts.fontStyle7["font-style"],
            fontWeight: fonts.fontStyle7["font-weight"],
            fontSize: "1.25rem",
            // padding:"0"
          }}
        >
          {isMinimized ? (
            <div style={{ margin: "10px" }}>EV</div>
          ) : (
            <div style={{ margin: "10px" }}>EV BPA KIOSK</div>
          )}
        </ListItem> */}
        {routes.map((route) => (
          <React.Fragment key={route.name}>
            {renderListItem(route)}
            {route.subcomponent && (
              <Collapse in={!isMinimized && open[route.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {route.subcomponent.map((subRoute) => renderListItem(subRoute, true))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
