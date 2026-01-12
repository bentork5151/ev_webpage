// import API_CONFIG from "../config/api.config"
// import ApiService from "./api.service"

// class EmailService {

//     static async sendInvoiceEmail(invoiceData) {
//         try {
//             const payload = {
//                 to: invoiceData.userEmail,
//                 subject: `Charging invoice #${invoiceData.receiptId || invoiceData.sessionId}`,
//                 invoiceData: {
//                     userName: invoiceData.userName,
//                     userEmail: invoiceData.userEmail,
//                     sessionId: invoiceData.sessionId,
//                     receiptId: invoiceData.receiptId,
//                     stationName: invoiceData.stationName,
//                     chargerType: invoiceData.chargerType,
//                     duration: invoiceData.duration,
//                     energyUsed: invoiceData.energyUsed,
//                     rate: invoiceData.rate,
//                     totalCost: invoiceData.totalCost,
//                     paymentMethod: invoiceData.paymentMethod,
//                     transactionId: invoiceData.transactionId,
//                     completedAt: invoiceData.completedAt || new Date().toISOString()
//                 }
//             }

//             console.log('sending email payload: ',payload)

//             const response = await ApiService.post(
//                 API_CONFIG.ENDPOINTS.SEND_INVOICE_EMAIL,
//                 payload
//             )

//             console.log('Invoice email response:', response)

//             return {
//                 success: true,
//                 message: 'Invoice sent successfully'
//             }
//         } catch (error) {
//             console.log('Failed to send invoice email:', error)
//             return {
//                 success: false,
//                 error: error?.message || 'Failed to send invoice email'
//             }
//         }
//     }


//     static async sendReceiptEmail(sessionData, userEmail) {
//         try {
//             const response = await ApiService.post(
//                 API_CONFIG.ENDPOINTS.SEND_RECEIPT_EMAIL,
//                 {
//                 email: userEmail,
//                 sessionId: sessionData.sessionId || sessionData.id,
//                 receiptId: sessionData.receiptId
//                 }
//             )

//             return {
//                 success: true,
//                 data: response
//             }

//             } catch (error) {
//             console.error('Failed to send receipt email:', error)
//             return {
//                 success: false,
//                 error: error?.message || 'Failed to send receipt'
//             }
//         }
//     }
// }

// export default EmailService


import emailjs from '@emailjs/browser'
import API_CONFIG from '../config/api.config'

class EmailService {
  static isInitialized = false


  static init() {
    if (this.isInitialized) return

    const publicKey = API_CONFIG.EMAIL_CONFIG?.PUBLIC_KEY
    if (!publicKey) {
      console.warn('EmailJS public key not configured')
      return
    }

    try {
      emailjs.init(publicKey)
      this.isInitialized = true
      console.log('EmailJS initialized successfully')
    } catch (error) {
      console.error('Failed to initialized EmailJS: ', error)
    }
  }


  static formatDate(dateString) {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    } catch {
      return new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    }
  }


  static formatDuration(minutes) {
    const mins = Number(minutes) || 0
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h > 0) return `${h}h ${m}m`
    return `${m} minutes`
  }


  static async sendInvoiceEmail(invoiceData) {

    if (!this.isInitialized) {
      this.init()
    }

    if (!this.isAvailable()) {
      console.error('EmailJS not properly configured')
      return {
        success: false,
        error: 'Email service not configured'
      }
    }

    if (!invoiceData.userEmail) {
      console.error('No recipient email provided')
      return {
        success: false,
        error: 'No email address provided'
      }
    }

    if (!this.isValidEmail(invoiceData.userEmail)) {
      console.warn('Invalid email format: ', invoiceData.userEmail)
      return {
        success: false,
        error: 'Invalid email address format'
      }
    }

    try {
      const templateParams = {

        to_email: invoiceData.userEmail,
        user_name: invoiceData.userName || 'Valued Customer',

        session_id: invoiceData.sessionId || 'N/A',
        receipt_id: invoiceData.receiptId || invoiceData.sessionId || 'N/A',
        station_name: invoiceData.stationName || 'Bentork EV Station',
        charger_type: invoiceData.chargerType || 'N/A',
        duration: this.formatDuration(invoiceData.duration),
        energy_used: Number(invoiceData.energyUsed || 0).toFixed(2),
        rate: Number(invoiceData.rate || 0).toFixed(2),

        payment_method: invoiceData.paymentMethod || 'Wallet',
        transaction_id: invoiceData.transactionId || invoiceData.receiptId || 'N/A',
        total_cost: Number(invoiceData.totalCost || 0).toFixed(2),
        completed_at: this.formatDate(invoiceData.completedAt)
      }

      console.log('Sending invoice email with params:', templateParams)

      const response = await emailjs.send(
        API_CONFIG.EMAIL_CONFIG.SERVICE_ID,
        API_CONFIG.EMAIL_CONFIG.TEMPLATE_ID,
        templateParams
      )

      console.log('Email sent successfully:', response)

      return {
        success: true,
        messageId: response.text
      }

    } catch (error) {
      console.error('Failed to send invoice email:', error)

      return {
        success: false,
        error: error?.text || error?.message || 'Failed to send email'
      }
    }
  }


  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }


  static isAvailable() {
    const config = API_CONFIG.EMAIL_CONFIG
    const available = !!(
      config?.SERVICE_ID &&
      config?.TEMPLATE_ID &&
      config?.PUBLIC_KEY
    )

    if (!available) {
      console.warn('EmailJS configuration missing: ', {
        hasServiceId: !!config?.SERVICE_ID,
        hasTemplateId: !!config?.TEMPLATE_ID,
        hasPublicKey: !!config?.PUBLIC_KEY
      })
    }

    return available
  }
}

export default EmailService