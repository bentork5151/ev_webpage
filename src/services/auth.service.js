import ApiService from './api.service'
import CacheService from './cache.service'
import API_CONFIG from '../config/api.config'
import { parseJwtToken } from '../utils/jwtHelper'

class AuthService {

  static async login(email, password) {
    try {
      console.log('Attempting login for:', email)
      const response = await ApiService.post(API_CONFIG.ENDPOINTS.LOGIN, {
        emailOrMobile: email,
        password: password
      })
      console.log('Login response:', response)

      if (response.token) {
        const tokenData = parseJwtToken(response.token)
        console.log('Parsed token data:', tokenData)
        
        const user = await ApiService.get(API_CONFIG.ENDPOINTS.GET_USER_BY_EMAIL, {email: email})

        if(user){
          user = {
            email: user.email,
            name: user?.name  || email,
          }
        }

        CacheService.saveUserCredentials(user, response.token)
        
        return {
          success: true,
          user: user,
          token: response.token
        }
      }
      console.log("error")
      throw new Error('Invalid response from server')
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Login failed'
      }
    }
  }
  

  static async verifyCachedCredentials() {
    const cachedData = CacheService.getCachedUser()
    
    if (!cachedData) {
      return { success: false, message: 'No cached credentials' }
    }
    
    if (cachedData.token) {
      const tokenData = parseJwtToken(cachedData.token)
      if (tokenData) {
        return {
          success: true,
          user: cachedData.user,
          token: cachedData.token
        }
      }
    }
    
    CacheService.clearCache()
    return { success: false, message: 'Token expired' }
  }
  

  static logout() {
    CacheService.clearCache()
    window.location.href = '/login'
  }
  

  static getCurrentUser() {
    const cachedData = CacheService.getCachedUser()
    return cachedData?.user || null
  }
  

  static isAuthenticated() {
    return !!CacheService.getToken()
  }
}

export default AuthService