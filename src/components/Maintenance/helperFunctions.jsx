// import colors from "../../style/colors";
import { format, parseISO, differenceInDays } from "date-fns";

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

export const grid_style2 = {
  display: "flex",
  // justifyContent: "center",
  alignItems: "center",
  height: "100%",
  marginLeft: "0.5rem",
};

export const select_style = (colors, fonts) => {
  return {
    borderRadius: "12.5px",
    minHeight: "3rem",
    color: "white",
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
  // Extract shift letters from the 'shiftname' property
  const shiftLetters = shifts.map((shift) => shift.shiftname.split(" - ")[1]);

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
  const newNumbers = numbers.map((num) => num.zones);
  if (newNumbers.length === 1) {
    return newNumbers[0].toString();
  }
  return newNumbers.join(" and ");
}

export function validateStrings(inputString) {
  const strings = inputString.split(",");
  const validStrings = [];
  const invalidStrings = [];

  // Use a Set to track unique strings
  const uniqueStrings = new Set();

  for (const str of strings) {
    const trimmedStr = str.trim();

    // Check for empty strings
    if (trimmedStr === "") {
      invalidStrings.push({ string: trimmedStr, reason: "Empty string" });
      continue;
    }

    // Check for duplicates
    if (uniqueStrings.has(trimmedStr)) {
      invalidStrings.push({ string: trimmedStr, reason: "Duplicate string" });
      continue;
    }

    // Add the unique string to the set
    uniqueStrings.add(trimmedStr);

    // Check for alphabets and uppercase
    const hasAlphabets = /[a-zA-Z]/.test(trimmedStr);
    if (hasAlphabets && trimmedStr.toUpperCase() !== trimmedStr) {
      invalidStrings.push({
        string: trimmedStr,
        reason: "Contains lowercase alphabets",
      });
    } else if (trimmedStr.length !== 12) {
      invalidStrings.push({ string: trimmedStr, reason: "Invalid length" });
    } else {
      validStrings.push(trimmedStr);
    }
  }

  // Check for duplicates by comparing the size of the set to the original array
  if (uniqueStrings.size !== strings.length) {
    console.warn("Duplicate strings found!");
  }

  return { validStrings, invalidStrings };
}

export function getMachineName(assetid, data) {
  const machine = data.find((item) => item.assetid === assetid);

  if (!machine) {
    return "Machine not found";
  }

  const { machinename, zone } = machine;

  // Check if there are multiple machines with the same name but different zones
  const duplicates = data.filter(
    (item) => item.machinename === machinename && item.assetid !== assetid
  );

  if (duplicates.length > 0) {
    return `${machinename} at ${zone}`;
  }

  return machinename;
}

export const checkBarcodeDefectCodes = (data, barcodes, defectCodes) => {
  // Convert barcodes and defectCodes parameters to arrays if they're not already
  const barcodeArray = Array.isArray(barcodes) ? barcodes : [barcodes];
  const defectCodeArray = Array.isArray(defectCodes)
    ? defectCodes
    : [defectCodes];

  // Create a Set of the barcodes we're looking for, for efficient lookup
  const barcodeSet = new Set(barcodeArray);

  // Iterate through the data
  for (const item of data) {
    // Check if the current item's barcode is one we're looking for
    if (barcodeSet.has(item.barcode)) {
      // If it is, check if its defect code is in our list of defect codes
      if (defectCodeArray.includes(item.defectcode)) {
        // If we find a match, return true immediately
        return true;
      }
    }
  }

  // If we've gone through all the data without finding a match, return false
  return false;
};
