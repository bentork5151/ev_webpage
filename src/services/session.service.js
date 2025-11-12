import ApiService from './api.service'
import API_CONFIG from '../config/api.config'
import wsService from './websocket.service'

class SessionService {
  static activeSession = null
  
  static async startSession(chargerId, planId, paymentId) {
    try {
      const response = await ApiService.post(API_CONFIG.ENDPOINTS.START_SESSION, {
        chargerId,
        planId,
        paymentId
      })
      
      if (response.sessionId) {
        this.activeSession = {
          id: response.sessionId,
          startTime: new Date().toISOString(),
          status: 'ACTIVE',
          ...response
        }
        
        wsService.connect(response.sessionId)
        

        sessionStorage.setItem('activeSession', JSON.stringify(this.activeSession))
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
      const response = await ApiService.post(API_CONFIG.ENDPOINTS.STOP_SESSION, {
        sessionId
      })
      
      wsService.disconnect()
      
      this.activeSession = null
      sessionStorage.removeItem('activeSession')
      
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
      throw error
    }
  }
  

  static async getKwhUsed(sessionId) {
    try {
      const response = await ApiService.get(API_CONFIG.ENDPOINTS.GET_KWH_USED, {
        sessionId
      })
      return response.kwhUsed || 0
    } catch (error) {
      console.error('Failed to get kWh used:', error)
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
      const stored = sessionStorage.getItem('activeSession')
      if (stored) {
        this.activeSession = JSON.parse(stored)
      }
    }
    return this.activeSession
  }
}

export default SessionService