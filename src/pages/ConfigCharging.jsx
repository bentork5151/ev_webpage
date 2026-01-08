import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useCharging } from '../store/ChargingContext'
import "@material/web/slider/slider.js";
import WalletIcon from "../assets/images/wallet.svg";
import Logo from "../assets/images/logo-1.png";
import StationImg from "../assets/images/station-img.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DownloadAppImg from "../assets/images/downloadPage.png";
import { useAuth } from "../store/AuthContext";

import "../assets/styles/global.css";

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
        { label: "Terms & Conditions", icon: <DescriptionIcon />, path: "/terms" },
        { label: "Privacy Policy", icon: <PrivacyTipIcon /> },
        { label: "About Us", icon: <InfoOutlinedIcon /> }
      ]
    }
  ]
};











const ConfigCharging = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
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
  padding-top: 68px;
  padding-bottom: 100px;
  font-family: Roboto, sans-serif;
}

/* ===== TOP BAR ===== */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 62px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  z-index: 100;
  background: #212121;

  
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu {
  font-size: 40px;
  font-weight: var(--font-weight-regular);
}

.top-logo {
  height: 68px;
  width: 128px;
}

.wallet-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background:#303030;
  border-radius: 16px;
  border: none;
  color: #fff;
  font-size: 12px;
  font-family: var(--font-primary);
  font-weight: var(--font-weight-medium);
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
  background: var(--color-matte-black);
  border-radius: 22px;
  overflow: hidden;
}



.side-drawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 90%;
  max-width: 347px;
  background: #212121;
  transform: translateX(-100%);
  transition: transform 0.35s ease;
  z-index: 101;
  border-radius: 0 28px 28px 0;
  display: flex;
  flex-direction: column;
  padding-left: 0px;
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
  transform: translateX(0%);
}


/* ===== HEADER ===== */
.drawer-header {
  padding: 20px 8px 0 0;
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
  padding: 8px 0;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-white);
}

.drawer-menu .item svg {
  margin-top: 6px;
  font-size: 18px;
  opacity: 0.85;
}

.avatar svg {
  border-radius: 25%;
  font-size: 42px;
  opacity: 0.9;
}

/* ===== LOGOUT ===== */
.logout-btn {
  position: absolute;
  bottom: 0;
  width: 88%;
  margin: 18px 0px;
  padding: 12px 10px;
  background: #7b2c2c;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 12px;
}


/* ===== CHARGER CARD ===== */
.charger-card {
  margin: 8px;
  background: #212121;
  border-radius: 12px;
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  height: fit-content;
    
}

.charger-info h1 {
  font-size: 24px;
  font-weight: var(--font-weight-medium);
}

.charger-info h2 {
  margin-top:-10px;
  font-size: 18px;
  font-weight: var(--font-weight-regular);
}

.charger-name {
  margin-top: 40%;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
}

.charger-meta {
  margin-top:2px;
  font-size: 12px;
  font-weight: var(--font-weight-regular);
}

.charger-img {
  height: 200px;
  width: 130px;
}

/* ===== SLIDER ===== */
.label {
  font-weight: var(--font-weight-regular);
  margin: 18px 0 6px;
  font-size: 12px;
  padding: 0px 16px;
}

md-slider {
  width: 100%;
  --md-sys-color-primary: var(--color-primary-container);
  --md-sys-color-secondary: var(--color-on-primary-container);
  --md-slider-active-track-height: 20px;
  --md-slider-inactive-track-height: 20px;
  --md-slider-active-track-color: var(--color-primary-container);
  --md-slider-inactive-track-color: var(--color-on-primary-container);
  --md-slider-handle-width: 4px;
  --md-slider-handle-height: 40px;
  --md-slider-handle-shape: 4px;
  --md-slider-tick-color: var(--color-on-primary-container);
  --md-slider-tick-active-color: var(--color-primary-container);
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
  padding: 6px 18px;
  border: 1px solid var(--color-primary-container);
  border-radius: 99px;
  color: var(--color-primary-container);
  font-size: 12px;
  font-weight: var(--font-weight-regular);
}

.plans {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
}

.plan {
  background: #212121;
  padding: 12px 18px;
  border-radius: 18px;
  border: 1px solid var(--color-on-primary-container);
  display: flex;
  height: fit-content;
  justify-content: space-between;
  align-items: center;
}
.plan strong{
  font-size: 18px;
    font-weight: 600;
}
.plan span {
  font-size: 12px;
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
  outline: 2px solid var(--color-primary-container);
}

/* ===== PAY BUTTON ===== */
.pay-btn {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 95%;
  max-width: 420px;
  padding: 14px 24px;
  background: #ffffffff;
  color: var(--color-matte-black);
  border-radius: 12px;
  font-size: 14px;
  font-family: var(--font-primary);
  font-weight: var(--font-weight-semibold);
  border: none;
  z-index: 99;
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
            ₹{Number(user?.walletBalance ?? 0).toLocaleString("en-IN")}
          </button>

        </div>


        {/* ===== OVERLAY ===== */}
        {/* ===== OVERLAY ===== */}
        <div
          className={`drawer-overlay ${drawerOpen ? "show" : ""}`}
          onClick={() => setDrawerOpen(false)}
        />


        {/* ===== SIDE DRAWER ===== */}
        <div className={`side-drawer ${drawerOpen ? "open" : ""}`}>
          <div className="drawer-box" onClick={(e) => e.stopPropagation()}>
            {/* USER HEADER */}
            <div className="drawer-header">
              <div className="user-info">
                <div className="avatar">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt="avatar"
                      style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                    />
                  ) : (
                    sidebarConfig.user.avatar
                  )}
                </div>
                <div>
                  <strong className="text-semibold">{user?.name || sidebarConfig.user.name}</strong>
                  <p className="text-regular">{user?.email || sidebarConfig.user.email}</p>
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
    setDrawerOpen(false);

    if (item.label === "My Wallet") {
      navigate("/dashboard");
    } else if (item.label === "Terms & Conditions") {
      navigate("/terms");
    } else if (item.label === "Privacy Policy") {
      navigate("/privacy");
    } else if (item.label === "About Us") {
      navigate("/about");
    } else if (item.label === "Download App") {
      setDownloadDialogOpen(true); // open dialog
    } else if (item.label === "Help") {
      window.open("https://bentork.com/contacts/",); // open in new tab
      // OR use this to open in same tab:
      // window.location.href = "https://bentork.com/contacts/";
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
              • Type: {chargerData?.connectorType || "CSS2"}<br />
              • Power: {chargerData?.chargerType || "AC"}
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
          Start
          {/* Pay ₹{selectedPlan?.walletDeduction || 0} */}
        </button>

{/* Download Dialog */}
      {downloadDialogOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
          onClick={() => setDownloadDialogOpen(false)}
        >
          <div
            style={{
              background: "#212121",
              padding: "20px",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "400px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <CloseIcon
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                cursor: "pointer",
                color: "#fff",
              }}
              onClick={() => setDownloadDialogOpen(false)}
            />

            {/* Image */}
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <img
                src={DownloadAppImg}
                alt="Coming Soon"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </div>

            {/* Text */}
            <h2
              style={{
                textAlign: "center",
                marginBottom: "8px",
                color: "#fff",
              }}
            >
              Coming Soon
            </h2>
            <p style={{ textAlign: "center", color: "#aaa" }}>Stay Tuned!</p>
          </div>
        </div>
      )}



        <Outlet />
      </div>
    </>
  )
};

export default ConfigCharging;



