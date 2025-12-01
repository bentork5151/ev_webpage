import ApiService from './api.service'
import API_CONFIG from '../config/api.config'
import APP_CONFIG from '../config/app.config'

class PaymentService {
  // static razorpayInstance = null
  

  static initializeRazorpay() {
    return new Promise((resolve) => {

      if (window.Razorpay) {
        resolve(true)
        return
      }

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
  

  // static calculatePaymentDetails(baseAmount) {
  //   const amount = parseFloat(baseAmount)
  //   const gst = amount * APP_CONFIG.TAX.GST_RATE
  //   const sxt = amount * APP_CONFIG.TAX.SXT_RATE
  //   const total = amount + gst + sxt
    
  //   return {
  //     baseAmount: amount.toFixed(2),
  //     gst: gst.toFixed(2),
  //     sxt: sxt.toFixed(2),
  //     total: total.toFixed(2),
  //     totalInPaise: Math.round(total * 100)
  //   }
  // }
  

  static async createOrder(amount) {
    try {
      const response = await ApiService.post(API_CONFIG.ENDPOINTS.CREATE_ORDER, {
        amount: amount,
      })

      console.log('Create order response:', response)

      const orderData = typeof response === 'string' ? JSON.parse(response) : response
      
      return {
        success: true,
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        orderData: orderData
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
      description: 'Wallet Recharge',
      prefill: {
        email: userDetails.email,
        name: userDetails.name || '',
        contact: userDetails.mobile || ''
      },
      theme: {
        color: '#1976d2'
      },
      handler: async function(response) {

        console.log('Razorpay response:', response)
        try{
          const verifyResult = await PaymentService.verifyPayment(response, userDetails.id)

          if (verifyResult.success) {
            onSuccess({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              ...verifyResult
            })
          } else {
            onFailure(verifyResult.error || 'Payment verification failed')
          }

        } catch (error){
          onFailure(error.message || 'Payment verification failed')
        }
      },
      modal: {
        ondismiss: function() {
          onFailure('Payment cancelled by user')
        }
      }
    }
    
    try{
      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error('RazorPay open error: ',error)
      onFailure('Failed to open RazorPay gateway')
    }
  }
  

  static async verifyPayment(paymentResponse, userId) {
    try {
      const response = await ApiService.post(
        API_CONFIG.ENDPOINTS.VERIFY_PAYMENT,
        {
          order_id: paymentResponse.razorpay_order_id,
          payment_id: paymentResponse.razorpay_payment_id,
          signature: paymentResponse.razorpay_signature,
          user_id: String(userId)
        }
      )
      
      console.log('Verify payment response:', response)

      return {
        success: true,
        message: response.message || 'Payment successful',
        walletAmount: response.walletAmount
      }
      // if (verificationResponse.verified) {
      //   onSuccess({
      //     paymentId: paymentResponse.razorpay_payment_id,
      //     orderId: paymentResponse.razorpay_order_id,
      //     ...verificationResponse
      //   })
      // } else {
      //   onFailure(verificationResponse.message || 'Payment verification failed')
      // }
    } catch (error) {
      console.error('Payment verification error:', error)
      // onFailure(error.message || 'Payment verification failed')
      return {
        success: false,
        error: error.message || 'Payment verification failed'
      }
    }
  }
  

  // static async processRefund(sessionId, amount, reason) {
  //   try {
  //     const response = await ApiService.post(API_CONFIG.ENDPOINTS.PROCESS_REFUND, {
  //       sessionId,
  //       amount,
  //       reason
  //     })
      
  //     return {
  //       success: true,
  //       refundId: response.refundId,
  //       amount: response.amount
  //     }
  //   } catch (error) {
  //     console.error('Refund processing error:', error)
  //     return {
  //       success: false,
  //       error: error.message || 'Failed to process refund'
  //     }
  //   }
  // }
}

export default PaymentService