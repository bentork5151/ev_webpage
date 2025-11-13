
// import React, { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { Box, CircularProgress, Typography } from '@mui/material'
// import AuthService from '../services/auth.service'
// import ApiService from '../services/api.service'
// import API_CONFIG from '../config/api.config'
// import APP_CONFIG from '../config/app.config'
// import { useAuth } from '../store/AuthContext'

// const SplashScreen = () => {
//   const navigate = useNavigate()
//   const { ocppId } = useParams()
//   const { updateChargerData } = useAuth()
//   const [status, setStatus] = useState('Initializing...')
  
//   useEffect(() => {
//     initializeApp()
//   }, [])
  
//   const initializeApp = async () => {
//     try {

//       if (ocppId) {
//         setStatus('Loading charger data...')
//         const chargerResponse = await ApiService.get(
//           API_CONFIG.ENDPOINTS.GET_CHARGER(ocppId)
//         )
//         updateChargerData(chargerResponse)
//       }
      

//       setStatus('Checking authentication...')
//       const authResult = await AuthService.verifyCachedCredentials()
      

//       await new Promise(resolve => setTimeout(resolve, APP_CONFIG.UI.SPLASH_DURATION))
      

//       if (authResult.success) {
//         navigate('/config-charging')
//       } else {
//         navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
//       }
//     } catch (error) {
//       console.error('Initialization error:', error)

//       setTimeout(() => {
//         navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
//       }, 1000)
//     }
//   }
  
//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       justifyContent="center"
//       minHeight="100vh"
//       bgcolor="primary.main"
//     >
//       <Typography variant="h3" color="white" gutterBottom>
//         {APP_CONFIG.APP_NAME}
//       </Typography>
//       <CircularProgress size={60} sx={{ color: 'white', mt: 4 }} />
//       <Typography variant="body1" color="white" mt={2}>
//         {status}
//       </Typography>
//     </Box>
//   )
// }

// export default SplashScreen



















import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bentork_logo from "../assets/images/bentork_logo.png"; // ✅ Correct relative path

export default function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate("/home"), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 120);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.topCircle}></div>
      <div style={styles.bottomCircle}></div>

      <div style={styles.logoContainer}>
        <img src={bentork_logo} alt="Bentork Logo" style={styles.logo} />
       
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  topCircle: {
    position: "absolute",
    top: "-40px",
    right: "80px",
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    backgroundColor: "#00a651",
    opacity: 0.15,
    filter: "blur(10px)",
  },
  bottomCircle: {
    position: "absolute",
    bottom: "-30px",
    left: "60px",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#00a651",
    opacity: 0.15,
    filter: "blur(10px)",
  },
  logoContainer: { textAlign: "center" },
  logo: { width: "80px", height: "auto", marginBottom: "16px" },
  title: {
    fontSize: "2rem",
    fontWeight: "900",
    letterSpacing: "2px",
    color: "#1a1a1a",
    margin: 0,
  },
  subtitle: { fontSize: "0.9rem", color: "#666", marginBottom: "24px" },
  progressContainer: {
    width: "120px",
    height: "6px",
    backgroundColor: "#e0e0e0",
    borderRadius: "3px",
    overflow: "hidden",
    margin: "0 auto",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#00a651",
    borderRadius: "3px",
    transition: "width 0.3s ease",
  },
};
