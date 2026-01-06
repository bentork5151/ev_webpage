import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Email, Download } from "@mui/icons-material";
import { CircularProgress, Alert, Snackbar } from "@mui/material"
import { useAuth } from "../store/AuthContext";
import CacheService from "../services/cache.service";
import EmailService from "../services/email.service"
import SessionService from "../services/session.service"

const Invoice = () => {
  const navigate = useNavigate();
  const { user, chargerData } = useAuth();
  const emailSentRef = useRef(false)
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const [emailStatus, setEmailStatus] = useState({
    sending: false,
    sent: false,
    error: null
  })
  // const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    loadSessionData()
  }, [])

  const loadSessionData = async () => {
    try {
      const stored = CacheService.getSessionData()
      
      if (stored) {
        const parsed = JSON.parse(stored)
        const completionData = parsed.completionData || parsed

        setSessionData(completionData)

        CacheService.clearPlanData()
        SessionService.clearSession()

        if (!emailSentRef.current && user?.email) {
          emailSentRef.current = true
          await sendInvoiceEmail(completionData)
        }
      } else {
        console.warn("No session completion data found")
      }
    } catch (error) {
      console.error("Error loading session data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendInvoiceEmail = async (data) => {
    
    if (!EmailService.isAvailable) {
      console.log('EmailJS not configured, skipping email')
      setEmailStatus({
        sending: false,
        sent: false,
        error: 'Email service not configured'
      })
      return
    }
    
    if (!user.email) {
      console.log('No user email available')
      setEmailStatus({
        sending: false,
        sent: false,
        error: 'User email not available'
      })
      return
    }
    
    setEmailStatus({ sending: true, sent: false, error: null })

    try {
      const invoiceData = {
        userName: user?.name || 'Customer',
        userEmail: user?.email,
        sessionId: data.sessionId,
        receiptId: data.receiptId || data.transactionId,
        stationName: data.stationName || chargerData?.stationName || chargerData?.name || 'N/A',
        chargerType: data.chargerType || chargerData?.chargerType || 'N/A',
        duration: data.duration || 0,
        energyUsed: data.energyUsed || 0,
        rate: data.rate || data.plan?.rate || 0,
        totalCost: data.finalCost || data.amountDebited || 0,
        paymentMethod: data.paymentMethod || 'Wallet',
        transactionId: data.transactionId || data.receiptId || data.sessionId,
        completedAt: data.endTime || new Date().toISOString()
      }

      console.log('Invoice data: ',invoiceData)

      const result = await EmailService.sendInvoiceEmail(invoiceData)

      if (result.success) {
        setEmailStatus({ sending: false, sent: true, error: null })
        // setSnackbar({
        //   open: true,
        //   message: `Invoice sent to ${user?.email}`,
        //   severity: 'success'
        // })
      } else {
        throw new Error(result.error)
      }

    } catch (error) {
      console.error("Failed to send invoice email:", error)
      setEmailStatus({ 
        sending: false, 
        sent: false, 
        error: error.message || 'Failed to send email'
      })
    }
  }

  const handleResendEmail = async () => {
    if (sessionData && user?.email) {
      await sendInvoiceEmail(sessionData)
    }
  }

  const handleDone = () => {
    navigate("/thank-you")
  }

  if (isLoading) {
    return (
      <div className="invoice-loading">
        <CircularProgress sx={{ color: '#7dbb63' }} />
        <p>Loading invoice...</p>
        <style>{`
          .invoice-loading {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            gap: 16px;
          }
        `}</style>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="invoice-page">
        {/* <style>{invoiceStyles}</style> */}
        <div className="invoice-header">
          <h1>Invoice</h1>
          <p>No session data found</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>The session data may have already been processed.</p>
          <button className="done-btn" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const stationName = sessionData.stationName || chargerData?.stationName || chargerData?.name || "N/A"
  const chargerType = sessionData.chargerType || chargerData?.chargerType || "N/A"
  const durationMin = sessionData.duration || 0
  const energy = sessionData.energyUsed || 0
  const rate = sessionData.rate || sessionData.plan?.rate || 0
  const totalCost = sessionData.finalCost || sessionData.amountDebited || (energy * rate)
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
    <div className="invoice-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }


        /* EMAIL STATUS */
  .email-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 16px;
    margin: -24px 16px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
  }

  .email-status.sending {
    background: #1976d2;
    color: #fff;
  }

  .email-status.sent {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .email-status.error {
    background: #ffebee;
    color: #c62828;
  }

  .email-status button {
    background: #c62828;
    color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
  }



        .invoice-page {
          min-height: 100vh;
          background: #f4f4f4;
          font-family: Inter, sans-serif;
          padding-bottom: 120px;
        }

        /* HEADER */
        .invoice-header {
          background: #1f1f1f;
          color: #fff;
          text-align: center;
          padding: 28px 16px 36px;
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
        }

        .header-icon {
          margin-bottom: 16px;
        }

        .invoice-header h1 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Roboto', sans-serif;
        }

        .invoice-header p {
     
          font-size: 12px;
           font-weight: 400;
         opacity: 0.75;
         font-family: 'Roboto', sans-serif;
          color: #fff;
         
        }
          .sub-heading{
          font-size: 18px;
           font-weight: 600;
          }

        /* CARD */
        .card {
          background: #fff;
          margin: 16px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 0 0 1px #e6e6e6;
        }

        .card h2 {
          margin: 0;
          padding: 16px;
          font-size: 18px;
          font-weight: 600;
        }

        .row {
          display: flex;
          justify-content: space-between;
          padding: 14px 16px;
          font-size: 12px;
          border-top: 1px solid #eee;
        }

        .row span:first-child {
          color: #444;
        }

        .row span:last-child {
          font-weight: 500;
        }

        .highlight {
          background: #B1DDFF;
          font-weight: 600;
        }

        .paid {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #63b54f;
          font-weight: 600;
        }

        .paid svg {
          font-size: 18px;
        }

        .highlight-green {
          background: #C0EFB0;
          font-weight: 600;
        }

        /* BOTTOM BUTTON */
        .bottom-action {
          position: fixed;
          bottom: 16px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
        }

        .bottom-action button {
          width: 90%;
          max-width: 420px;
          padding: 14px;
          border-radius: 28px;
          border: none;
          background: #1f1f1f;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
        }

        /* RESPONSIVE */
        @media (min-width: 768px) {
          .card {
            max-width: 600px;
            margin: 16px auto;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="invoice-header">
        <div className="header-icon">
          <CheckCircle sx={{ fontSize: 48, color: '#7dbb63' }} />
        </div>
        <h1>Invoice</h1>
        <p>Session Completed</p>
      </div>

      {emailStatus.sending && (
        <div className="email-status sending">
          <CircularProgress size={16} sx={{ color: '#fff' }} />
          <span>Sending invoice to {user?.email}...</span>
        </div>
      )}
      
      {emailStatus.sent && (
        <div className="email-status sent">
          <Email sx={{ fontSize: 18 }} />
          <span>Invoice sent to {user?.email}</span>
        </div>
      )}

      {emailStatus.error && (
        <div className="email-status error">
          <span>Failed to send email: {emailStatus.error}</span>
          <button onClick={handleResendEmail}>Retry</button>
        </div>
      )}

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
      <div className="card">
        <h2>Payment Details</h2>

        <Row label="Payment Method" value={paymentMethod} />
        <Row label="Transaction ID" value={transactionId} />
        <Row label="Completed At" value={formatDate(completedAt)} />

        <div className="row">
          <span>Status</span>
          <span className="paid">
            <CheckCircle />
            PAID
          </span>
        </div>

        <div className="row highlight-green">
          <span>Total Amount Paid</span>
          <span>₹{NUmber(totalCost).toFixed(2)}</span>
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
