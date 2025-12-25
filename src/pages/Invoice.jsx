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
import { CheckCircle } from "@mui/icons-material";
import { useAuth } from "../store/AuthContext";
import CacheService from "../services/cache.service";

const Invoice = () => {
  const navigate = useNavigate();
  const { chargerData } = useAuth();
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(
      sessionStorage.getItem("sessionCompletion") || "{}"
    );

    if (data) {
      setSessionData(data?.completionData || data);
      sessionStorage.removeItem("sessionCompletion");
      CacheService.clearPlanData();
      CacheService.clearSessionData();
    }
  }, []);

  if (!sessionData) return null;

  /* ---------------- Dynamic Values ---------------- */
  const stationName = chargerData?.stationName || "N/A";
  const chargerType = chargerData?.chargerType || "N/A";

  const durationMin = sessionData?.duration || 0;
  const energy = sessionData?.energyUsed || 0;
  const rate = sessionData?.plan?.rate || 0;

  const totalCost =
    sessionData?.finalCost ||
    sessionData?.amountDebited ||
    energy * rate;

  const transactionId = sessionData?.transactionId || "N/A";
  const paymentMethod = sessionData?.paymentMethod || "Wallet";

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const Row = ({ label, value, highlight }) => (
    <div className={`row ${highlight ? "highlight" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );

  return (
    <div className="invoice-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .invoice-page {
          min-height: 100vh;
          background: #f4f4f4;
          font-family: Inter, sans-serif;
          padding-bottom: 120px;
        }

        /* HEADER */
        .invoice-header {
          background: #1f1f1f;
          color: #fff;
          text-align: center;
          padding: 28px 16px 36px;
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
          
          
        }

        .invoice-header h1 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Roboto', sans-serif;
        }

        .invoice-header p {
     
          font-size: 12px;
           font-weight: 400;
         opacity: 0.75;
         font-family: 'Roboto', sans-serif;
          color: #fff;
         
        }
          .sub-heading{
          font-size: 18px;
           font-weight: 600;
          }

        /* CARD */
        .card {
          background: #fff;
          margin: 16px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 0 0 1px #e6e6e6;
        }

        .card h2 {
          margin: 0;
          padding: 16px;
          font-size: 18px;
          font-weight: 600;
        }

        .row {
          display: flex;
          justify-content: space-between;
          padding: 14px 16px;
          font-size: 12px;
          border-top: 1px solid #eee;
        }

        .row span:first-child {
          color: #444;
        }

        .row span:last-child {
          font-weight: 500;
        }

        .highlight {
          background: #B1DDFF;
          font-weight: 600;
        }

        .paid {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #63b54f;
          font-weight: 600;
        }

        .paid svg {
          font-size: 18px;
        }

        .highlight-green {
          background: #C0EFB0;
          font-weight: 600;
        }

        /* BOTTOM BUTTON */
        .bottom-action {
          position: fixed;
          bottom: 16px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
        }

        .bottom-action button {
          width: 90%;
          max-width: 420px;
          padding: 14px;
          border-radius: 28px;
          border: none;
          background: #1f1f1f;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
        }

        /* RESPONSIVE */
        @media (min-width: 768px) {
          .card {
            max-width: 600px;
            margin: 16px auto;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="invoice-header">
        <h1>Invoice</h1>
        <p>Session Completed</p>
      </div>

      {/* CHARGING DETAILS */}
      <div className="card">
        <h2 className="sub-heading">Charging Details</h2>

        <Row label="Station Name" value={stationName} />
        <Row label="Charger Type" value={chargerType} />
        <Row label="Duration" value={formatDuration(durationMin)} />
        <Row label="Energy Delivered" value={`${energy} kWh`} />
        <Row label="Rate per kWh" value={`₹${rate}`} />
        <Row label="Total Energy Cost" value={`₹${totalCost}`} highlight />
      </div>

      {/* PAYMENT DETAILS */}
      <div className="card">
        <h2>Payment Details</h2>

        <Row label="Payment Method" value={paymentMethod} />
        <Row label="Transaction ID" value={transactionId} />

        <div className="row">
          <span>Status</span>
          <span className="paid">
            <CheckCircle />
            PAID
          </span>
        </div>

        <div className="row highlight-green">
          <span>Total Amount Paid</span>
          <span>₹{totalCost}</span>
        </div>
      </div>

      {/* BOTTOM BUTTON */}
      <div className="bottom-action">
        <button onClick={() => navigate("/thank-you")}>
          Done
        </button>
      </div>
    </div>
  );
};

export default Invoice;
