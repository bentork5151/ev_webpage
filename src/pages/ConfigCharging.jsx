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
   const [showPaymentDialog, setShowPaymentDialog] = useState(false); 
const totalAmount =
  Number(selectedPlan?.rate || 0) * Number(powerValue);

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
  
const handleConfirmPayment = () => {
  if (!selectedPlan) return;

  const updatedPlan = {
    ...selectedPlan,
    energyProvided: powerValue,
    // walletDeduction: totalAmount,
walletDeduction: Number(totalAmount.toFixed(2))
  };

  CacheService.savePlanData(updatedPlan);

  // ✅ Close dialog first
  setShowPaymentDialog(false);

  // ✅ Navigate AFTER state update
  setTimeout(() => {
    navigate("/Receipt", { replace: true });
  }, 100);
};


  useEffect(() => {
  if (plans.length && !selectedPlan) {
    setSelectedPlan(plans[0]);
  }
}, [plans]);

  return (
    <>
      <style>{`
        html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Arial, sans-serif;
  overflow: hidden;   /* ✅ STOP PAGE SCROLL */
}

       .page {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
  height: calc(100vh - 80px); /* ✅ FULL SCREEN */
  box-sizing: border-box;
  overflow: hidden; /* ✅ NO VERTICAL SCROLL */
}

        .header {
         display: flex;
  justify-content: flex-start; /* 👈 move logo to left */
 
  margin-bottom: 8px;
         
         
        }
/* ===== MAIN WRAPPER ===== */
.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

/* ===== LEFT ===== */
.left-content {
  width: 50%;
}

/* ===== RIGHT ===== */
.right-content {
  width: 50%;
  display: flex;
  justify-content: center;
}
        /* ===== TITLE ===== */
.top-flex {
  margin: 20px 0 18px;
}

.title {
  font-size: 42px;
  font-weight: 300;
  line-height: 1.1;
}

.sub {
  font-size: 18px;

    font-weight: 300;
}
/* ===== STATION LAYOUT ===== */
.station-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
       /* ===== STATION CARD ===== */
.station {
  background: #212121;
  color: #fff;
  padding: 12px 6px;
  border-radius: 12px;
 
}

.station-title {
  display: block;
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 10px;
}
  .station-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.station-list li {
  font-size: 12px;
  line-height: 1.6;
  color: #fffefeff;
  position: relative;
  padding-left: 14px;
  font-weight: 300;
}

.station-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #ffffff;
}

      

        /* ===== IMAGE ===== */
.station-img {
  width: 166px;
  height: 190px;


}

        .label {
          font-weight: 400;
          margin: 20px 0 8px;
           font-size: 14px;
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
  overflow-x: auto;   /* ✅ only horizontal scroll */
  overflow-y: hidden;
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
  transition: all 0.25s ease;
}

       .card.selected {
  border: 2px solid #67B84B;
  background: #fff;
}

       .popular {
  position: absolute;
  top: -12px;
  left: 16px;
  background: #67B84B;
  color: #fff;
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
}
.card:hover {
  transform: translateY(-3px);
}
        .card strong {
          font-size: 18px;
          font-weight: 400;

        }

        .time {
          margin-top: 8px;
          color: #333;
        }

        .price {
          margin-top: 10px;
          color: #67B84B;
          font-weight: 700;
          font-size: 18px;
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
         
          .card strong { font-size: 18px; }
          .price { font-size: 18px; }
        }



       .dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.48);
  display: flex;
  justify-content: center; /* center horizontally */
  align-items: center;     /* center vertically */
  z-index: 999;
}
       .dialog {
  background: #fff;
  width: 90%;
  max-width: 400px;
  border-radius: 16px;
  padding: 16px;
  animation: scaleUp 0.3s ease;
}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .section{border-radius:16px;padding:14px;margin-bottom:12px}
        .blue{background:#f1f8ff;border:1px solid #cce3ff}
        .green{background:#eaffdb}
        .row{display:flex;justify-content:space-between;margin:10px 0}
        .pay-btn{background:#111;color:#fff;padding:16px;border-radius:16px;text-align:center;margin-top:12px}
      
      `}</style>

      <div className="page">
        <div className="header">
          <img
            src="https://github.com/bentork5151/assets/blob/main/Logo/logo_transparent.png?raw=true"
            alt="BENTORK Logo"
            style={{ height: "55px", objectFit: "contain", width: "200px" }}
          />
        </div>

      <div className="top-section">
  {/* LEFT SIDE */}
  <div className="left-content">
    <div className="top-flex">
      <div className="title">Charging</div>
      <div className="sub">Configuration</div>
    </div>

    <div className="station">
      <div className="station-text">
        <strong className="station-title">🔌 Station</strong>

        <ul className="station-list">
          <li>{chargerData?.name || "Bentork EV Station"}</li>
          <li>Charger: {chargerData?.chargerType || "Type 2"}</li>
          <li>Power: {chargerData?.chargerType === "DC" ? "DC" : "AC"}</li>
        </ul>
      </div>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="right-content">
    <img
      className="station-img"
      src="https://raw.githubusercontent.com/bentork5151/assets/19d62ecada81d6658614b7da7360f863b727105a/Illustrations/undraw_editable_y4ms.svg"
      alt="EV Illustration"
    />
  </div>
</div>



        <div className="label">Custom Power Range</div>
        <md-slider
          labeled
          min="0"
          max="100"
          step="10"
          value={powerValue}  
         onInput={(e) => setPowerValue(Number(e.target.value))}
        ></md-slider>

        <div className="label">Based on Time</div>
       <div className="scroll">
  {plans.map((plan) => (
    <div
      key={plan.id}
      className={`card ${selectedPlan?.id === plan.id ? "selected" : ""}`}
      onClick={() => setSelectedPlan(plan)}
    >
      {selectedPlan?.id === plan.id && (
        <div className="popular">Popular</div>
      )}

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

      {/* <div className="pay-bar" onClick={handleConfirm}>
        Pay ₹{selectedPlan?.walletDeduction || "0.00"}
      </div> */}

 <div className="pay-bar" onClick={() => setShowPaymentDialog(true)}>
        PAY ₹{selectedPlan?.walletDeduction || 0}
      </div>

      {/* ===== PAYMENT DIALOG ===== */}
      {showPaymentDialog && (
  <div className="dialog-backdrop" onClick={() => setShowPaymentDialog(false)}>
  <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Payment Summary</h3>

            <div className="section blue">
  <strong>Charging Details</strong>
  <div className="row"><span>Duration</span><span>{selectedPlan?.durationMin} mins</span></div>
  <div className="row"><span>Charger Type</span><span>{chargerData?.chargerType}</span></div>
  <div className="row"><span>Energy</span><span>{powerValue} kWh</span></div>
  <div className="row"><span>Rate</span><span>₹{selectedPlan?.rate}/kWh</span></div>
</div>

<div className="section">
  <strong>Price Breakdown</strong>
 <div className="row">
  <span>Total Amount</span>
  <span>₹{totalAmount.toFixed(2)}</span>
</div>

</div>

            <div className="section green">
              <div className="row"><strong>Wallet Balance</strong><strong>₹101.92</strong></div>
            </div>

            <div className="pay-btn" onClick={handleConfirmPayment}>
              PAY
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfigCharging;
