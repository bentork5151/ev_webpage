import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useRef 
} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import SessionService from '../services/session.service'
import CacheService from '../services/cache.service'
import NotificationService from '../services/notification.service'
import EmailService from '../services/email.service'
import APP_CONFIG from '../config/app.config'

const SessionContext = createContext(null)

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}

const LOADING_MESSAGES = [
  "Initializing your session...",
  "Communicating with charger...",
  "Establishing connection...",
  "Preparing charging station...",
  "Starting charge...",
  "Almost ready..."
]

export const SessionProvider = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, chargerData } = useAuth()

    const timerRef = useRef(null)
    const pollingRef = useRef(null)
    const messageRef = useRef(null)
    const lowTimeWarningShown = useRef(false)
    const sessionCompleteHandled = useRef(false)

    const [session, setSession] = useState(null)
    const [plan, setPlan] = useState(null)
    
    const [chargingData, setChargingData] = useState({
        energyUsed: 0,
        timeElapsed: 0,
        percentage: 0,
        status: 'INITIALIZING'
    })

    const [isInitializing, setIsInitializing] = useState(true)
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])
    const [messageIndex, setMessageIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [isStopping, setIsStopping] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [notifyOnComplete, setNotifyOnComplete] = useState(true)

    const isSessionActive = chargingData.status === 'ACTIVE'
    const isOnSessionPage = location.pathname === '/charging-session'

    useEffect(() => {
        const savedPref = CacheService.getNotificationPreference()
        setNotifyOnComplete(savedPref)

        NotificationService.requestPermission()

        return () => {
        cleanupAllIntervals()
        }
    }, [])

    useEffect(() => {
        if (isOnSessionPage && isSessionActive && !isCompleted) {

        const handleBeforeUnload = (e) => {
            e.preventDefault()
            e.returnValue = 'Charging session is active. Are you sure you want to leave?'
            return e.returnValue
        }

        const handlePopState = (e) => {
            if (isSessionActive && !isCompleted) {
            window.history.pushState(null, '', location.pathname)
            setError('Cannot leave during active charging session')
            setTimeout(() => setError(''), 3000)
            }
        }

        window.history.pushState(null, '', location.pathname)

        window.addEventListener('beforeunload', handleBeforeUnload)
        window.addEventListener('popstate', handlePopState)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            window.removeEventListener('popstate', handlePopState)
        }
        }
    }, [isOnSessionPage, isSessionActive, isCompleted, location.pathname])


    useEffect(() => {
        if (isInitializing) {
        messageRef.current = setInterval(() => {
            setMessageIndex((prev) => {
            const next = (prev + 1) % LOADING_MESSAGES.length
            setLoadingMessage(LOADING_MESSAGES[next])
            return next
            })
        }, APP_CONFIG.SESSION.MESSAGE_ROTATE_INTERVAL)
        } else {
        if (messageRef.current) {
            clearInterval(messageRef.current)
            messageRef.current = null
        }
        }

        return () => {
        if (messageRef.current) {
            clearInterval(messageRef.current)
        }
        }
    }, [isInitializing])


    const cleanupAllIntervals = useCallback(() => {
        if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
        }
        if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
        }
        if (messageRef.current) {
        clearInterval(messageRef.current)
        messageRef.current = null
        }
        SessionService.stopStatusPolling()
    }, [])


    const initializeSession = useCallback(async () => {
        try {
        setIsLoading(true)
        setError('')
        sessionCompleteHandled.current = false

        let activeSession = CacheService.getSessionData()
        let activePlan = CacheService.getPlanData()

        if (!activeSession || !(activeSession.sessionId || activeSession.id)) {
            console.warn('No active session found')
            navigate('/config-charging')
            return { success: false }
        }

        const sessionStatus = String(activeSession.status || '').toUpperCase()
        if (sessionStatus === 'FAILED') {
            console.error('Session status is FAILED, redirecting back')
            setError('Failed to start charging session')
            CacheService.clearSessionData()
            CacheService.clearPlanData()
            
            setTimeout(() => {
            navigate('/config-charging')
            }, 2000)
            
            setIsLoading(false)
            return { success: false, error: 'Session failed to start' }
        }

        setSession(activeSession)
        setPlan(activePlan)

        const savedTimer = CacheService.getSessionTimer()
        if (savedTimer && savedTimer.sessionId === (activeSession.sessionId || activeSession.id)) {
            setChargingData(prev => ({
            ...prev,
            timeElapsed: savedTimer.timeElapsed,
            percentage: savedTimer.percentage,
            energyUsed: activeSession.energyUsed || 0,
            status: activeSession.status || 'ACTIVE'
            }))

            if (activeSession.warmupCompletedAt || activeSession.status === 'ACTIVE') {
            setIsInitializing(false)
            startChargingTimers(activeSession, activePlan, savedTimer.timeElapsed)
            } else {
            await runWarmupSequence(activeSession, activePlan)
            }
        } else {
            await runWarmupSequence(activeSession, activePlan)
        }

        setIsLoading(false)
        return { success: true }

        } catch (err) {
        console.error('Session initialization error:', err)
        setError('Failed to initialize session')
        setIsLoading(false)
        return { success: false, error: err.message }
        }
    }, [navigate])


    const runWarmupSequence = useCallback(async (activeSession, activePlan) => {
        setIsInitializing(true)
        setChargingData(prev => ({ ...prev, status: 'INITIALIZING' }))

        await new Promise(resolve => setTimeout(resolve, APP_CONFIG.SESSION.WARMUP_DURATION))

        await SessionService.completeWarmup(activeSession.sessionId || activeSession.id)
        
        setIsInitializing(false)
        setChargingData(prev => ({ ...prev, status: 'ACTIVE' }))

        startChargingTimers(activeSession, activePlan, 0)
    }, [])


    const startChargingTimers = useCallback((activeSession, activePlan, initialElapsed = 0) => {
        const sessionId = activeSession.sessionId || activeSession.id
        const durationSeconds = (activePlan?.durationMin || 0) * 60

        if (timerRef.current) clearInterval(timerRef.current)
        if (pollingRef.current) clearInterval(pollingRef.current)

        timerRef.current = setInterval(() => {
        setChargingData(prev => {
            if (sessionCompleteHandled.current) return prev

            const newElapsed = prev.timeElapsed + 1
            const percentage = durationSeconds > 0 
            ? (newElapsed / durationSeconds) * 100 
            : 0

            SessionService.updateTimerState(newElapsed, percentage)

            const remaining = durationSeconds - newElapsed
            if (remaining === APP_CONFIG.SESSION.LOW_TIME_WARNING && !lowTimeWarningShown.current) {
            lowTimeWarningShown.current = true
            if (notifyOnComplete) {
                NotificationService.sendLowTimeWarning(5)
            }
            }

            if (newElapsed >= durationSeconds && durationSeconds > 0) {
            handleSessionComplete({ status: 'COMPLETED' })
            }

            return {
            ...prev,
            timeElapsed: newElapsed,
            percentage: Math.min(100, percentage)
            }
        })
        }, 1000)

        pollingRef.current = setInterval(async () => {

            if (sessionCompleteHandled.current) return
            const data = await SessionService.fetchSessionData(sessionId)
            
            setChargingData(prev => ({
                ...prev,
                energyUsed: data.energyUsed || prev.energyUsed,
                status: data.status !== 'UNKNOWN' ? data.status : prev.status
            }))

            if (['COMPLETED', 'FAILED'].includes(data.status)) {
                handleSessionComplete({ status: data.status })
            }
            }, APP_CONFIG.SESSION.STATUS_POLL_INTERVAL)

            SessionService.fetchSessionData(sessionId).then(data => {
                setChargingData(prev => ({
                    ...prev,
                    energyUsed: data.energyUsed || 0
            }))
        })
    }, [notifyOnComplete])


    const stopSession = useCallback(async () => {
    if (isStopping) return { success: false }

    setIsStopping(true)
    setError('')

    try {
      const sessionId = session?.sessionId || session?.id
      const result = await SessionService.stopSession(sessionId)

      if (result.success) {
        handleSessionComplete({ 
          status: 'STOPPED',
          ...result.sessionData 
        })
        return { success: true }
      } else {
        setError(result.error || 'Failed to stop session')
        return { success: false, error: result.error }
      }

    } catch (err) {
      console.error('Stop session error:', err)
      setError('Failed to stop charging session')
      return { success: false, error: err.message }
    } finally {
      setIsStopping(false)
    }
  }, [session, isStopping])


  const handleSessionComplete = useCallback(async (data) => {
    if (sessionCompleteHandled.current) {
      console.log('Session complete already handled, skipping...')
      return
    }
    sessionCompleteHandled.current = true

    console.log('Session complete:', data)

    cleanupAllIntervals()

    setChargingData(prev => ({ ...prev, status: data.status }))
    setIsCompleted(true)

    const completionData = {
      sessionId: session?.sessionId || session?.id,
      receiptId: session?.receiptId,
      status: data.status,
      startTime: session?.startTime,
      endTime: new Date().toISOString(),
      duration: Math.floor(chargingData.timeElapsed / 60),
      energyUsed: chargingData.energyUsed || 0,
      plan: plan,
      amountDebited: session?.amountDebited || plan?.walletDeduction,
      finalCost: session?.amountDebited || plan?.walletDeduction,
      rate: plan?.rate || 0,
      transactionId: session?.receiptId || session?.sessionId || session?.id,
      paymentMethod: 'Wallet',
      stationName: chargerData?.stationName || chargerData?.name,
      chargerType: chargerData?.chargerType,
      userName: user?.name,
      userEmail: user?.email
    }

    sessionStorage.setItem('sessionCompletion', JSON.stringify({
      completionData,
      notifyOnComplete
    }))

    if (notifyOnComplete) {
      await NotificationService.sendSessionCompleted(
        completionData.sessionId,
        user?.name || 'User'
      )
    }

    setTimeout(() => {
      navigate('/invoice')
    }, 1500)
  }, [chargingData, chargerData, user, notifyOnComplete, cleanupAllIntervals, navigate])


  const toggleNotification = useCallback(() => {
    setNotifyOnComplete(prev => {
      const newValue = !prev
      CacheService.saveNotificationPreference(newValue)
      
      if (newValue) {
        NotificationService.requestPermission()
      }
      
      return newValue
    })
  }, [])


  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  const getRemainingTime = useCallback(() => {
    if (!plan?.durationMin) return '--:--'
    const total = plan.durationMin * 60
    return formatTime(Math.max(0, total - chargingData.timeElapsed))
  }, [plan?.durationMin, chargingData.timeElapsed, formatTime])

  const getBatteryHealth = useCallback(() => {
    const p = chargingData.percentage
    if (p >= 80) return 'Excellent'
    if (p >= 55) return 'Good'
    if (p >= 30) return 'Average'
    return 'Low'
  }, [chargingData.percentage])


  const sendInvoiceEmail = useCallback(async (invoiceData) => {
    if (!user?.email) {
      console.warn('No user email available')
      return { success: false, error: 'No email address' }
    }

    return await EmailService.sendInvoiceEmail({
      ...invoiceData,
      userName: user.name,
      userEmail: user.email
    })
  }, [user])


  const value = useMemo(() => ({

    session,
    plan,
    chargingData,
    isInitializing,
    loadingMessage,
    messageIndex,
    isLoading,
    error,
    isStopping,
    isCompleted,
    notifyOnComplete,
    isSessionActive,

    loadingMessages: LOADING_MESSAGES,
    remainingTime: getRemainingTime(),
    batteryHealth: getBatteryHealth(),

    initializeSession,
    stopSession,
    toggleNotification,
    formatTime,
    getRemainingTime,
    getBatteryHealth,
    sendInvoiceEmail,
    setError,
    cleanupAllIntervals
  }), [
    session,
    plan,
    chargingData,
    isInitializing,
    loadingMessage,
    messageIndex,
    isLoading,
    error,
    isStopping,
    isCompleted,
    notifyOnComplete,
    isSessionActive,
    getRemainingTime,
    getBatteryHealth,
    initializeSession,
    stopSession,
    toggleNotification,
    formatTime,
    sendInvoiceEmail,
    cleanupAllIntervals
  ])

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )

}