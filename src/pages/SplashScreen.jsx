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


const Wrap = styled(Box)({
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
minHeight: '100vh',
backgroundColor: 'var(--md-sys-color-background)',
position: 'relative',
overflow: 'hidden',
})

const TopImg = styled('img')({
position: 'absolute',
top: 0, left: 0, width: '100%',
maxHeight: '28vh', objectFit: 'cover', objectPosition: 'bottom'
})

const BottomImg = styled('img')({
position: 'absolute',
bottom: 0, left: 0, width: '100%',
maxHeight: '28vh', objectFit: 'cover', objectPosition: 'top'
})

const Content = styled(Box)({
zIndex: 1,
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
padding: '2rem',
})

const Logo = styled('img')({
width: 180, height: 'auto', marginBottom: '2rem'
})

const Bar = styled(LinearProgress)({
  width: 240, height: 4, borderRadius: 2,
backgroundColor: 'var(--md-sys-color-surface-variant)',
'& .MuiLinearProgress-bar': {
backgroundColor: 'var(--md-sys-color-primary)',
borderRadius: 2,
},
})

const Status = styled(Typography)({
marginTop: '1rem',
color: 'var(--md-sys-color-on-surface-variant)',
fontSize: 14,
})


const SplashScreen = () => {
  const navigate = useNavigate()
  const { ocppId } = useParams()
  const { updateChargerData } = useAuth()
  const [status, setStatus] = useState('Initializing...')
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    initializeApp()
  }, [])
  
  const initializeApp = async () => {
    try {

      setProgress(10)
      const cacheUser = await AuthService.getCurrentUser();

      if (!cacheUser) {
        setProgress(100)
        navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
      }
      console.log(cacheUser)
      const user = await AuthService.login(cacheUser.email);
      console.log(user.email)
      console.log(user.name)
      if (!user) {
        setProgress(100)
        navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
      }

      if (ocppId) {
        setStatus('Loading charger data...')
        setProgress(35)
        const chargerResponse = await ApiService.get(
          API_CONFIG.ENDPOINTS.GET_CHARGER(ocppId)
        )
        updateChargerData(chargerResponse)
        setProgress(55)
      }
      

      setStatus('Checking authentication...')
      const authResult = await AuthService.verifyCachedCredentials()
      setProgress(80)

      await new Promise(resolve => setTimeout(resolve, APP_CONFIG.UI.SPLASH_DURATION))
      setProgress(100)

      if (authResult.success) {
        navigate('/dashboard')
      } else {
        navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
      }
    } catch (error) {
      console.error('Initialization error:', error)
      setProgress(100)
      setTimeout(() => {
        navigate(`/login${ocppId ? `/${ocppId}` : ''}`)
      }, 1000)
    }
  }
  
  return (
    <Wrap>
    <ThemedImage
      lightSrc={ASSETS.top.light}
      darkSrc={ASSETS.top.dark}
      alt="Top decoration"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', maxHeight: '28vh', objectFit: 'cover', objectPosition: 'bottom' }}
      />
    <Content>
    <ThemedImage
      lightSrc={ASSETS.logo.light}
      darkSrc={ASSETS.logo.dark}
      alt="Company logo"
      style={{ width: 180, height: 'auto', marginBottom: '2rem' }}
      />
    <Bar variant="determinate" value={progress} />
    <Status>{status}</Status>
    </Content>
    <ThemedImage 
      lightSrc={ASSETS.bottom.light} 
      darkSrc={ASSETS.bottom.dark} 
      alt="Bottom decoration" />
    </Wrap>
  )
}
