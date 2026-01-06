import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../store/AuthContext"
import PaymentService from "../services/payment.service"
import APP_CONFIG from "../config/app.config"
import AuthService from "../services/auth.service"
import Download from "../assets/images/download.svg";
import Terms from "../assets/images/Terms.svg";
import Privacy from "../assets/images/Privacy.svg";
import About from "../assets/images/About.svg";
import Help from "../assets/images/Help.svg";
import ProfileIcon from "../assets/images/profile.svg";
import WalletIcon from "../assets/images/wallet.svg";
import ArrowUp from "../assets/images/ArrowUp.svg";
import ArrowDown from "../assets/images/ArrowDown.svg";

import logoutIcon from "../assets/images/Logout.svg";


export default function Dashboard() {

  const navigate = useNavigate()
  const { user, transactionData, userByEmail, transactionHistory } = useAuth()

  const [transactions, setTransactions] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [amount, setAmount] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  
  const [showTerms, setShowTerms] = useState(false);
const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

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
      console.info('First')
      const userReload = await userByEmail(user.email)
      console.debug('Second')
      if(!userReload.success && !userReload.updatedUser) {
        setError('Failed to fetch User')
        return
      }
      console.debug('third')

      const transactionReload  = await AuthService.loadTransaction(user.id, 10);
      setTransactions(transactionReload);
      transactionHistory(transactionReload);

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
          .title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;

}

.main-title {
  margin: 0;
  font-size: 28px;
  font-weight: 400;
   
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 28px;
  background-color: #F2B8B5; /* light pink like image */
  color: #852221;
  font-size: 8px;
  cursor: pointer;
}



.logout-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}


          .profile-name{
          font-size:18px;
          font-weight:400;
          }
        .card{
          background:white;
          padding:20px;
          border-radius:16px;
          margin-bottom:20px;
        }
          .card-1{
          background:#303030;
          padding:10px;
          border-radius:12px;
           border:1px solid #eee;
           color: #ffffffff;
         
        }
       .small-font{
            font-size:12px;
          
       }
          .profile-photo{
  width:90px;
  height:90px;
  border-radius:20px;
  border:1px solid #eee;
  margin:0 auto 13px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#FFFFFF;
}
  .profile-img{
  width:60px;
  height:60px;
  object-fit:contain;
}
        .center{text-align: center}
        .menu {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin-top: 15px;
}

.menu-item {
  text-align: center;
  cursor: pointer;
}

.menu-item:hover .circle {
  background: rgba(0, 0, 0, 0.05);
}

.menu-item:hover .menu-text {
  color: #6DB85B;
}

.menu-text {
  font-family: "Lexend", sans-serif;
  font-size: 8px;
  font-weight: 400;
  opacity: 0.75;
  display: block;
}
  
         .small-font available-text{
          margin-top: 20px;
          
          }
           .small-font{
           font-size:12px;
           font-weight:400;

           }
        .menu div{
          text-align:center;
          font-size:10px;
           font-weight:400;
        }
        .circle{
          width:46px;
          height:46px;
          border-radius:12px;
          border:1px solid #eee;
          margin:auto auto 8px;
          display:flex;
           padding:12px;
          align-items:center;
           gap: 10px;
          justify-content:center;
        }
          .circle img{
  display:block;
}

        .wallet-row{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }
         .wallet-title{
  display: flex;
  align-items: center;
  gap: 6px;
}
  .tx-right {
  text-align: right;
}

.tx-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  background: #dff5cc;
  color: #2e7d32;
  display: inline-block;
  margin-bottom: 4px;
}

.tx-amount {
  font-size: 12px;
  font-weight: 400;
}

.tx-amount.green {
  color: #2e7d32;
}

.tx-amount.red {
  color: #000000ff;
}
      
       
        .btn{
          padding:8px 15px;
          border-radius:28px;
          border:none;
          background:#FFFFFF;
          color:#000000;
          font-weight:500;
          cursor:pointer;
            font-size:12px;
        }
        .amount{
          font-size:18px;
          font-weight:400;
          margin-top:12px;
        }
          .transactions-scroll {
  max-height: 260px;       /* control visible height */
  overflow-y: auto;        /* enable vertical scroll */
  padding-right: 4px;
}
  /* Smooth scrolling */
.transactions-scroll {
  scroll-behavior: smooth;
}

/* Optional: hide scrollbar (mobile look) */
.transactions-scroll::-webkit-scrollbar {
  width: 4px;
}

.transactions-scroll::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
          .transactions-title {
  font-size: 18px;
  font-weight: 400;
 
  padding:12px;
}
        .transaction-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f5;
  border-radius: 12px;
    border:0.25px solid #00000045;
  padding: 14px 16px;
  margin-bottom: 12px;
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

.tx-icon img {
  width: 16px;
  height: 16px;
}

.tx-icon.credit {
  background: #dff5cc;
}

.tx-icon.debit {
  background: #ffe1cc;
}


.tx-title {
  font-size: 16px;
  font-weight: 400;
}

.tx-sub {
  font-size: 12px;
  color: #777;
}
    



        .green{color:#000000;
         font-size:12px;
        }  
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
        .dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
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


        /* Common button styles */
.btn-primary,
.btn-secondary {
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  min-width: 120px;
}

/* Primary Pay Button */
.btn-primary {
  background: linear-gradient(135deg, #000000ff, #000000ff);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);

}

/* Secondary Cancel Button */
.btn-secondary {
  margin-left: 10px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

/* Disabled State */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

      `}</style>

      {/* TITLE */}
      {/* TITLE BAR */}
<div className="title-bar">
  <h2 className="main-title">Wallet</h2>

  <button className="logout-btn">
    Logout
    <img src={logoutIcon} alt="logout" className="logout-icon" />
  </button>
</div>


<br />
      {/* PROFILE */}
      <div className="card center">
      <div className="profile-photo">
  <img
    src={user?.profileImage || ProfileIcon}
    alt="Profile"
    className="profile-img"
  />
</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
  <p className="profile-name">{user?.name || "User"}</p>
  <p className="small-font">{user?.email}</p>
</div>

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
    { name: "Download App", icon: Download },
    { name: "Terms & Conditions", icon: Terms },
    { name: "Privacy Policy", icon: Privacy },
    { name: "Help", icon: Help },
    { name: "About", icon: About },
  ].map((item, k) => (
    <div
      key={k}
      className="menu-item"
      onClick={() => {
        if (item.name === "Terms & Conditions") setShowTerms(true);
        else if (item.name === "Privacy Policy") setShowPrivacy(true);
        else if (item.name === "Help") navigate("/help");
        else if (item.name === "About") navigate("/about");
      }}
    >
      <div className="circle">
        <img src={item.icon} alt={item.name} width="22" height="22" />
      </div>

      <span className="menu-text">{item.name}</span>
    </div>
  ))}
</div>



      </div>

      {/* WALLET */}
    <div className="card-1">
  <div className="wallet-row">
    <div className="wallet-title">
      <img src={WalletIcon} alt="Wallet" width="14" height="14" />
      <h6 className="small-font">Wallet Balance</h6>
    </div>

    <button className="btn" onClick={() => setShowDialog(true)}>
      Add balance
    </button>
  </div>

 <div className="amount">
  ₹{Number(user?.walletBalance ?? 0).toLocaleString("en-IN")}
</div>

<br />
  <p className="small-font available-text">
    Available for charging
  </p>
</div>


      {/* TRANSACTIONS */}
   <p className="transactions-title">Transactions</p>

<div className="transactions-scroll">
  {transactions?.map((t, i) => {
    const isCredit = t?.type === "credit";

    return (
      <div className="transaction-card" key={i}>
        {/* LEFT */}
        <div className="tx-left">
          <div className={`tx-icon ${isCredit ? "credit" : "debit"}`}>
            <img
              src={isCredit ? ArrowDown : ArrowUp}
              alt={isCredit ? "Credit" : "Debit"}
            />
          </div>

          <div>
            <div className="tx-title">
              {isCredit ? "Credited" : "Debited"}
            </div>
            <div className="tx-sub">
              via {t?.method || "Wallet"}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="tx-right">
          <div className={`tx-amount ${isCredit ? "green" : "red"}`}>
            {isCredit ? "+" : "-"}₹{t?.amount}
          </div>
          <span className="tx-status">Completed</span>
        </div>
      </div>
    );
  })}
</div>




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

                <button
  className="btn-primary"
  onClick={handleRecharge}
  disabled={loading || parseFloat(totalAmount) <= 0}
>
  {loading ? "Processing..." : `Pay ₹${totalAmount || 0}`}
</button>

<button
  className="btn-secondary"
  onClick={() => {
    if (!loading) setShowDialog(false)
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


