import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Email, Download } from "@mui/icons-material";
import { CircularProgress, Alert, Snackbar } from "@mui/material"
import { useAuth } from "../store/AuthContext";
import CacheService from "../services/cache.service";
import EmailService from "../services/email.service"
import SessionService from "../services/session.service"
import Logo from "../assets/images/logo-1.png";
import { logError } from "../config/errors.config";
const Invoice = () => {
  const navigate = useNavigate();
  const { user, chargerData } = useAuth();
  const emailSentRef = useRef(false)
  const [sessionData, setSessionData] = useState(null);
  //Static data for testing
  // const [sessionData, setSessionData] = useState({
  //   sessionId: "MOCK-123",
  //   stationName: "Test Station",
  //   chargerType: "DC Fast",
  //   duration: 45,
  //   energyUsed: 25.5,
  //   rate: 15,
  //   finalCost: 382.50,
  //   paymentMethod: "Wallet",
  //   transactionId: "TXN-999",
  //   endTime: new Date().toISOString()
  // });
  // Dynamic Data Extraction with Formatting
  const stationName = sessionData.stationName || chargerData?.stationName || chargerData?.name || chargerData?.chargerName || chargerData?.charger_name || "N/A"
  const chargerType = sessionData.chargerType || chargerData?.chargerType || "N/A"
  const durationMin = sessionData.duration || 0

  const energyVal = Number(sessionData.energyUsed || 0)
  const rateVal = Number(sessionData.rate || sessionData.plan?.rate || 0)
  const totalCostVal = Number(sessionData.finalCost || sessionData.amountDebited || (energyVal * rateVal))

  const energy = energyVal.toFixed(2)
  const rate = rateVal.toFixed(2)
  const totalCost = totalCostVal.toFixed(2)

  const transactionId = sessionData.transactionId || sessionData.receiptId || sessionData.sessionId || "N/A"
  const paymentMethod = sessionData.paymentMethod || "Wallet"
  const sessionId = sessionData.sessionId || "N/A"
  const completedAt = sessionData.endTime || sessionData.completedAt || new Date().toISOString()

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h > 0) return `${h}h ${m}m`
    return `${m} min`
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    } catch {
      return 'N/A'
    }
  }

  const Row = ({ label, value, highlight, className }) => (
    <div className={`row ${highlight ? 'highlight' : ''} ${className || ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )

  return (
    <div className="invoice-page page-enter-anim">
      <style>{`
       /* ================== RESET ================== */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #212121;
  font-family: "Inter", "Roboto", sans-serif;
}

/* ================== PAGE ================== */
.invoice-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1e1e1e, #121212);
  padding-bottom: 120px;
  color: #fff;
  width: 100%;
  overflow-x: hidden;
}

/* ===== INVOICE ROW ===== */
.invoice-row {
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.invoice-row h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}

/* SESSION COMPLETED PILL */
.session-pill {
  padding: 4px 12px;
  border-radius: 20px;
  background: #303030;
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}


/* ================== HEADER ================== */
.invoice-header {
  background: linear-gradient(180deg, #1c1c1c 0%, #141414 100%);
  padding: 40px 20px;
  text-align: center;
  width: 100%;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

/* LOGO */
.header-logo {
  width: 140px;
  max-width: 60%;
  height: auto;
  object-fit: contain;
}

.invoice-header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.invoice-header p {
  margin-top: 6px;
  font-size: 13px;
  opacity: 0.7;
}

.sub-heading {
  font-size: 18px;
  font-weight: 600;
}

/* ================== EMAIL STATUS ================== */
.email-status {
  margin: 0 16px 16px;
  padding: 12px 16px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.email-status.sending {
  background: #1f3a5f;
  color: #dbe9ff;
}

.email-status.sent {
  background: #1f3d2b;
  color: #9df3c4;
}

.email-status.error {
  background: #3b1f1f;
  color: #ffbdbd;
}

.email-status button {
  margin-left: auto;
  background: #c62828;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}

/* ================== CARD ================== */
.card, .card-1 {
  margin: 16px;
  border-radius: 18px;
  background-color: #212121;
  gap: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 0 1px rgba(85, 85, 85, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card h2, .card-1 h2 {
  padding: 16px;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* ================== ROW ================== */
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  font-size: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.row span:first-child {
  color: rgba(255, 255, 255, 0.6);
}

.row span:last-child {
  font-weight: 500;
  color: #fff;
  text-align: right;
}

/* ================== HIGHLIGHTS ================== */
.highlight {
  background: rgba(255, 255, 255, 0.03);
  font-weight: 700;
  color: #FFFFFF;
}

.highlight-green {
  background: rgba(57, 226, 155, 0.1);
  font-weight: 600;
}

.highlight-green span:last-child {
  color: var(--color-primary-container);
  font-size: 16px;
  font-weight: 700;
}

/* ================== PAID ================== */
.paid {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary-container) !important;
  font-weight: 600;
}

.paid svg {
  font-size: 18px;
}

/* ================== BOTTOM ACTION ================== */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 24px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: linear-gradient(0deg, #111 20%, transparent 100%);
  display: flex;
  justify-content: center;
  z-index: 100;
}

.bottom-action button {
  width: 100%;
  max-width: 500px;
  padding: 16px;
  border-radius: 16px;
  border: none;
  background: #ffffff;
  color: #000;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}

.bottom-action button:active {
  transform: scale(0.98);
}

/* ================== RESPONSIVE BREAKPOINTS ================== */
@media (min-width: 600px) {
  .card, .card-1 {
    margin: 24px auto;
    max-width: 500px;
  }
}

@media (min-width: 900px) {
  .card, .card-1 {
    max-width: 600px;
  }
  
  .invoice-header {
    height: 160px;
  }
}

      `}</style>

      {/* HEADER */}
      <div className="invoice-header">
        <img
          src={Logo}
          alt="Bentork Logo"
          className="header-logo"
        />
      </div>

      {/* Email Status Removed */}
      <div className="invoice-row">
        <h1>Invoice</h1>
        <span className="session-pill">Session Completed</span>
      </div>

      {/* CHARGING DETAILS */}
      <div className="card">
        <h2 className="sub-heading">Charging Details</h2>

        <Row label="Session ID" value={`#${sessionId}`} />
        <Row label="Station Name" value={stationName} />
        <Row label="Charger Type" value={chargerType} />
        <Row label="Duration" value={formatDuration(durationMin)} />
        <Row label="Energy Delivered" value={`${energy} kWh`} />
        <Row label="Rate per kWh" value={`₹${rate}`} />
        <Row label="Total Energy Cost" value={`₹${totalCost}`} highlight />
      </div>

      {/* PAYMENT DETAILS */}
      <div className="card-1">
        <h2>Payment Details</h2>

        <Row label="Payment Method" value={paymentMethod} />



        <div className="row">
          <span>Status</span>
          <span className="paid">
            <CheckCircle />
            PAID
          </span>
        </div>

        <div className="row highlight-green">
          <span>Total Amount Paid</span>
          <span>₹{Number(totalCost).toFixed(2)}</span>
        </div>
      </div>

      {/* BOTTOM BUTTON */}
      <div className="bottom-action">
        <button onClick={handleDone}>
          Done
        </button>
      </div>
    </div>
  );
};

export default Invoice;
