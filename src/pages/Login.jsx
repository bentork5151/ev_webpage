import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Button
} from '@mui/material'
import { Google as GoogleIcon } from '@mui/icons-material'
import { useAuth } from '../store/AuthContext'
import ApiService from '../services/api.service'
import API_CONFIG from '../config/api.config'
import CacheService from '../services/cache.service' // ✅ ADD THIS IMPORT
import { parseJwtToken } from '../utils/jwtHelper'

const Login = () => {
  const navigate = useNavigate()
  const { ocppId } = useParams()
  const { updateChargerData } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  useEffect(() => {
    checkOAuthCallback();

    if (ocppId) {
      loadChargerData()
    }
  }, [ocppId])

  const checkOAuthCallback = async () => {
    const urlParam = new URLSearchParams(window.location.search)
    const token = urlParam.get("token")
    const error = urlParam.get("error")

    if(token){
      handleOAuthSuccess(token)
    } else if (error){
      setError('Google login failed '+error)
    }
  }

  const handleOAuthSuccess = async (token) => {
    try {
      const tokenData = parseJwtToken(token)
      const user = {
        email: tokenData?.sub || '',
        name: tokenData?.name || tokenData?.sub || '',
        loginMethod: 'google'
      }
      
      CacheService.saveUserCredentials(user, token)

      console.log(user)
      console.log(token)

      window.history.replaceState({}, document.title, window.location.pathname)
      
      navigate('/config-charging')
    } catch (error) {
      console.error('OAuth callback error:', error)
      setError('Failed to process login')
    }
  }
  
  const loadChargerData = async () => {
    try {
      const chargerResponse = await ApiService.get(
        API_CONFIG.ENDPOINTS.GET_CHARGER(ocppId)
      )
      updateChargerData(chargerResponse)
    } catch (error) {
      console.error('Failed to load charger data:', error)
    }
  }

  const handleGoogleSuccess = async () => {
    setLoading(true)
    
    if (ocppId) {
      sessionStorage.setItem('ocppid', ocppId)
    }

    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
          
          <Typography component="h1" variant="h4" gutterBottom>
            Welcome
          </Typography>
          
          <Typography variant="body1" color="text.secondary" gutterBottom>
            One tap to login
          </Typography>
          
          {ocppId && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Charger ID: {ocppId}
              </Typography>
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {/* Google Sign-In Button */}
          <Box sx={{ mt: 4, mb: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" py={2}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Redirecting to Google...</Typography>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSuccess}
                sx={{
                  backgroundColor: '#4285F4',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '16px',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#357ae8'
                  }
                }}
              >
                Sign in with Google
              </Button>
            )}
          </Box>
          
          {/* Footer Text */}
          <Typography variant="caption" color="text.secondary" display="block" mt={3}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login