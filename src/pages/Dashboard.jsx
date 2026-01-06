import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import PaymentService from "../services/payment.service";
import AuthService from "../services/auth.service";
import APP_CONFIG from "../config/app.config";

import WalletIcon from "../assets/images/wallet.svg";
import ArrowUp from "../assets/images/ArrowUp.svg";
import ArrowDown from "../assets/images/ArrowDown.svg";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ProfileIcon from "../assets/images/profile.svg";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, transactionData, userByEmail, transactionHistory } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
    if (Array.isArray(transactionData)) setTransactions(transactionData);
  }, [user, transactionData, navigate]);

  useEffect(() => {
    const baseAmount = parseFloat(amount) || 0

    if (baseAmount > 0) {
      const gst = baseAmount * (APP_CONFIG.TAX.GST_RATE || 0)
      const total = baseAmount + gst
      setTotalAmount(total.toFixed(2));
    } else {
      setTotalAmount(0);
    }
  }, [amount]);

  const handleRecharge = async () => {
    if (!totalAmount || totalAmount <= 0) return setError("Enter valid amount");
    setLoading(true); setError("");

    try {
      const orderResult = await PaymentService.createOrder(totalAmount);
      PaymentService.processPayment(orderResult, user, handleSuccess, handleFailure);
    } catch {
      setError("Recharge failed"); setLoading(false);
    }
  };

  const handleSuccess = () => {
    setSuccess("Payment Successful"); setLoading(false); setIsVerifying(true); reloadData();
  };

  //const handleSuccess = () => {
  // setSuccess("Payment Successful");
  // setLoading(false);
  // setIsVerifying(true);

  // Update wallet with actual recharge amount (without GST)
  //   AuthService.addToWallet(user.id, parseFloat(amount))  // ⚡ Add baseAmount
  //     .then(() => reloadData())
  //     .catch(() => setError("Failed to update wallet"));
  // };

  const handleFailure = (err) => {
    setError(err || "Payment Failed"); setLoading(false); setIsVerifying(false);
  };

  const reloadData = async () => {
    try {
      const userReload = await userByEmail(user.email);
      if (!userReload?.success && !userReload?.updatedUser) return setError("Failed to fetch user");
      const transactionReload = await AuthService.loadTransaction(user.id, 10);
      setTransactions(transactionReload); transactionHistory(transactionReload);
      setTimeout(() => {
        setSuccess("Verification Completed");
        setTimeout(() => { setShowDialog(false); setSuccess(""); setAmount(""); setError(""); setIsVerifying(false); }, 500);
      }, 1000);
    } catch {
      setError("Failed while reloading data"); setIsVerifying(false); setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #212121;
          color: #fff;
        }

        .dashboard {
          padding: 16px;
          max-width: 480px;
          margin: auto;
        }

        .title-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }

        .back-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-title {
          font-size: 16px;
          font-weight: 500;
        }

        .card-1 {
          margin-top: 16px;
          padding: 16px;
          border-radius: 16px;
          background: linear-gradient(62deg, rgba(48,48,48,0.5) 2%, rgba(0,0,0,0.5) 54%);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          gap: 12px;
          cursor: pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .wallet-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .wallet-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: var(--font-weight-medium);
        }

        .amount {
          font-size: 24px;
          font-weight: var(--font-weight-medium);
        }

        .small-font {
          font-size: 10px;
          font-weight: var(--font-weight-regular);
          color: rgba(255,255,255,0.6);
        }

        .transactions-title {
          font-size: 14px;
          font-weight: var(--font-weight-medium);
          margin: 16px 0 8px 0;
        }

        .transactions-scroll {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 630px;
          overflow-y: auto;
        }

        .transactions-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .transactions-scroll::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 8px;
        }

        .transaction-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #303030;
          border-radius: 12px;
          padding: 12px;
        }

        .tx-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tx-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tx-icon.credit { background: #39E29B; }
        .tx-icon.debit { background: #F9DEDC; }

        .tx-title { font-size: 16px; font-weight: 500; }
        .tx-sub { font-size: 12px; color: rgba(255,255,255,0.6); }

        .tx-right { text-align: right; }
        .tx-amount { font-size: 16px; font-weight: 500; color: #fff; }
        .tx-status { font-size: 10px; background: #39E29B; color: #091f1a; padding: 2px 6px; border-radius: 12px; display: inline-block; margin-top: 4px; }

        .btn {
          padding: 8px 24px;
          border-radius: 24px;
          font-size: 12px;
          font-weight: var(--font-weight-regular);
          cursor: pointer;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: var(--color-white);
  transition: background 0.2s ease, transform 0.2s ease;
        }
  .btn:hover {
  transform: scale(0.97);
  background: rgba(255, 255, 255, 0.18);
}

.btn:active {
  transform: scale(0.97);
}

        /* Dialog */
           .dialog-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }

        .dialog {
          background: #1c1c1c;
          width: 90%;
          max-width: 400px;
          padding: 24px 20px;
          border-radius: 20px;
          color: #fff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          animation: slideUp 0.4s ease;
          font-family: 'Arial', sans-serif;
        }

        @keyframes slideUp {
          0% { transform: translateY(100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        h3 {
          text-align: center;
          margin-bottom: 20px;
          font-size: 20px;
          font-weight: 500;
        }

        .invoice-row label {
          display: block;
          font-size: 14px;
          margin-bottom: 6px;
          color: #ccc;
        }

        input {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 20px;
          border-radius: 12px;
          border: 1px solid #444;
          background: #2a2a2a;
          color: #fff;
          font-size: 16px;
        }

        .invoice-summary {
          background: #2a2a2a;
          padding: 16px 20px;
          border-radius: 16px;
          margin-bottom: 20px;
        }

        .invoice-summary .row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
          color: #ccc;
        }

        .invoice-summary .row.total {
          font-weight: 600;
          font-size: 16px;
          color: #fff;
          border-top: 1px dashed #444;
          padding-top: 10px;
        }

        .btn-primary, .btn-secondary {
          width: 100%;
          padding: 12px 0;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          border: none;
          transition: all 0.25s ease;
          margin-bottom: 10px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ffffffff, #ffffffff);
          color: #000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }

        .btn-secondary {
          background: #2a2a2a;
          color: #fff;
          border: 1px solid #444;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #3a3a3a;
        }

        .btn-primary.loading {
          pointer-events: none;
          color: transparent;
          position: relative;
        }

        .loader {
          width: 24px;
          height: 24px;
          border: 3px solid #fff;
          border-top: 3px solid #39E29B;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error { color: #ff4d4f; margin: 8px 0; text-align:center;}
        .success { color: #4caf50; margin: 8px 0; text-align:center;}


        
      `}</style>

      {/* Header */}
      <div className="title-bar">
        <button className="back-btn" onClick={() => navigate("/config-charging")}>
          <ArrowBackIosNewIcon sx={{ fontSize: 16, color: "#fff" }} />
        </button>
        <h2 className="main-title">Wallet</h2>
      </div>

      {/* Wallet Card */}
      <div className="card-1">
        <div className="wallet-row">
          <div className="wallet-title">
            <img src={WalletIcon} alt="Wallet" width="16" height="16" /> Wallet Balance
          </div>
          <button className="btn" onClick={() => setShowDialog(true)}>Add balance</button>
        </div>
        <div className="amount">₹{Number(user?.walletBalance ?? 0).toLocaleString("en-IN")}</div>
        <p className="small-font">Available for charging</p>
      </div>

      {/* Transactions */}
      <p className="transactions-title">Transactions</p>
      <div className="transactions-scroll">
        {transactions?.map((t, i) => {
          const isCredit = t?.type === "credit";
          return (
            <div className="transaction-card" key={i}>
              <div className="tx-left">
                <div className={`tx-icon ${isCredit ? "credit" : "debit"}`}>
                  <img src={isCredit ? ArrowDown : ArrowUp} alt="" />
                </div>
                <div>
                  <div className="tx-title">{isCredit ? "Credited" : "Debited"}</div>
                  <div className="tx-sub">via {t?.method || "Wallet"}</div>
                </div>
              </div>
              <div className="tx-right">
                <div className="tx-amount">{isCredit ? "+" : "-"}₹{t?.amount}</div>
                <span className="tx-status">Completed</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="dialog-backdrop" onClick={() => !loading && setShowDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Recharge Wallet</h3>

            {/* Amount Input */}
            <div className="invoice-row">
              <label>Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* GST & Total */}
            <div className="invoice-summary">
              <div className="row">
                <span>GST (18%)</span>
                <span>₹{((parseFloat(amount) || 0) * 0.18).toFixed(2)}</span>
              </div>
              <div className="row total">
                <span>Total Payable</span>
                <span>₹{totalAmount || 0}</span>
              </div>
            </div>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            {/* Buttons */}
            <button
              className={`btn-primary ${loading ? "loading" : ""}`}
              onClick={handleRecharge}
              disabled={loading || parseFloat(totalAmount) <= 0}
            >
              {loading ? <div className="loader"></div> : `Pay ₹${totalAmount || 0}`}
            </button>

            <button
              className="btn-secondary"
              onClick={() => !loading && setShowDialog(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
