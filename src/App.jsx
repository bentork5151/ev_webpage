import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import AuthGuard from './guards/AuthGuard'

import EmailService from './services/email.service'

import SplashScreen from './pages/SplashScreen'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ChargingFlow from './wrapper/ChargingFlow'
import SessionFlow from './wrapper/SessionFlow'
import Invoice from './pages/Invoice'
import ThankYou from './pages/ThankYou'
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy.jsx";
import About from "./pages/about.jsx";
import AnimatedLayout from './wrapper/AnimatedLayout';

import ErrorPage from './pages/ErrorPage'

EmailService.init()

const router = createBrowserRouter([

  {
    element: <AnimatedLayout />,
    children: [
      { path: '/', element: <SplashScreen /> },
      { path: '/splash/:ocppId', element: <SplashScreen /> },
      { path: '/login', element: <Login /> },
      { path: '/login/:ocppId', element: <Login /> },
      { path: '/terms', element: <Terms /> },
      { path: '/privacy', element: <Privacy /> },
      { path: '/about', element: <About /> },
      {
        element: <AuthGuard />,
        errorElement: <ErrorPage />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },

          {
            path: '/config-charging', element: <ChargingFlow />,
            children: [
              {
                path: 'receipt',
                lazy: async () => {
                  const { default: Receipt } = await import('./pages/Receipt')
                  return { Component: Receipt }
                }
              }
            ]
          },

          { path: '/charging-session', element: <SessionFlow /> },
          { path: '/invoice', element: <Invoice /> },
          { path: '/thank-you', element: <ThankYou /> },

        ]
      },
      {
        path: '*',
        element: <ErrorPage />
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
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
