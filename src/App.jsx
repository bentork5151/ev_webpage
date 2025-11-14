import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { AuthProvider } from './store/AuthContext'
import AuthGuard from './guards/AuthGuard'

import SplashScreen from './pages/SplashScreen'
import Login from './pages/Login'
// import ConfigCharging from './pages/ConfigCharging'
// import Receipt from './pages/Receipt'

import ChargingSession from "./pages/ChargingSession";

import PaymentStatus from './pages/PaymentStatus'
import HomeScreen from "./pages/HomeScreen";


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <SplashScreen />
  },
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}


export default App




