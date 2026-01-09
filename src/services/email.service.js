import emailjs from "@emailjs/browser";
import API_CONFIG from "../config/api.config";

class EmailService {
  static isInitialized = false;

  // 1. Init EmailJS
  static init() {
    if (this.isInitialized) return;

    const publicKey = API_CONFIG.EMAIL_CONFIG?.PUBLIC_KEY;
    if (!publicKey) {
      console.warn("❌ EmailJS Public Key सापडली नाही");
      return;
    }

    emailjs.init(publicKey);
    this.isInitialized = true;
    console.log("✅ EmailJS Initialized");
  }

  // 2. Date format
  static formatDate(dateString) {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  // 3. Duration format
  static formatDuration(minutes) {
    const mins = Number(minutes) || 0;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m} minutes`;
  }

  // 4. Email validation
  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // 5. Config available check
  static isAvailable() {
    const c = API_CONFIG.EMAIL_CONFIG;
    return !!(c?.SERVICE_ID && c?.TEMPLATE_ID && c?.PUBLIC_KEY);
  }

  // 6. Send Invoice Email
  static async sendInvoiceEmail(invoiceData) {
    if (!this.isInitialized) this.init();

    if (!this.isAvailable()) {
      return { success: false, error: "EmailJS config missing" };
    }

    if (!invoiceData?.userEmail || !this.isValidEmail(invoiceData.userEmail)) {
      return { success: false, error: "Invalid email address" };
    }

    const templateParams = {
      to_email: invoiceData.userEmail, // 🔥 EmailJS मध्ये आवश्यक
      user_name: invoiceData.userName || "Customer",

      session_id: invoiceData.sessionId || "N/A",
      receipt_id: invoiceData.receiptId || "N/A",
      completed_at: this.formatDate(invoiceData.completedAt),

      station_name: invoiceData.stationName || "Bentork EV Station",
      charger_type: invoiceData.chargerType || "N/A",
      duration: this.formatDuration(invoiceData.duration),
      energy_used: Number(invoiceData.energyUsed || 0).toFixed(2),
      rate: Number(invoiceData.rate || 0).toFixed(2),

      payment_method: invoiceData.paymentMethod || "Wallet",
      transaction_id: invoiceData.transactionId || "N/A",
      total_cost: Number(invoiceData.totalCost || 0).toFixed(2),
    };

    try {
      const res = await emailjs.send(
        API_CONFIG.EMAIL_CONFIG.SERVICE_ID,
        API_CONFIG.EMAIL_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log("✅ Email Sent:", res.text);
      return { success: true };
    } catch (err) {
      console.error("❌ Email Failed:", err);
      return {
        success: false,
        error: err?.text || err?.message || "Email failed",
      };
    }
  }
}

export default EmailService;
