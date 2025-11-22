import React, { useEffect, useState } from 'react'
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
  Chip,
  Divider
} from '@mui/material'
import {
  CheckCircleOutline,
  Home,
  Receipt
} from '@mui/icons-material'
import { useAuth } from '../store/AuthContext'

const PaymentStatus = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [sessionData, setSessionData] = useState(null)
  
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('sessionCompletion') || '{}')
    const paymentData = JSON.parse(sessionStorage.getItem('paymentData') || '{}')
    
    setSessionData({
      ...data,
      payment: paymentData
    })
    
    sessionStorage.removeItem('selectedPlan')
    sessionStorage.removeItem('paymentData')
    sessionStorage.removeItem('activeSession')
    sessionStorage.removeItem('sessionCompletion')
  }, [])
  
  const handleNewSession = () => {
    navigate('/config-charging')
  }
  
  const handleLogout = () => {
    logout()
  }
  
  if (!sessionData) {
    return null
  }
  
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleOutline 
          sx={{ fontSize: 80, color: 'success.main', mb: 2 }} 
        />
        
        <Typography variant="h4" gutterBottom>
          Charging Complete!
        </Typography>
        
        <Chip 
          label={sessionData.status || 'COMPLETED'} 
          color="success" 
          sx={{ mb: 3 }}
        />
        
        <Divider sx={{ my: 3 }} />
        
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell align="left">Total Duration</TableCell>
              <TableCell align="right">
                {sessionData.duration} minutes
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Energy Consumed</TableCell>
              <TableCell align="right">
                {sessionData.kwhUsed?.toFixed(2) || '0.00'} kWh
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Amount Paid</TableCell>
              <TableCell align="right">
                ₹{sessionData.payment?.plan?.walletDeduction || '0.00'}
              </TableCell>
            </TableRow>
            {sessionData.refund && (
              <TableRow>
                <TableCell align="left">Refund Amount</TableCell>
                <TableCell align="right">
                  ₹{sessionData.refund.refundAmount}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {sessionData.refund && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Refund will be processed within 5-7 business days
          </Typography>
        )}
        
        <Box display="flex" gap={2} justifyContent="center" mt={4}>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={handleNewSession}
          >
            New Session
          </Button>
          <Button
            variant="outlined"
            startIcon={<Receipt />}
            onClick={() => window.print()}
          >
            Download Receipt
          </Button>
          <Button
            variant="text"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default PaymentStatus
