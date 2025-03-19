import React, { useEffect, useState } from "react";
import { Card, Grid } from "@mui/material";
import UptimeGraph from "./UptimeGraph";
import MTTRGraph from "./MTTRGraph";
import MTBFGraph from "./MTBFGraph";
import { useSelector } from "react-redux";

const WMGraphContainer = () => {
  const graphData = useSelector((state) => state.graphData.graphData);
  const graphDetails = useSelector((state) => state.graphData.graphDetails);

  // State to track if we should use the stacked layout
  const [useStackedLayout, setUseStackedLayout] = useState(false);

  // Check window size on mount and when it changes
  useEffect(() => {
    const checkZoomLevel = () => {
      // This checks if we're at a high zoom level (like 150%)
      // or if the screen width is narrow
      const shouldStack = window.devicePixelRatio > 1.2 || window.innerWidth < 1200;

      setUseStackedLayout(shouldStack);
    };

    // Run on component mount
    checkZoomLevel();

    // Set up listener for window resize events
    window.addEventListener("resize", checkZoomLevel);

    // Clean up on unmount
    return () => window.removeEventListener("resize", checkZoomLevel);
  }, []);

  const cardStyle = {
    display: "flex",
    width: "100%",
    padding: "20px",
    borderRadius: "15px",
    background: "rgba(15, 18, 59, 0.2)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
  };

  const gridContainerStyle = {
    width: "100%",
    margin: 0,
  };

  const graphGridStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: "13px",
  };

  const splitGraphContainerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    gap: "16px",
    padding: "16px",
  };

  const splitGraphItemStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "200px",
  };

  if (useStackedLayout) {
    // 150% display scale - all graphs stacked vertically
    return (
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Card style={cardStyle}>
          <Grid container style={gridContainerStyle} spacing={2}>
            <Grid item xs={12} style={graphGridStyle}>
              <UptimeGraph graphData={graphData} graphDetails={graphDetails} status={false} />
            </Grid>
            <Grid item xs={12} style={graphGridStyle}>
              <MTTRGraph graphData={graphData} graphDetails={graphDetails} status={false} />
            </Grid>
            <Grid item xs={12} style={graphGridStyle}>
              <MTBFGraph graphData={graphData} graphDetails={graphDetails} status={false} />
            </Grid>
          </Grid>
        </Card>
      </div>
    );
  } else {
    // 100% display scale - UptimeGraph on left, two other graphs stacked on right
    return (
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Card style={cardStyle}>
          <Grid container style={gridContainerStyle}>
            {/* Left Graph */}
            <Grid item xs={12} md={6} style={graphGridStyle}>
              <UptimeGraph graphData={graphData} graphDetails={graphDetails} status={false} />
            </Grid>
            {/* Right Graphs Container */}
            <Grid item xs={12} md={6} style={graphGridStyle}>
              <div style={splitGraphContainerStyle}>
                <div style={splitGraphItemStyle}>
                  <MTTRGraph graphData={graphData} graphDetails={graphDetails} status={false} />
                </div>
                <div style={splitGraphItemStyle}>
                  <MTBFGraph graphData={graphData} graphDetails={graphDetails} status={false} />
                </div>
              </div>
            </Grid>
          </Grid>
        </Card>
      </div>
    );
  }
};

export default WMGraphContainer;
