import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, LinearProgress, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import AuthService from '../services/auth.service'
import ApiService from '../services/api.service'
import API_CONFIG from '../config/api.config'
import APP_CONFIG from '../config/app.config'
import { useAuth } from '../store/AuthContext'
import ThemedImage from '../context/ThemedImage'
import { ASSETS } from '../assets/images/images.config'

import "../assets/styles/SplashScreen.css"; // ✅ Correct CSS path
import "@material/web/progress/linear-progress.js"; // ✅ Material Web progress


const SplashScreen = () => {
  const navigate = useNavigate()
  const { ocppId } = useParams()
  const { updateChargerData, transactionHistory } = useAuth()
  const [status, setStatus] = useState('Initializing...')
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    initializeApp()
  }, [])
  
  const initializeApp = async () => {
    try {

      setProgress(10)
      setStatus('Checking authentication...')

      const cacheUser = await AuthService.getCurrentUser();

      if (!cacheUser) {
        setProgress(100)
        navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
        return
      }
      console.log(cacheUser)

      setProgress(25)
      setStatus('Validating credentials...')

      const loginResult = await AuthService.login(cacheUser.email);
      console.log(loginResult.user.email)
      console.log(loginResult.user.name)

      if (!loginResult.success) {
        setProgress(100)
        navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
        return
      }
      
      setProgress(40)
      
      if (ocppId) {
        try{
          setStatus('Loading charger data...')
          const chargerResponse = await ApiService.get(
            API_CONFIG.ENDPOINTS.GET_CHARGER(ocppId)
          )
          updateChargerData(chargerResponse)
        } catch(error){
          console.error('Failed to load charger data:', error)
        }
        setProgress(60)
      }
      
      setStatus('Loading Transaction History')
      const transactions = await AuthService.loadTransaction(loginResult.user.id, 10)
      transactionHistory(transactions)

      setStatus('Checking authentication...')
      // const authResult = await AuthService.verifyCachedCredentials()
      setProgress(80)
      setStatus('Finalizing...')

      await new Promise(resolve => setTimeout(resolve, APP_CONFIG.UI.SPLASH_DURATION))
      setProgress(100)

      navigate('/dashboard')

    } catch (error) {
      console.error('Initialization error:', error)
      setProgress(100)
      setTimeout(() => {
        navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
      }, 1000)
    }
  }
  
  return (
    <Box className="splash-container">
      <img src={"https://github.com/bentork5151/assets/blob/main/Logo/logo_transparent.png?raw=true"} alt="Bentork Logo" className="splash-logo" />
      <md-linear-progress indeterminate></md-linear-progress>
      {/* <Bar variant="determinate" value={progress} />
      <Status>{status}</Status> */}
    </Box>
  )
}
