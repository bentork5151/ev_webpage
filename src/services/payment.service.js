import ApiService from './api.service'
import API_CONFIG from '../config/api.config'
import APP_CONFIG from '../config/app.config'

class PaymentService {
  static razorpayInstance = null
  

  static initializeRazorpay() {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }
  

  static calculatePaymentDetails(baseAmount) {
    const amount = parseFloat(baseAmount)
    const gst = amount * APP_CONFIG.TAX.GST_RATE
    const sxt = amount * APP_CONFIG.TAX.SXT_RATE
    const total = amount + gst + sxt
    
    return {
      baseAmount: amount.toFixed(2),
      gst: gst.toFixed(2),
      sxt: sxt.toFixed(2),
      total: total.toFixed(2),
      totalInPaise: Math.round(total * 100)
    }
  }
  

  static async createPaymentOrder(planData, chargerData, userEmail) {
    try {
      const paymentDetails = this.calculatePaymentDetails(planData.walletDeduction)
      
      const orderResponse = await ApiService.post(API_CONFIG.ENDPOINTS.CREATE_ORDER, {
        amount: paymentDetails.totalInPaise,
        planId: planData.id,
        chargerId: chargerData.id,
        userEmail: userEmail,
        paymentDetails: paymentDetails
      })
      
      return {
        success: true,
        orderId: orderResponse.orderId,
        amount: paymentDetails.totalInPaise,
        currency: orderResponse.currency || 'INR',
        paymentDetails: paymentDetails
      }
    } catch (error) {
      console.error('Failed to create payment order:', error)
      return {
        success: false,
        error: error.message || 'Failed to create payment order'
      }
    }
  }
  

  static async processPayment(orderData, userDetails, onSuccess, onFailure) {
    const isLoaded = await this.initializeRazorpay()
    
    if (!isLoaded) {
      onFailure('Failed to load payment gateway')
      return
    }
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: APP_CONFIG.APP_NAME,
      description: 'EV Charging Session',
      prefill: {
        email: userDetails.email,
        name: userDetails.name || '',
        contact: userDetails.phone || ''
      },
      theme: {
        color: '#1976d2'
      },
      handler: async function(response) {

        await PaymentService.verifyPayment(response, onSuccess, onFailure)
      },
      modal: {
        ondismiss: function() {
          onFailure('Payment cancelled by user')
        }
      }
    }
    
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }
  

  static async verifyPayment(paymentResponse, onSuccess, onFailure) {
    try {
      const verificationResponse = await ApiService.post(
        API_CONFIG.ENDPOINTS.VERIFY_PAYMENT,
        {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature
        }
      )
      
      if (verificationResponse.verified) {
        onSuccess({
          paymentId: paymentResponse.razorpay_payment_id,
          orderId: paymentResponse.razorpay_order_id,
          ...verificationResponse
        })
      } else {
        onFailure('Payment verification failed')
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      onFailure(error.message || 'Payment verification failed')
    }
  }
  

  static async processRefund(sessionId, amount, reason) {
    try {
      const response = await ApiService.post(API_CONFIG.ENDPOINTS.PROCESS_REFUND, {
        sessionId,
        amount,
        reason
      })
      
      return {
        success: true,
        refundId: response.refundId,
        amount: response.amount
      }
    } catch (error) {
      console.error('Refund processing error:', error)
      return {
        success: false,
        error: error.message || 'Failed to process refund'
      }
    }
  }
}

export default PaymentService