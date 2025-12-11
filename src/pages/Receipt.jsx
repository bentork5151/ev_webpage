// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   Container,
//   Paper,
//   Typography,
//   Box,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableRow,
//   Alert,
//   CircularProgress,
//   Divider
// } from '@mui/material'
// import {
//   Receipt as ReceiptIcon,
//   PlayArrow,
//   ArrowBack
// } from '@mui/icons-material'
// import SessionService from '../services/session.service'
// import { useAuth } from '../store/AuthContext'
// import APP_CONFIG from '../config/app.config'
// import CacheService from '../services/cache.service'

// const Receipt = () => {
//   const navigate = useNavigate()
//   const { user, chargerData } = useAuth()
  
//   const [selectedPlan, setSelectedPlan] = useState(null)
//   const [paymentDetails, setPaymentDetails] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
  
//   useEffect(() => {
//     const plan = CacheService.getPlanData()
    
//     if (!plan.id) {
//       navigate('/config-charging')
//       return
//     }
    
//     setSelectedPlan(plan)
//     calculatePaymentDetails(plan)
//   }, [navigate])

//   const calculatePaymentDetails = (plan) => {
//     const baseAmount = parseFloat(plan.walletDeduction)
//     const gst = baseAmount * APP_CONFIG.TAX.GST_RATE
//     const sxt = baseAmount * APP_CONFIG.TAX.SXT_RATE
//     const total = baseAmount + gst + sxt
    
//     setPaymentDetails({
//       baseAmount: baseAmount.toFixed(2),
//       gst: gst.toFixed(2),
//       sxt: sxt.toFixed(2),
//       total: total.toFixed(2)
//     })
//   }
  
  
//   const handleStartSession = async () =>{
//     if(!user.walletBalance || parseFloat(user.walletBalance) < parseFloat(paymentDetails.total)){
//       setError('Insufficient wallet balance. Please recharge your wallet.')
//       return
//     }

//     setLoading(true)
//     setError('')

//     try{
//       const sessionData = {
//         userId : user.id,
//         chargerId : chargerData.id,
//         planId: selectedPlan.id,
//         message: 'Session start from web',
//         selectedKwh: selectedPlan.kwh || null
//       }

//       const result = await SessionService.startSession(
//         sessionData.chargerId,
//         sessionData.planId
//       )

//       if(result.success){
//         console.log('Session started successfully: ')
//         CacheService.saveSessionData(result.session)
//         CacheService.savePlanData(selectedPlan)
//         navigate('/charging-session')
//       } else{
//         setError(result.error || 'Failed to start session')
//       }
//     } catch(error) {
//       console.error('Session start error: ',error)
//       setError('Error while starting the session')
//     }

//     setLoading(false)
//   }

  
//   if (!selectedPlan || !paymentDetails) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <CircularProgress />
//       </Box>
//     )
//   }
  
//   return (
//     <Container maxWidth="sm" sx={{ py: 4 }}>
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Box display="flex" alignItems="center" mb={3}>
//           <ReceiptIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
//           <Typography variant="h4">Charging Receipt</Typography>
//         </Box>
        
//         {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
//         <Typography variant="h6" gutterBottom>
//           {selectedPlan.planName}
//         </Typography>
//         <Typography variant="body2" color="text.secondary" paragraph>
//           {selectedPlan.description}
//         </Typography>
        
//         <Table size="small">
//           <TableBody>
//             <TableRow>
//               <TableCell>Duration</TableCell>
//               <TableCell align="right">{selectedPlan.durationMin} minutes</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Charger Type</TableCell>
//               <TableCell align="right">{selectedPlan.chargerType}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Rate</TableCell>
//               <TableCell align="right">₹{selectedPlan.rate}/kWh</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell colSpan={2}><Divider /></TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Base Amount</TableCell>
//               <TableCell align="right">₹{paymentDetails.baseAmount}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>GST (18%)</TableCell>
//               <TableCell align="right">₹{paymentDetails.gst}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Service Tax (18%)</TableCell>
//               <TableCell align="right">₹{paymentDetails.sxt}</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell><Typography variant="h6">Total</Typography></TableCell>
//               <TableCell align="right">
//                 <Typography variant="h6">₹{paymentDetails.total}</Typography>
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
        
//         <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
//           <Typography variant="body2" color="text.secondary">
//             Wallet Balance: ₹{user?.walletBalance || '0.00'}
//           </Typography>
//           <Button
//             variant="contained"
//             size="large"
//             startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
//             onClick={handleStartSession}
//             disabled={loading}
//           >
//             {loading ? 'Starting...' : 'Start Charging'}
//           </Button>
//         </Box>
//       </Paper>
//     </Container>
//   )
// }

// export default Receipt





import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Button, CircularProgress, Alert } from "@mui/material"

import SessionService from "../services/session.service"
import CacheService from "../services/cache.service"
import { useAuth } from "../store/AuthContext"
import APP_CONFIG from "../config/app.config"

const Receipt = () => {
  const navigate = useNavigate()
  const { user = {}, chargerData } = useAuth()

  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Fetch selected plan dynamically from CacheService
    const plan = CacheService.getPlanData()
    if (!plan || !plan.id) {
      navigate("/config-charging")
      return
    }

    setSelectedPlan(plan)
    calculatePayment(plan)
  }, [navigate])

  // Dynamically calculate payment based on plan kWh, price, taxes
  const calculatePayment = (plan) => {
    const basePrice = parseFloat(plan.walletDeduction ?? plan.price ?? 0) || 0
    // const gst = basePrice * (APP_CONFIG.TAX?.GST_RATE ?? 0)
    // const sxt = basePrice * (APP_CONFIG.TAX?.SXT_RATE ?? 0)
    const total = basePrice

    setPaymentDetails({
      balance: parseFloat(user.walletBalance ?? 0).toFixed(2),
      power: parseFloat(plan.kwh ?? 0).toFixed(2),
      price: basePrice.toFixed(2),
      total: total.toFixed(2)
    })
  }

  const handlePayment = async () => {
    if (!paymentDetails || !selectedPlan) return

    if (parseFloat(user.walletBalance ?? 0) < parseFloat(paymentDetails.total)) {
      setError("Insufficient wallet balance")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Start session dynamically using selected plan and charger
      const result = await SessionService.startSession(
        chargerData?.id,
        selectedPlan?.id
      )

      if (result?.success) {
        // Save dynamic session and plan
        CacheService.saveSessionData(result.session)
        CacheService.savePlanData(selectedPlan)
        navigate("/charging-session")
      } else {
        setError(result?.error || "Failed to start session")
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!selectedPlan || !paymentDetails) {
    return (
      <div className="centered">
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="page">
      <style>{`
        .page { min-height: 100vh; display: flex; flex-direction: column; background: #fff; padding-bottom: 40px; }
        .header { display: flex; align-items: center; padding: 24px 20px 10px; gap: 12px; }
        .back-icon { width: 28px; height: 28px; cursor: pointer; }
        .title { font-size: 28px; font-weight: 800; }
        .container { flex: 1; padding-top: 40px; max-width: 600px; margin: 0 auto; }
        .row { display: flex; justify-content: space-between; align-items: center; margin: 20px 0; }
        .label { font-size: 20px; font-weight: 400; color: #000; }
        .value { font-size: 22px; font-weight: 600; }
        .divider { height: 2px; background: #d0d0d0; margin: 30px 0; }
        .totalRow { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
        .totalLabel { font-size: 26px; font-weight: 700; }
        .totalValue { font-size: 28px; font-weight: 700; }
        .payWrap { padding: 40px 20px 0; }
        .payButton { width: 100%; height: 70px; border-radius: 40px; background-color: #1c1c1c; color: white; font-size: 18px; font-weight: 700; text-transform: none; }
        .centered { min-height: 100vh; display: flex; justify-content: center; align-items: center; }
      `}</style>

      {/* HEADER */}
      <div className="header">
        <img
          src="/src/assets/images/backicon.svg"
          alt="back"
          className="back-icon"
          onClick={() => navigate(-1)}
        />
        <div className="title">Summary</div>
      </div>

      {/* CONTENT */}
      <Container className="container">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <div className="row">
          <div className="label">Current Balance</div>
          <div className="value">Rs. {paymentDetails.balance}</div>
        </div>

        <div className="row">
          <div className="label">Power Level</div>
          <div className="value">{paymentDetails.power} kWh</div>
        </div>

        <div className="row">
          <div className="label">Price</div>
          <div className="value">Rs. {paymentDetails.price}</div>
        </div>

        <div className="divider"></div>

        <div className="totalRow">
          <div className="totalLabel">Total</div>
          <div className="totalValue">Rs. {paymentDetails.total}</div>
        </div>
      </Container>

      {/* PAY BUTTON */}
      <div className="payWrap">
        <Button onClick={handlePayment} disabled={loading} className="payButton">
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "PAY"}
        </Button>
      </div>
    </div>
  )
}

export default Receipt
