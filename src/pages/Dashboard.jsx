import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../store/AuthContext"
import PaymentService from "../services/payment.service"
import APP_CONFIG from "../config/app.config"
import AuthService from "../services/auth.service"

export default function Dashboard() {

  const navigate = useNavigate()
  const { user, transactionData } = useAuth()

  const [transactions, setTransactions] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [amount, setAmount] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [walletBalance, setWalletBalance] = useState()

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    setWalletBalance(user?.walletBalance || 0);

    if (Array.isArray(transactionData)) {
      setTransactions(transactionData);
    }
  }, [user, transactionData, navigate])

  useEffect(() => {
    const baseAmount = parseFloat(amount) || 0

    if(baseAmount > 0){
      const gst = baseAmount * (APP_CONFIG.TAX.GST_RATE || 0)
      const pst = baseAmount * (APP_CONFIG.TAX.SXT_RATE || 0)
      setTotalAmount((baseAmount + gst + pst).toFixed(2));
    } else {
      setTotalAmount(0);
    }
  }, [amount]);


  const handleRecharge = async () => {
    if (!totalAmount || totalAmount <= 0) {
      setError("Enter valid amount");
      return
    }

    setLoading(true);
    setError("");

    try {
      const orderResult = await PaymentService.createOrder(totalAmount)

      PaymentService.processPayment(
        orderResult,
        user,
        handleSuccess,
        handleFailure
      )

    } catch (error) {
      setError("Recharge failed");
      setLoading(false);
    }
  }

  const handleSuccess = () => {
    setSuccess("Payment Successful");
    setLoading(false);
    setIsVerifying(true);
    reloadData();
  }

  const handleFailure = (err) => {
    setError(err || "Payment Failed");
    setLoading(false);
    setIsVerifying(false);
  }

  const reloadData = async () => {
    try{
      const userReload = await AuthService.login(user.email)

      setWalletBalance(userReload?.user?.walletBalance || 0);

      const transactionReload  = await AuthService.loadTransaction(user.id, 10);
      setTransactions(transactionReload);

      setTimeout(() => {
        setSuccess("Verification Completed");
        setTimeout(() => {
          setShowDialog(false);
          setSuccess("");
          setAmount("");
          setError("");
          setIsVerifying(false);
        }, 500)
      }, 1000)
      
    } catch (error){
      setError("Failed while loading user or while loading transaction");
      setIsVerifying(false);
      setLoading(false)
    }
  }


  return (
    <div className="dashboard">

      {/* ==== INTERNAL CSS ==== */}
      <style>{`
        body{
          background:#f6f6f6;
          font-family:Arial;
        }
        .dashboard{
          padding:20px;
          max-width:420px;
          margin:auto;
        }
        .card{
          background:white;
          padding:20px;
          border-radius:16px;
          margin-bottom:20px;
        }
        .profile-photo{
          width:90px;
          height:90px;
          border-radius:20px;
          border:1px solid #eee;
          margin:0 auto 10px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:40px;
        }
        .center{text-align:center}
        .menu{
          display:grid;
          grid-template-columns: repeat(4,1fr);
          margin-top:15px;
        }
        .menu div{
          text-align:center;
          font-size:12px;
        }
        .circle{
          width:45px;
          height:45px;
          border-radius:50%;
          border:1px solid #eee;
          margin:auto auto 8px;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .wallet-row{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }
        .btn{
          padding:8px 15px;
          border-radius:20px;
          border:none;
          background:#212121;
          color:white;
          font-weight:bold;
          cursor:pointer;
        }
        .amount{
          font-size:28px;
          font-weight:400;
          margin-top:8px;
        }
        .transaction{
          background:white;
          padding:15px;
          border-radius:14px;
          display:flex;
          justify-content:space-between;
          margin-bottom:12px;
        }
        .green{color:green}
        .start-btn{
          position:fixed;
          left:0;
          right:0;
          bottom:15px;
          padding:15px;
          background:#6DB85B;
          color:white;
          border-radius:15px;
          font-weight:bold;
          border:none;
          width:90%;
          margin:auto;
          display:block;
        }
        .dialog-backdrop{
          position:fixed;
          top:0;
          left:0;
          right:0;
          bottom:0;
          background:rgba(0,0,0,0.5);
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .dialog{
          background:white;
          width:90%;
          padding:20px;
          border-radius:15px;
        }
        input{
          width:100%;
          padding:10px;
          margin-top:10px;
          margin-bottom:10px;
          border-radius:8px;
          border:1px solid #ccc;
        }
        .loading-bar-container{
          width:100%;
          background-color:#f3f3f3;
          border-redius:4px;
          overflow:hidden;
          margin-top:15px;
        }
        .loading-bar {
          height: 8px;
          width: 100%; /* Start at 0, animation will change this */
          background-color: #4CAF50;
          animation: progress-bar 2s infinite linear;
        }
        @keyframes progress-bar {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(100%) }
        }
        .error{color:red;margin-top:10px}
        .success{color:green;margin-top:10px}
        .spacing{font-size:0.7rem;margin-bottom:16px}
      `}</style>

      {/* TITLE */}
      <h4>Dashboard</h4>

      {/* PROFILE */}
      <div className="card center">
        <div className="profile-photo">👤</div>
        <b>{user?.name || "User"}</b>
        <p>{user?.email}</p>
{/* 
        <div className="menu">
          {["Download","Terms","Privacy","About"].map((i,k)=>(
            <div key={k}>
              <div className="circle">⬇️</div>
              {i}
            </div>
          ))}
        </div> */}

<div className="menu">
  {[
    {
      name: "Download",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
          <path d="M12 3v12" />
          <path d="M7 10l5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      )
    },
    {
      name: "Terms",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      )
    },
    {
      name: "Privacy",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
          <path d="M12 2l7 4v6c0 5-3.5 9.7-7 10-3.5-.3-7-5-7-10V6l7-4z" />
        </svg>
      )
    },
    {
      name: "About",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    },
  ].map((item, k) => (
    <div key={k}>
      <div className="circle">{item.icon}</div>
      {item.name}
    </div>
  ))}
</div>




      </div>

      {/* WALLET */}
      <div className="card">
        <div className="wallet-row">
          <p>Wallet Balance</p>
          {/* <b>Wallet Balance</b> */}
          <button className="btn" onClick={()=>setShowDialog(true)}>Add balance</button>
        </div>
        <div className="amount">₹ {walletBalance}</div>
        <small>Available for charging</small>
      </div>

      {/* TRANSACTIONS */}
      {transactions?.map((t,i)=>(
        <div className="transaction" key={i} style={{background:i===0?"#e6f7dc":"white"}}>
          <div>
            <b>{t?.type === "credit" ? "Credited" : "Debited"}</b>
            <p>via {t?.method || "wallet"}</p>
          </div>
          <div style={{textAlign:"right"}}>
            <span className="green">Completed</span>
            <p><b>₹ {t?.amount}</b></p>
          </div>
        </div>
      ))}


      {/* START CHARGING */}
      <button className="start-btn" onClick={()=>navigate("/config-charging")}>
        Start 
      </button>


      {/* DIALOG */}
      {showDialog && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h3>Recharge Wallet</h3>

            {isVerifying ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <h4 style={{ color: 'green' }}>{success || "Verifying Payment..."}</h4>
                <p>Please wait, updating your wallet balance.</p>
                <div className="loading-bar-container">
                    <div className="loading-bar"></div>
                </div>
              </div>

            ) : (
              <>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e)=>{
                    setAmount(e.target.value)
                    setError("")
                  }}
                  disabled={loading}
                />

                <p className="spacing">This will also include GST(18%) and PST(18%) of the Amount </p>

                <button className="btn" onClick={handleRecharge} disabled={loading || parseFloat(totalAmount) <= 0}>
                  {loading ? "Processing..." : `Pay ₹${totalAmount || 0}`}
                </button>
                <button style={{marginLeft:10}} 
                  onClick={()=> {
                    if(!loading)setShowDialog(false)
                    }}
                  disabled={loading}  
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
