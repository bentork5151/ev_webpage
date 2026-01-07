import React from 'react'
import { CircularProgress } from '@mui/material'
import { useCharging } from '../store/ChargingContext'

const Receipt = () => {
  const {
    selectedPlan,
    powerValue,
    loading,
    error,
    pricing,
    chargerData,
    isChargerUnavailable,
    hasInsufficientBalance,
    userWalletBalance,
    closeReceipt,
    processPayment
  } = useCharging()

  if (!selectedPlan) {
    return null
  }

  const handlePayment = async () => {
    await processPayment()
  }

  return (
    <>
      <style>{`
        .receipt-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.0);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .receipt-dialog {
          background: #212121;
          width: 90%;
          max-width: 400px;
          border-radius: 20px;
          padding: 20px;
          animation: slideUp 0.3s ease;
          max-height: 85vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .receipt-dialog::-webkit-scrollbar { width: 4px; }
        .receipt-dialog::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .receipt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .receipt-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: #ffffffff;
        }

        .receipt-close-btn {
          background: #f5f5f5;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #666;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .receipt-close-btn:hover { background: #e8e8e8; color: #333; }
        .receipt-close-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .receipt-section {
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 12px;
        }

        .receipt-section-default {
        
          background: #303030;;
        }
        
        .receipt-blue { background: #303030;  }
        .receipt-green { background: #212121;   }

        .receipt-section-title {
          font-size: 14px;
          font-weight: 600;
          color: #ffffffff;
          margin-bottom: 10px;
          display: block;
        }
        
        .receipt-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          
          font-size: 13px;
        }

        .receipt-row-label { color: #fff8f8ff;  }
        .receipt-row-value { font-weight: 500; color: #ffffffff; }
        
        .receipt-divider {
          margin: 12px 0;
          border: none;
          border-top: 1px dashed #ddd;
        }
        
        .receipt-row-total { font-size: 15px; padding: 8px 0; }
        .receipt-row-total .receipt-row-label,
        .receipt-row-total .receipt-row-value {
          font-weight: 700;
          color: #ffffffff;
        }

        .receipt-error-text {
          font-size: 12px;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .receipt-help-link {
          font-size: 11px;
          font-weight: 600;
          color: #dc2626;
          text-decoration: underline;
          cursor: pointer;
          margin-left: auto;
        }
        
        .receipt-pay-btn {
          background: #FFFFFF;
          color: #000000ff;
          padding: 16px;
          border-radius: 14px;
          text-align: center;
          margin-top: 16px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
        }
        
        .receipt-pay-btn:hover:not(:disabled) {
          background: #333;
          transform: translateY(-1px);
        }
        
        .receipt-pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .receipt-error-msg {
          color: #dc2626;
          font-size: 13px;
          margin-bottom: 12px;
          padding: 10px 14px;
          background: #fef2f2;
          border-radius: 10px;
          border: 1px solid #fecaca;
        }

        .wallet-insufficient { color: #dc2626; }
      `}</style>

      <div className="receipt-backdrop" onClick={() => !loading && closeReceipt()}>
        <div className="receipt-dialog" onClick={(e) => e.stopPropagation()}>

          <div className="receipt-header">
            <h3 className="receipt-title">Payment Summary</h3>
            <button
              className="receipt-close-btn"
              onClick={closeReceipt}
              disabled={loading}
            >
              ✕
            </button>
          </div>

          {isChargerUnavailable && (
            <div className="receipt-section receipt-red">
              <div className="receipt-error-text">
                <span>⚠️ Charger is offline. Please try again later.</span>
                <a
                  href="https://bentork.com/support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="receipt-help-link"
                >
                  Get Help
                </a>
              </div>
            </div>
          )}

          <div className="receipt-section receipt-blue">
            <span className="receipt-section-title">Charging Details</span>
            <div className="receipt-row">
              <span className="receipt-row-label">Duration</span>
              <span className="receipt-row-value">{selectedPlan?.durationMin || 0} mins</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-row-label">Charger Type</span>
              <span className="receipt-row-value">{chargerData?.chargerType || 'N/A'}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-row-label">Energy</span>
              <span className="receipt-row-value">{powerValue} kWh</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-row-label">Rate</span>
              <span className="receipt-row-value">₹{chargerData?.rate || 8}/kWh</span>
            </div>
          </div>

          <div className="receipt-section receipt-section-default">
            <span className="receipt-section-title">Price Breakdown</span>
            <div className="receipt-row">
              <span className="receipt-row-label">Session Cost</span>
              <span className="receipt-row-value">₹{pricing.formattedBaseAmount}</span>
            </div>
            {/* <div className="receipt-row">
              <span className="receipt-row-label">GST (18%)</span>
              <span className="receipt-row-value">₹{pricing.formattedGst}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-row-label">PST (5%)</span>
              <span className="receipt-row-value">₹{pricing.formattedPst}</span>
            </div> */}
            <hr className="receipt-divider" />
            <div className="receipt-row receipt-row-total">
              <span className="receipt-row-label">Total Amount</span>
              <span className="receipt-row-value">₹{pricing.formattedTotalAmount}</span>
            </div>
          </div>

          <div className="receipt-section receipt-green">
            <div className="receipt-row">
              <span className="receipt-row-label" style={{ fontWeight: 600 }}>
                Wallet Balance
              </span>
              <span
                className={`receipt-row-value ${hasInsufficientBalance ? 'wallet-insufficient' : ''}`}
                style={{ fontWeight: 600 }}
              >
                ₹{userWalletBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {error && <div className="receipt-error-msg">⚠️ {error}</div>}

          <button
            className="receipt-pay-btn"
            onClick={handlePayment}
            disabled={loading || isChargerUnavailable}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: 'white' }} />
                Processing...
              </>
            ) : (
              `PAY ₹${pricing.formattedTotalAmount}`
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default Receipt