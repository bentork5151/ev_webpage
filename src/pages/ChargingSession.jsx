// import React, { useState, useEffect, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   Container,
//   Paper,
//   Typography,
//   Box,
//   Button,
//   CircularProgress,
//   Alert,
//   Grid,
//   LinearProgress,
//   Card,
//   CardContent,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material'
// import {
//   BatteryChargingFull,
//   Timer,
//   Bolt,
//   Stop,
// } from '@mui/icons-material'
// import SessionService from '../services/session.service'
// // import ApiService from '../services/api.service'
// import APP_CONFIG from '../config/app.config'
// // import wsService from '../services/websocket.service'
// import CacheService from '../services/cache.service'

// const ChargingSession = () => {
//   const navigate = useNavigate()
//   const intervalRef = useRef(null)
//   const energyIntervalRef  = useRef(null)
//   const chargingDataRef = useRef({
//     energyUsed: 0,
//     timeElapsed: 0,
//     percentage: 0,
//     status: 'ACTIVE'
//   })
//   const [selectedPlan, setSelectedPlan] = useState(null)
//   const [session, setSession] = useState(null)
//   const [chargingData, setChargingData] = useState({
//     energyUsed: 0,
//     timeElapsed: 0,
//     percentage: 0,
//     status: 'ACTIVE'
//   })
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [stopDialog, setStopDialog] = useState(false)
//   const [stopping, setStopping] = useState(false)
//   const [sessionCompleted, setSessionCompleted] = useState(false)

//   useEffect(() => {
//     chargingDataRef.current = chargingData
//   }, [chargingData])
    
//   useEffect(() => {
//     initializeSession()
    
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current)
//       if (energyIntervalRef.current) clearInterval(energyIntervalRef.current)
//       // wsService.disconnect()
//     }
//   }, [])
  
//   const initializeSession = async () => {
//     try {
//       const activeSession = CacheService.getSessionData() || SessionService.getActiveSession()
//       const plan = CacheService.getPlanData()

//       console.log('Active session:', activeSession)
//       console.log('Selected plan:', plan)
      
//       if (!activeSession || !activeSession.sessionId) {
//         console.error('No active session found')
//         navigate('/config-charging')
//         return
//       }
      
//       setSession(activeSession)
//       setSelectedPlan(plan)
      
//       // wsService.connect(activeSession.sessionId)
//       // setupWebSocketListeners()
      
//       if (plan?.durationMin) {
//         startTimer(plan.durationMin)
//       }

//       if (activeSession.sessionId) {
//         startEnergyMonitoring(activeSession.sessionId)
//       }
      
//       setLoading(false)
//     } catch (error) {
//       console.error('Failed to initialize session:', error)
//       setError('Failed to load charging session')
//       setLoading(false)
//     }
//   }
  
  
//   const startTimer = (durationMinutes) => {
//     const totalSeconds = durationMinutes * 60

//     intervalRef.current = setInterval(() => {
//       setChargingData(prev => {
//         const newElapsed = prev.timeElapsed + 1
//         const percentage = (newElapsed / totalSeconds) * 100
        
//         if (newElapsed >= totalSeconds) {
//           if (intervalRef.current) {
//             clearInterval(intervalRef.current)
//             intervalRef.current = null
//           }

//           setTimeout(() => {
//             handleSessionComplete({ 
//               status: 'COMPLETED', 
//               reason: 'Time limit reached' 
//             })
//           }, 0)
//         }

//         return {
//           ...prev,
//           timeElapsed: newElapsed,
//           percentage: Math.min(100, percentage)
//         }
//       })
//     }, 1000)
//   }
  
//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600)
//     const minutes = Math.floor((seconds % 3600) / 60)
//     const secs = seconds % 60
    
//     if (hours > 0) {
//       return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
//     }
//     return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
//   }

//   const getRemainingTime = () => {
//     if (!selectedPlan?.durationMin) return '--:--'
//     const totalSeconds = selectedPlan.durationMin * 60
//     const remaining = Math.max(0, totalSeconds - chargingData.timeElapsed)
//     return formatTime(remaining)
//   }

//   const startEnergyMonitoring = (sessionId) => {
//     const checkEnergy = async () => {
//       try {
//         const status = await SessionService.getSessionStatus(sessionId)
//         const kwhUsed = await SessionService.getKwhUsed(sessionId)
//         // const elapsedMinutes = chargingData.timeElapsed / 60

//         console.log('Session status:', status)
//         console.log('Session status:', kwhUsed)
//         // console.log('Session status:', elapsedMinutes)

//         setChargingData(prev => ({
//           ...prev,
//           energyUsed: kwhUsed || 0,
//           status: typeof status === 'string' ? status.toUpperCase() : status?.status?.toUpperCase() || 'ACTIVE'
//           // timeRemaining: elapsedMinutes
//         }))

//         const statusValue = typeof status === 'string' ? status : status?.status
//         if (statusValue?.toLowerCase() === 'completed') {
//           handleSessionComplete({ status: 'COMPLETED', reason: 'Energy limit reached' })
//         }

//       } catch (error) {
//         console.error('Failed to fetch kWh:', error)
//       }
//     }
//     checkEnergy()

//     // check energy and status every 10 seconds
//     energyIntervalRef.current = setInterval(checkEnergy, 10000)
//   }
  
//   const handleStopSession = async () => {
//     setStopDialog(false)
//     setStopping(true)
//     setError('')
    
//     try {
//       console.log('Stopping session:', session?.sessionId)
      
//       if (!session?.sessionId) {
//         setError('Session ID not found')
//         setStopping(false)
//         return
//       }

//       const result = await SessionService.stopSession(session.sessionId)

//       console.log('Stop session result:', result)
      
//       if (result.success) {
//         handleSessionComplete({ 
//           status: 'STOPPED',
//           reason: 'Manual stop',
//           ...result.sessionData
//         })
//       } else {
//         setError(result.error || 'Failed to stop session')
//       }
//     } catch (error) {
//       console.error('Failed to stop session:', error)
//       setError('Failed to stop charging session')
//     }
    
//     setLoading(false)
//   }
  
//   const handleSessionComplete = (data) => {
//     if (intervalRef.current) {
//     clearInterval(intervalRef.current)
//     intervalRef.current = null
//   }
//   if (energyIntervalRef.current) {
//     clearInterval(energyIntervalRef.current)
//     energyIntervalRef.current = null
//   }
    
//     // if (useWebSocket) wsService.disconnect()

//     const currentChargingData = chargingDataRef.current

//     setChargingData(prev => ({
//       ...prev,
//       status: data.status || 'COMPLETED'
//     }))

//     setSessionCompleted(true)
//     setStopping(false)

//     console.log('Session completion - incoming data:', data)
//     console.log('Session completion - current charging data:', currentChargingData)

//     const durationMinutes = Math.ceil(currentChargingData.timeElapsed / 60)
    
//     const energyUsed = data.energyUsed ?? currentChargingData.energyUsed ?? 0
//     const finalCost = data.finalCost ?? (energyUsed * (selectedPlan?.rate || 0))
    
//     const amountDebited = session?.amountDebited ?? selectedPlan?.walletDeduction ?? 0

//     const completionData = {
//       sessionId: session?.sessionId || data.sessionId,
//       status: data.status || 'COMPLETED',
//       reason: data.reason || 'Session ended',
//       energyUsed: energyUsed,
//       duration: durationMinutes,
//       timeElapsedSeconds: currentChargingData.timeElapsed,
//       finalCost: finalCost,
//       amountDebited: amountDebited,
//       plan: selectedPlan,
//       extraDebited: data.extraDebited,
//       refundIssued: data.refundIssued || false,
//       message: data.message || ''
//     }

//     console.log('Saving completion data:', completionData)
    
//     sessionStorage.setItem('sessionCompletion', JSON.stringify({completionData}))

//     CacheService.clearSessionData()
//     SessionService.clearSession()
    
//     setTimeout(() => {
//       navigate('/invoice')
//     }, 2000)
//   }
  
//   if (loading && !session) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <CircularProgress />
//         <Typography sx={{ ml: 2 }}>Loading session...</Typography>
//       </Box>
//     )
//   }

//   const isSessionActive = chargingData.status?.toUpperCase() === 'ACTIVE'
  
//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
//           <BatteryChargingFull 
//             sx={{ 
//               fontSize: 50, 
//               mr: 2, 
//               color: sessionCompleted ? 'text.secondary' : 'success.main',
//               animation: sessionCompleted ? 'none' : 'pulse 1.5s infinite'
//             }} 
//           />
//           <Typography variant="h4">
//             {sessionCompleted ? 'Charging Complete' : 'Charging in Progress'}
//           </Typography>
//         </Box>
        
//         {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
//         {sessionCompleted && (
//           <Alert severity="success" sx={{ mb: 3 }}>
//             Session completed! Redirecting to invoice...
//           </Alert>
//         )}
        
//         {/* Plan Info */}
//         {selectedPlan && (
//           <Box mb={3} p={2} bgcolor="grey.100" borderRadius={2}>
//             <Typography variant="subtitle1" fontWeight="bold">
//               {selectedPlan.planName}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Duration: {selectedPlan.durationMin} minutes | Rate: ₹{selectedPlan.rate}/kWh
//             </Typography>
//           </Box>
//         )}
        
//         {/* Progress Bar */}
//         <Box mb={4}>
//           <Box display="flex" justifyContent="space-between" mb={1}>
//             <Typography variant="body2">Progress</Typography>
//             <Typography variant="body2">{Math.round(chargingData.percentage)}%</Typography>
//           </Box>
//           <LinearProgress 
//             variant="determinate" 
//             value={chargingData.percentage}
//             sx={{ height: 20, borderRadius: 10 }}
//             color={sessionCompleted ? 'inherit' : 'primary'}
//           />
//         </Box>
        
//         {/* Stats Cards */}
//         <Grid container spacing={3} mb={4}>
//           <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//             <Card>
//               <CardContent>
//                 <Box display="flex" alignItems="center">
//                   <Timer sx={{ mr: 1, color: 'primary.main' }} />
//                   <Box>
//                     <Typography variant="caption" color="text.secondary">
//                       Time Elapsed
//                     </Typography>
//                     <Typography variant="h6">
//                       {formatTime(chargingData.timeElapsed)}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
          
//           <Grid item xs={12} sm={6} md={3}>
//             <Card>
//               <CardContent>
//                 <Box display="flex" alignItems="center">
//                   <Timer sx={{ mr: 1, color: 'info.main' }} />
//                   <Box>
//                     <Typography variant="caption" color="text.secondary">
//                       Time Remaining
//                     </Typography>
//                     <Typography variant="h6">
//                       {getRemainingTime()}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
          
//           <Grid item xs={12} sm={6} md={3}>
//             <Card>
//               <CardContent>
//                 <Box display="flex" alignItems="center">
//                   <Bolt sx={{ mr: 1, color: 'warning.main' }} />
//                   <Box>
//                     <Typography variant="caption" color="text.secondary">
//                       Energy Used
//                     </Typography>
//                     <Typography variant="h6">
//                       {chargingData.energyUsed.toFixed(2)} kWh
//                     </Typography>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
          
//           <Grid item xs={12} sm={6} md={3}>
//             <Card>
//               <CardContent>
//                 <Typography variant="caption" color="text.secondary">
//                   Status
//                 </Typography>
//                 <Typography 
//                   variant="h6" 
//                   color={
//                     chargingData.status === 'ACTIVE' ? 'success.main' : 
//                     chargingData.status === 'COMPLETED' ? 'info.main' : 
//                     'text.secondary'
//                   }
//                 >
//                   {chargingData.status}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
        
//         {/* Estimated Cost */}
//         {selectedPlan && (
//           <Box mb={4} textAlign="center">
//             <Typography variant="body2" color="text.secondary">
//               Estimated Cost
//             </Typography>
//             <Typography variant="h4" color="primary">
//               ₹{(chargingData.energyUsed * (selectedPlan.rate || 0)).toFixed(2)}
//             </Typography>
//           </Box>
//         )}
        
//         {/* Stop Button */}
//         <Box display="flex" justifyContent="center">
//           <Button
//             variant="contained"
//             color="error"
//             size="large"
//             startIcon={stopping ? <CircularProgress size={20} color="inherit" /> : <Stop />}
//             onClick={() => setStopDialog(true)}
//             disabled={stopping || sessionCompleted || chargingData.status !== 'ACTIVE'}
//           >
//             {stopping ? 'Stopping...' : 'Stop Charging'}
//           </Button>
//         </Box>
//       </Paper>
      
//       {/* Stop Confirmation Dialog */}
//       <Dialog open={stopDialog} onClose={() => !stopping && setStopDialog(false)}>
//         <DialogTitle>Stop Charging?</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to stop charging?
//           </Typography>
//           <Box mt={2}>
//             <Typography variant="body2">
//               <strong>Time elapsed:</strong> {formatTime(chargingData.timeElapsed)}
//             </Typography>
//             <Typography variant="body2">
//               <strong>Energy used:</strong> {chargingData.energyUsed.toFixed(2)} kWh
//             </Typography>
//             {selectedPlan && (
//               <Typography variant="body2">
//                 <strong>Estimated cost:</strong> ₹{(chargingData.energyUsed * selectedPlan.rate).toFixed(2)}
//               </Typography>
//             )}
//           </Box>
//           <Alert severity="info" sx={{ mt: 2 }}>
//             Any unused amount from your prepaid plan will be refunded to your wallet.
//           </Alert>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setStopDialog(false)} disabled={stopping}>
//             Continue Charging
//           </Button>
//           <Button 
//             onClick={handleStopSession} 
//             color="error" 
//             variant="contained"
//             disabled={stopping}
//           >
//             {stopping ? 'Stopping...' : 'Stop Charging'}
//           </Button>
//         </DialogActions>
//       </Dialog>
      
//       {/* CSS for pulse animation */}
//       <style>{`
//         @keyframes pulse {
//           0% { opacity: 1; }
//           50% { opacity: 0.5; }
//           100% { opacity: 1; }
//         }
//       `}</style>
//     </Container>
//   )
// }

// export default ChargingSession





/////







import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Paper,
  CircularProgress,
  Button,
  Switch,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material"
import {
  BatteryChargingFull,
  Bolt,
  NotificationsNone,
  ReportProblemRounded,
  LocalCafeRounded
} from "@mui/icons-material"    

import SessionService from "../services/session.service"
import CacheService from "../services/cache.service"
import energyIcon from "../assets/images/energy.svg";
import batteryIcon from "../assets/images/battery.svg";
import notifyIcon from "../assets/images/notify.svg"

const ChargingSession = () => {
  const navigate = useNavigate()

  const intervalRef = useRef(null)
  const energyIntervalRef = useRef(null)

  const [selectedPlan, setSelectedPlan] = useState(null)
  const [session, setSession] = useState(null)
  const [chargingData, setChargingData] = useState({
    energyUsed: 0,
    timeElapsed: 0,
    percentage: 0,
    status: "ACTIVE"
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stopDialog, setStopDialog] = useState(false)
  const [stopping, setStopping] = useState(false)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [notifyOnComplete, setNotifyOnComplete] = useState(true)
const getBatteryHealth = () => {
  const p = chargingData.percentage

  if (p >= 80) return "Excellent"
  if (p >= 55) return "Good"
  if (p >= 30) return "Average"
  return "Low"
}

  useEffect(() => {
    initializeSession()
    return () => {
      clearInterval(intervalRef.current)
      clearInterval(energyIntervalRef.current)
    }
  }, [])

  const initializeSession = async () => {
    try {
      const activeSession =
        CacheService.getSessionData() || (await SessionService.getActiveSession?.())
      const plan = CacheService.getPlanData?.()

      if (!activeSession || !(activeSession.sessionId || activeSession.id)) {
        navigate("/config-charging")
        return
      }

      setSession(activeSession)
      setSelectedPlan(plan)

      if (plan?.durationMin) startTimer(plan.durationMin)
      startEnergyMonitoring(activeSession.sessionId || activeSession.id)
      setLoading(false)
    } catch {
      setError("Failed to load charging session")
      setLoading(false)
    }
  }

  const startTimer = (durationMinutes) => {
    const totalSeconds = durationMinutes * 60
    intervalRef.current = setInterval(() => {
      setChargingData((prev) => {
        const newElapsed = prev.timeElapsed + 1
        const percentage = (newElapsed / totalSeconds) * 100

        if (newElapsed >= totalSeconds) {
          clearInterval(intervalRef.current)
          handleSessionComplete({ status: "COMPLETED" })
        }

        return { ...prev, timeElapsed: newElapsed, percentage: Math.min(100, percentage) }
      })
    }, 1000)
  }

  const startEnergyMonitoring = async (sessionId) => {
    const checkEnergy = async () => {
      try {
        const status = await SessionService.getSessionStatus(sessionId)
        const kwh = await SessionService.getKwhUsed(sessionId)
        setChargingData((prev) => ({
          ...prev,
          energyUsed: kwh || 0,
          status: (status || "ACTIVE").toUpperCase()
        }))
        if ((status || "").toUpperCase() === "COMPLETED") handleSessionComplete({ status: "COMPLETED" })
      } catch (err) {
        console.error("Energy error:", err)
      }
    }
    checkEnergy()
    energyIntervalRef.current = setInterval(checkEnergy, 10000)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getRemainingTime = () => {
    if (!selectedPlan?.durationMin) return "--:--"
    const total = selectedPlan.durationMin * 60
    return formatTime(Math.max(0, total - chargingData.timeElapsed))
  }

  const handleStopSession = async () => {
    if (stopping) return
    setStopDialog(false)
    setStopping(true)
    setError("")
    try {
      const sessionId = session?.sessionId || session?.id
      console.log("Stopping session:", sessionId)
      await SessionService.stopSession(sessionId)
      handleSessionComplete({ status: "STOPPED" })
    } catch (err) {
      console.error(err)
      setError("Failed to stop charging session")
    }
    setStopping(false)
  }

  const handleSessionComplete = (data) => {
    clearInterval(intervalRef.current)
    clearInterval(energyIntervalRef.current)
    setChargingData((prev) => ({ ...prev, status: data.status }))
    setSessionCompleted(true)
    setTimeout(() => navigate("/invoice"), 1500)
  }

  if (loading) return (
    <div className="loading"><CircularProgress /><p>Loading session...</p></div>
  )

  const isSessionActive = (chargingData.status || "").toUpperCase() === "ACTIVE"

  return (
    <Container maxWidth="sm">
      <Paper className="main-card">

        {/* HEADER */}
        <div className="header">
          <img
            src="https://github.com/bentork5151/assets/blob/main/Logo/logo_transparent.png?raw=true"
            alt="BENTORK Logo"
            className="logo"
          />
         
        </div>

        {/* CIRCLE */}
        <div className="circle-container">
          <CircularProgress variant="determinate" value={100} size={260} thickness={4} className="circle-bg" />
          <CircularProgress variant="determinate" value={chargingData.percentage} size={260} thickness={8} className="circle-progress" />
          <div className="circle-text">
            <Bolt className="bolt-icon" />
            <h1>{Math.round(chargingData.percentage)}%</h1>
            <p>Charged</p>
          </div>
        </div>

        {error && <Alert severity="error">{error}</Alert>}
        {sessionCompleted && <Alert severity="success">Completed! Redirecting...</Alert>}

        {/* RATE & TIME */}
        <div className="rate-time">
          <div><h2>{selectedPlan?.rate || 20} kW/h</h2><p>Charging Rate</p></div>
          <div className="right"><h2>{getRemainingTime()}</h2><p>Time Left</p></div>
        </div>

        {/* ENERGY & HEALTH */}
        {/* <div className="stats">
          <div className="stat-box"><Bolt /><div><h3>{chargingData.energyUsed.toFixed(1)} kWh</h3><p>Energy Delivered</p></div></div>
          <div className="stat-box"><BatteryChargingFull /><div><h3>Good</h3><p>Battery Health</p></div></div>
        </div> */}
<div className="stats">
  
  <div className="stat-box">
    <img
      src={energyIcon}
      alt="Energy"
      style={{ width: "32px", height: "32px" }}
    />
    <div>
      <h3>{chargingData.energyUsed.toFixed(1)} kWh</h3>
      <p>Energy Delivered</p>
    </div>
  </div>

  <div className="stat-box">
    <img
      src={batteryIcon}
      alt="Battery"
      style={{ width: "32px", height: "32px" }}
    />
    <div>
      <h3>{getBatteryHealth()}</h3>
      <p>Battery Health</p>
    </div>
  </div>

</div>

        {/* NOTIFY */}
        <div className="notify">
          {/* <div className="notify-left"><NotificationsNone /><span>Notify when complete</span></div> */}
          <div className="notify-left"> <img src={notifyIcon} alt="Notify" className="notify-icon" /> <span>Notify when complete</span></div>
          <Switch checked={notifyOnComplete} onChange={() => setNotifyOnComplete(!notifyOnComplete)} />
        </div>

        {/* ACTIONS */}
        <div className="actions">
          <Button fullWidth startIcon={<LocalCafeRounded />} className="btn cafe">Nearby Cafe</Button>
          <Button fullWidth startIcon={<ReportProblemRounded />} className="btn report">Report</Button>
        </div>

        {/* STOP BUTTON */}
        <Button
          fullWidth
          variant="contained"
          color="error"
          className="stop-btn"
          onClick={() => setStopDialog(true)}
          disabled={stopping || sessionCompleted || !isSessionActive}
        >
          {stopping ? "Stopping..." : "Stop Charging"}
        </Button>

        <p className="station-id">Station ID: {session?.stationId || session?.sessionId || session?.id}</p>

        {/* <Dialog open={stopDialog} onClose={() => setStopDialog(false)}>
          <DialogTitle>Warning!</DialogTitle>
          <DialogContent>
            <p>Are you sure want to Stop the Charging?</p>
            <p>Time elapsed: {formatTime(chargingData.timeElapsed)}</p>
            <p>Energy used: {chargingData.energyUsed.toFixed(2)} kWh</p>
          </DialogContent>
          <DialogActions className="DialogActions_button">
            <Button onClick={() => setStopDialog(false)}color="error">Cancel</Button>
            <Button onClick={handleStopSession} color="error" variant="contained">Stop</Button>
          </DialogActions>
        </Dialog> */}

        <Dialog open={stopDialog} onClose={() => setStopDialog(false)}>
  <DialogTitle style={{ fontWeight: "700", fontSize: "22px" }}>
    Warning!
  </DialogTitle>

  <DialogContent>
    Are you sure want to Stop the Charging?
   <p>Time elapsed: {formatTime(chargingData.timeElapsed)}</p>
            <p>Energy used: {chargingData.energyUsed.toFixed(2)} kWh</p>
  </DialogContent>

  <DialogActions className="dialog-actions-custom">
    <button className="back-btn" onClick={() => setStopDialog(false)}>Back</button>
    <button className="stop-btn-dark" onClick={handleStopSession}>Stop</button>
  </DialogActions>
</Dialog>


        {/* INTERNAL CSS */}
        <style>{`
          .main-card { padding: 20px; border-radius: 20px; width: 100%; box-sizing: border-box; }
          .header { text-align: center; }
          .logo { width: 40%; max-width: 160px; display: block; margin: 0 auto 8px; }
          .circle-container { position: relative; width: 80%; max-width: 260px; height: auto; margin: 30px auto; }
          .circle-bg { color: #C0EFB0 !important; }
          .circle-progress { position: absolute; left: 0; top: 0; color: #6DB85B !important; }
          .circle-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; }
          .bolt-icon { color: #6DB85B; font-size: 32px; }
          .rate-time { display: flex; justify-content: space-between; flex-wrap: wrap; }
          .right { text-align: right; } 
          .stats { display: flex; justify-content: space-between; margin: 20px 0; flex-wrap: wrap; gap: 200px; }
       
          .stat-box { display: flex; align-items: center; gap: 12px;}
.stat-icon {
  width: 32px;
  height: 32px;
}
.notify-icon {
  width: 24px;
  height: 24px;
}

          .notify { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
          .notify-left { display: flex; align-items: center; gap: 5px; }
          .actions { display: flex; gap: 10px; margin: 15px 0; flex-wrap: wrap; }
          .btn { border-radius: 12px !important; font-weight: bold !important; flex: 1; min-width: 140px; }
          .cafe { background: #ffe0c2 !important; color: #a84310 !important; }
          .report { background: #d9f3df !important; color: #2e7d32 !important; }
          .stop-btn { border-radius: 16px !important; margin-top: 15px !important; }
          .station-id { text-align: center; margin-top: 20px; color: gray; font-size: 14px; }
          .loading { display: flex; justify-content: center; align-items: center; gap: 10px; height: 70vh; flex-direction: column; }
          .DialogActions_button{ gap: 100px; justify-content: space-between ; display: flex;}


          .dialog-actions-custom {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px !important;
}

.back-btn {
  min-width: 120px;
  padding: 12px 26px;
  border-radius: 25px;
  border: 2px solid #000;
  background: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.stop-btn-dark {
  min-width: 120px;
  padding: 12px 26px;
  border-radius: 25px;
  border: none;
  background: #1c1c1c;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.stop-btn-dark:hover {
  background: #000;
}

.back-btn:hover {
  background: #f5f5f5;
}

        `}</style>
      </Paper>
    </Container>
  )
}

export default ChargingSession
