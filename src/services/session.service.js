import ApiService from './api.service'
import API_CONFIG from '../config/api.config'
import CacheService from './cache.service'
import APP_CONFIG from '../config/app.config'
// import wsService from './websocket.service'

class SessionService {
  static activeSession = null
  
  static async startSession(chargerId, planId) {
    try {
      const response = await ApiService.post(API_CONFIG.ENDPOINTS.START_SESSION, {
        chargerId,
        planId
      })
      
      if (response.sessionId) {
        this.activeSession = {
          id: response.sessionId,
          startTime: new Date().toISOString(),
          status: 'ACTIVE',
          ...response
        }
        
        // wsService.connect(response.sessionId)
        
        CacheService.saveSessionData(this.activeSession)
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
  

  static async stopSession(sessionId) {
    try {
      console.log('Stopping session with ID:', sessionId)

      const response = await ApiService.post(API_CONFIG.ENDPOINTS.STOP_SESSION, {
        sessionId: sessionId
      })
      
      console.log('Stop session response:', response)

      // wsService.disconnect()
      
      this.activeSession = null
      sessionStorage.removeItem(APP_CONFIG.CACHE.SESSION_KEY)
      
      return {
        success: true,
        sessionData: response
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
      const response = await ApiService.get(
        API_CONFIG.ENDPOINTS.GET_SESSION_STATUS(sessionId)
      )
      return response
    } catch (error) {
      console.error('Failed to get session status:', error)
      return { status: 'UNKNOWN', error: error.message }
    }
  }
  

  static async getKwhUsed(sessionId) {
    try {
      const response = await ApiService.get(API_CONFIG.ENDPOINTS.GET_ENERGY_USED(sessionId))
      return response.kwhUsed || 0
    } catch (error) {
      console.error('Failed to get kWh used:', error)

      const session = this.getActiveSession()
      if (session && session.startTime) {
        const elapsed = Date.now() - new Date(session.startTime).getTime()
        const minutes = elapsed / (1000 * 60)
        return minutes * 0.5
      }

      return 0
    }
  }
  

  static calculateRefund(planData, actualUsage) {
    const { rate, walletDeduction, durationMin } = planData
    const { kwhUsed, minutesUsed } = actualUsage
    
    const actualCost = kwhUsed * rate
    
    const refundAmount = Math.max(0, walletDeduction - actualCost)
    
    return {
      actualCost: actualCost.toFixed(2),
      refundAmount: refundAmount.toFixed(2),
      kwhUsed,
      minutesUsed
    }
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

  static clearSession() {
    this.activeSession = null
    CacheService.clearSessionData?.() || sessionStorage.removeItem(APP_CONFIG.CACHE.SESSION_KEY)
  }
  
  // Method to update session data locally (since no WebSocket)
  static updateSessionLocally(updates) {
    if (this.activeSession) {
      this.activeSession = {
        ...this.activeSession,
        ...updates
      }
      sessionStorage.setItem('activeSession', JSON.stringify(this.activeSession))
    }
  }
  
  // Simulate session progress (for demo purposes without WebSocket)
  static simulateProgress(durationMin) {
    const totalSeconds = durationMin * 60
    const startTime = new Date(this.activeSession?.startTime || Date.now())
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000)
    const percentage = Math.min(100, (elapsed / totalSeconds) * 100)
    
    return {
      elapsed,
      percentage,
      remaining: Math.max(0, totalSeconds - elapsed)
    }
  }

}

export default SessionService