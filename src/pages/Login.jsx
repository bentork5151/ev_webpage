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

        const hasSeenOnboarding = CacheService.getOnboardingStatus()

        if (!hasSeenOnboarding) {
          CacheService.saveOnboardingStatus(true)
          navigate('/onboarding-1')
        } else {
          if (ocppIdFromUrl) {
            navigate(`/config-charging?ocppid=${ocppIdFromUrl}`)
          } else {
            navigate('/config-charging')
          }
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

        {/* Top Icon / Logo */}
        <div className="brand-section">
          <img src={Logo} alt="Bentork Logo" className="brand-logo" />
        </div>

        {/* Hero Graphic */}
        <div className="hero-section">
          <img src={LoginImg} alt="EV Charging" className="hero-image" />
        </div>

        {/* Text Section */}
        <div className="text-section-dark">
          <h1 className="welcome-text-dark">Welcome!</h1>
          <p className="subtitle-dark">Your journey starts from here</p>
        </div>

        {/* Buttons Section */}
        <div className="action-section">
          <button className="google-btn-dark" onClick={handleGoogleSuccess}>
            <GoogleIcon className="google-icon" />
            Continue with Google
          </button>
        </div>

        {/* Footer Legal Text */}
        <div className="footer-legal">
          <p>By continuing you agree to our</p>
          <div className="legal-links">
            <span onClick={() => navigate('/terms')}>Terms of Service</span> and <span onClick={() => navigate('/privacy')}>Privacy Policy</span>
          </div>
        </div>

      </div>

      {/* Blob Container */}
      <div className="blob-container-login">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Layer 1: Dark Base */}
          <path
            className="blob-layer blob-dark"
            d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.9,32.3C59.6,43.1,48.3,51.8,36.5,58.8C24.7,65.8,12.4,71.1,-0.6,72.1C-13.6,73.1,-27.2,69.8,-39.6,62.8C-52,55.8,-63.2,45.1,-71.3,32.2C-79.4,19.3,-84.4,4.2,-81.8,-9.4C-79.2,-23,-69,-35.1,-57.4,-43.8C-45.8,-52.5,-32.8,-57.8,-19.9,-65.4C-7,-73,8.9,-82.9,25.4,-84.2C41.9,-85.5,59,-78.2,44.7,-76.4Z"
            transform="translate(100 100)"
          />
          {/* Layer 2: Main Brand Green */}
          <path
            className="blob-layer blob-green"
            d="M41.3,-72.6C53.4,-65.3,63.2,-54.6,70.4,-42.1C77.6,-29.6,82.2,-15.3,81.3,-1.4C80.4,12.5,74,26,64.8,37.3C55.6,48.6,43.6,57.7,30.8,63.2C18,68.7,4.4,70.6,-8.3,69.7C-21,68.8,-32.8,65.1,-43.2,58.3C-53.6,51.5,-62.6,41.6,-68.9,30.1C-75.2,18.6,-78.8,5.5,-75.9,-6.2C-73,-17.9,-63.6,-28.2,-53.4,-36.5C-43.2,-44.8,-32.2,-51.1,-20.9,-58.5C-9.6,-65.9,2,-74.4,14.5,-76.6C27,-78.8,40.4,-74.7,41.3,-72.6Z"
            transform="translate(100 100)"
          />
          {/* Layer 3: Bright Glow */}
          <path
            className="blob-layer blob-light"
            d="M35.6,-62.3C46.5,-55.8,55.9,-47.5,63.1,-37.2C70.3,-26.9,75.3,-14.6,74.7,-2.6C74.1,9.4,67.9,21.1,60.1,31.8C52.3,42.5,42.9,52.2,31.7,58.5C20.5,64.8,7.5,67.7,-4.8,67.3C-17.1,66.9,-32.7,63.2,-45.3,55.8C-57.9,48.4,-67.5,37.3,-72.8,24.6C-78.1,11.9,-79.1,-2.4,-75.3,-15.8C-71.5,-29.2,-62.9,-41.7,-51.5,-49.6C-40.1,-57.5,-25.9,-60.8,-11.8,-62.8C2.3,-64.8,16.4,-65.5,29.3,-62.9C42.2,-60.3,54,-54.4,35.6,-62.3Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

    </div>
  )

}

export default Login
