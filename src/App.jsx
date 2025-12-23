import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import AuthGuard from './guards/AuthGuard'

import SplashScreen from './pages/SplashScreen'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ChargingFlow from './wrapper/ChargingFlow'
import ChargingSession from './pages/ChargingSession'
import Invoice from './pages/Invoice'
import ThankYou from './pages/ThankYou'


const router = createBrowserRouter([

  { path: '/', element: <SplashScreen /> },
  { path: '/splash/:ocppId', element: <SplashScreen /> },
  { path: '/login', element: <Login /> },
  { path: '/login/:ocppId', element: <Login /> },
  { element: <AuthGuard />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },

      { path: '/config-charging', element: <ChargingFlow />,
        children: [
          { path: 'receipt',
            lazy: async () => {
              const { default: Receipt } = await import('./pages/Receipt')
              return { Component: Receipt }
            }
          }
        ]
      },
      
      { path: '/charging-session', element: <ChargingSession /> },
      { path: '/invoice', element: <Invoice /> },
      { path: '/thank-you', element: <ThankYou /> }
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
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
  )
}

export default App




