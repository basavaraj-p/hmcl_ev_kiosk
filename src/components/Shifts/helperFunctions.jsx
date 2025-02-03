// import colors from "../../style/colors";
import {
  format,
  parseISO,
  differenceInDays,
  isBefore,
  isEqual,
  startOfToday,
  parse,
  addMinutes,
} from "date-fns";

export const date_range_style = (colors, fonts) => {
  return {
    color: `${colors.white.focus} !important`,
    height: "3rem",
    borderRadius: "12.5px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: `${colors.grey[600]} !important`,
      borderWidth: "1px",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: `${colors.grey[600]} !important`,
      borderWidth: "1px",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: `${colors.grey[600]} !important`,
      borderWidth: "1px",
    },
    "& .MuiSelect-icon": {
      color: `${colors.info.main} !important`,
    },
    fontFamily: fonts.fontStyle3["font-family"],
    fontStyle: fonts.fontStyle3["font-style"],
    fontWeight: fonts.fontStyle3["font-weight"],
  };
};

export const chip_style = (colors, fonts) => {
  return {
    color: "black",
    backgroundColor: "whitesmoke",
    "& .MuiChip-deleteIcon": {
      color: "black",
    },
    fontFamily: fonts.fontStyle7["font-family"],
    fontStyle: fonts.fontStyle7["font-style"],
    fontWeight: fonts.fontStyle7["font-weight"],
  };
};

export const form_control_header = (colors, fonts) => {
  return {
    color: `${colors.white.focus}`,
    fontFamily: fonts.fontStyle3["font-family"],
    fontStyle: fonts.fontStyle3["font-style"],
    fontWeight: fonts.fontStyle3["font-weight"],
  };
};

export const grid_style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
};

export const select_style = (colors, fonts) => {
  return {
    borderRadius: "12.5px",
    minHeight: "3rem",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: `${colors.grey[600]} !important`,
      borderWidth: "1px",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: `${colors.grey[600]} !important`,
      borderWidth: "1px",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: `${colors.grey[600]} !important`,
      borderWidth: "1px",
    },
    "& .MuiSelect-icon": {
      color: `${colors.white.focus} !important`,
    },
    fontFamily: fonts.fontStyle7["font-family"],
    fontStyle: fonts.fontStyle7["font-style"],
    fontWeight: fonts.fontStyle7["font-weight"],
  };
};

export const menu_item_style = (fonts) => {
  return {
    fontFamily: fonts.fontStyle7["font-family"],
    fontStyle: fonts.fontStyle7["font-style"],
    fontWeight: fonts.fontStyle7["font-weight"],
  };
};

export const getUniqueValues = (arr) => {
  const machineArray = [];
  const zoneSet = new Set();

  arr.forEach((obj) => {
    const machineName =
      obj.machinename === "Insertion"
        ? `${obj.machinename} at ${obj.zone}`
        : obj.machinename;
    machineArray.push(machineName);
    zoneSet.add(obj.zone);
  });

  return [machineArray, [...zoneSet]];
};

export function filterAssetDataByZones(assetIdData, zones) {
  if (zones.includes("all")) {
    return assetIdData;
  }

  return assetIdData.filter((asset) => zones.includes(asset.zone));
}

export function getDateRangeString(dates) {
  // Parse and sort the dates
  const sortedDates = dates
    ?.map((date) => parseISO(date))
    .sort((a, b) => a - b);

  let ranges = [];
  let start = sortedDates[0];
  let end = start;

  for (let i = 1; i < sortedDates.length; i++) {
    if (differenceInDays(sortedDates[i], end) === 1) {
      end = sortedDates[i];
    } else {
      ranges.push({ start, end });
      start = sortedDates[i];
      end = start;
    }
  }
  ranges.push({ start, end });

  // Convert ranges to strings
  const rangeStrings = ranges.map((range) => {
    const startDay = format(range.start, "do");
    const endDay = format(range.end, "do");
    return startDay === endDay ? startDay : `${startDay} to ${endDay}`;
  });

  return rangeStrings.join(" and ");
}

export function getShiftRangeString(shifts) {
  const shiftNames = {
    1: "Shift - A",
    2: "Shift - B",
    3: "Shift - C",
  };

  const getShiftName = (value) => shiftNames[value] || "Unknown Shift";

  const convertShifts = () => shifts.map(getShiftName);
  const convertShifts2 = convertShifts();
  // console.log(convertShifts());
  
  // Extract shift letters from the 'shiftname' property
  const shiftLetters = convertShifts2?.map(
    (shift) => shift.split(" - ")[1]
  );

  // Sort the shift letters
  const sortedShifts = shiftLetters.sort();

  // Construct the output string based on the number of shifts
  if (sortedShifts.length === 3) {
    return `${sortedShifts[0]} to ${sortedShifts[2]}`;
  } else if (sortedShifts.length === 2) {
    return `${sortedShifts[0]}, ${sortedShifts[1]}`;
  } else if (sortedShifts.length === 1) {
    return sortedShifts[0];
  } else {
    return ""; // Return an empty string if there are no shifts
  }
}

export function getNumberString(numbers) {
  const newNumbers = numbers.map((num) => num);
  if (newNumbers.length === 1) {
    return newNumbers[0].toString();
  }
  return newNumbers.join(" and ");
}

export const isDateValid = (startDate, endDate) => {
  const today = startOfToday(); // Get today's date with time set to 00:00:00

  // Check if startDate or endDate is today or before today
  const isStartDateValid =
    isBefore(startDate, today) || isEqual(startDate, today);
  const isEndDateValid = isBefore(endDate, today) || isEqual(endDate, today);

  return isStartDateValid || isEndDateValid;
};

export function convertTimeVanilla(timeStr) {
  // Parse the time string
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  // Create a new Date object for today
  const date = new Date();

  // Set the hours and minutes
  // Convert 12-hour format to 24-hour format
  let hour24 = hours;
  if (period === "PM" && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === "AM" && hours === 12) {
    hour24 = 0;
  }

  date.setHours(hour24);
  date.setMinutes(minutes);
  date.setSeconds(1); // Set seconds to 01

  // Convert to UTC string and format
  return date.toISOString().split("T")[1].substring(0, 8) + "Z";
}

export const generateTimeSlots = (startTime, endTime) => {
  // Parse the input strings into Date objects
  const start = parse(startTime, "HH:mm", new Date());
  const end = parse(endTime, "HH:mm", new Date());

  // Ensure end time is after start time
  if (isBefore(end, start) || isEqual(end, start)) {
    end.setDate(end.getDate() + 1);
  }

  const timeSlots = [];
  let currentTime = start;

  while (isBefore(currentTime, end) || isEqual(currentTime, end)) {
    timeSlots.push(format(currentTime, "h:mm a"));
    currentTime = addMinutes(currentTime, 10);
  }

  return timeSlots;
};

export function getFormattedShifts(shifts) {
  return shifts.map((shift) => {
    const shiftFromDate = parseISO(`1970-01-01T${shift.shiftfrom}`);
    // const shiftFromDate = new Date(shift.shiftfrom);
    const shiftToDate = parseISO(`1970-01-01T${shift.shiftto}`);

    const formattedShiftFrom = format(shiftFromDate, "HH:mm");

    const formattedShiftTo = format(shiftToDate, "HH:mm");

    return {
      shiftid: shift.shiftid,
      shiftname: shift.shiftname,
      shiftfrom: formattedShiftFrom,
      shiftto: formattedShiftTo,
    };
  });
}
