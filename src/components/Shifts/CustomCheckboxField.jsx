import React from "react";
import { Grid, FormControl, Checkbox, FormControlLabel } from "@mui/material";
import { styled } from "@mui/system";
import colors from "../../style/colors";
import fonts from "../../style/fonts";

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: "15rem",
  height: "3rem",
  border: `1.5px solid ${colors.grey[600]}`,
  borderRadius: "12.5px",
  display: "flex",
  alignItems: "center",
  padding: "0 0px",
  "&:hover": {
    borderColor: colors.grey[600],
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  width: "100%",
  height: "100%",
  "& .MuiFormControlLabel-label": {
    color: colors.white.focus,
    fontFamily: fonts.fontStyle3["font-family"],
    fontStyle: fonts.fontStyle3["font-style"],
    fontWeight: fonts.fontStyle3["font-weight"],
  },
}));

const CustomCheckboxField = ({ label, checked, onChange }) => {
  const getUniqueValues = (arr) => {
    const machineArray = [];

    arr.forEach((obj) => {
      const machineName =
        obj.machinename === "Insertion"
          ? `${obj.machinename} at ${obj.zone}`
          : obj.machinename;
      machineArray.push(machineName);
    });

    return [machineArray];
  };
  const labelArray = getUniqueValues(label)
  // Join the array of labels with a comma
  const labelText = Array.isArray(labelArray) ? labelArray.join(", ") : label;

  return (
    <StyledFormControl>
      <StyledFormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={onChange}
            sx={{
              color: colors.grey[500],
              "&.Mui-checked": {
                color: colors.info.main,
              },
            }}
          />
        }
        label={labelText}
      />
    </StyledFormControl>
  );
};

export default CustomCheckboxField;
