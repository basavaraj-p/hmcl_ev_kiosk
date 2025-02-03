import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import "./LoginPage.css";
import { styled } from "@mui/material/styles";
import colors from "../style/colors";
import tripleLinearGradient from "../style/tripleLinearGradient";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EngineeringIcon from "@mui/icons-material/Engineering";
import fonts from "../style/fonts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setGlobalAdid } from "../redux/loginSlice";

const GradientTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "15px",
    background: `linear-gradient(${colors.secondary.main}, ${colors.secondary.main}) padding-box, radial-gradient(94.43% 69.43% at 50% 50%, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%) border-box`,
    border: "2px solid transparent",

    "&:hover, &.Mui-focused": {
      background: `linear-gradient(${colors.secondary.main}, ${colors.secondary.main}) padding-box, radial-gradient(94.43% 69.43% at 50% 50%, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%) border-box`,
      border: "2px solid transparent",
    },
    "& fieldset": {
      border: "none",
    },
    // Change input text color and apply fontStyle1
    "& input": {
      color: "whitesmoke",
      fontFamily: fonts.fontStyle2["font-family"],
      fontStyle: fonts.fontStyle2["font-style"],
      fontWeight: fonts.fontStyle2["font-weight"],
    },
    // Change placeholder color and apply fontStyle1
    "& input::placeholder": {
      color: "whitesmoke",
      opacity: 1,
      fontFamily: fonts.fontStyle1["font-family"],
      fontStyle: fonts.fontStyle1["font-style"],
      fontWeight: fonts.fontStyle1["font-weight"],
    },
  },
  // For Internet Explorer
  "& input:-ms-input-placeholder": {
    color: "whitesmoke",
    fontFamily: fonts.fontStyle1["font-family"],
    fontStyle: fonts.fontStyle1["font-style"],
    fontWeight: fonts.fontStyle1["font-weight"],
  },
  // For Microsoft Edge
  "& input::-ms-input-placeholder": {
    color: "whitesmoke",
    fontFamily: fonts.fontStyle1["font-family"],
    fontStyle: fonts.fontStyle1["font-style"],
    fontWeight: fonts.fontStyle1["font-weight"],
  },
}));

const LoginPage = ({ setIsLoggedIn, isLoggedIn }) => {
  const { gradients, secondary } = colors;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [adid, setAdid] = useState("");
  const [password, setPassword] = useState("");
  // console.table({ adid, password });
  const dispatch = useDispatch();

  // const [message, setMessage] = useState("");
  // console.log("isLoggedIn : ", isLoggedIn);

  const notify = (message) => {
    toast(message, {
      position: "top-right",
      autoClose: 5000, // 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false, // Disable pause on hover
      draggable: true,
      progress: undefined,
      style: {
        background:
          "linear-gradient(180deg, #1a1f4d 0%, #23284f 50%, #2d3154 100%)", // Dark background
        color: "#fff", // White text
        fontFamily: fonts.fontStyle1["font-family"],
        fontSize: "16px",
      },
      progressStyle: {
        background: colors.info.main, // Green progress bar
      },
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // const ldapLogin = async (adid, password) => {
  //   try {
  //     const response = await axios.post("http://localhost:7010/searchUser", {
  //       username: adid,
  //       password: password,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("LDAP Login Error:", error);
  //     throw error;
  //   }
  // };

  async function handleSubmit() {
    try {
      // const loginData = await ldapLogin(adid, password);

      dispatch(setGlobalAdid(adid));
      setIsLoggedIn(true);

      // Store login state in sessionStorage
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("adid", adid);

      notify("Login successful!", "success");
      navigate("/dashboard");
    } catch (error) {
      notify("Login failed");
    }
  }

  return (
    <div
      style={{
        background: tripleLinearGradient(
          gradients.cover.main,
          gradients.cover.state,
          gradients.cover.stateSecondary,
          gradients.cover.angle
        ),
        minHeight: "100vh", // Ensure full height
        width: "100%",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        style={{
          fontFamily: fonts.fontStyle2["font-family"],
          fontSize: "16px",
        }}
        progressStyle={{
          background: colors.info.main, // Green progress bar
        }}
      />

      <Grid container spacing={0}>
        <Grid item xs={6}>
          <div className="loginpage_img_container"></div>
        </Grid>
        <Grid item xs={6}>
          <div className="login-content-container">
            <div className="card-container">
              <Card className="loginpage_card">
                <h1 className="loginpage_box_header">LOGIN</h1>
                <GradientTextField
                  //   fullWidth
                  margin="normal"
                  size="small"
                  variant="outlined"
                  placeholder="ADID"
                  onChange={(e) => setAdid(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EngineeringIcon style={{ color: "whitesmoke" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <GradientTextField
                  //   fullWidth
                  margin="normal"
                  size="small"
                  variant="outlined"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon
                              style={{ color: "whitesmoke" }}
                            />
                          ) : (
                            <VisibilityIcon style={{ color: "whitesmoke" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  style={{
                    marginTop: "5%",
                    fontFamily: fonts.fontStyle9["font-family"],
                    fontStyle: fonts.fontStyle9["font-style"],
                    fontWeight: fonts.fontStyle9["font-weight"],
                  }}
                  onClick={handleSubmit}
                  type="submit"
                  //   fullWidth
                >
                  Submit
                </Button>
              </Card>
            </div>
            <footer className="footer">
              © {new Date().getFullYear()} SENSEOPS Tech Solutions Pvt. Ltd.
            </footer>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginPage;
