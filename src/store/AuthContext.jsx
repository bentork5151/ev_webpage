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
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const login = async (email, password) => {
    const result = await AuthService.login(email, password)
    if (result.success) {
      setUser(result.user)
    }
    return result
  }
  
  const logout = () => {
    setUser(null)
    setChargerData(null)
    AuthService.logout()
  }
  
  const updateChargerData = (data) => {
    setChargerData(data)
    CacheService.saveChargerData(data)
  }
  
  const value = {
    user,
    chargerData,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateChargerData
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}