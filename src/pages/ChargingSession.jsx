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
  DialogActions,
  Chip
} from '@mui/material'
import {
  BatteryChargingFull,
  Timer,
  Bolt,
  Stop,
  CheckCircle
} from '@mui/icons-material'
import SessionService from '../services/session.service'
import PaymentService from '../services/payment.service'
import wsService from '../services/websocket.service'
import APP_CONFIG from '../config/app.config'

const ChargingSession = () => {
  const navigate = useNavigate()
  const intervalRef = useRef(null)
  const kwhIntervalRef = useRef(null)
  
  const [session, setSession] = useState(null)
  const [chargingStatus, setChargingStatus] = useState({
    percentage: 0,
    kwhUsed: 0,
    timeRemaining: 0,
    status: 'ACTIVE'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stopDialog, setStopDialog] = useState(false)
  const [refundInfo, setRefundInfo] = useState(null)
  const [useWebSocket, setUseWebSocket] = useState(true)
  
  useEffect(() => {
    initializeSession()
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (kwhIntervalRef.current) clearInterval(kwhIntervalRef.current)
      if (useWebSocket) wsService.disconnect()
    }
  }, [])
  
  const initializeSession = async () => {
    try {
      const activeSession = SessionService.getActiveSession()
      if (!activeSession) {
        navigate('/config-charging')
        return
      }
      
      setSession(activeSession)
      
      const paymentData = JSON.parse(sessionStorage.getItem('paymentData') || '{}')
      const totalDuration = paymentData.plan?.durationMin || 60
      
      setChargingStatus({
        percentage: 0,
        kwhUsed: 0,
        timeRemaining: totalDuration * 60,
        totalDuration: totalDuration * 60,
        status: 'ACTIVE'
      })
      
      if (useWebSocket) {
        setupWebSocketListeners()
      } else {
        setupPolling(activeSession.id)
      }
      
      startTimer()
      
      setLoading(false)
    } catch (error) {
      console.error('Failed to initialize session:', error)
      setError('Failed to load charging session')
      setLoading(false)
    }
  }
  
  const setupWebSocketListeners = () => {
    wsService.on('charging:update', (data) => {
      setChargingStatus(prev => ({
        ...prev,
        percentage: data.percentage || prev.percentage,
        status: data.status || prev.status
      }))
    })
    
    wsService.on('kwh:update', (data) => {
      setChargingStatus(prev => ({
        ...prev,
        kwhUsed: data.kwhUsed || prev.kwhUsed
      }))
    })
    
    wsService.on('session:status', (data) => {
      if (data.status === 'COMPLETED' || data.status === 'STOPPED') {
        handleSessionComplete(data)
      }
    })
    
    wsService.on('connection:status', (data) => {
      if (!data.connected) {
        console.log('WebSocket disconnected, falling back to polling')
        setUseWebSocket(false)
        setupPolling(session?.id)
      }
    })
  }
  
  const setupPolling = (sessionId) => {
    // Poll for kWh updates every 5 minutes
    kwhIntervalRef.current = setInterval(async () => {
      try {
        const kwhUsed = await SessionService.getKwhUsed(sessionId)
        setChargingStatus(prev => ({
          ...prev,
          kwhUsed: kwhUsed
        }))
      } catch (error) {
        console.error('Failed to fetch kWh:', error)
      }
    }, APP_CONFIG.SESSION.KWH_UPDATE_INTERVAL)
    
    // Poll for status updates every 5 seconds
    intervalRef.current = setInterval(async () => {
      try {
        const status = await SessionService.getSessionStatus(sessionId)
        if (status.status === 'COMPLETED' || status.status === 'STOPPED') {
          handleSessionComplete(status)
        }
      } catch (error) {
        console.error('Failed to fetch status:', error)
      }
    }, APP_CONFIG.SESSION.UPDATE_INTERVAL)
  }
  
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setChargingStatus(prev => {
        const newTimeRemaining = Math.max(0, prev.timeRemaining - 1)
        const percentage = ((prev.totalDuration - newTimeRemaining) / prev.totalDuration) * 100
        
        if (newTimeRemaining === 0) {
          handleSessionComplete({ status: 'COMPLETED' })
        }
        
        return {
          ...prev,
          timeRemaining: newTimeRemaining,
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
  
  const handleStopCharging = async () => {
    setStopDialog(false)
    setLoading(true)
    
    try {
      const result = await SessionService.stopSession(session.id)
      
      if (result.success) {
        const paymentData = JSON.parse(sessionStorage.getItem('paymentData') || '{}')
        const actualUsage = {
          kwhUsed: chargingStatus.kwhUsed,
          minutesUsed: Math.ceil((chargingStatus.totalDuration - chargingStatus.timeRemaining) / 60)
        }
        
        const refund = SessionService.calculateRefund(paymentData.plan, actualUsage)
        
        if (parseFloat(refund.refundAmount) > 0) {
          const refundResult = await PaymentService.processRefund(
            session.id,
            refund.refundAmount,
            'Early termination of charging session'
          )
          
          if (refundResult.success) {
            setRefundInfo(refund)
          }
        }
        
        handleSessionComplete({ status: 'STOPPED', refund })
      }
    } catch (error) {
      console.error('Failed to stop session:', error)
      setError('Failed to stop charging session')
    }
    
    setLoading(false)
  }
  
  const handleSessionComplete = (data) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (kwhIntervalRef.current) clearInterval(kwhIntervalRef.current)
    
    if (useWebSocket) wsService.disconnect()
    
    sessionStorage.setItem('sessionCompletion', JSON.stringify({
      ...data,
      kwhUsed: chargingStatus.kwhUsed,
      duration: Math.ceil((chargingStatus.totalDuration - chargingStatus.timeRemaining) / 60)
    }))
    
    setTimeout(() => {
      navigate('/payment-status')
    }, 2000)
  }
  
  if (loading && !session) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
          <BatteryChargingFull sx={{ fontSize: 50, mr: 2, color: 'success.main' }} />
          <Typography variant="h4">Charging in Progress</Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Charging Progress */}
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Charging Progress</Typography>
            <Typography variant="body2">{Math.round(chargingStatus.percentage)}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={chargingStatus.percentage}
            sx={{ height: 20, borderRadius: 10 }}
          />
        </Box>
        
        {/* Status Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Timer sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Time Remaining
                    </Typography>
                    <Typography variant="h6">
                      {formatTime(chargingStatus.timeRemaining)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Bolt sx={{ mr: 1, color: 'warning.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Energy Consumed
                    </Typography>
                    <Typography variant="h6">
                      {chargingStatus.kwhUsed.toFixed(2)} kWh
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="h6">
                      <Chip 
                        label={chargingStatus.status} 
                        color="success" 
                        size="small"
                      />
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="error"
            size="large"
            startIcon={<Stop />}
            onClick={() => setStopDialog(true)}
            disabled={loading || chargingStatus.status !== 'ACTIVE'}
          >
            Stop Charging
          </Button>
        </Box>
        
        {/* Connection Status */}
        <Box mt={3} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Connection: {useWebSocket ? 'Real-time (WebSocket)' : 'Polling'}
          </Typography>
        </Box>
      </Paper>
      
      {/* Stop Confirmation Dialog */}
      <Dialog open={stopDialog} onClose={() => setStopDialog(false)}>
        <DialogTitle>Stop Charging?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to stop charging? 
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            You have used {chargingStatus.kwhUsed.toFixed(2)} kWh so far.
            Any unused amount will be refunded based on actual usage.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStopDialog(false)}>Continue Charging</Button>
          <Button 
            onClick={handleStopCharging} 
            color="error" 
            variant="contained"
          >
            Stop Charging
          </Button>
        </DialogActions>
      </Dialog>
      
      {refundInfo && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Refund of ₹{refundInfo.refundAmount} will be processed within 5-7 business days.
        </Alert>
      )}
    </Container>
  )
}

export default ChargingSession