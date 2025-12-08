import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../store/AuthContext"
import PaymentService from "../services/payment.service"

export default function Dashboard() {

  const navigate = useNavigate()
  const { user, transactionData } = useAuth()

  const [transactions, setTransactions] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    if (Array.isArray(transactionData)) {
      setTransactions(transactionData)
    }
  }, [user, transactionData, navigate])


  const handleRecharge = async () => {
    if (!amount || amount <= 0) {
      setError("Enter valid amount")
      return
    }

    setLoading(true)
    setError("")

    try {
      const orderResult = await PaymentService.createOrder(amount)

      PaymentService.processPayment(
        orderResult,
        user,
        handleSuccess,
        handleFailure
      )

    } catch (error) {
      setError("Recharge failed")
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    setSuccess("Payment Successful")
    setLoading(false)

    setTimeout(() => {
      setShowDialog(false)
      setSuccess("")
      setAmount("")
      window.location.reload()
    }, 1500)
  }

  const handleFailure = (err) => {
    setError(err || "Failed")
    setLoading(false)
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
          border-radius:8px;
          border:1px solid #ccc;
        }
        .error{color:red;margin-top:10px}
        .success{color:green;margin-top:10px}
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
        <div className="amount">₹ {user?.walletBalance || 0.00}</div>
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

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e)=>setAmount(e.target.value)}
            />

            <br/><br/>

            <button className="btn" onClick={handleRecharge}>
              {loading ? "Processing..." : `Pay ₹${amount || 0}`}
            </button>
            <button style={{marginLeft:10}} onClick={()=>setShowDialog(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
