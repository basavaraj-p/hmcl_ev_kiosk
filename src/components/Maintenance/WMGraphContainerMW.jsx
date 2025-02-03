import React from "react";
import { Card, Grid } from "@mui/material";
import UptimeGraph from "./UptimeGraph";
import MTTRGraph from "./MTTRGraph";
import MTBFGraph from "./MTBFGraph";
import { useSelector } from "react-redux";
import fonts from "../../style/fonts";
import bgImage from "../../assets/body-background.png";

const cardStyle = {
  display: "flex",
  width: "100%",
  padding: "20px",
  borderRadius: "15px",
  background: "rgba(15, 18, 59, 0.2)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
};

const gridContainerStyle = {
  minHeight: "600px", // Set a fixed height or use minHeight as needed
  margin: 0, // Remove default margin
};

const graphGridStyle = {
  // border: "2px solid red",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
  padding: "13px", // Consistent padding
};

const splitGraphContainerStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  gap: "16px", // Consistent spacing between graphs
  padding: "16px",
};

const splitGraphItemStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
};

const WMGraphContainerMW = () => {
  const graphData2 = useSelector((state) => state.graphData.graphData2);
  const graphDetails = useSelector((state) => state.graphData.graphDetails);
  // console.log("graphData2 : ", graphData2);
  //   console.log("graphDetails : ", graphDetails);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <Card style={cardStyle}>
        <Grid container style={gridContainerStyle}>
          {/* Left Graph */}
          <Grid item xs={12} md={6} style={graphGridStyle}>
            <UptimeGraph
              graphData={graphData2}
              graphDetails={graphDetails}
              status={true}
            />
          </Grid>
          {/* Right Graphs Container */}
          <Grid item xs={12} md={6} style={graphGridStyle}>
            <div style={splitGraphContainerStyle}>
              <div style={splitGraphItemStyle}>
                <MTTRGraph
                  graphData={graphData2}
                  graphDetails={graphDetails}
                  status={true}
                />
              </div>
              <div style={splitGraphItemStyle}>
                <MTBFGraph
                  graphData={graphData2}
                  graphDetails={graphDetails}
                  status={true}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default WMGraphContainerMW;
