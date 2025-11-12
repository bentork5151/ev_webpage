const APP_CONFIG = {
  APP_NAME: 'Bentork',
  VERSION: '1.0.0',
  

  CACHE: {
    USER_KEY: 'ev_user_data',
    TOKEN_KEY: 'ev_auth_token',
    CHARGER_KEY: 'ev_charger_data',
    EXPIRY_DAYS: 7,
  },
  

  SESSION: {
    UPDATE_INTERVAL: 5000,
    KWH_UPDATE_INTERVAL: 300000,
  },
  

  TAX: {
    GST_RATE: 0.18, // 18%
    SXT_RATE: 0.18, // 18%
  },
  

  UI: {
    SPLASH_DURATION: 3000,
    TOAST_DURATION: 4000,
  },
}

export default APP_CONFIG