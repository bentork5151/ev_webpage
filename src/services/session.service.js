import ApiService from './api.service'
import API_CONFIG from '../config/api.config'
import CacheService from './cache.service'
import APP_CONFIG from '../config/app.config'
import NotificationService from './notification.service'
import { typeOf } from 'react-is'
// import wsService from './websocket.service'

class SessionService {
  static activeSession = null
  static statusPollingInterval = null
  static onStatusUpdate = null
  
  static async startSession(chargerId, planId, boxId) {
    try {
      if (!chargerId || !planId) {
        return {
          success: false,
          error: 'Charger ID and Plan ID are required'
        }
      }
      this.clearSession()
      console.log('Starting session:', { chargerId, planId, boxId })

      const response = await ApiService.post(API_CONFIG.ENDPOINTS.START_SESSION, {
        chargerId,
        planId,
        boxId
      })

      console.log('Session start response:', response)
      if (!response?.sessionId) {
        return {
          success: false,
          error: response?.message || 'Failed to start session'
        }
      }

      const statusResponse = await this.getSessionStatus(response?.sessionId)

      console.log('response session status: ',statusResponse)

      const normalizedStatus = String(statusResponse).toUpperCase()
      if (normalizedStatus === 'FAILED') {
        return {
          success: false,
          error: 'Charging session failed to start',
          session: { ...response, statusResponse }
        }
      }
      
      if (response.sessionId) {
        this.activeSession = {
          id: response.sessionId,
          startTime: response.startTime || new Date().toISOString(),
          status: statusResponse,
          energyUsed: 0,
          timeElapsed: 0,
          ...response
        }
        
        // wsService.connect(response.sessionId)
        
        CacheService.saveSessionData(this.activeSession)
        
        await NotificationService.requestPermission()
      }

      return {
        success: true,
        session: this.activeSession
      }
    } catch (error) {
      console.error('Failed to start session:', error)
      return {
        success: false,
        error: error.message || 'Failed to start charging session'
      }
    }
  }

  static async completeWarmup(sessionId) {
    const session = this.activeSession || CacheService.getSessionData()
    const sessionStatus = await this.getSessionStatus(sessionId)

    if (session) {
      session.status = sessionStatus
      session.warmupCompletedAt = new Date().toISOString()

      this.activeSession = session
      CacheService.saveSessionData(session)

      await NotificationService.sendSessionStarted(sessionId)
    }

    console.log('Session Data after Warmup complete: ',session)
    return session
  }
  

  static async stopSession(sessionId) {
    try {
      const id = sessionId || this.activeSession?.id || this.activeSession?.sessionId
      if (!id) {
        return {
          success: false,
          error: 'No active session to stop'
        }
      }
      console.log('Stopping session with ID:', id)

      const response = await ApiService.post(API_CONFIG.ENDPOINTS.STOP_SESSION, {
        sessionId: sessionId
      })
      
      console.log('Stop session response:', response)

      const statusResponse = await this.getSessionStatus(sessionId)

      if (this.activeSession) {
        this.activeSession.status = statusResponse
        this.activeSession.endTime = new Date().toISOString()
      }
      console.log('Stoped active session response:', this.activeSession)

      // wsService.disconnect()
      // this.activeSession = null
      // sessionStorage.removeItem(APP_CONFIG.CACHE.SESSION_KEY)
      
      this.stopStatusPolling()
      
      return {
        success: true,
        sessionData: {
          ...response,
          ...this.activeSession
        }
      }
    } catch (error) {
      console.error('Failed to stop session:', error)
      return {
        success: false,
        error: error.message || 'Failed to stop charging session'
      }
    }
  }
  

  static async getSessionStatus(sessionId) {
    try {
      if (!sessionId) {
        throw new Error('Session ID required')
      }

      const response = await ApiService.get(
        API_CONFIG.ENDPOINTS.GET_SESSION_STATUS(sessionId)
      )

      const status = typeof response === 'string' ? response : response?.status || 'unknown'
      return status.toLowerCase()
    } catch (error) {
      console.error('Failed to get session status:', error)
      return { status: 'UNKNOWN', error: error.message }
    }
  }
  

  static async getKwhUsed(sessionId) {
    try {
      const id = sessionId || this.activeSession?.id || this.activeSession?.sessionId
      if (!id) {
        return 0
      }

      const response = await ApiService.get(API_CONFIG.ENDPOINTS.GET_ENERGY_USED(sessionId))
      console.log('KWH: ',response)
      
      let energyUsed = 0
      if (typeof response === 'number') {
        energyUsed = response
      } else if (typeof response === 'object') {
        energyUsed = response.kwhUsed ?? response.energy ?? response.energyUsed ?? 0
      }
      return Number(energyUsed) || 0
    } catch (error) {
      console.error('Failed to get kWh used:', error)
      return this.activeSession?.kwhUsed || 0
    }
  }


  static async fetchSessionData(sessionId) {
    try {
      const [status, energyUsed] = await Promise.all([
        this.getSessionStatus(sessionId),
        this.getKwhUsed(sessionId)
      ])

      if (this.activeSession) {
        this.activeSession.status = status
        this.activeSession.energyUsed = energyUsed
        this.activeSession.lastUpdated = new Date().toISOString()
        
        CacheService.saveSessionData(this.activeSession)
      }

      return {
        status,
        energyUsed,
      }
    } catch (error) {
      console.error('Failed to fetch session data:', error)
      return {
        status: this.activeSession?.status || 'UNKNOWN',
        energyUsed: this.activeSession?.energyUsed || 0
      }
    }
  }


  static startStatusPolling(sessionId, callback) {
    this.stopStatusPolling()
    this.onStatusUpdate = callback

    const poll = async () => {
      const data = await this.fetchSessionData(sessionId)
      
      if (this.onStatusUpdate) {
        this.onStatusUpdate(data)
      }

      const normalizedStatus = String(data.status).toUpperCase()
      if (['COMPLETED', 'FAILED'].includes(normalizedStatus)) {
        this.stopStatusPolling()
      }
    }

    poll()

    this.statusPollingInterval = setInterval(poll, APP_CONFIG.SESSION.STATUS_POLL_INTERVAL)
  }


  static stopStatusPolling() {
    if (this.statusPollingInterval) {
      clearInterval(this.statusPollingInterval)
      this.statusPollingInterval = null
    }
    this.onStatusUpdate = null
  }
  

  static getActiveSession() {
    if (!this.activeSession) {
      const stored = CacheService.getSessionData()
      if (stored) {
        this.activeSession = stored
      }
    }
    return this.activeSession
  }


  static updateTimerState(timeElapsed, percentage) {
    if (this.activeSession) {
      this.activeSession.timeElapsed = timeElapsed
      this.activeSession.percentage = percentage
      
      CacheService.saveSessionTimer({
        timeElapsed,
        percentage,
        sessionId: this.activeSession.sessionId
      })
    }
  }


  static clearSession() {
    this.activeSession = null
    this.stopStatusPolling()
    CacheService.clearSessionData()
    CacheService.clearSessionTimer()
  }


  static hasValidSession() {
    const session = this.getActiveSession()
    if (!session) return false

    const normalizedStatus = String(session.status).toUpperCase()
    return ['ACTIVE', 'INITIATED'].includes(normalizedStatus)
  }
  
  
  // Simulate session progress (for demo purposes without WebSocket)
  // static simulateProgress(durationMin) {
  //   const totalSeconds = durationMin * 60
  //   const startTime = new Date(this.activeSession?.startTime || Date.now())
  //   const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000)
  //   const percentage = Math.min(100, (elapsed / totalSeconds) * 100)
    
  //   return {
  //     elapsed,
  //     percentage,
  //     remaining: Math.max(0, totalSeconds - elapsed)
  //   }
  // }

}

export default SessionService