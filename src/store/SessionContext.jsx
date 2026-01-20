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
// import EmailService from '../services/email.service'
import AuthService from '../services/auth.service'
import ApiService from '../services/api.service'
import API_CONFIG from '../config/api.config'
import APP_CONFIG from '../config/app.config'
import { logError } from '../config/errors.config'

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
  const initializationStarted = useRef(false)

  const sessionRef = useRef(null)
  const planRef = useRef(null)
  const chargingDataRef = useRef({
    energyUsed: 0,
    timeElapsed: 0,
    percentage: 0,
    status: 'INITIALIZING'
  })

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
  const [notificationPermission, setNotificationPermission] = useState('default')

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  useEffect(() => {
    planRef.current = plan
  }, [plan])

  useEffect(() => {
    chargingDataRef.current = chargingData
  }, [chargerData])

  const isSessionActive = useMemo(() => {
    const status = String(chargingData.status || '').toLowerCase()
    const active = ['active', 'initiated'].includes(status)
    console.log('isSessionActive check: ', { status, active })
    return active
  }, [chargingData.status])

  const isOnSessionPage = location.pathname === '/charging-session'

  useEffect(() => {
    const savedPref = CacheService.getNotificationPreference()
    setNotifyOnComplete(savedPref)

    if (NotificationService.isSupported) {
      setNotificationPermission(Notification.permission)
    }

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
    if (initializationStarted.current) {
      return { success: false, message: 'Already initializing' }
    }
    initializationStarted.current = true

    try {
      console.log('Initialize Session Started - DB SCAN MODE')
      setError('')
      sessionCompleteHandled.current = false
      lowTimeWarningShown.current = false

      setIsLoading(false)
      setIsInitializing(true)

      // 1. Get Current User
      let currentUserId = user?.id;
      if (!currentUserId) {
        const cachedUser = await AuthService.getCurrentUser();
        currentUserId = cachedUser?.id;
      }
      console.log('User ID:', currentUserId)

      let activeSession = CacheService.getSessionData()
      let activePlan = CacheService.getPlanData()

      // 2. SEARCH DB: Fetch ALL sessions and filter for this user's ACTIVE session
      // This ensures we get the "Source of Truth" directly from the Session Table as requested
      try {
        console.log('Scanning DB for active session...')
        const allSessionsResponse = await ApiService.get(API_CONFIG.ENDPOINTS.GET_ALL_SESSIONS)

        // Handle response which might be wrapped or just an array
        const allSessions = Array.isArray(allSessionsResponse) ? allSessionsResponse : (allSessionsResponse?.data || [])

        console.log(`Scanned ${allSessions.length} records.`)

        const foundSession = allSessions.find(s =>
          Number(s.user?.id || s.userId) === Number(currentUserId) &&
          String(s.status).toUpperCase() === 'ACTIVE'
        )

        if (foundSession) {
          console.log('✅ FOUND ACTIVE SESSION IN DB:', foundSession)

          activeSession = {
            ...foundSession,
            sessionId: foundSession.id,
            startTime: foundSession.startTime, // This is the gold standard from DB
            status: foundSession.status,
            energyUsed: foundSession.energyKwh || foundSession.energyUsed || 0
          }
          CacheService.saveSessionData(activeSession)

          // 3. Match Plan using Transaction Amount (Secondary Recovery)
          // Since Session Table lacks Plan info, we still assume Plan matches similar debit
          if (!activePlan) {
            const transactions = await AuthService.loadTransaction(currentUserId, 20)
            const sessionTx = transactions.find(t =>
              (String(t.sessionId) === String(foundSession.id) || String(t.session_id) === String(foundSession.id)) &&
              ['DEBIT', 'debit'].includes(t.type)
            )
            if (sessionTx) {
              const allPlans = await ApiService.get(API_CONFIG.ENDPOINTS.GET_ALL_PLANS)
              const matchedPlan = allPlans.find(p => Math.abs(Number(p.walletDeduction) - Number(sessionTx.amount)) < 0.5)
              if (matchedPlan) {
                console.log('Matched Plan:', matchedPlan)
                activePlan = matchedPlan
                CacheService.savePlanData(matchedPlan)
              }
            }
          }

        } else {
          console.warn('No ACTIVE session found in DB for this user.')
          // If we rely purely on DB, we might stop here. 
          // But valid scenarios might have latency, so fall back to cache if really needed
          // For now, assume if DB says no, then NO.
        }
      } catch (dbErr) {
        console.error('Failed to scan DB sessions:', dbErr)
      }


      const sessionId = activeSession?.sessionId || activeSession?.id

      if (!sessionId) {
        console.warn('No active session identified after DB scan.')
        setIsInitializing(false)
        // navigate('/config-charging') // Optional: Redirect if strict
        return { success: false }
      }

      // 4. Live Status Double-Check (Energy & Status)
      const sessionData = await SessionService.fetchSessionData(sessionId)

      const sessionStatus = String(sessionData.status || activeSession.status || '').toUpperCase()

      if (['FAILED', 'COMPLETED', 'STOPPED'].includes(sessionStatus)) {
        console.error('Session is finished (verified live):', sessionStatus)
        setError(`Session ${sessionStatus.toLowerCase()}.`)
        CacheService.clearSessionData()
        CacheService.clearPlanData()
        setIsInitializing(false)
        setTimeout(() => navigate('/config-charging'), 2000)
        return { success: false, error: 'Session unavailable' }
      }

      // 5. Update Context State
      if (activeSession) {
        activeSession.status = sessionStatus
        if (sessionData.energyUsed !== undefined) {
          activeSession.energyUsed = sessionData.energyUsed
        }
      }

      setSession(activeSession)
      setPlan(activePlan)
      sessionRef.current = activeSession
      planRef.current = activePlan

      // 6. Calculate Timer
      let initialElapsed = 0

      if (activeSession?.startTime) {
        let startMs = 0;
        const sTime = activeSession.startTime;
        // Robust Date Parsing for Java LocalDateTime array [yyyy, MM, dd, HH, mm, ss]
        if (Array.isArray(sTime)) {
          startMs = new Date(sTime[0], sTime[1] - 1, sTime[2], sTime[3], sTime[4], sTime[5] || 0).getTime()
        } else {
          startMs = new Date(sTime).getTime()
        }

        if (!isNaN(startMs)) {
          const now = Date.now()
          initialElapsed = Math.floor((now - startMs) / 1000)
          if (initialElapsed < 0) initialElapsed = 0
          console.log('Calculated Initial Elapsed:', initialElapsed, 's')
        }
      }

      setChargingData(prev => ({
        ...prev,
        timeElapsed: initialElapsed,
        percentage: 0,
        energyUsed: activeSession?.energyUsed || 0,
        status: activeSession?.status || 'ACTIVE'
      }))

      // 7. Start UI Timers
      setIsInitializing(false)
      startChargingTimers(activeSession, activePlan, initialElapsed)

      return { success: true }
    } catch (err) {
      console.error('Session Init Error:', err)
      setError(logError('SESSION_INIT_ERROR', err))
      setIsInitializing(false)
      setIsLoading(false)
      return { success: false, error: err.message }
    }
  }, [navigate, user])

  const runWarmupSequence = useCallback(async (activeSession, activePlan) => {
    setIsInitializing(true)
    setChargingData(prev => ({ ...prev, status: 'INITIALIZING' }))

    await new Promise(resolve => setTimeout(resolve, APP_CONFIG.SESSION.WARMUP_DURATION))

    const updatedSession = await SessionService.completeWarmup(activeSession.sessionId || activeSession.id)

    if (updatedSession) {
      setSession(updatedSession)
      sessionRef.current = updatedSession
    }

    setIsInitializing(false)
    setChargingData(prev => ({ ...prev, status: 'ACTIVE' }))

    startChargingTimers(activeSession, activePlan, 0)
  }, [])


  const startChargingTimers = useCallback((activeSession, activePlan, initialElapsed = 0) => {
    const sessionId = activeSession.sessionId || activeSession.id
    const durationSeconds = (activePlan?.durationMin || 0) * 60

    if (timerRef.current) clearInterval(timerRef.current)
    if (pollingRef.current) clearInterval(pollingRef.current)

    setChargingData(prev => ({
      ...prev,
      timeElapsed: initialElapsed,
      percentage: durationSeconds > 0 ? (initialElapsed / durationSeconds) * 100 : 0
    }))

    timerRef.current = setInterval(() => {
      if (sessionCompleteHandled.current) {
        console.log('Session already completed, stopping timer')
        return
      }

      setChargingData(prev => {
        const newElapsed = prev.timeElapsed + 1

        // Use ref to ensure we get the latest session object even inside interval closure
        const currentSession = sessionRef.current || activeSession;
        // Check multiple possible property names for the target energy (camel and snake case)
        const targetKwh = Number(
          currentSession?.selectedKwh ||
          currentSession?.selected_kwh ||
          currentSession?.kwh ||
          currentSession?.targetKwh ||
          currentSession?.target_kwh ||
          0
        );

        let percentage = 0;

        if (durationSeconds > 0) {
          percentage = (newElapsed / durationSeconds) * 100;
        } else if (targetKwh > 0) {
          // Use live energyUsed (updated via poller) for percentage
          // Ensure we use the latest available energy reading
          const currentEnergy = chargingDataRef.current?.energyUsed || prev.energyUsed || 0;
          percentage = (currentEnergy / targetKwh) * 100;
        }

        const updated = {
          ...prev,
          timeElapsed: newElapsed,
          percentage: Math.min(100, percentage),
          status: 'ACTIVE'
        }

        chargingDataRef.current = updated

        SessionService.updateTimerState(newElapsed, percentage)

        const remaining = durationSeconds - newElapsed
        if (remaining === APP_CONFIG.SESSION.LOW_TIME_WARNING && !lowTimeWarningShown.current) {
          lowTimeWarningShown.current = true
          if (notifyOnComplete && notificationPermission === 'granted') {
            NotificationService.sendLowTimeWarning(5)
          }
        }

        if (newElapsed >= durationSeconds && durationSeconds > 0 && !sessionCompleteHandled.current) {
          console.log('Timer completed, triggering session completed')
          setTimeout(() => handleSessionComplete({ status: 'COMPLETED' }), 0)
        }

        return updated
      })
    }, 1000)

    pollingRef.current = setInterval(async () => {
      if (sessionCompleteHandled.current) return

      try {
        const data = await SessionService.fetchSessionData(sessionId)

        setChargingData(prev => ({
          ...prev,
          energyUsed: typeof data.energyUsed === 'number' && data.energyUsed > 0.001 ? data.energyUsed : prev.energyUsed,
          status: data.status || prev.status
        }))

        const normalizedPollStatus = String(data.status || '').toUpperCase()
        if (['COMPLETED', 'FAILED'].includes(normalizedPollStatus) && !sessionCompleteHandled.current) {
          handleSessionComplete({ status: normalizedPollStatus })
        }
      } catch (error) {
        console.error('Polling error: ', error)
      }
    }, APP_CONFIG.SESSION.STATUS_POLL_INTERVAL)

    SessionService.fetchSessionData(sessionId).then(data => {
      setChargingData(prev => {
        const updated = {
          ...prev,
          energyUsed: typeof data.energyUsed === 'number' ? data.energyUsed : 0
        }
        chargingDataRef.current = updated
        return updated
      })
    })
  }, [notifyOnComplete, notificationPermission])


  const stopSession = useCallback(async () => {
    if (isStopping || sessionCompleteHandled.current) {
      return { success: false }
    }

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
      setError(logError('SESSION_STOP_FAILED', err))
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

    const currentSession = sessionRef.current
    const currentPlan = planRef.current
    const currentChagingData = chargingDataRef.current

    console.log('Building completion data with ', { currentSession, currentPlan, currentChagingData })

    const completionData = {
      sessionId: data.sessionId || currentSession?.sessionId || currentSession?.id,
      receiptId: data.receiptId || currentSession?.receiptId,
      status: data.status,
      startTime: data.startTime || currentSession?.startTime,
      endTime: new Date().toISOString(),
      duration: Math.floor((currentChagingData.timeElapsed || 0) / 60),
      energyUsed: data.energyUsed || data.energyKwh || currentChagingData.energyUsed || 0,
      plan: currentPlan,
      // Prioritize backend response (data), then session, then plan
      amountDebited: data.amountDebited ?? currentSession?.amountDebited ?? currentPlan?.walletDeduction,
      finalCost: data.finalCost ?? data.amountDebited ?? currentSession?.amountDebited ?? currentPlan?.walletDeduction,
      rate: data.rate ?? currentChagingData?.rate ?? currentPlan?.rate ?? 0,

      transactionId: data.transactionId || session?.receiptId || session?.sessionId || session?.id,
      paymentMethod: 'Wallet',
      stationName: currentChagingData?.stationName || currentChagingData?.name,
      chargerType: currentChagingData?.chargerType,
      userName: user?.name,
      userEmail: user?.email
    }

    console.log('Complete session data: ', completionData)

    const dataToSave = {
      completionData,
      notifyOnComplete
    }
    CacheService.saveSessionData(dataToSave)

    if (notifyOnComplete && notificationPermission === 'granted') {
      await NotificationService.sendSessionCompleted(
        completionData.sessionId,
        user?.name || 'User'
      )
    }

    setTimeout(() => {
      navigate('/invoice')
    }, 1500)
  }, [chargingData,
    chargerData,
    plan,
    session,
    user,
    notifyOnComplete,
    notificationPermission,
    cleanupAllIntervals,
    navigate
  ])


  const toggleNotification = useCallback(async () => {
    if (!notifyOnComplete) {
      const granted = await NotificationService.requestPermission()
      if (granted) {
        setNotificationPermission('granted')
        setNotifyOnComplete(true)
        CacheService.saveNotificationPreference(true)
      } else {
        setNotificationPermission(Notification.permission)
        setError('Notification permission denied')
        setTimeout(() =>
          setError('')
          , 3000)
      }
    } else {
      setNotifyOnComplete(false)
      CacheService.saveNotificationPreference(false)
    }
  }, [notifyOnComplete])


  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  const isCustomSession = useMemo(() => {
    return plan?.type === 'CUSTOM' || plan?.isCustom === true
  }, [plan])

  const getRemainingTime = useCallback(() => {
    // If custom session or NO PLAN data (recovery failed), show elapsed time
    if (isCustomSession || !plan?.durationMin) {
      return formatTime(chargingData.timeElapsed)
    }
    const total = plan.durationMin * 60
    return formatTime(Math.max(0, total - chargingData.timeElapsed))
  }, [plan?.durationMin, chargingData.timeElapsed, formatTime, isCustomSession])

  const getBatteryHealth = useCallback(() => {
    const p = chargingData.percentage
    if (p >= 80) return 'Excellent'
    if (p >= 55) return 'Good'
    if (p >= 30) return 'Average'
    return 'Low'
  }, [chargingData.percentage])


  const isNotificationDisabled = useMemo(() => {
    return notificationPermission === 'denied'
  }, [notificationPermission])


  // const sendInvoiceEmail = useCallback(async (invoiceData) => {
  //   if (!user?.email) {
  //     console.warn('No user email available')
  //     return { success: false, error: 'No email address' }
  //   }

  //   return await EmailService.sendInvoiceEmail({
  //     ...invoiceData,
  //     userName: user.name,
  //     userEmail: user.email
  //   })
  // }, [user])


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
    notificationPermission,
    isNotificationDisabled,
    isCustomSession,

    loadingMessages: LOADING_MESSAGES,
    remainingTime: getRemainingTime(),
    batteryHealth: getBatteryHealth(),

    initializeSession,
    stopSession,
    toggleNotification,
    formatTime,
    getRemainingTime,
    getBatteryHealth,
    // sendInvoiceEmail,
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
    notificationPermission,
    isNotificationDisabled,
    isCustomSession,
    getRemainingTime,
    getBatteryHealth,
    initializeSession,
    stopSession,
    toggleNotification,
    formatTime,
    // sendInvoiceEmail,
    cleanupAllIntervals
  ])

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )

}