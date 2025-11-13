import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, LinearProgress, Typography } from "@mui/material";
import bentork_logo from "../assets/images/bentork_logo.png";
import "../assets/style/SplashScreen.css"; // ✅ Correct path to CSS file

export default function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
         setTimeout(() => navigate("/login"), 500);
          return 100;
        }
        return Math.min(oldProgress + 5, 100);
      });
    }, 150);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <Box className="splash-container">
      <img src={bentork_logo} alt="Bentork Logo" className="splash-logo" />
      {/* <Typography className="splash-title">BENTORK</Typography>
      <Typography className="splash-subtitle">
        Connecting to the modern world
      </Typography> */}
      <Box className="splash-progress">
        <LinearProgress variant="determinate" value={progress} />
      </Box>
      <Typography className="splash-percent">{progress}%</Typography>
    </Box>
  );
}
