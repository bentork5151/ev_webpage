import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Divider
} from '@mui/material'
import {
  CheckCircle,
  Logout
} from '@mui/icons-material'
import { useAuth } from '../store/AuthContext'
import CacheService from '../services/cache.service'

const Invoice = () => {
  const navigate = useNavigate()
  const { user, chargerData, logout } = useAuth()
  const [sessionData, setSessionData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const completion  = JSON.parse(sessionStorage.getItem('sessionCompletion') || '{}')
    if (completion) {
      try {
        const parsed = completion
        console.log('Parsed session completion data:', parsed)
        
        const completionData = parsed.completionData || parsed
        setSessionData(completionData)
        
        sessionStorage.removeItem('sessionCompletion')
        CacheService.clearPlanData()
        CacheService.clearSessionData()
      } catch (error) {
        console.error('Error parsing session data:', error)
        setSessionData(null)
      }
    } else {
      console.warn('No session completion data found')
      setSessionData(null)
    }
    
    setLoading(false)
  }, [])
  
  const handleOk = () => {
    navigate('/thank-you')
  }
  
  // const handleLogout = () => {
  //   logout()
  // }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }
  
  if (!sessionData) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            No session data found. The session may have already been processed.
          </Alert>
          <Box display="flex" justifyContent="center">
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    )
  }

  const planName = sessionData.plan?.planName || 'N/A'
  const energyUsed = sessionData.energyUsed ?? 0
  const duration = sessionData.duration ?? 0
  const rate = sessionData.plan?.rate ?? 0
  const finalCost = sessionData.finalCost ?? sessionData.amountDebited ?? (energyUsed * rate)
  const refundIssued = sessionData.refundIssued || false
  const extraDebited = sessionData.extraDebited || false
  
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          <CheckCircle sx={{ fontSize: 60, color: 'success.main', mr: 2 }} />
          <Typography variant="h4">Charging Complete</Typography>
        </Box>

        {/* Status Messages */}
        {refundIssued && (
          <Alert severity="info" sx={{ mb: 2 }}>
            A refund has been issued for unused energy.
          </Alert>
        )}
        {extraDebited && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Extra amount was debited due to higher usage.
          </Alert>
        )}
        
        <Typography variant="h6" gutterBottom>Invoice Details</Typography>
        
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell align="right">{user?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align="right">{user?.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}><Divider /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Charger Name</TableCell>
              <TableCell align="right">{chargerData?.stationId || chargerData?.name || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>OCPP ID</TableCell>
              <TableCell align="right">{chargerData?.ocppId || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Charger Type</TableCell>
              <TableCell align="right">{chargerData?.chargerType || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}><Divider /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Plan</TableCell>
              <TableCell align="right">{planName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Energy Used</TableCell>
              <TableCell align="right">{energyUsed?.toFixed(2)} kWh</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Time Taken</TableCell>
              <TableCell align="right">{duration} minutes</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rate</TableCell>
              <TableCell align="right">₹{rate}/kWh</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}><Divider /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography variant="h6">Total Amount</Typography></TableCell>
              <TableCell align="right">
                <Typography variant="h6">₹{Number(finalCost).toFixed(2)}</Typography>
              </TableCell>
            </TableRow>

            {sessionData.message && (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {sessionData.message}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
        
        <Box display="flex" gap={2} justifyContent="center" mt={4}>
          <Button variant="contained" onClick={handleOk}>OK</Button>
        </Box>
        
        <Box position="fixed" bottom={24} left={0} right={0} textAlign="center">
          <Button startIcon={<Logout />} color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default Invoice 