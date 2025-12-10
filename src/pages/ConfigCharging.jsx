// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Typography,
//   Button,
//   Box,
//   CircularProgress,
//   Alert,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material'
// import {
//   BoltOutlined,
//   AccessTime,
//   AccountBalanceWallet
// } from '@mui/icons-material'
// import ApiService from '../services/api.service'
// import API_CONFIG from '../config/api.config'
// import { useAuth } from '../store/AuthContext'
// import CacheService from '../services/cache.service'

// const ConfigCharging = () => {
//   const navigate = useNavigate()
//   const { user, chargerData } = useAuth()
  
//   const [plans, setPlans] = useState([])
//   const [selectedPlan, setSelectedPlan] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [confirmDialog, setConfirmDialog] = useState(false)
  
//   useEffect(() => {
//     fetchPlans()
//   }, [])
  
//   const fetchPlans = async () => {
//     try {
//       setLoading(true)
//       const response = await ApiService.get(API_CONFIG.ENDPOINTS.GET_ALL_PLANS)
      
//       const filteredPlans = chargerData?.chargerType 
//         ? response.filter(plan => plan.chargerType === chargerData.chargerType)
//         : response
      
//       setPlans(filteredPlans)
//     } catch (error) {
//       console.error('Failed to fetch plans:', error)
//       setError('Failed to load charging plans')
//     } finally {
//       setLoading(false)
//     }
//   }
  
//   const handlePlanSelect = (plan) => {
//     setSelectedPlan(plan)
//     setError('')
//   }
  
//   const handleProceedToPayment = () => {
//     if (!selectedPlan) {
//       setError('Please select a charging plan')
//       return
//     }
    
//     if (!chargerData) {
//       setError('Charger information not available')
//       return
//     }
    
//     setConfirmDialog(true)
//   }
  
//   const confirmAndProceed = () => {

//     if (!selectedPlan) {
//       console.error('No plan selected')
//       return
//     }

//     CacheService.savePlanData(selectedPlan)
//     setConfirmDialog(false)

//     setTimeout(() => {
//       navigate('/receipt')
//     }, 100)
//   }
  
//   const formatDuration = (minutes) => {
//     const hours = Math.floor(minutes / 60)
//     const mins = minutes % 60
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`
//   }
  
//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <CircularProgress />
//       </Box>
//     )
//   }
  
//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Typography variant="h4" gutterBottom align="center">
//         Select Charging Plan
//       </Typography>
      
//       {chargerData && (
//         <Box textAlign="center" mb={3}>
//           <Chip 
//             label={`Charger: ${chargerData.name || chargerData.ocppId}`}
//             color="primary"
//           />
//           <Chip 
//             label={`Type: ${chargerData.chargerType}`}
//             color="secondary"
//             sx={{ ml: 1 }}
//           />
//         </Box>
//       )}
      
//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//       )}
      
//       <Grid container spacing={3}>
//         {plans.map((plan) => (
//           <Grid size={{ xs: 12, sm: 6, md: 4 }}>
//             <Card
//               sx={{
//                 height: '100%',
//                 cursor: 'pointer',
//                 border: selectedPlan?.id === plan.id ? '2px solid' : '1px solid #e0e0e0',
//                 borderColor: selectedPlan?.id === plan.id ? 'primary.main' : '#e0e0e0',
//                 transition: 'all 0.3s ease',
//                 '&:hover': {
//                   boxShadow: 3,
//                   transform: 'translateY(-4px)'
//                 }
//               }}
//               onClick={() => handlePlanSelect(plan)}
//             >
//               <CardContent>
//                 <Typography variant="h5" component="div" gutterBottom>
//                   {plan.planName}
//                 </Typography>
                
//                 <Typography variant="body2" color="text.secondary" mb={2}>
//                   {plan.description}
//                 </Typography>
                
//                 <Box display="flex" flexDirection="column" gap={2}>
//                   <Box display="flex" alignItems="center">
//                     <AccountBalanceWallet sx={{ mr: 1, color: 'primary.main' }} />
//                     <Typography variant="h6">
//                       ₹{plan.walletDeduction}
//                     </Typography>
//                   </Box>
                  
//                   {plan.energyProvided && (
//                     <Box display="flex" alignItems="center">
//                       <BoltOutlined sx={{ mr: 1, color: 'warning.main' }} />
//                       <Typography>
//                         {plan.energyProvided} kWh
//                       </Typography>
//                     </Box>
//                   )}
                  
//                   <Box display="flex" alignItems="center">
//                     <AccessTime sx={{ mr: 1, color: 'info.main' }} />
//                     <Typography>
//                       {formatDuration(plan.durationMin)}
//                     </Typography>
//                   </Box>
                  
//                   <Typography variant="caption" color="text.secondary">
//                     Rate: ₹{plan.rate}/kWh
//                   </Typography>
//                 </Box>
//               </CardContent>
              
//               {selectedPlan?.id === plan.id && (
//                 <CardActions>
//                   <Chip label="Selected" color="primary" size="small" />
//                 </CardActions>
//               )}
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
      
//       <Box display="flex" justifyContent="center" mt={4}>
//         <Button
//           variant="contained"
//           size="large"
//           disabled={!selectedPlan}
//           onClick={handleProceedToPayment}
//           sx={{ minWidth: 200 }}
//         >
//           Pay ₹{selectedPlan?.walletDeduction || 0}
//         </Button>
//       </Box>
      
//       <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
//         <DialogTitle>Confirm Selection</DialogTitle>
//         <DialogContent>
//           <Typography>
//             You have selected: <strong>{selectedPlan?.planName}</strong>
//           </Typography>
//           <Typography variant="body2" sx={{ mt: 1 }}>
//             Amount: ₹{selectedPlan?.walletDeduction}
//           </Typography>
//           <Typography variant="body2">
//             Duration: {selectedPlan && formatDuration(selectedPlan.durationMin)}
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
//           <Button onClick={confirmAndProceed} variant="contained">
//             Proceed to Payment
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   )
// }

// export default ConfigCharging




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/api.service";
import API_CONFIG from "../config/api.config";
import { useAuth } from "../store/AuthContext";
import CacheService from "../services/cache.service";
import "@material/web/slider/slider.js";

const ConfigCharging = () => {
  const navigate = useNavigate();
  const { chargerData } = useAuth();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [powerValue, setPowerValue] = useState(10);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const response = await ApiService.get(API_CONFIG.ENDPOINTS.GET_ALL_PLANS);
    const filtered = chargerData?.chargerType
      ? response.filter((p) => p.chargerType === chargerData.chargerType)
      : response;
    setPlans(filtered);
  };

  const handleConfirm = () => {
    if (!selectedPlan) return;
    const updatedPlan = { ...selectedPlan, energyProvided: powerValue };
    CacheService.savePlanData(updatedPlan);
    navigate("/receipt");
  };

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: Arial, sans-serif;
          overflow-y: auto;
        }

        .page {
          max-width: 480px;
          margin: 0 auto;
          padding: 16px 16px 220px;
          box-sizing: border-box;
        }

        .header {
          text-align: center;
          margin-bottom: 10px;
        }

        .top-flex {
          margin: 20px 0 10px;
        }

        .title {
          font-size: 28px;
          font-weight: 500;
        }

        .sub {
          font-size: 16px;
          color: #444;
        }

        .station {
          background: #111;
          color: #fff;
          padding: 16px;
          border-radius: 16px;
          margin: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .station-text {
          max-width: 60%;
        }

        .station strong {
          display: block;
          margin-bottom: 6px;
        }

        .station-img {
          width: 100px;
          max-width: 40%;
        }

        .label {
          font-weight: 600;
          margin: 20px 0 8px;
        }

        md-slider {
          width: 100%;
          --md-sys-color-primary: #00A000;
          --md-sys-color-secondary: #d6efbf;
          --md-slider-active-track-height: 20px;
          --md-slider-inactive-track-height: 20px;
          --md-slider-active-track-color: #5cc554ff;
          --md-slider-inactive-track-color: #d6efbf;
          --md-slider-handle-width: 4px;
          --md-slider-handle-height: 40px;
          --md-slider-handle-shape: 4px;
          --md-slider-tick-color: #4b4b4b;
          --md-slider-tick-active-color: #4caf50;
          --md-slider-tick-size: 7px;
            transition: all 0.3s ease;
        }

        .scroll {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding: 10px 0;
          -webkit-overflow-scrolling: touch;
        }

        .card {
          min-width: 150px;
          padding: 16px;
          border-radius: 16px;
          border: 2px solid #e6e6e6;
          background: #f5f5f5;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
          text-align: center;
        }

        .card.selected {
          border: 2px solid #67B84B;
          background: white;
        }

        .popular {
          position: absolute;
          top: -12px;
          left: 20px;
          background: #67B84B;
          color: white;
          padding: 2px 10px;
          border-radius: 16px;
          font-size: 12px;
        }

        .card strong {
          font-size: 20px;
        }

        .time {
          margin-top: 8px;
          color: #333;
        }

        .price {
          margin-top: 10px;
          color: #67B84B;
          font-weight: bold;
          font-size: 20px;
        }

        .info {
          text-align: center;
          margin: 16px 0;
          color: #67B84B;
          font-size: 14px;
        }

        .pay-bar {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 400px;
          background: #111;
          color: white;
          padding: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          z-index: 1000;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .title { font-size: 24px; }
          .sub { font-size: 14px; }
          .station-img { width: 80px; }
          .card strong { font-size: 18px; }
          .price { font-size: 18px; }
        }
      `}</style>

      <div className="page">
        <div className="header">
          <img
            src="https://github.com/bentork5151/assets/blob/main/Logo/logo_transparent.png?raw=true"
            alt="BENTORK Logo"
            style={{ height: "70px", objectFit: "contain", width: "140px" }}
          />
        </div>

        <div className="top-flex">
          <div className="title">Charging</div>
          <div className="sub">Configuration</div>
        </div>

        <div className="station">
          <div className="station-text">
            <strong>🔌 Station</strong>
            <div>• {chargerData?.name || "Bentork EV Station"}</div>
            <div>• Charger: {chargerData?.chargerType || "Type 2"}</div>
          </div>
          <img
            className="station-img"
            src="https://raw.githubusercontent.com/bentork5151/assets/19d62ecada81d6658614b7da7360f863b727105a/Illustrations/undraw_editable_y4ms.svg"
            alt="EV"
          />
        </div>

        <div className="label">Custom Power Range</div>
        <md-slider
          labeled
          min="0"
          max="100"
          step="10"
          value={powerValue}
          onInput={(e) => setPowerValue(e.target.value)}
        ></md-slider>

        <div className="label">Based on Time</div>
        <div className="scroll">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card ${selectedPlan?.id === plan.id ? "selected" : ""}`}
              onClick={() => setSelectedPlan(plan)}
            >
              {plan.isPopular && <div className="popular">Popular</div>}
              <strong>{plan.planName}</strong>
              <div className="time">{plan.durationMin} mins</div>
              <div className="price">₹{plan.walletDeduction}</div>
            </div>
          ))}
        </div>

        <div className="label">Based on Power</div>
        <div className="scroll">
          {plans.map((plan) => (
            <div
              key={plan.id + "p"}
              className={`card ${selectedPlan?.id === plan.id ? "selected" : ""}`}
              onClick={() => setSelectedPlan(plan)}
            >
              <strong>{plan.energyProvided || 10} kWh</strong>
              <div className="time">{plan.durationMin} mins</div>
              <div className="price">₹{plan.walletDeduction}</div>
            </div>
          ))} 
        </div>

        <div className="info">✓ Optimal charging rates for your vehicle</div>
      </div>

      <div className="pay-bar" onClick={handleConfirm}>
        Pay ₹{selectedPlan?.walletDeduction || "0.00"}
      </div>
    </>
  );
};

export default ConfigCharging;
