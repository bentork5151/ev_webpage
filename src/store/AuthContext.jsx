import React, { createContext, useContext, useState, useEffect } from 'react'
import AuthService from '../services/auth.service'
import CacheService from '../services/cache.service'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => { 
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chargerData, setChargerData] = useState(null)
  const [transactionData, setTransactionData] = useState([])
  

  useEffect(() => {
    initializeAuth()
  }, [])
  
  const initializeAuth = async () => {
    try {
      const cachedData = CacheService.getCachedUser()
      if (cachedData) {
        setUser(cachedData.user)
      }
      

      const charger = CacheService.getChargerData()
      if (charger) {
        setChargerData(charger)
      }

      const transactions = CacheService.getTransactionHistory()
      if (transactions) {
          setTransactionData(transactions)
      }

    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const login = async (emailOrCredential, password = null) => {
    try{
      let result;

      if(password) {
        result = await AuthService.login(emailOrCredential, password)
      } else {
        result = await AuthService.googleLogin(emailOrCredential)
      }

      if (result && result.success) {
        setUser(result.user)
        return result
      }

      return result || { success: false, error: 'Login failed' }
    } catch (error) {
        console.error('Login error in context:', error)
        return {
        success: false,
        error: error.message || 'Login failed'
      }
      }
  }
  
  const logout = () => {
    setUser(null)
    setChargerData(null)
    setTransactionData([])
    AuthService.logout()
  }
  
  const updateChargerData = (data) => {
    setChargerData(data)
    CacheService.saveChargerData(data)
  }

  const transactionHistory = (data) => {
    setTransactionData(data || [])
    CacheService.saveTransactionHistory(data || [])
  }
  
  const value = {
    user,
    chargerData,
    loading,
    isAuthenticated: !!user,
    transactionData,
    login,
    logout,
    updateChargerData,
    transactionHistory
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}