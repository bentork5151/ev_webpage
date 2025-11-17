const API_CONFIG = {

  BASE_URL: '',
  

  ENDPOINTS: {
    // LOGIN: '/api/user/login',
    LOGIN: '/api/user/google-login-success',
    VERIFY_TOKEN: '/user/verify',
    REFRESH_TOKEN: '/user/refresh',
    GET_USER_BY_EMAIL: (email) => `/user/byemail/${email}`,


    GET_USER_TRANSACTION: (id) => `/api/user/transaction/{id}`,
    

    GET_CHARGER: (ocppId) => `/api/user/charger/ocpp/${ocppId}`,
    

    GET_ALL_PLANS: '/api/user/plans/available',
    

    START_SESSION: '/sessions/start',
    STOP_SESSION: '/sessions/stop',
    GET_SESSION_STATUS: (sessionId) => `/sessions/${sessionId}/status`,
    GET_KWH_USED: '/session/kwh/used',
    

    CREATE_ORDER: '/api/razorpay/create-order',
    VERIFY_PAYMENT: '/api/razorpay/verify-payment',
    PROCESS_REFUND: '/api/razorpay/refund',
  },
  
  TIMEOUT: 30000,
  
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}

export const WS_CONFIG = {
  URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8080',
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 3000,
}

// export const GOOGLE_CONFIG = {
//   CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_DEFAULT_CLIENT_ID.apps.googleusercontent.com'
// }

export default API_CONFIG