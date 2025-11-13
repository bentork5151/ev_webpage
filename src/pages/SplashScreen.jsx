import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import AuthService from '../services/auth.service'
import ApiService from '../services/api.service'
import API_CONFIG from '../config/api.config'
import APP_CONFIG from '../config/app.config'
import { useAuth } from '../store/AuthContext'

const SplashScreen = () => {
  const navigate = useNavigate()
  const { ocppId } = useParams()
  const { updateChargerData } = useAuth()
  const [status, setStatus] = useState('Initializing...')
  
  useEffect(() => {
    initializeApp()
  }, [])
  
  const initializeApp = async () => {
    try {

      const user = await AuthService.getCurrentUser();

      if (!user) {
        navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
      }

      if (ocppId) {
        setStatus('Loading charger data...')
        const chargerResponse = await ApiService.get(
          API_CONFIG.ENDPOINTS.GET_CHARGER(ocppId)
        )
        updateChargerData(chargerResponse)
      }
      

      setStatus('Checking authentication...')
      const authResult = await AuthService.verifyCachedCredentials()
      

      await new Promise(resolve => setTimeout(resolve, APP_CONFIG.UI.SPLASH_DURATION))
      

      if (authResult.success) {
        navigate('/config-charging')
      } else {
        navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
      }
    } catch (error) {
      console.error('Initialization error:', error)

      setTimeout(() => {
        navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
      }, 1000)
    }
  }
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="primary.main"
    >
      <Typography variant="h3" color="white" gutterBottom>
        {APP_CONFIG.APP_NAME}
      </Typography>
      <CircularProgress size={60} sx={{ color: 'white', mt: 4 }} />
      <Typography variant="body1" color="white" mt={2}>
        {status}
      </Typography>
    </Box>
  )
}

export default SplashScreen