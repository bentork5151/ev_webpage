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
import "../assets/styles/global.css"
import { Google as GoogleIcon } from '@mui/icons-material'
import { useAuth } from '../store/AuthContext'
import ApiService from '../services/api.service'
import API_CONFIG from '../config/api.config'
import CacheService from '../services/cache.service'
import AuthService from '../services/auth.service'
import Logo from "../assets/images/logo-1.png";
import LoginImg from "../assets/images/car.png";
import BottomImg from "../assets/images/BottomImg.png";
import "../assets/styles/Login.css";
import { logError } from "../config/errors.config";
import TopRightBg from "../assets/images/tr.png";

const Login = () => {
  const navigate = useNavigate()
  const { ocppId } = useParams()
  const { updateChargerData, login: contextLogin, transactionHistory } = useAuth()

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
    const ocppIdFromUrl = sessionStorage.getItem('ocppId')

    if (token) {
      setLoading(true)
      try {
        const result = await contextLogin(token)

        if (!result.success) {
          setError(result.error)
          setLoading(false)
          return
        }

        console.log('Login successful:', result.user)
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

        if (ocppIdFromUrl) {
          navigate(`/config-charging?ocppid=${ocppIdFromUrl}`)
        } else {
          navigate('/config-charging')
        }

      } catch (error) {
        setError(logError('AUTH_GOOGLE_FAILED', error))
        setLoading(false)
      }
    }
  }

  const handleGoogleSuccess = async () => {
    setLoading(true)

    if (ocppId) {
      sessionStorage.setItem('ocppId', ocppId)
    }
    console.log('google')
    window.location.href = import.meta.env.VITE_API_BASE_URL + '/oauth2/authorization/google'
  }

  return (
    <div className={`login-container-dark ${animate ? "slide-up" : ""}`}>

      <div className="screen-content">

        {/* Brand */}
        <div className="brand-section">
          <img src={Logo} alt="Bentork Logo" className="brand-logo" />

        </div>

        {/* Hero */}
        <div className="hero-section">
          <img src={LoginImg} alt="EV Charging" className="hero-image" />
        </div>

        {/* Text */}
        <div className="text-section-dark">
          <h1 className="welcome-text-dark">Welcome</h1>
          <p className="subtitle-dark">Let’s get you started</p>
        </div>

        {/* Button */}
        <button className="google-btn-dark" onClick={handleGoogleSuccess}>

          Sign in with Google
        </button>

      </div>

      {/* Footer always bottom */}
      <p className="footer-dark">
        Connect Your Charger • Follow Simple Steps
      </p>

    </div>
  )

}

export default Login
