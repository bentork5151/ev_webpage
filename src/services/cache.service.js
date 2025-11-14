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
      
      return decryptedData
    } catch (error) {
      console.error('Error getting cached user:', error)
      return null
    }
  }
  

  static getToken() {
    return sessionStorage.getItem(APP_CONFIG.CACHE.TOKEN_KEY)
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
}

export default CacheService