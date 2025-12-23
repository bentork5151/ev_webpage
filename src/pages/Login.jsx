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
import CacheService from '../services/cache.service'
import AuthService from '../services/auth.service'
import Logo from "../assets/images/logo.png";
import Onboarding from "../assets/images/onboarding.png";

import "../assets/styles/Login.css";

const Login = () => {
  const navigate = useNavigate()
  const { ocppId } = useParams()
  const { updateChargerData, login: contextLogin, transactionHistory} = useAuth()

  const [animate, setAnimate] = useState(false);

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  useEffect(() => {
    setTimeout(() => setAnimate(true), 200);
    checkOAuthCallback();
  }, [])

  const checkOAuthCallback = async () => {
    const urlParam = new URLSearchParams(window.location.search)
    const token = urlParam.get("token")
    const ocppIdFromUrl = urlParam.get('ocppId') || ocppId

    if(token){
      setLoading(true)
      try {
      const result = await contextLogin(token)
      
      if (!result.success) {
          setError(result.error)
          setLoading(false)
          return
        }

      console.log('Login successful:',result.user)
      console.log(token)

      if (ocppIdFromUrl) {
        try {
          const chargerData = await ApiService.get(
            API_CONFIG.ENDPOINTS.GET_CHARGER(ocppIdFromUrl),
            null,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          updateChargerData(chargerData)
        } catch (error) {
            console.error('Failed to load charger:', error)
        }
      }

      const transactions = await AuthService.loadTransaction(result.user.id, 10)
      transactionHistory(transactions || [])

      window.history.replaceState({}, document.title, window.location.pathname)
      
      navigate('/dashboard')

    }catch (error) {
        console.error('OAuth callback error:', error)
        setError('Failed to process login')
        setLoading(false)
    }
  } 
}

  const handleGoogleSuccess = async () => {
    setLoading(true)
    
    if (ocppId) {
      sessionStorage.setItem('ocppId', ocppId)
    }

    window.location.href = import.meta.env.VITE_API_BASE_URL + '/oauth2/authorization/google'
  }
  
  return (
    <div className={`login-container ${animate ? "fade-in" : ""}`}>
      <img
    src={Logo}
    alt="Bentork Logo"
    className="login-logo"
  />
<div className='card-2'>
     
      <div className="onboarding-container">
      <img
        src={Onboarding}
        alt="Onboarding"
        className="onboarding-img"
      />
      </div>

      <div className="text-section">
        <h1 className="welcome-text">Welcome</h1>
        <p className="subtitle-text">One-Tap Login</p>
      </div>

      <button className="google-btn" onClick={handleGoogleSuccess}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google Logo"
          className="google-icon"
        />
        SignIn with Google
      </button>
       <p className="subtitle-text-1">Start charging smarter today</p>
      </div>

      <p className='fotter-text'>Connect Your Charger • Follow Simple Steps</p>
    </div>
  )
}

export default Login
