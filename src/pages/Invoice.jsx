// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   Container,
//   Paper,
//   Typography,
//   CircularProgress,
//   Alert,
//   Box,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableRow,
//   Divider
// } from '@mui/material'
// import {
//   CheckCircle,
//   Logout
// } from '@mui/icons-material'
// import { useAuth } from '../store/AuthContext'
// import CacheService from '../services/cache.service'

// const Invoice = () => {
//   const navigate = useNavigate()
//   const { user, chargerData, logout } = useAuth()
//   const [sessionData, setSessionData] = useState(null)
//   const [loading, setLoading] = useState(true)
  
//   useEffect(() => {
//     const completion  = JSON.parse(sessionStorage.getItem('sessionCompletion') || '{}')
//     if (completion) {
//       try {
//         const parsed = completion
//         console.log('Parsed session completion data:', parsed)
        
//         const completionData = parsed.completionData || parsed
//         setSessionData(completionData)
        
//         sessionStorage.removeItem('sessionCompletion')
//         CacheService.clearPlanData()
//         CacheService.clearSessionData()
//       } catch (error) {
//         console.error('Error parsing session data:', error)
//         setSessionData(null)
//       }
//     } else {
//       console.warn('No session completion data found')
//       setSessionData(null)
//     }
    
//     setLoading(false)
//   }, [])
  
//   const handleOk = () => {
//     navigate('/thank-you')
//   }
  
//   // const handleLogout = () => {
//   //   logout()
//   // }

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <CircularProgress />
//       </Box>
//     )
//   }
  
//   if (!sessionData) {
//     return (
//       <Container maxWidth="sm" sx={{ py: 4 }}>
//         <Paper elevation={3} sx={{ p: 4 }}>
//           <Alert severity="warning" sx={{ mb: 3 }}>
//             No session data found. The session may have already been processed.
//           </Alert>
//           <Box display="flex" justifyContent="center">
//             <Button variant="contained" onClick={() => navigate('/dashboard')}>
//               Go to Dashboard
//             </Button>
//           </Box>
//         </Paper>
//       </Container>
//     )
//   }

//   const planName = sessionData.plan?.planName || 'N/A'
//   const energyUsed = sessionData.energyUsed ?? 0
//   const duration = sessionData.duration ?? 0
//   const rate = sessionData.plan?.rate ?? 0
//   const finalCost = sessionData.finalCost ?? sessionData.amountDebited ?? (energyUsed * rate)
//   const refundIssued = sessionData.refundIssued || false
//   const extraDebited = sessionData.extraDebited || false
  
//   return (
//     <Container maxWidth="sm" sx={{ py: 4 }}>
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
//           <CheckCircle sx={{ fontSize: 60, color: 'success.main', mr: 2 }} />
//           <Typography variant="h4">Charging Complete</Typography>
//         </Box>

//         {/* Status Messages */}
//         {refundIssued && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             A refund has been issued for unused energy.
//           </Alert>
//         )}
//         {extraDebited && (
//           <Alert severity="warning" sx={{ mb: 2 }}>
//             Extra amount was debited due to higher usage.
//           </Alert>
//         )}
        
//         <Typography variant="h6" gutterBottom>Invoice Details</Typography>
        
//         <Table size="small">
//           <TableBody>
//             <TableRow>
//               <TableCell>User Name</TableCell>
//               <TableCell align="right">{user?.name}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Email</TableCell>
//               <TableCell align="right">{user?.email}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell colSpan={2}><Divider /></TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Charger Name</TableCell>
//               <TableCell align="right">{chargerData?.stationId || chargerData?.name || 'N/A'}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>OCPP ID</TableCell>
//               <TableCell align="right">{chargerData?.ocppId || 'N/A'}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Charger Type</TableCell>
//               <TableCell align="right">{chargerData?.chargerType || 'N/A'}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell colSpan={2}><Divider /></TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Plan</TableCell>
//               <TableCell align="right">{planName}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Energy Used</TableCell>
//               <TableCell align="right">{energyUsed?.toFixed(2)} kWh</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Time Taken</TableCell>
//               <TableCell align="right">{duration} minutes</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Rate</TableCell>
//               <TableCell align="right">₹{rate}/kWh</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell colSpan={2}><Divider /></TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell><Typography variant="h6">Total Amount</Typography></TableCell>
//               <TableCell align="right">
//                 <Typography variant="h6">₹{Number(finalCost).toFixed(2)}</Typography>
//               </TableCell>
//             </TableRow>

//             {sessionData.message && (
//               <TableRow>
//                 <TableCell colSpan={2}>
//                   <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                     {sessionData.message}
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}

//           </TableBody>
//         </Table>
        
//         <Box display="flex" gap={2} justifyContent="center" mt={4}>
//           <Button variant="contained" onClick={handleOk}>OK</Button>
//         </Box>
        
//         <Box position="fixed" bottom={24} left={0} right={0} textAlign="center">
//           <Button startIcon={<Logout />} color="error" onClick={logout}>
//             Logout
//           </Button>
//         </Box>
//       </Paper>
//     </Container>
//   )
// }

// export default Invoice 












import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowBackIosNew,
  NotificationsNoneOutlined,
  CheckCircle,
} from "@mui/icons-material";
import { useAuth } from "../store/AuthContext";
import CacheService from "../services/cache.service";

const Invoice = () => {
  const navigate = useNavigate();
  const { user, chargerData } = useAuth();

  const [sessionData, setSessionData] = useState(null);

  const selectedPlanName = () => {
    const plan = CacheService.getPlanData();
    console.info('plan data: ',plan)
    return plan.planName || 'N/A'
  }

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("sessionCompletion") || "{}");

    if (data) {
      setSessionData(data?.completionData || data);

      sessionStorage.removeItem("sessionCompletion");
      CacheService.clearPlanData();
      CacheService.clearSessionData();
    }
  }, []);
// Invoice page to open and NOT allow going back

  useEffect(() => {
  // Push current page to history
  window.history.pushState(null, "", window.location.href);

  const handleBack = () => {
    window.history.pushState(null, "", window.location.href);
  };

  window.addEventListener("popstate", handleBack);

  return () => {
    window.removeEventListener("popstate", handleBack);
  };
}, []);


  if (!sessionData) return null;

  // -----------------------------
  //  Dynamic Values
  // -----------------------------

  const planName = 0;
  const rate = sessionData?.plan?.rate || 0;
  const energy = sessionData?.energyUsed || 0;
  const duration = sessionData?.duration || 0;
  const finalCost =
    sessionData?.finalCost ||
    sessionData?.amountDebited ||
    (energy * rate);

  const gstAmount = ((finalCost * 18) / 100).toFixed(2);

  const Row = ({ label, value, big }) => (
    <div className="row">
      <span className={`label ${big && "big"}`}>{label}</span>
      <span className={`value ${big && "big"}`}>{value}</span>
    </div>
  );

  return (
    <div className="invoice-container">
      <style>{`
        .invoice-container {
          padding: 16px;
          padding-bottom: 120px;
          font-family: Arial, sans-serif;
        }

        .header {
  display: flex;
  justify-content: center;   /* 🔥 horizontal center */
  align-items: center;       /* 🔥 vertical center */
  height: 48px;              /* optional, clean spacing */
}

.header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}


        .bell {
          position: relative;
        }

        .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: red;
          color: #fff;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .invoice-no {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 20px;
        }

        h3 {
          margin: 20px 0 10px;
          font-size: 18px;
        }

        .row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 15px;
        }

        .label {
          color: #444;
          font-weight: 500;
        }

        .value {
          font-weight: 400;
        }

        .big {
          font-size: 17px;
          font-weight: 600;
        }

        .divider {
          border-bottom: 1px solid #ddd;
          margin: 20px 0;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6DB85B;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 15px;
        }

       .bottom-button {
  position: fixed;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

.bottom-button button {
  width: 90%;
  padding: 14px;
  border-radius: 24px;
  border: none;
  background: #212121;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
 
      `}</style>

      {/* HEADER */}
      <div className="header">
      
        <h2>Invoice</h2>
      
      </div>

      {/* INVOICE NUMBER (dynamic if available) */}
      {/* <div className="invoice-no">
        <span>{sessionData?.invoiceId || "N/A"}</span>
        <span>{sessionData?.invoiceId || "N/A"}</span>
      </div> */}

      <h3>Charging Details</h3>

      <Row label="Station Name" value={chargerData?.stationName || "N/A"} />
      <Row label="Charger Type" value={chargerData?.chargerType || "N/A"} />
      <Row label="Duration" value={formatDuration(duration)} />
      <Row label="Energy Delivered" value={`${energy} kWh`} />
      <Row label="Charging Plan" value={planName} />
      <Row label="Rate per kWh" value={`₹${rate}`} />
      <Row label="GST (18%)" value={`₹${gstAmount}`} />
      <Row label="Total Energy Cost" value={`₹${finalCost}`} big />

      <div className="divider" />

      <h3>Payment Details</h3>

      <Row label="Payment Method" value={sessionData?.paymentMethod || "Wallet"} />
      <Row label="Transaction ID" value={sessionData?.transactionId || "N/A"} />

      <div className="row">
        <span className="label">Status</span>
        <div className="status">
          <CheckCircle style={{ fontSize: 16 }} />
          PAID
        </div>
      </div>

      <Row label="Total Amount Paid" value={`₹${finalCost}`} />

      {/* BOTTOM BUTTON */}
<div className="bottom-button">
  <button onClick={() => navigate("/thank-you")}>
    OK
  </button>
</div>

    </div>
  );
};

export default Invoice;
