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
          .profile-name{
          font-size:18px;
          font-weight:500;
          }
        .card{
          background:white;
          padding:20px;
          border-radius:16px;
          margin-bottom:20px;
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
        .menu{
          display:grid;
          grid-template-columns: repeat(5,1fr);
          margin-top:15px;
          
        }
         .small-font available-text{
          margin-top: 20px;
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

        .btn{
          padding:8px 15px;
          border-radius:20px;
          border:none;
          background:#212121;
          color:white;
          font-weight:bold;
          cursor:pointer;
            font-size:8px;
        }
        .amount{
          font-size:20px;
          font-weight:400;
          margin-top:12px;
        }
        .transaction{
          background:#f6f6f6;
          padding:15px;
          border-radius:14px;
          display:flex;
          justify-content:space-between;
          margin-bottom:12px;
        }
      .transaction-font{
           font-size:16px;
          font-weight:400;

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
      <h2>Dashboard</h2>
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
    <div key={k} style={{ textAlign: "center" }}>
      <div className="circle">
        <img src={item.icon} alt={item.name} width="24" height="24"/>
      </div>

      {/* TEXT ONLY FONT CHANGE */}
      <span
        style={{
          fontFamily: "'Lexend', sans-serif",
          fontSize: "8px",
          fontWeight: 400
        }}
      >
        {item.name}
      </span>
    </div>
  ))}
</div>



      </div>

      {/* WALLET */}
    <div className="card">
  <div className="wallet-row">
    <div className="wallet-title">
      <img src={WalletIcon} alt="Wallet" width="14" height="14" />
      <p className="small-font">Wallet Balance</p>
    </div>

    <button className="btn" onClick={() => setShowDialog(true)}>
      Add balance
    </button>
  </div>

  <div className="amount">₹ {user?.walletBalance || 0}</div>
<br />
  <p className="small-font available-text">
    Available for charging
  </p>
</div>


      {/* TRANSACTIONS */}
      {transactions?.map((t,i)=>(
        <div className="transaction" key={i} style={{background:i===0?"#e1ffd7ff":"white"}}>
          <div>
            <b className="transaction-font">{t?.type === "credit" ? "Credited" : "Debited"}</b>
            <br /><br />
            <p className="small-font">via {t?.method || "wallet"}</p>
          </div>
          <div style={{textAlign:"right"}}>
            <span className="green">Completed</span>
            <br />
            <br />
            <p className="small-font"><p>Rs. {t?.amount}</p></p>
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
