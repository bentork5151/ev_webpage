import React from 'react'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { AuthProvider } from './store/AuthContext'
import AuthGuard from './guards/AuthGuard'

import SplashScreen from './pages/SplashScreen'
import Login from './pages/Login'
import ConfigCharging from './pages/ConfigCharging'
import Receipt from './pages/Receipt'

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
    
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <AuthProvider>
//         <RouterProvider router={router} />
//         <Route path="/" element={<SplashScreen />} />
//         <Route path="/home" element={<HomeScreen />} />
//         <Route path="/charging-session" element={<ChargingSession />} />
// <Route path="/payment-status" element={<PaymentStatus />} />

//       </AuthProvider>
//     </ThemeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App




