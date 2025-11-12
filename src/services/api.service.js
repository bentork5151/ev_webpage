import axios from 'axios'
import API_CONFIG from '../config/api.config'
import CacheService from './cache.service'


const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
})


apiClient.interceptors.request.use(
  (config) => {
    const token = CacheService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    

    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url,
      data: config.data
    })
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)


apiClient.interceptors.response.use(
  (response) => {

    if (import.meta.env.DEV) {
      console.log(`API Response:`, response.data)
    }
    return response.data
  },
  async (error) => {
    const originalRequest = error.config
    

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      

      try {
        const refreshToken = CacheService.getToken()
        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH_TOKEN}`,
            { token: refreshToken }
          )
          
          const newToken = response.data.token
          CacheService.saveUserCredentials(response.data.user, newToken)
          

          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        CacheService.clearCache()
        window.location.href = '/login'
      }
    }
    

    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
    
    if (import.meta.env.DEV) {
      console.error(`API Error:`, errorMessage)
    }
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    })
  }
)


class ApiService {
  static async request(method, endpoint, data = null, options = {}) {
    const config = {
      method,
      url: endpoint,
      ...options
    }
    
    if (data) {
      if (method === 'get') {
        config.params = data
      } else {
        config.data = data
      }
    }
    

    let lastError
    for (let i = 0; i < API_CONFIG.RETRY_ATTEMPTS; i++) {
      try {
        const response = await apiClient(config)
        return response
      } catch (error) {
        lastError = error
        

        if (error.status >= 400 && error.status < 500) {
          throw error
        }
        

        if (i < API_CONFIG.RETRY_ATTEMPTS - 1) {
          await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * (i + 1)))
        }
      }
    }
    
    throw lastError
  }
  

  static get(endpoint, params, options) {
    return this.request('get', endpoint, params, options)
  }
  
  static post(endpoint, data, options) {
    return this.request('post', endpoint, data, options)
  }
  
  static put(endpoint, data, options) {
    return this.request('put', endpoint, data, options)
  }
  
  static delete(endpoint, options) {
    return this.request('delete', endpoint, null, options)
  }
}

export default ApiService