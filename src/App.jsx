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


EmailService.init()

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
      
      { path: '/charging-session', element: <SessionFlow  /> },
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




// import TermsPage from './pages/TermsPage' // import the new page

// const router = createBrowserRouter([
//   { path: '/', element: <SplashScreen /> },
//   { path: '/splash/:ocppId', element: <SplashScreen /> },
//   { path: '/login', element: <Login /> },
//   { path: '/login/:ocppId', element: <Login /> },

//   { element: <AuthGuard />,
//     children: [
//       { path: '/dashboard', element: <Dashboard /> },

//       { path: '/config-charging', element: <ChargingFlow />,
//         children: [
//           { path: 'receipt',
//             lazy: async () => {
//               const { default: Receipt } = await import('./pages/Receipt')
//               return { Component: Receipt }
//             }
//           }
//         ]
//       },

//       { path: '/charging-session', element: <ChargingSession /> },
//       { path: '/invoice', element: <Invoice /> },
//       { path: '/thank-you', element: <ThankYou /> },

//       // ✅ Add Terms & Conditions route
//       { path: '/terms', element: <TermsPage /> }
//     ]
//   }
// ], {
//   future: {
//     v7_startTransition: true,
//     v7_relativeSplatPath: true
//   }
// })
