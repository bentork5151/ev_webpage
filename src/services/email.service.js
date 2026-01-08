import emailjs from "@emailjs/browser";
import API_CONFIG from "../config/api.config";

class EmailService {
  static isInitialized = false;

  static init() {
    if (this.isInitialized) return;

    const publicKey = API_CONFIG.EMAIL_CONFIG?.PUBLIC_KEY;
    if (!publicKey) {
      console.warn("EmailJS public key not configured");
      return;
    }

    try {
      emailjs.init(publicKey);
      this.isInitialized = true;
      console.log("EmailJS initialized");
    } catch (error) {
      console.error("EmailJS init failed:", error);
    }
  }

  static formatDate(dateString) {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  static formatDuration(minutes) {
    const mins = Number(minutes) || 0;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m} minutes`;
  }

  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static isAvailable() {
    const config = API_CONFIG.EMAIL_CONFIG;
    return !!(
      config?.SERVICE_ID &&
      config?.TEMPLATE_ID &&
      config?.PUBLIC_KEY
    );
  }

  static async sendInvoiceEmail(invoiceData) {
    if (!this.isInitialized) this.init();

    if (!this.isAvailable()) {
      return { success: false, error: "Email service not configured" };
    }

    if (!invoiceData?.userEmail || !this.isValidEmail(invoiceData.userEmail)) {
      return { success: false, error: "Invalid email address" };
    }

    const templateParams = {
      to_email: invoiceData.userEmail,
      user_name: invoiceData.userName || "Valued Customer",

      session_id: invoiceData.sessionId || "N/A",
      receipt_id: invoiceData.receiptId || "N/A",
      station_name: invoiceData.stationName || "Bentork EV Station",
      charger_type: invoiceData.chargerType || "N/A",
      duration: this.formatDuration(invoiceData.duration),
      energy_used: Number(invoiceData.energyUsed || 0).toFixed(2),
      rate: Number(invoiceData.rate || 0).toFixed(2),

      payment_method: invoiceData.paymentMethod || "Wallet",
      transaction_id: invoiceData.transactionId || "N/A",
      total_cost: Number(invoiceData.totalCost || 0).toFixed(2),
      completed_at: this.formatDate(invoiceData.completedAt),
    };

    try {
      const response = await emailjs.send(
        API_CONFIG.EMAIL_CONFIG.SERVICE_ID,
        API_CONFIG.EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        API_CONFIG.EMAIL_CONFIG.PUBLIC_KEY
      );

      return { success: true, messageId: response.text };
    } catch (error) {
      return {
        success: false,
        error: error?.text || error?.message || "Email failed",
      };
    }
  }
}

export default EmailService;
