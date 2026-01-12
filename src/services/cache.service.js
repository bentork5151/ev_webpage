import dayjs from 'dayjs'
import CryptoJS from 'crypto-js'
import APP_CONFIG from '../config/app.config'

class CacheService {

  static ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'ev-charging-secret-key-default-2024'


  static encrypt(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.ENCRYPTION_KEY).toString()
  }


  static decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY)
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    } catch (error) {
      console.error('Decryption failed:', error)
      return null
    }
  }


  static saveUserCredentials(userData, token) {
    const dataToSave = {
      user: userData,
      token: token,
      timestamp: dayjs().toISOString(),
      expiry: dayjs().add(APP_CONFIG.CACHE.EXPIRY_DAYS, 'day').toISOString()
    }


    const encryptedData = this.encrypt(dataToSave)
    localStorage.setItem(APP_CONFIG.CACHE.USER_KEY, encryptedData)


    sessionStorage.setItem(APP_CONFIG.CACHE.TOKEN_KEY, token)
  }


  static getCachedUser() {
    try {
      const encryptedData = localStorage.getItem(APP_CONFIG.CACHE.USER_KEY)
      if (!encryptedData) return null

      const decryptedData = this.decrypt(encryptedData)
      if (!decryptedData) return null

      const expiryDate = dayjs(decryptedData.expiry)
      if (dayjs().isAfter(expiryDate)) {
        this.clearCache()
        return null
      }
      console.log(decryptedData)
      return decryptedData
    } catch (error) {
      console.error('Error getting cached user:', error)
      return null
    }
  }


  static getToken() {
    let token = sessionStorage.getItem(APP_CONFIG.CACHE.TOKEN_KEY)

    if (!token) {
      const cachedData = this.getCachedUser()
      if (cachedData?.token) {
        token = cachedData.token
        sessionStorage.setItem(APP_CONFIG.CACHE.TOKEN_KEY, token)
      }
    }
    return token
  }


  static clearCache() {
    localStorage.removeItem(APP_CONFIG.CACHE.USER_KEY)
    localStorage.removeItem(APP_CONFIG.CACHE.CHARGER_KEY)
    sessionStorage.clear()
  }


  static saveChargerData(chargerData) {
    sessionStorage.setItem(APP_CONFIG.CACHE.CHARGER_KEY, JSON.stringify(chargerData))
  }


  static getChargerData() {
    const data = sessionStorage.getItem(APP_CONFIG.CACHE.CHARGER_KEY)
    return data ? JSON.parse(data) : null
  }

  static saveTransactionHistory(transactionData) {
    sessionStorage.setItem(APP_CONFIG.CACHE.TRANSACTION_KEY, JSON.stringify(transactionData))
  }

  static getTransactionHistory() {
    const data = sessionStorage.getItem(APP_CONFIG.CACHE.TRANSACTION_KEY)
    try {
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error parsing transaction history:', error)
      return []
    }
  }

  static savePlanData(planData) {
    sessionStorage.setItem(APP_CONFIG.CACHE.PLAN_KEY, JSON.stringify(planData))
  }


  static getPlanData() {
    const data = sessionStorage.getItem(APP_CONFIG.CACHE.PLAN_KEY)
    return data ? JSON.parse(data) : null
  }

  static clearPlanData() {
    sessionStorage.removeItem(APP_CONFIG.CACHE.PLAN_KEY)
  }

  static saveSessionData(sessionData) {
    if (!sessionData) {
      return null
    }

    const dataToSave = {
      ...sessionData,
      savedAt: new Date().toISOString()
    }

    localStorage.setItem(APP_CONFIG.CACHE.SESSION_KEY, JSON.stringify(dataToSave))
    sessionStorage.setItem(APP_CONFIG.CACHE.SESSION_KEY, JSON.stringify(dataToSave))
  }

  static getSessionData() {
    try {
      let data = sessionStorage.getItem(APP_CONFIG.CACHE.SESSION_KEY)

      if (!data) {
        data = localStorage.getItem(APP_CONFIG.CACHE.SESSION_KEY)

        if (data) {
          sessionStorage.getItem(APP_CONFIG.CACHE.SESSION_KEY)
        }
      }

      if (!data) {
        return null
      }

      const parse = JSON.parse(data)

      if (parse.savedAt) {
        const savedTime = new Date(parse.savedAt).getTime()
        const now = Date.now()
        const maxAge = 24 * 60 * 60 * 1000 // 24 hours

        if (now - savedTime > maxAge) {
          this.clearSessionData()
          return null
        }
      }

      return parse
    } catch (error) {
      console.error('Error parsing Session Data:', error)
      return null
    }
  }

  static updateSessionData(updates) {
    const current = this.getSessionData()
    if (!current) {
      return
    }

    const updated = {
      ...current,
      ...updates,
      updatedAT: new Date().toISOString()
    }

    this.saveSessionData(updated)
    return updated
  }

  static clearSessionData() {
    localStorage.removeItem(APP_CONFIG.CACHE.SESSION_KEY)
    sessionStorage.removeItem(APP_CONFIG.CACHE.SESSION_KEY)
  }

  static hasActiveSession() {
    const session = this.getSessionData()
    if (!session) {
      return false
    }

    const activeStatuses = ['ACTIVE', 'INITIATED']
    return activeStatuses.includes(String(session.status).toUpperCase())
  }

  static saveSessionTimer(timeData) {
    sessionStorage.setItem(APP_CONFIG.SESSION.SESSION_TIMER, JSON.stringify({
      ...timeData,
      savesAt: Date.now()
    }))
  }

  static getSessionTimer() {
    try {
      const data = sessionStorage.getItem(APP_CONFIG.SESSION.SESSION_TIMER)
      if (!data) {
        return null
      }

      const parse = JSON.parse(data)

      const elapsedSincesSave = Math.floor((Date.now() - parse.savesAt) / 1000)

      return {
        ...parse,
        timeElapsed: parse.timeElapsed + elapsedSincesSave
      }
    } catch (error) {
      return null
    }
  }

  static clearSessionTimer() {
    sessionStorage.removeItem(APP_CONFIG.SESSION.SESSION_TIMER)
  }

  static saveNotificationPreference(enabled) {
    localStorage.setItem(APP_CONFIG.SESSION.NOTIFICATION_PREFERENCE, JSON.stringify(enabled))
  }

  static getNotificationPreference() {
    try {
      const data = localStorage.getItem(APP_CONFIG.SESSION.NOTIFICATION_PREFERENCE)
      return data !== null ? JSON.parse(data) : true
    } catch (error) {
      return true
    }
  }

  static saveOnboardingStatus(status) {
    localStorage.setItem(APP_CONFIG.CACHE.ONBOARDING_KEY, JSON.stringify(status))
  }

  static getOnboardingStatus() {
    const data = localStorage.getItem(APP_CONFIG.CACHE.ONBOARDING_KEY)
    return data ? JSON.parse(data) : false
  }

}

export default CacheService