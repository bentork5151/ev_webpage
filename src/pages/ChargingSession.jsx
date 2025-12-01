import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Grid,
  LinearProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  BatteryChargingFull,
  Timer,
  Bolt,
  Stop,
} from '@mui/icons-material'
import SessionService from '../services/session.service'
// import ApiService from '../services/api.service'
import APP_CONFIG from '../config/app.config'
// import wsService from '../services/websocket.service'
import CacheService from '../services/cache.service'

const ChargingSession = () => {
  const navigate = useNavigate()
  const intervalRef = useRef(null)
  const energyIntervalRef  = useRef(null)
  const chargingDataRef = useRef({
    energyUsed: 0,
    timeElapsed: 0,
    percentage: 0,
    status: 'ACTIVE'
  })
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [session, setSession] = useState(null)
  const [chargingData, setChargingData] = useState({
    energyUsed: 0,
    timeElapsed: 0,
    percentage: 0,
    status: 'ACTIVE'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stopDialog, setStopDialog] = useState(false)
  const [stopping, setStopping] = useState(false)
  const [sessionCompleted, setSessionCompleted] = useState(false)

  useEffect(() => {
    chargingDataRef.current = chargingData
  }, [chargingData])
    
  useEffect(() => {
    initializeSession()
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (energyIntervalRef.current) clearInterval(energyIntervalRef.current)
      // wsService.disconnect()
    }
  }, [])
  
  const initializeSession = async () => {
    try {
      const activeSession = CacheService.getSessionData() || SessionService.getActiveSession()
      const plan = CacheService.getPlanData()

      console.log('Active session:', activeSession)
      console.log('Selected plan:', plan)
      
      if (!activeSession || !activeSession.sessionId) {
        console.error('No active session found')
        navigate('/config-charging')
        return
      }
      
      setSession(activeSession)
      setSelectedPlan(plan)
      
      // wsService.connect(activeSession.sessionId)
      // setupWebSocketListeners()
      
      if (plan?.durationMin) {
        startTimer(plan.durationMin)
      }

      if (activeSession.sessionId) {
        startEnergyMonitoring(activeSession.sessionId)
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Failed to initialize session:', error)
      setError('Failed to load charging session')
      setLoading(false)
    }
  }
  
  // const setupWebSocketListeners = () => {
  //   wsService.on('charging:update', (data) => {
  //     setchargingData(prev => ({
  //       ...prev,
  //       energyUsed: data.energyUsed || prev.energyUsed,
  //       status: data.status || prev.status
  //     }))
  //   })
    
    // wsService.on('kwh:update', (data) => {
    //   setChargingStatus(prev => ({
    //     ...prev,
    //     kwhUsed: data.kwhUsed || prev.kwhUsed
    //   }))
    // })
    
    // wsService.on('session:status', (data) => {
    //   if (data.status === 'COMPLETED' || data.status === 'STOPPED') {
    //     handleSessionComplete(data)
    //   }
    // })
    
    // wsService.on('connection:status', (data) => {
    //   if (!data.connected) {
    //     console.log('WebSocket disconnected, falling back to polling')
    //     setUseWebSocket(false)
    //     setupPolling(session?.id)
    //   }
    // })
  // }
  
  // const setupPolling = (sessionId) => {
  //   // Poll for kWh updates every 5 minutes
  //   kwhIntervalRef.current = setInterval(async () => {
  //     try {
  //       const kwhUsed = await SessionService.getKwhUsed(sessionId)
  //       setChargingStatus(prev => ({
  //         ...prev,
  //         kwhUsed: kwhUsed
  //       }))
  //     } catch (error) {
  //       console.error('Failed to fetch kWh:', error)
  //     }
  //   }, APP_CONFIG.SESSION.KWH_UPDATE_INTERVAL)
    
  //   // Poll for status updates every 5 seconds
  //   intervalRef.current = setInterval(async () => {
  //     try {
  //       const status = await SessionService.getSessionStatus(sessionId)
  //       if (status.status === 'COMPLETED' || status.status === 'STOPPED') {
  //         handleSessionComplete(status)
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch status:', error)
  //     }
  //   }, APP_CONFIG.SESSION.UPDATE_INTERVAL)
  // }
  
  const startTimer = (durationMinutes) => {
    const totalSeconds = durationMinutes * 60

    intervalRef.current = setInterval(() => {
      setChargingData(prev => {
        const newElapsed = prev.timeElapsed + 1
        const percentage = (newElapsed / totalSeconds) * 100
        
        if (newElapsed >= totalSeconds) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          setTimeout(() => {
            handleSessionComplete({ 
              status: 'COMPLETED', 
              reason: 'Time limit reached' 
            })
          }, 0)
        }

        return {
          ...prev,
          timeElapsed: newElapsed,
          percentage: Math.min(100, percentage)
        }
      })
    }, 1000)
  }
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getRemainingTime = () => {
    if (!selectedPlan?.durationMin) return '--:--'
    const totalSeconds = selectedPlan.durationMin * 60
    const remaining = Math.max(0, totalSeconds - chargingData.timeElapsed)
    return formatTime(remaining)
  }

  const startEnergyMonitoring = (sessionId) => {
    const checkEnergy = async () => {
      try {
        const status = await SessionService.getSessionStatus(sessionId)
        const kwhUsed = await SessionService.getKwhUsed(sessionId)
        // const elapsedMinutes = chargingData.timeElapsed / 60

        console.log('Session status:', status)
        console.log('Session status:', kwhUsed)
        // console.log('Session status:', elapsedMinutes)

        setChargingData(prev => ({
          ...prev,
          energyUsed: kwhUsed || 0,
          status: typeof status === 'string' ? status.toUpperCase() : status?.status?.toUpperCase() || 'ACTIVE'
          // timeRemaining: elapsedMinutes
        }))

        const statusValue = typeof status === 'string' ? status : status?.status
        if (statusValue?.toLowerCase() === 'completed') {
          handleSessionComplete({ status: 'COMPLETED', reason: 'Energy limit reached' })
        }

      } catch (error) {
        console.error('Failed to fetch kWh:', error)
      }
    }
    checkEnergy()

    // check energy and status every 10 seconds
    energyIntervalRef.current = setInterval(checkEnergy, 10000)
  }
  
  const handleStopSession = async () => {
    setStopDialog(false)
    setStopping(true)
    setError('')
    
    try {
      console.log('Stopping session:', session?.sessionId)
      
      if (!session?.sessionId) {
        setError('Session ID not found')
        setStopping(false)
        return
      }

      const result = await SessionService.stopSession(session.sessionId)

      console.log('Stop session result:', result)
      
      if (result.success) {
        handleSessionComplete({ 
          status: 'STOPPED',
          reason: 'Manual stop',
          ...result.sessionData
        })
      } else {
        setError(result.error || 'Failed to stop session')
      }
    } catch (error) {
      console.error('Failed to stop session:', error)
      setError('Failed to stop charging session')
    }
    
    setLoading(false)
  }
  
  const handleSessionComplete = (data) => {
    if (intervalRef.current) {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }
  if (energyIntervalRef.current) {
    clearInterval(energyIntervalRef.current)
    energyIntervalRef.current = null
  }
    
    // if (useWebSocket) wsService.disconnect()

    const currentChargingData = chargingDataRef.current

    setChargingData(prev => ({
      ...prev,
      status: data.status || 'COMPLETED'
    }))

    setSessionCompleted(true)
    setStopping(false)

    console.log('Session completion - incoming data:', data)
    console.log('Session completion - current charging data:', currentChargingData)

    const durationMinutes = Math.ceil(currentChargingData.timeElapsed / 60)
    
    const energyUsed = data.energyUsed ?? currentChargingData.energyUsed ?? 0
    const finalCost = data.finalCost ?? (energyUsed * (selectedPlan?.rate || 0))
    
    const amountDebited = session?.amountDebited ?? selectedPlan?.walletDeduction ?? 0

    const completionData = {
      sessionId: session?.sessionId || data.sessionId,
      status: data.status || 'COMPLETED',
      reason: data.reason || 'Session ended',
      energyUsed: energyUsed,
      duration: durationMinutes,
      timeElapsedSeconds: currentChargingData.timeElapsed,
      finalCost: finalCost,
      amountDebited: amountDebited,
      plan: selectedPlan,
      extraDebited: data.extraDebited,
      refundIssued: data.refundIssued || false,
      message: data.message || ''
    }

    console.log('Saving completion data:', completionData)
    
    sessionStorage.setItem('sessionCompletion', JSON.stringify({completionData}))

    CacheService.clearSessionData()
    SessionService.clearSession()
    
    setTimeout(() => {
      navigate('/invoice')
    }, 2000)
  }
  
  if (loading && !session) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading session...</Typography>
      </Box>
    )
  }

  const isSessionActive = chargingData.status?.toUpperCase() === 'ACTIVE'
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
          <BatteryChargingFull 
            sx={{ 
              fontSize: 50, 
              mr: 2, 
              color: sessionCompleted ? 'text.secondary' : 'success.main',
              animation: sessionCompleted ? 'none' : 'pulse 1.5s infinite'
            }} 
          />
          <Typography variant="h4">
            {sessionCompleted ? 'Charging Complete' : 'Charging in Progress'}
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        {sessionCompleted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Session completed! Redirecting to invoice...
          </Alert>
        )}
        
        {/* Plan Info */}
        {selectedPlan && (
          <Box mb={3} p={2} bgcolor="grey.100" borderRadius={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              {selectedPlan.planName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Duration: {selectedPlan.durationMin} minutes | Rate: ₹{selectedPlan.rate}/kWh
            </Typography>
          </Box>
        )}
        
        {/* Progress Bar */}
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2">{Math.round(chargingData.percentage)}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={chargingData.percentage}
            sx={{ height: 20, borderRadius: 10 }}
            color={sessionCompleted ? 'inherit' : 'primary'}
          />
        </Box>
        
        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Timer sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Time Elapsed
                    </Typography>
                    <Typography variant="h6">
                      {formatTime(chargingData.timeElapsed)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Timer sx={{ mr: 1, color: 'info.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Time Remaining
                    </Typography>
                    <Typography variant="h6">
                      {getRemainingTime()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Bolt sx={{ mr: 1, color: 'warning.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Energy Used
                    </Typography>
                    <Typography variant="h6">
                      {chargingData.energyUsed.toFixed(2)} kWh
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Typography 
                  variant="h6" 
                  color={
                    chargingData.status === 'ACTIVE' ? 'success.main' : 
                    chargingData.status === 'COMPLETED' ? 'info.main' : 
                    'text.secondary'
                  }
                >
                  {chargingData.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Estimated Cost */}
        {selectedPlan && (
          <Box mb={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Estimated Cost
            </Typography>
            <Typography variant="h4" color="primary">
              ₹{(chargingData.energyUsed * (selectedPlan.rate || 0)).toFixed(2)}
            </Typography>
          </Box>
        )}
        
        {/* Stop Button */}
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="error"
            size="large"
            startIcon={stopping ? <CircularProgress size={20} color="inherit" /> : <Stop />}
            onClick={() => setStopDialog(true)}
            disabled={stopping || sessionCompleted || chargingData.status !== 'ACTIVE'}
          >
            {stopping ? 'Stopping...' : 'Stop Charging'}
          </Button>
        </Box>
      </Paper>
      
      {/* Stop Confirmation Dialog */}
      <Dialog open={stopDialog} onClose={() => !stopping && setStopDialog(false)}>
        <DialogTitle>Stop Charging?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to stop charging?
          </Typography>
          <Box mt={2}>
            <Typography variant="body2">
              <strong>Time elapsed:</strong> {formatTime(chargingData.timeElapsed)}
            </Typography>
            <Typography variant="body2">
              <strong>Energy used:</strong> {chargingData.energyUsed.toFixed(2)} kWh
            </Typography>
            {selectedPlan && (
              <Typography variant="body2">
                <strong>Estimated cost:</strong> ₹{(chargingData.energyUsed * selectedPlan.rate).toFixed(2)}
              </Typography>
            )}
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            Any unused amount from your prepaid plan will be refunded to your wallet.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStopDialog(false)} disabled={stopping}>
            Continue Charging
          </Button>
          <Button 
            onClick={handleStopSession} 
            color="error" 
            variant="contained"
            disabled={stopping}
          >
            {stopping ? 'Stopping...' : 'Stop Charging'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Container>
  )
}

export default ChargingSession
