import React from "react";
import { useState, useEffect } from "react";
import {
  // BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { useDispatch } from "react-redux";
import { setRoutes } from "./redux/routesSlice";
import tripleLinearGradient from "./style/tripleLinearGradient";
import colors from "./style/colors";
import bgImage from "./assets/body-background.png";
// import noiseSvg from "./noise.svg"; // Adjust the path as necessary
import "./App.css";

// import routes from "./pages/routes";
import "./t-star-pro-webfont/style.css";
import "./t-star-pro-webfont/TStarProBold.woff";
import "./t-star-pro-webfont/TStarProBoldItalic.woff";
import "./t-star-pro-webfont/TStarProHeavy.woff";
import "./t-star-pro-webfont/TStarProHeavyItalic.woff";
import "./t-star-pro-webfont/TStarProLight.woff";
import "./t-star-pro-webfont/TStarProLightItalic.woff";
import "./t-star-pro-webfont/TStarProMedium.woff";
import "./t-star-pro-webfont/TStarProMediumItalic.woff";
import "./t-star-pro-webfont/TStarProRegular.woff";
import "./t-star-pro-webfont/TStarProRegularItalic.woff";

// Component and Page imports
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import EnergyMaintenance from "./components/Energy Maintenance/EnergyMaintenance";
import LinesAndMachines from "./components/Lines and Machines/LinesAndMachines";
import ConsolidatedLosses from "./components/Losses/ConsolidatedLosses";
import Rejection from "./components/Losses/Rejection";
import Rework from "./components/Losses/Rework";
import StoppageReasons from "./components/Losses/StoppageReasons";
import PeriodicMaintenance from "./components/Maintenance/PeriodicMaintenance";
import TimeBasedMaintenance from "./components/Maintenance/TimeBasedMaintenance";
import ToolLifeManagement from "./components/Maintenance/ToolLifeManagement";
import CurrentShifts from "./components/Shifts/CurrentShifts";
import ShiftHistory from "./components/Shifts/ShiftHistory";
import MachineAlarms from "./components/Machine Alarms/MachineAlarms";
import Traceability from "./components/Traceability/Traceability";
import LeakTesting from "./components/Losses/LeakTesting";

// Icons
import { MdLogout } from "react-icons/md";
import { MdHome } from "react-icons/md";
import { SlEnergy } from "react-icons/sl";
import { MdFactory } from "react-icons/md";
import { GiHammerBreak } from "react-icons/gi";
import { MdIncompleteCircle } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { FaRedo } from "react-icons/fa";
import { FaStop } from "react-icons/fa";
import { IoAlarm } from "react-icons/io5";
import { FaToolbox } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { IoTimer } from "react-icons/io5";
import { BsTools } from "react-icons/bs";
import { MdAccessTime } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { IoLogoBuffer } from "react-icons/io5";

import { MdPunchClock } from "react-icons/md";
import { MdHistoryToggleOff } from "react-icons/md";
import { GiMechanicalArm } from "react-icons/gi";
import { FaBellSlash } from "react-icons/fa6";
import { CiNoWaitingSign } from "react-icons/ci";
import { MdOutlineHourglassTop } from "react-icons/md";
import { MdHourglassFull } from "react-icons/md";
import { LuRecycle } from "react-icons/lu";
import { MdDeleteForever } from "react-icons/md";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { gradients } = colors;
  const dispatch = useDispatch();

  useEffect(() => {
    const storedIsLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    } else {
      navigate("/"); // Redirect to login if not logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("adid");
    navigate("/");
  };

  const routes = [
    {
      name: "Dashboard",
      icon: <MdHome />,
      component: <Dashboard />,
      route: "/dashboard",
      subcomponent: null,
    },
    // {
    //   name: "Energy Maintenance",
    //   icon: <SlEnergy />,
    //   component: <EnergyMaintenance />,
    //   route: "/energy-maintenance",
    //   subcomponent: null,
    // },
    {
      name: "Losses",
      icon: <CiNoWaitingSign />,
      component: null,
      route: null,
      subcomponent: [
        // {
        //   name: "Consolidated Losses",
        //   icon: <MdHourglassFull />,
        //   component: <ConsolidatedLosses />,
        //   route: "/losses/consolidated-losses",
        // },
        {
          name: "Rejection and Rework",
          icon: <MdDeleteForever />,
          component: <Rejection />,
          route: "/losses/rejection",
        },
        // {
        //   name: "Leak Testing",
        //   icon: <MdDeleteForever />,
        //   component: <LeakTesting />,
        //   route: "/losses/leak-testing",
        // },
        {
          name: "Stoppage Reasons",
          icon: <MdOutlineHourglassTop />,
          component: <StoppageReasons />,
          route: "/losses/stoppage-reasons",
        },
      ],
    },
    // {
    //   name: "Machine Alarms",
    //   icon: <FaBellSlash />,
    //   component: <MachineAlarms />,
    //   route: "/machine-alarms",
    //   subcomponent: null,
    // },
    {
      name: "Maintenance",
      icon: <FaToolbox />,
      component: null,
      route: null,
      subcomponent: [
        {
          name: "MTTR & MTBF",
          icon: <FaCalendarAlt />,
          component: <PeriodicMaintenance />,
          route: "/maintenance/periodic-maintenance",
        },
        // {
        //   name: "Periodic",
        //   icon: <FaCalendarAlt />,
        //   component: <PeriodicMaintenance />,
        //   route: "/maintenance/periodic-maintenance",
        // },
        // {
        //   name: "Time Based",
        //   icon: <IoTimer />,
        //   component: <TimeBasedMaintenance />,
        //   route: "/maintenance/time-based-maintenance",
        // },
        // {
        //   name: "Tool Life Management",
        //   icon: <BsTools />,
        //   component: <ToolLifeManagement />,
        //   route: "/maintenance/tool-life-management",
        // },
      ],
    },
    {
      name: "Shifts",
      icon: <MdAccessTime />,
      component: null,
      route: null,
      subcomponent: [
        {
          name: "Current Shifts",
          icon: <MdPunchClock />,
          component: <CurrentShifts />,
          route: "/shifts/current-shifts",
        },
        {
          name: "Shift History",
          icon: <MdHistoryToggleOff />,
          component: <ShiftHistory />,
          route: "/shifts/shift-history",
        },
      ],
    },
    {
      name: "Zones and Machines",
      icon: <GiMechanicalArm />,
      component: <LinesAndMachines />,
      route: "/zones-and-machines",
      subcomponent: null,
    },

    {
      name: "Logout",
      icon: <MdLogout />,
      component: null,
      route: "/logout",
      subcomponent: null,
      onClick: handleLogout,
    },
  ];

  useEffect(() => {
    dispatch(setRoutes(routes));
  }, [dispatch]);

  const box_style = {
    display: "flex",
    filter: "contrast(100%) brightness(100%)",
    // background:
    //   "linear-gradient(159.02deg, #0f123b 14.25%, #090d2e 56.45%, #020515 86.14%)",
    backgroundImage: `url(${bgImage})`,
    // backgroundRepeat: "no-repeat",
    // backgroundColor:"white",
    minHeight: "100vh",
    height: "auto",
  };

  return (
    <Box sx={box_style}>
      {/* <CssBaseline />
      <Header /> */}
      {isLoggedIn && <Sidebar routes={routes} />}
      <Box
        component="main"
        sx={{
          flexGrow: isLoggedIn ? 1 : 0,
          p: isLoggedIn ? 1 : 0,
          width: isLoggedIn ? 0 : "100%",
          ml: isLoggedIn ? 0 : 0,
          // marginTop: isLoggedIn ? "80px" : 0, // Adjust based on your header's height
          // padding: isLoggedIn ? "20px" : 0,
          // overflowY: isLoggedIn ? "auto": 0, // Ensure content is scrollable
        }}
      >
        {/* {isLoggedIn && <Header routes={routes} />} */}
        <Routes>
          <Route
            path="/"
            element={
              <LoginPage
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          {isLoggedIn ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              {routes.map(
                (route) =>
                  route.component && (
                    <Route
                      key={route.name}
                      path={route.route}
                      element={route.component}
                    />
                  )
              )}
              {routes.map(
                (route) =>
                  route.subcomponent &&
                  route.subcomponent.map((subRoute) => (
                    <Route
                      key={subRoute.name}
                      path={subRoute.route}
                      element={subRoute.component}
                    />
                  ))
              )}
              <Route
                path="/logout"
                element={<Navigate to="/" replace />}
                onEnter={() => setIsLoggedIn(false)}
              />
            </>
          ) : null}
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} replace />}
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
