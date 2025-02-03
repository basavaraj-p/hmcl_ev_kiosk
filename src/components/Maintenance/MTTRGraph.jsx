import React from "react";
import ReactECharts from "echarts-for-react";
import { Typography } from "@mui/material";
import fonts from "../../style/fonts";
import * as globalColors from "../../style/colors";

const MTTRGraph = ({ graphData, graphDetails, status }) => {
  const months = React.useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const mttr = graphData.mttr;
  const mttrConstant = 0.5;

  // Transform data for ECharts format
  const xAxisData = [
    `${months[graphDetails.month] || "Month"} Avg`,
    "w1",
    "w2",
    "w3",
    "w4",
  ];
  const mttrData = Object.values(mttr[0]);
  const mttrConstantData = Array(5).fill(mttrConstant);

  // Custom colors
  const colors = {
    mttr: globalColors.default.orange.main, // Sky blue
    targetMttr: globalColors.default.success.main, // Sage green
    axisLabels: "whitesmoke", // Dark blue-grey
    axisLines: "#666666", // Medium grey
  };

  // Common font style
  const commonFontStyle = {
    fontFamily: fonts.fontStyle7["font-family"],
    fontSize: 12,
    color: colors.axisLabels,
  };

  const tooltipStyle = {
    fontFamily: fonts.fontStyle7["font-family"],
    fontSize: 12,
    color: "black",
  };

  const option = {
    color: [colors.mttr, colors.targetMttr],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      textStyle: tooltipStyle,
    },
    legend: {
      data: ["MTTR", "Target MTTR"],
      top: 0,
      textStyle: {
        ...commonFontStyle,
        fontSize: 14,
      },
    },
    grid: {
      top: "15%",
      right: "5%",
      bottom: "10%",
      left: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLabel: {
        ...commonFontStyle,
        rotate: 0,
      },
      axisLine: {
        lineStyle: {
          color: colors.axisLines,
        },
      },
    },
    yAxis: {
      type: "value",
      name: "Hours",
      min: 0,
      max: 2,
      interval: 0.5,
      axisLabel: {
        ...commonFontStyle,
        formatter: "{value}",
      },
      nameTextStyle: {
        ...commonFontStyle,
        fontSize: 14,
        padding: [0, 0, 0, 10],
      },
      axisLine: {
        lineStyle: {
          color: colors.axisLines,
        },
      },
      splitLine: {
        lineStyle: {
          color: colors.axisLines,
          opacity: 0.5,
        },
      },
    },
    series: [
      {
        name: "MTTR",
        type: "line",
        data: mttrData,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          width: 2,
          color: colors.mttr,
        },
        itemStyle: {
          color: colors.mttr,
        },
      },
      {
        name: "Target MTTR",
        type: "line",
        data: mttrConstantData,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          //   type: "dashed",
          width: 2,
          color: colors.targetMttr,
        },
        itemStyle: {
          color: colors.targetMttr,
        },
      },
    ],
  };

  return (
    <div
      // className="w-full h-96"
      style={{
        background: "rgba(15, 18, 59, 0.2)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection : "column",
        width: "90%",
      }}
    >
      <Typography
        sx={{
          fontFamily: fonts.fontStyle7["font-family"],
          fontStyle: fonts.fontStyle7["font-style"],
          fontWeight: fonts.fontStyle7["font-weight"],
          fontSize: "1.25rem",
          textAlign: "center",
          color: colors.axisLabels,
        }}
      >
        MTTR Zone {graphDetails.zone || "---"}{" "}
        {status ? `at ${graphDetails.machine}` : ""}
      </Typography>
      <ReactECharts
        option={option}
        style={{ height: "14rem", width: "42.5rem" }}
        className="py-4"
      />
    </div>
  );
};

export default MTTRGraph;
