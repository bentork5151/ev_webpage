import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  ArrowBack
} from '@mui/icons-material'
import PaymentService from '../services/payment.service'
import SessionService from '../services/session.service'
import { useAuth } from '../store/AuthContext'
import APP_CONFIG from '../config/app.config'

const Receipt = () => {
  const navigate = useNavigate()
  const { user, chargerData } = useAuth()
  
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderData, setOrderData] = useState(null)
  
  useEffect(() => {
    const plan = JSON.parse(sessionStorage.getItem('selectedPlan') || '{}')
    if (!plan.id) {
      navigate('/config-charging')
      return
    }
    
    setSelectedPlan(plan)
    const details = PaymentService.calculatePaymentDetails(plan.walletDeduction)
    setPaymentDetails(details)
  }, [navigate])
  
  const handlePayment = async () => {
    if (!selectedPlan || !chargerData || !user) {
      setError('Missing required information')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const order = await PaymentService.createPaymentOrder(
        selectedPlan,
        chargerData,
        user.email
      )
      
      if (!order.success) {
        setError(order.error || 'Failed to create payment order')
        setLoading(false)
        return
      }
      
      setOrderData(order)
      
      PaymentService.processPayment(
        order,
        user,
        handlePaymentSuccess,
        handlePaymentFailure
      )
    } catch (error) {
      console.error('Payment error:', error)
      setError('Failed to process payment')
      setLoading(false)
    }
  }
  
  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      const sessionResult = await SessionService.startSession(
        chargerData.id,
        selectedPlan.id,
        paymentResponse.paymentId
      )
      
      if (sessionResult.success) {
        sessionStorage.setItem('paymentData', JSON.stringify({
          ...paymentResponse,
          plan: selectedPlan,
          charger: chargerData
        }))
        
        navigate('/charging-session')
      } else {
        setError('Payment successful but failed to start charging session')
      }
    } catch (error) {
      console.error('Session start error:', error)
      setError('Payment successful but failed to start charging session')
    }
    
    setLoading(false)
  }
  
  const handlePaymentFailure = (error) => {
    setError(error || 'Payment failed')
    setLoading(false)
  }
  
  const formatDate = () => {
    return new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/config-charging')}
        sx={{ mb: 2 }}
      >
        Back to Plans
      </Button>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <ReceiptIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4">Payment Receipt</Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        

        
        
        <Divider sx={{ my: 3 }} />
        

        <TableContainer>
          <Table size="small">
            <TableBody>
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
                <TableCell colSpan={2}>
                  <Divider />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Total Amount</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">₹{paymentDetails.total}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box mt={3}>
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
            Generated on: {formatDate()}
          </Typography>
        </Box>
        
        <Box mt={4}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ₹${paymentDetails.total}`}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default Receipt