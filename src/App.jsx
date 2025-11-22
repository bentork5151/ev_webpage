import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './store/AuthContext'
import AuthGuard from './guards/AuthGuard'

import SplashScreen from './pages/SplashScreen'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ConfigCharging from './pages/ConfigCharging'
import Receipt from './pages/Receipt'

import ChargingSession from "./pages/ChargingSession";

import PaymentStatus from './pages/PaymentStatus'
import HomeScreen from "./pages/HomeScreen";


const router = createBrowserRouter([
  {
    path: '/splash/:ocppId',
    element: <SplashScreen />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/login/:ocppId',
    element: <Login />
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/config-charging',
        element: <ConfigCharging />
      },
      {
        path: '/receipt',
        element: <Receipt />
      },
      {
        path: '/charging-session',
        element: <ChargingSession />
      },
      {
        path: '/payment-status',
        element: <PaymentStatus />
      }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
})

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App




