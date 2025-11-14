import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material"; // ✅ Import Box from MUI
import bentork_logo from "../assets/images/bentork_logo.png";
import "../assets/styles/SplashScreen.css"; // ✅ Correct CSS path
import "@material/web/progress/linear-progress.js"; // ✅ Material Web progress

export default function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
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
      <md-linear-progress indeterminate></md-linear-progress>
    </Box>
  );
}
