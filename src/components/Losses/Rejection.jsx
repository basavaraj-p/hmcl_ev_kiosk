import React, { useState } from "react";
import Header from "../Header/Header";
import fonts from "../../style/fonts";
import colors from "../../style/colors";
import { Card, Tooltip, Typography, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
// import RejectionContainer2 from "./RejectionContainer2";
import RejectionCard2 from "./RejectionCard2";
import RejectionTable from "./RejectionTable";

const Rejection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

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
          overflow: "hidden",
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          Rejection and Rework
          <Tooltip
            title={
              <Typography
                sx={{
                  fontFamily: fonts.fontStyle7["font-family"],
                  fontStyle: fonts.fontStyle7["font-style"],
                  fontWeight: fonts.fontStyle7["font-weight"],
                  fontSize: "0.9rem",
                }}
              >
                {isOpen ? "Close console" : "Add Rejection/Rework?"}
              </Typography>
            }
            placement="bottom"
          >
            <Button
              variant="contained"
              size="small"
              onClick={toggleOpen}
              style={{
                margin: "2%",
                // height: "2rem",
                backgroundColor: isOpen ? colors.error.main : colors.info.main,
                fontFamily: fonts.fontStyle7["font-family"],
                fontStyle: fonts.fontStyle7["font-style"],
                fontWeight: fonts.fontStyle7["font-weight"],
              }}
              endIcon={
                isOpen ? (
                  <CloseIcon
                    fontSize="medium"
                    style={{ color: colors.white.main }}
                  />
                ) : (
                  <AddIcon
                    fontSize="medium"
                    style={{ color: colors.white.main }}
                  />
                )
              }
            >
              {isOpen ? "Close" : "Add"}
            </Button>
          </Tooltip>
        </div>

        <div
          style={{
            maxHeight: isOpen ? "500px" : "0",
            transition: "max-height 0.3s ease-in-out",
            overflow: "hidden",
          }}
        >
          <RejectionCard2 refresh={refresh} setRefresh={setRefresh} />
        </div>
        <div>
          <RejectionTable refresh={refresh} setRefresh={setRefresh} />
        </div>
        {/* <RejectionContainer2 /> */}
      </Card>
    </div>
  );
};

export default Rejection;
