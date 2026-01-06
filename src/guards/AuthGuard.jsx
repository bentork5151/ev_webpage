import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { CircularProgress, Box } from '@mui/material'

const AuthGuard = () => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default AuthGuard