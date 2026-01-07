// import React, { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { Box, LinearProgress, Typography } from '@mui/material'
// import { styled } from '@mui/material/styles'
// import AuthService from '../services/auth.service'
// import ApiService from '../services/api.service'
// import API_CONFIG from '../config/api.config'
// import APP_CONFIG from '../config/app.config'
// import { useAuth } from '../store/AuthContext'
// import logo from "../assets/images/logo.png";
// import TopRightBg from "../assets/images/tr.png";
// import BottomImg from "../assets/images/BottomImg.png";
// import "../assets/styles/SplashScreen.css"; // ✅ Correct CSS path
// import "@material/web/progress/linear-progress.js"; // ✅ Material Web progress


// const SplashScreen = () => {
//   const navigate = useNavigate()
//   const { ocppId } = useParams()
//   const { updateChargerData, transactionHistory } = useAuth()
//   const [status, setStatus] = useState('Initializing...')
//   const [progress, setProgress] = useState(0)

//   useEffect(() => {
//     initializeApp()
//   }, [])

//   const initializeApp = async () => {
//     try {

//       // setProgress(10)
//       setStatus('Checking authentication...')

//       const cacheUser = await AuthService.getCurrentUser();

//       if (!cacheUser) {
//         // setProgress(100)
//         navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
//         return
//       }
//       console.log(cacheUser)

//       // setProgress(25)
//       setStatus('Validating credentials...')

//       const loginResult = await AuthService.login(cacheUser.email);
//       console.log(loginResult.user.email)
//       console.log(loginResult.user.name)

//       if (!loginResult.success) {
//         // setProgress(100)
//         navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
//         return
//       }

//       // setProgress(40)

//       if (ocppId) {
//         try{
//           setStatus('Loading charger data...')
//           const chargerResponse = await ApiService.get(
//             API_CONFIG.ENDPOINTS.GET_CHARGER(ocppId)
//           )
//           console.info('Charger Data:', chargerResponse)
//           updateChargerData(chargerResponse)
//         } catch(error){
//           console.error('Failed to load charger data:', error)
//         }
//         // setProgress(60)
//       }

//       setStatus('Loading Transaction History')
//       const transactions = await AuthService.loadTransaction(loginResult.user.id, 10)
//       transactionHistory(transactions)

//       setStatus('Checking authentication...')
//       // const authResult = await AuthService.verifyCachedCredentials()
//       // setProgress(80)
//       setStatus('Securing Communication...')

//       await new Promise(resolve => setTimeout(resolve, APP_CONFIG.UI.SPLASH_DURATION))
//       // setProgress(100)

//       navigate('/dashboard')

//     } catch (error) {
//       console.error('Initialization error:', error)
//       // setProgress(100)
//       setTimeout(() => {
//         navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
//       }, 1000)
//     }
//   }

//   return (

//    <Box className="splash-container">
//     <img
//   src={TopRightBg}
//   alt="Background decoration"
//   className="top-right-image"
// />
//    <img
//   src={BottomImg}
//   alt="Bottom decoration"
//   className="bottom-image"
// />
//   <img
//   src={logo}
//   alt="Bentork Logo"
//   className="splash-logo"
// />

//   <md-linear-progress indeterminate></md-linear-progress>

//   <p className="splash-text">{status}</p>
// </Box>

//   )
// }

// export default SplashScreen









import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../services/auth.service";
import ApiService from "../services/api.service";
import API_CONFIG from "../config/api.config";
import APP_CONFIG from "../config/app.config";
import { useAuth } from "../store/AuthContext";
import "@material/web/progress/linear-progress.js"; // ✅ Material Web progress
import logo from "../assets/images/logo-1.png";
import "../assets/styles/SplashScreen.css";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { ocppId } = useParams();
  const { updateChargerData, transactionHistory } = useAuth();

  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    initializeApp();
    // eslint-disable-next-line
  }, []);

  const initializeApp = async () => {
    try {
      setStatus("Checking authentication...");

      const cacheUser = await AuthService.getCurrentUser();

      if (!cacheUser) {
        navigate(`/login${ocppId ? `/${ocppId}` : ""}`);
        return;
      }

      setStatus("Validating credentials...");
      const loginResult = await AuthService.login(cacheUser.email);

      if (!loginResult?.success) {
        navigate(`/login${ocppId ? `/${ocppId}` : ""}`);
        return;
      }

      if (ocppId) {
        try {
          setStatus("Loading charger...");
          const chargerResponse = await ApiService.get(
            API_CONFIG.ENDPOINTS.GET_CHARGER(ocppId)
          );
          updateChargerData(chargerResponse);
        } catch (err) {
          console.error("Charger load failed", err);
        }
      }

      setStatus("Loading transactions...");
      const transactions = await AuthService.loadTransaction(
        loginResult.user.id,
        10
      );
      transactionHistory(transactions);

      setStatus("Securing communication...");
      await new Promise((r) =>
        setTimeout(r, APP_CONFIG.UI.SPLASH_DURATION)
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Splash error:", error);
      setTimeout(() => {
        navigate(`/login${ocppId ? `/${ocppId}` : ""}`);
      }, 1000);
    }
  };

  return (
    <div className="splash-container">
      {/* Center Logo Section */}
      <div className="splash-center">
        <img src={logo} alt="Bentork Logo" className="splash-logo" />
        {/* <md-linear-progress indeterminate></md-linear-progress> */}
      </div>

      {/* Bottom Loading Text */}
      <p className="splash-text">{status}</p>
    </div>
  );
};

export default SplashScreen;
