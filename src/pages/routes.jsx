// Component and Page imports
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import EnergyMaintenance from "../components/Energy Maintenance/EnergyMaintenance";
import LinesAndMachines from "../components/Lines and Machines/LinesAndMachines";
import ConsolidatedLosses from "../components/Losses/ConsolidatedLosses";
import Rejection from "../components/Losses/Rejection";
import Rework from "../components/Losses/Rework";
import StoppageReasons from "../components/Losses/StoppageReasons";
import PeriodicMaintenance from "../components/Maintenance/PeriodicMaintenance";
import TimeBasedMaintenance from "../components/Maintenance/TimeBasedMaintenance";
import ToolLifeManagement from "../components/Maintenance/ToolLifeManagement";
import CurrentShifts from "../components/Shifts/CurrentShifts";
import ShiftHistory from "../components/Shifts/ShiftHistory";
import MachineAlarms from "../components/Machine Alarms/MachineAlarms";
import Traceability from "../components/Traceability/Traceability";

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
import { MdOutlineMoreTime } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { IoLogoBuffer } from "react-icons/io5";

const routes = [
  {
    name: "Dashboard",
    icon: <MdHome />,
    component: Dashboard,
    route: "/dashboard",
    subcomponent: null,
  },
  {
    name: "Shifts",
    icon: <MdOutlineMoreTime />,
    component: null,
    route: null,
    subcomponent: [
      {
        name: "Current Shifts",
        icon: <GrUserWorker />,
        component: CurrentShifts,
        route: "/shifts/current-shifts",
      },
      {
        name: "Shift History",
        icon: <IoLogoBuffer />,
        component: ShiftHistory,
        route: "/shifts/shift-history",
      },
    ],
  },

  {
    name: "Lines and Machines",
    icon: <MdFactory />,
    component: LinesAndMachines,
    route: "/lines-and-machines",
    subcomponent: null,
  },
  {
    name: "Losses",
    icon: <GiHammerBreak />,
    component: null,
    route: null,
    subcomponent: [
      {
        name: "Consolidated Losses",
        icon: <MdIncompleteCircle />,
        component: ConsolidatedLosses,
        route: "/losses/consolidated-losses",
      },
      {
        name: "Rejection",
        icon: <ImCross />,
        component: Rejection,
        route: "/losses/rejection",
      },
      {
        name: "Rework",
        icon: <FaRedo />,
        component: Rework,
        route: "/losses/rework",
      },
      {
        name: "Stoppage Reasons",
        icon: <FaStop />,
        component: StoppageReasons,
        route: "/losses/stoppage-reasons",
      },
    ],
  },
  {
    name: "Machine Alarms",
    icon: <IoAlarm />,
    component: MachineAlarms,
    route: "/machine-alarms",
    subcomponent: null,
  },
  {
    name: "Maintenance",
    icon: <FaToolbox />,
    component: null,
    route: null,
    subcomponent: [
      {
        name: "Periodic Maintenance",
        icon: <FaCalendarAlt />,
        component: PeriodicMaintenance,
        route: "/maintenance/periodic-maintenance",
      },
      {
        name: "Time Based Maintenance",
        icon: <IoTimer />,
        component: TimeBasedMaintenance,
        route: "/maintenance/time-based-maintenance",
      },
      {
        name: "Tool Life Management",
        icon: <BsTools />,
        component: ToolLifeManagement,
        route: "/maintenance/tool-life-management",
      },
    ],
  },
  {
    name: "Energy Maintenance",
    icon: <SlEnergy />,
    component: EnergyMaintenance,
    route: "/energy-maintenance",
    subcomponent: null,
  },
  {
    name: "Logout",
    icon: <MdLogout />,
    component: LoginPage,
    route: "/",
    subcomponent: null,
  },
];

export default routes;