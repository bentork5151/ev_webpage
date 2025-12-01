import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  BoltOutlined,
  AccessTime,
  AccountBalanceWallet
} from '@mui/icons-material'
import ApiService from '../services/api.service'
import API_CONFIG from '../config/api.config'
import { useAuth } from '../store/AuthContext'
import CacheService from '../services/cache.service'

const ConfigCharging = () => {
  const navigate = useNavigate()
  const { user, chargerData } = useAuth()
  
  const [plans, setPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmDialog, setConfirmDialog] = useState(false)
  
  useEffect(() => {
    fetchPlans()
  }, [])
  
  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await ApiService.get(API_CONFIG.ENDPOINTS.GET_ALL_PLANS)
      
      const filteredPlans = chargerData?.chargerType 
        ? response.filter(plan => plan.chargerType === chargerData.chargerType)
        : response
      
      setPlans(filteredPlans)
    } catch (error) {
      console.error('Failed to fetch plans:', error)
      setError('Failed to load charging plans')
    } finally {
      setLoading(false)
    }
  }
  
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
    setError('')
  }
  
  const handleProceedToPayment = () => {
    if (!selectedPlan) {
      setError('Please select a charging plan')
      return
    }
    
    if (!chargerData) {
      setError('Charger information not available')
      return
    }
    
    setConfirmDialog(true)
  }
  
  const confirmAndProceed = () => {

    if (!selectedPlan) {
      console.error('No plan selected')
      return
    }

    CacheService.savePlanData(selectedPlan)
    setConfirmDialog(false)

    setTimeout(() => {
      navigate('/receipt')
    }, 100)
  }
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`
  }
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Select Charging Plan
      </Typography>
      
      {chargerData && (
        <Box textAlign="center" mb={3}>
          <Chip 
            label={`Charger: ${chargerData.name || chargerData.ocppId}`}
            color="primary"
          />
          <Chip 
            label={`Type: ${chargerData.chargerType}`}
            color="secondary"
            sx={{ ml: 1 }}
          />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                border: selectedPlan?.id === plan.id ? '2px solid' : '1px solid #e0e0e0',
                borderColor: selectedPlan?.id === plan.id ? 'primary.main' : '#e0e0e0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-4px)'
                }
              }}
              onClick={() => handlePlanSelect(plan)}
            >
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {plan.planName}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {plan.description}
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" alignItems="center">
                    <AccountBalanceWallet sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                      ₹{plan.walletDeduction}
                    </Typography>
                  </Box>
                  
                  {plan.energyProvided && (
                    <Box display="flex" alignItems="center">
                      <BoltOutlined sx={{ mr: 1, color: 'warning.main' }} />
                      <Typography>
                        {plan.energyProvided} kWh
                      </Typography>
                    </Box>
                  )}
                  
                  <Box display="flex" alignItems="center">
                    <AccessTime sx={{ mr: 1, color: 'info.main' }} />
                    <Typography>
                      {formatDuration(plan.durationMin)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Rate: ₹{plan.rate}/kWh
                  </Typography>
                </Box>
              </CardContent>
              
              {selectedPlan?.id === plan.id && (
                <CardActions>
                  <Chip label="Selected" color="primary" size="small" />
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          variant="contained"
          size="large"
          disabled={!selectedPlan}
          onClick={handleProceedToPayment}
          sx={{ minWidth: 200 }}
        >
          Pay ₹{selectedPlan?.walletDeduction || 0}
        </Button>
      </Box>
      
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Selection</DialogTitle>
        <DialogContent>
          <Typography>
            You have selected: <strong>{selectedPlan?.planName}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Amount: ₹{selectedPlan?.walletDeduction}
          </Typography>
          <Typography variant="body2">
            Duration: {selectedPlan && formatDuration(selectedPlan.durationMin)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={confirmAndProceed} variant="contained">
            Proceed to Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ConfigCharging