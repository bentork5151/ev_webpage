import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useCharging } from '../store/ChargingContext'
import "@material/web/slider/slider.js";
import WalletIcon from "../assets/images/wallet.svg";
import Logo from "../assets/images/Logo-1.png";
import StationImg from "../assets/images/station-img.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";




import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";





const sidebarConfig = {
  user: {
    name: "Ricard Joseph",
    email: "richard@bentork.com",
    avatar: <AccountCircleIcon fontSize="large" />
  },
  menu: [
    {
      section: "primary",
      items: [
        { label: "My Wallet", icon: <AccountBalanceWalletIcon /> },
        
      ]
    },
    {
      section: "support",
      items: [
        { label: "Help", icon: <HelpOutlineIcon /> },
        { label: "Download App", icon: <DownloadIcon /> }
      ]
    },
    {
      section: "legal",
      items: [
        { label: "Terms & Conditions", icon: <DescriptionIcon /> },
        { label: "Privacy Policy", icon: <PrivacyTipIcon /> },
        { label: "About Us", icon: <InfoOutlinedIcon /> }
      ]
    }
  ]
};










const ConfigCharging = () => {
    const navigate = useNavigate();
  const {
    plans,
    selectedPlan,
    powerValue,
    plansLoading,
    chargerData,
    openReceipt,
    selectPlan,
    updatePowerValue
  } = useCharging()

   // 🔐 SAFE last used plan
  const lastUsed = selectedPlan || plans[0];
const [drawerOpen, setDrawerOpen] = useState(false);

  // 🔹 Quick plans only
  const quickPlans = plans.filter(p => p.type === "QUICK");

  return (
    <>
      <style>{`
        html, body {
        margin: 0;
        padding: 0;
        height: 100%;
          overflow-y: auto;
        font-family: Arial, sans-serif;
     
      }

       /* ===== PAGE ===== */
.config-page {
   min-height: 100vh;
  background: #303030;
  color: #fff;
  padding-top: 92px;  
  padding-bottom: 100px;
  font-family: Roboto, sans-serif;
}

/* ===== TOP BAR ===== */
.topbar {
 position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 92px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #212121;

  
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu {
  font-size: 40px;
       font-weight: 400;
}

.top-logo {
  height: 72px;
   width: 138px;
} 

.wallet-pill {
  display: flex;
  align-items: center;
  gap: 10px;
   font-weight: 600;
  padding: 8px 12px;
  background:#303030;
  border-radius: 16px;
  border: none;
  color: #fff;
}

/* ===== MENU ICON ===== */
.menu-icon {
  font-size: 26px;
  cursor: pointer;
}

/* ===== OVERLAY ===== */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  pointer-events: none;
  transition: 0.3s;
  z-index: 9;
}

.drawer-overlay.show {
  opacity: 1;
  pointer-events: all;
}

/* ===== DRAWER ===== */

.drawer-box {
  margin: 16px;
  background: #1f1f1f;
  border-radius: 22px;
  overflow: hidden;
}



.side-drawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 82%;
  max-width: 347px;
  background: #212121;
  transform: translateX(-100%);
  transition: transform 0.35s ease;
  z-index: 10;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
   padding-left: 20px;
     gap: 18px;

}

.side-drawer hr {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.23);
  margin: 14px 0;
}
/* OPEN STATE */
.side-drawer.open {
  transform: translateX(0);
}


/* ===== HEADER ===== */
.drawer-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info p {
  font-size: 12px;
  opacity: 0.6;
}

.close-icon {
  cursor: pointer;
}

/* ===== MENU ===== */



.drawer-menu .item {
  padding: 14px 0;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fff;
}

.drawer-menu .item svg {
  font-size: 22px;
  opacity: 0.85;
}

.avatar svg {
  font-size: 42px;
  opacity: 0.9;
}

/* ===== LOGOUT ===== */
.logout-btn {
  margin: 20px;
  padding: 14px;
  background: #7b2c2c;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 16px;
}





/* ===== CHARGER CARD ===== */
.charger-card {
  margin: 16px;
  background: #212121;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
   height: 220px;
    
}

.charger-info h1 {
  font-size: 36px;
  font-weight: 300;
}

.charger-info h2 {
  font-size: 22px;
  font-weight: 300;
}

.charger-name {
  margin-top: 16px;
  font-weight: 600;
}

.charger-meta {
margin-top:10px;
  font-size: 16px;

    font-weight: 400;
}

.charger-img {
  height: 200px;
     width: 130px;
}

/* ===== SLIDER ===== */
.label {
          font-weight: 400;
          margin: 20px 0 8px;
           font-size: 14px; 
            padding: 0px 16px;
        }

        md-slider {
          width: 100%;
          --md-sys-color-primary: #00A000;
          --md-sys-color-secondary: #d6efbf;
          --md-slider-active-track-height: 20px;
          --md-slider-inactive-track-height: 20px;
          --md-slider-active-track-color: #5cc554ff;
          --md-slider-inactive-track-color: #d6efbf;
          --md-slider-handle-width: 4px;
          --md-slider-handle-height: 40px;
          --md-slider-handle-shape: 4px;
          --md-slider-tick-color: #4b4b4b;
          --md-slider-tick-active-color: #4caf50;
          --md-slider-tick-size: 7px;
            transition: all 0.3s ease;
        }


/* ===== PLANS ===== */
.plans-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 16px 10px;
  
}

.last-used-pill {
  padding: 6px 12px;
  border: 1px solid #39E29B;
  border-radius: 999px;
  color: #39E29B;
  font-size: 12px;
}

.plans {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
}

.plan {
  background: #212121;
  padding: 6px 28px;
  border-radius: 28px;
    border: 1px solid #00000024;
  display: flex;
    height: 101px;
    
  justify-content: space-between;
  align-items: center;

  
}
.plan strong{
  font-size: 24px;

    font-weight: 600;
}
.plan span {
  font-size: 16px;
  opacity: 0.7;
    font-weight: 400;
}

.plan .price {
  color: #39E29B;
  font-size: 18px;
  font-weight: 700;
}

.plan.active {
  background: #2b2b2b;
  outline: 1px solid #6db85b;
}

/* ===== PAY BUTTON ===== */
.pay-btn {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 420px;
  padding: 18px;
  background: #fff;
  color: #111;
  border-radius: 24px;
  font-size: 18px;
  font-weight: 600;
  border: none;
}

      
      `}</style>

       <div className="config-page">

      {/* ===== TOP BAR ===== */}
      <div className="topbar">
        <div className="topbar-left">
     <MenuIcon
  className="menu-icon"
  onClick={() => setDrawerOpen(true)}
/>

          <img src={Logo} className="top-logo" />
        </div>

        <button
  className="wallet-pill"
  onClick={() => navigate("/dashboard")}
>
  <img src={WalletIcon} alt="Wallet" />
  ₹29.30
</button>

      </div>


{/* ===== OVERLAY ===== */}
{/* ===== OVERLAY ===== */}
<div
  className={`drawer-overlay ${drawerOpen ? "show" : ""}`}
  onClick={() => {
    // Check if the clicked item is "MW Wallet"
    const walletItem = sidebarConfig.menu
      .flatMap(group => group.items)
      .find(item => item.label === "MW Wallet");
    
    if (walletItem) {
      navigate("/dashboard"); // Go to dashboard page
    }
    setDrawerOpen(false); // Close drawer anyway
  }}
/>

{/* ===== SIDE DRAWER ===== */}
<div className={`side-drawer ${drawerOpen ? "open" : ""}`}>
  <div className="drawer-box" onClick={(e) => e.stopPropagation()}>
    {/* USER HEADER */}
    <div className="drawer-header">
      <div className="user-info">
        <div className="avatar">{sidebarConfig.user.avatar}</div>
        <div>
          <strong>{sidebarConfig.user.name}</strong>
          <p>{sidebarConfig.user.email}</p>
        </div>
      </div>
      <CloseIcon
        className="close-icon"
        onClick={() => setDrawerOpen(false)}
      />
    </div>

    <hr />

    {/* MENU */}
  <div className="drawer-menu">
  {sidebarConfig.menu.map((group, index) => (
    <div key={index}>
     {group.items.map((item, i) => (
  <div
    className="item"
    key={i}
    onClick={() => {
      setDrawerOpen(false); // close drawer
      if (item.label === "My Wallet") {
        navigate("/dashboard");
      } else if (item.label === "Terms & Conditions") {
        navigate("/terms");
      }
    }}
  >
    <span className="icon">{item.icon}</span>
    <span>{item.label}</span>
  </div>
))}

      {index !== sidebarConfig.menu.length - 1 && <hr />}
    </div>
  ))}
</div>


    {/* LOGOUT */}
    <button className="logout-btn" onClick={() => console.log("Log Out")}>
      Log Out
    </button>
  </div>
</div>











      {/* ===== CHARGER CARD ===== */}
      <div className="charger-card">
        <div className="charger-info">
          <h1>Configure</h1>
          <h2>Charger</h2>
<br />
          <p className="charger-name">
            {chargerData?.name || "Bentork Charger"}
          </p>
          <p className="charger-meta">
            Type: {chargerData?.connectorType || "CSS2"}<br/>
            Power: {chargerData?.chargerType || "AC"}
          </p>
        </div>

        <img src={StationImg} className="charger-img" />
      </div>

      {/* ===== SLIDER ===== */}
   <div className="label">Custom Power Range</div>
        <md-slider
          labeled
          min="0"
          max="1"
          step="0.1"
          value={powerValue}  
         onInput={(e) => updatePowerValue(Number(e.target.value))}
        ></md-slider>


      {/* ===== PLANS ===== */}
      <div className="plans-header">
        <h3>Plans</h3>
        <span className="last-used-pill">Last used</span>
      </div>

      <div className="plans">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan ${selectedPlan?.id === plan.id ? "active" : ""}`}
            onClick={() => selectPlan(plan)}
          >
            <div>
              <strong>{plan.planName}</strong>
              <br />
              <span>{plan.durationMin} mins</span>
            </div>
            <span className="price">₹{plan.walletDeduction}</span>
            
          </div>
        ))}
      </div>

      {/* ===== PAY BUTTON ===== */}
      <button className="pay-btn" onClick={openReceipt}>
        Pay ₹{selectedPlan?.walletDeduction || 0}
      </button>

      <Outlet/>
    </div>
  </>
)
};

export default ConfigCharging;
