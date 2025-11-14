import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/styles/index.css'

// Razorpay SDK
const script = document.createElement('script')
script.src = 'https://checkout.razorpay.com/v1/checkout.js'
script.async = true
document.body.appendChild(script)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)