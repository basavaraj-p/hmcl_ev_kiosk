import React from 'react'
import Header from '../Header/Header'
import { Card } from '@mui/material';
import colors from '../../style/colors';
import fonts from '../../style/fonts';
import WMConsoleCard from './WMConsoleCard';
import WMGraphContainer from './WMGraphContainer';
import WMGraphContainerMW from './WMGraphContainerMW';

const PeriodicMaintenance = () => {
  return (
    <div>
      <Header />
      <Card
        style={{
          background: "transparent",
          padding: "0.5% 0.5% 0.5% 0.5%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
          borderRadius: "12px",
          margin: "5px 0 10px 0",
          width: "auto",
        }}
      >
        <div
          style={{
            color: "whitesmoke",
            fontFamily: fonts.fontStyle9["font-family"],
            fontStyle: fonts.fontStyle9["font-style"],
            fontWeight: fonts.fontStyle9["font-weight"],
            fontSize: "20px",
            padding: "0 0 1% 2%",
            // display: "flex",
            // justifyContent: "space-between",
            // alignItems: "center", // Ensures text and icons are centered vertically
            // flexDirection: "row",
          }}
        >
          Weekly Dashboard
        </div>
        <div>
          <WMConsoleCard />
        </div>
        <div
          style={{
            color: "whitesmoke",
            fontFamily: fonts.fontStyle9["font-family"],
            fontStyle: fonts.fontStyle9["font-style"],
            fontWeight: fonts.fontStyle9["font-weight"],
            fontSize: "20px",
            padding: "1%",
            // display: "flex",
            // justifyContent: "space-between",
            // alignItems: "center", // Ensures text and icons are centered vertically
            // flexDirection: "row",
          }}
        >
          Zone Wise
        </div>
        <div>
          <WMGraphContainer />
        </div>
        {/* <div
          style={{
            color: "whitesmoke",
            fontFamily: fonts.fontStyle9["font-family"],
            fontStyle: fonts.fontStyle9["font-style"],
            fontWeight: fonts.fontStyle9["font-weight"],
            fontSize: "20px",
            padding: "2%",
            // display: "flex",
            // justifyContent: "space-between",
            // alignItems: "center", // Ensures text and icons are centered vertically
            // flexDirection: "row",
          }}
        >
          Machine Wise
        </div>
        <div>
          <WMGraphContainerMW />
        </div> */}
      </Card>
    </div>
  );
}

export default PeriodicMaintenance