import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material'
import {
  Receipt as ReceiptIcon,
  PlayArrow,
  ArrowBack
} from '@mui/icons-material'
import SessionService from '../services/session.service'
import { useAuth } from '../store/AuthContext'
import APP_CONFIG from '../config/app.config'
import CacheService from '../services/cache.service'

const Receipt = () => {
  const navigate = useNavigate()
  const { user, chargerData } = useAuth()
  
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  useEffect(() => {
    const plan = CacheService.getPlanData()
    
    if (!plan.id) {
      navigate('/config-charging')
      return
    }
    
    setSelectedPlan(plan)
    calculatePaymentDetails(plan)
  }, [navigate])

  const calculatePaymentDetails = (plan) => {
    const baseAmount = parseFloat(plan.walletDeduction)
    const gst = baseAmount * APP_CONFIG.TAX.GST_RATE
    const sxt = baseAmount * APP_CONFIG.TAX.SXT_RATE
    const total = baseAmount + gst + sxt
    
    setPaymentDetails({
      baseAmount: baseAmount.toFixed(2),
      gst: gst.toFixed(2),
      sxt: sxt.toFixed(2),
      total: total.toFixed(2)
    })
  }
  
  
  const handleStartSession = async () =>{
    if(!user.walletBalance || parseFloat(user.walletBalance) < parseFloat(paymentDetails.total)){
      setError('Insufficient wallet balance. Please recharge your wallet.')
      return
    }

    setLoading(true)
    setError('')

    try{
      const sessionData = {
        userId : user.id,
        chargerId : chargerData.id,
        planId: selectedPlan.id,
        message: 'Session start from web',
        selectedKwh: selectedPlan.kwh || null
      }

      const result = await SessionService.startSession(
        sessionData.chargerId,
        sessionData.planId
      )

      if(result.success){
        console.log('Session started successfully: ')
        CacheService.saveSessionData(result.session)
        CacheService.savePlanData(selectedPlan)
        navigate('/charging-session')
      } else{
        setError(result.error || 'Failed to start session')
      }
    } catch(error) {
      console.error('Session start error: ',error)
      setError('Error while starting the session')
    }

    setLoading(false)
  }

  
  if (!selectedPlan || !paymentDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }
  
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <ReceiptIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4">Charging Receipt</Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Typography variant="h6" gutterBottom>
          {selectedPlan.planName}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {selectedPlan.description}
        </Typography>
        
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>Duration</TableCell>
              <TableCell align="right">{selectedPlan.durationMin} minutes</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Charger Type</TableCell>
              <TableCell align="right">{selectedPlan.chargerType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rate</TableCell>
              <TableCell align="right">₹{selectedPlan.rate}/kWh</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}><Divider /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Base Amount</TableCell>
              <TableCell align="right">₹{paymentDetails.baseAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>GST (18%)</TableCell>
              <TableCell align="right">₹{paymentDetails.gst}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Service Tax (18%)</TableCell>
              <TableCell align="right">₹{paymentDetails.sxt}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography variant="h6">Total</Typography></TableCell>
              <TableCell align="right">
                <Typography variant="h6">₹{paymentDetails.total}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
          <Typography variant="body2" color="text.secondary">
            Wallet Balance: ₹{user?.walletBalance || '0.00'}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
            onClick={handleStartSession}
            disabled={loading}
          >
            {loading ? 'Starting...' : 'Start Charging'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default Receipt