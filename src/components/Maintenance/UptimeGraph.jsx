import React from "react";
import ReactECharts from "echarts-for-react";
import { Typography } from "@mui/material";
import fonts from "../../style/fonts";
import * as globalColors from "../../style/colors";

const UptimeGraph = ({ graphData, graphDetails, status }) => {
  // console.log("graphDetails : ", graphDetails);
  // console.log("graphData : ", graphData);

  const getMinMax = (data, data2) => {
    // console.log({ data, data2 });

    const max = Math.ceil(Math.max(...data, ...data2) / 5) * 5;
    const min = Math.min(...data, ...data2);
    return { min, max };
  };

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

  const bdMinutes = graphData.bdMinutes;
  const bdNumbers = graphData.bdNumbers;
  const upTimeConstant = graphData.upTimeConstant;
  const upTimeVariable = graphData.upTimeVariable;

  // Transform data for ECharts format
  const xAxisData = [
    `${months[graphDetails.month] || "Month"} Avg`,
    "w1",
    "w2",
    "w3",
    "w4",
  ];
  const bdMinutesData = Object.values(bdMinutes[0]);
  const bdNumbersData = Object.values(bdNumbers[0]);
  const upTimeVariableData = Object.values(upTimeVariable[0]);
  const upTimeConstantData = Array(5).fill(upTimeConstant);

  // console.log("data : ", upTimeConstantData);

  // Custom colors
  const colors = {
    bdMinutes: globalColors.default.info.main, // Coral red
    bdNumbers: globalColors.default.error.main, // Turquoise
    uptimeVariable: globalColors.default.orange.main, // Sky blue
    uptimeConstant: globalColors.default.success.main, // Sage green
    axisLabels: "whitesmoke", // Dark blue-grey
    axisLines: "#666666", // Medium grey
  };

  // Common font styles
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
    color: [
      colors.bdMinutes,
      colors.bdNumbers,
      colors.uptimeVariable,
      colors.uptimeConstant,
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      textStyle: tooltipStyle,
    },
    legend: {
      data: ["BD Minutes", "BD Numbers", "Uptime Variable", "Uptime Constant"],
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
    yAxis: [
      {
        type: "value",
        name: "     Minutes & Numbers",
        min: 0,
        max: getMinMax(bdMinutesData, bdNumbersData).max || 20,
        interval: 5,
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
          show: true,
          lineStyle: {
            color: colors.axisLines,
          },
        },
        splitLine: {
          lineStyle: {
            color: colors.axisLines,
            opacity: 0.5, // Makes grid lines less prominent
          },
        },
      },
      {
        type: "value",
        name: "Uptime %",
        min: 0,
        max: getMinMax(upTimeVariableData, upTimeConstantData).max || 100,
        interval: 10,
        axisLabel: {
          ...commonFontStyle,
          formatter: "{value}%",
        },
        nameTextStyle: {
          ...commonFontStyle,
          fontSize: 14,
          padding: [0, 0, 0, 10],
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: colors.axisLines,
          },
        },
        splitLine: {
          lineStyle: {
            color: colors.axisLines,
            opacity: 0, // Makes grid lines less prominent
          },
        },
      },
    ],
    series: [
      {
        name: "BD Minutes",
        type: "bar",
        data: bdMinutesData,
        yAxisIndex: 0,
        barGap: "20%",
        itemStyle: {
          color: colors.bdMinutes,
        },
      },
      {
        name: "BD Numbers",
        type: "bar",
        data: bdNumbersData,
        yAxisIndex: 0,
        barGap: "20%",
        itemStyle: {
          color: colors.bdNumbers,
        },
      },
      {
        name: "Uptime Variable",
        type: "line",
        yAxisIndex: 1,
        data: upTimeVariableData,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          color: colors.uptimeVariable,
        },
        lineStyle: {
          width: 2,
          color: colors.uptimeVariable,
        },
      },
      {
        name: "Uptime Constant",
        type: "line",
        yAxisIndex: 1,
        data: upTimeConstantData,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          color: colors.uptimeConstant,
        },
        lineStyle: {
          //   type: "dashed",
          width: 2,
          color: colors.uptimeConstant,
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
        flexDirection: "column",
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
        Uptime Zone {graphDetails.zone || "---"}{" "}
        {status ? `at ${graphDetails.machine}` : ""}
      </Typography>
      <ReactECharts
        option={option}
        style={{ height: "32.5rem", width: "42.5rem" }}
        className="py-4"
      />
    </div>
  );
};

export default UptimeGraph;
