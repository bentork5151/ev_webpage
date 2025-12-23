import React from "react";
import { Outlet } from "react-router-dom";
import { useCharging } from '../store/ChargingContext'
import "@material/web/slider/slider.js";

const ConfigCharging = () => {
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


  return (
    <>
      <style>{`
        html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family: Arial, sans-serif;
        overflow: hidden;   /* ✅ STOP PAGE SCROLL */
      }

       .page {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
  height: calc(100vh - 80px); /* ✅ FULL SCREEN */
  box-sizing: border-box;
  overflow: hidden; /* ✅ NO VERTICAL SCROLL */
}

        .header {
         display: flex;
  justify-content: flex-start; /* 👈 move logo to left */
 
  margin-bottom: 8px;
         
         
        }
/* ===== MAIN WRAPPER ===== */
.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

/* ===== LEFT ===== */
.left-content {
  width: 50%;
}

/* ===== RIGHT ===== */
.right-content {
  width: 50%;
  display: flex;
  justify-content: center;
}
        /* ===== TITLE ===== */
.top-flex {
  margin: 20px 0 18px;
}

.title {
  font-size: 42px;
  font-weight: 300;
  line-height: 1.1;
}

.sub {
  font-size: 18px;

    font-weight: 300;
}
/* ===== STATION LAYOUT ===== */
.station-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
       /* ===== STATION CARD ===== */
.station {
  background: #212121;
  color: #fff;
  padding: 12px 6px;
  border-radius: 12px;
 
}

.station-title {
  display: block;
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 10px;
}
  .station-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.station-list li {
  font-size: 12px;
  line-height: 1.6;
  color: #fffefeff;
  position: relative;
  padding-left: 14px;
  font-weight: 300;
}

.station-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #ffffff;
}

      

        /* ===== IMAGE ===== */
.station-img {
  width: 166px;
  height: 190px;


}

        .label {
          font-weight: 400;
          margin: 20px 0 8px;
           font-size: 14px;
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

      .scroll {
  display: flex;
  gap: 14px;
  overflow-x: auto;   /* ✅ only horizontal scroll */
  overflow-y: hidden;
  padding: 10px 0;
  -webkit-overflow-scrolling: touch;
}

       .card {
  min-width: 150px;
  padding: 16px;
  border-radius: 16px;
  border: 2px solid #e6e6e6;
  background: #f5f5f5;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  text-align: center;
  transition: all 0.25s ease;
}

       .card.selected {
  border: 2px solid #67B84B;
  background: #fff;
}

       .popular {
  position: absolute;
  top: -12px;
  left: 16px;
  background: #67B84B;
  color: #fff;
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
}
.card:hover {
  transform: translateY(-3px);
}
        .card strong {
          font-size: 18px;
          font-weight: 400;

        }

        .time {
          margin-top: 8px;
          color: #333;
        }

        .price {
          margin-top: 10px;
          color: #67B84B;
          font-weight: 700;
          font-size: 18px;
        }

        .info {
          text-align: center;
          margin: 16px 0;
          color: #67B84B;
          font-size: 14px;
        }

        .pay-bar {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 400px;
          background: #111;
          color: white;
          padding: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          z-index: 1000;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .title { font-size: 24px; }
          .sub { font-size: 14px; }
         
          .card strong { font-size: 18px; }
          .price { font-size: 18px; }
        }



       .dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.48);
  display: flex;
  justify-content: center; /* center horizontally */
  align-items: center;     /* center vertically */
  z-index: 999;
}
       .dialog {
  background: #fff;
  width: 90%;
  max-width: 400px;
  border-radius: 16px;
  padding: 16px;
  animation: scaleUp 0.3s ease;
}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .section{border-radius:16px;padding:14px;margin-bottom:12px;
          border: 0.5px solid #0000004b;

        }
          .help{
          font-size: 10px;
          font-weight: 700;
          margin-left: 30px;
          color: #852221;
  text-decoration: underline;
  cursor: pointer

          }
  .help:hover {
  opacity: 0.8;
}
  .row-1{font-size: 12px;
          font-weight: 400;
          justify-content:space-between;
            border-radius: 12px;
            color: #852221;
          
          }
     
.blue{background:#f1f8ff;border:1px solid #cce3ff}
        .green{background:#eaffdb}
        .Red{background:#F9DEDC}
        .row{display:flex;justify-content:space-between;margin:10px 0;     font-size: 12px;
          font-weight: 400;
           margin-left: 35px;
          
        }
          .dialog-title{
          font-size: 16px;
          font-weight: 400;
            padding: 10px;
          }
            .dialog-sub{
            font-size: 14px;
          font-weight: 400;
          }
          .divider {
  margin: 12px 0;
  border: none;
  border-top: 1px solid #ddd;
}
  .row.total {
  font-size: 16px;
}

        .pay-btn{background:#111;color:#fff;padding:16px;border-radius:16px;text-align:center;margin-top:12px;
         font-size: 12px;
          font-weight: 500;
        }

        .loading-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 16px;
          min-width: 150px;
          height: 100px;
        }
      
      `}</style>

      <div className="page">
        <div className="header">
          <img
            src="https://github.com/bentork5151/assets/blob/main/Logo/logo_transparent.png?raw=true"
            alt="BENTORK Logo"
            style={{ height: "55px", objectFit: "contain", width: "200px" }}
          />
        </div>

      <div className="top-section">
  {/* LEFT SIDE */}
  <div className="left-content">
    <div className="top-flex">
      <div className="title">Charging</div>
      <div className="sub">Configuration</div>
    </div>

    <div className="station">
      <div className="station-text">
        <strong className="station-title">🔌 Station</strong>

        <ul className="station-list">
          <li>{chargerData?.name || "Bentork EV Station"}</li>
          <li>Charger: {chargerData?.connectorType || "Type 2"}</li>
          <li>Power: {chargerData?.chargerType === "DC" ? "DC" : "AC"}</li>
        </ul>
      </div>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="right-content">
    <img
      className="station-img"
      src="https://raw.githubusercontent.com/bentork5151/assets/19d62ecada81d6658614b7da7360f863b727105a/Illustrations/undraw_editable_y4ms.svg"
      alt="EV Illustration"
    />
  </div>
</div>



        <div className="label">Custom Power Range</div>
        <md-slider
          labeled
          min="0"
          max="1"
          step="0.1"
          value={powerValue}  
         onInput={(e) => updatePowerValue(Number(e.target.value))}
        ></md-slider>

        <div className="label">Based on Time</div>
       <div className="scroll">
        {plansLoading ? (
          <>
            <div className="loading-skeleton" />
              <div className="loading-skeleton" />
              <div className="loading-skeleton" />
          </>
        ):(
          plans.map((plan) => (
            <div
              key={plan.id}
              className={`card ${selectedPlan?.id === plan.id ? "selected" : ""}`}
              onClick={() => selectPlan(plan)}
            >
              {selectedPlan?.id === plan.id && (
                <div className="popular">Popular</div>
              )}
              <strong>{plan.planName}</strong>
              <div className="time">{plan.durationMin} mins</div>
              <div className="price">₹{plan.walletDeduction}</div>
            </div>
          ))
        )}
        </div>


        <div className="label">Based on Power</div>
        <div className="scroll">
          {plansLoading ? (
          <>
            <div className="loading-skeleton" />
              <div className="loading-skeleton" />
              <div className="loading-skeleton" />
          </>
          ):(
          plans.map((plan) => (
            <div
              key={plan.id + "p"}
              className={`card ${selectedPlan?.id === plan.id ? "selected" : ""}`}
              onClick={() => selectPlan(plan)}
            >
              <strong>{plan.planName} kWh</strong>
              <div className="time">{plan.durationMin} mins</div>
              <div className="price">₹{plan.walletDeduction}</div>
            </div>
          ))
        )} 
        </div>

        <div className="info">✓ Optimal charging rates for your vehicle</div>
      </div>

      {/* <div className="pay-bar" onClick={handleConfirm}>
        Pay ₹{selectedPlan?.walletDeduction || "0.00"}
      </div> */}

      <div className="pay-bar" onClick={openReceipt}>
        PAY ₹{selectedPlan?.walletDeduction || 0}
      </div>

      
      <Outlet/>
    </>
  );
};

export default ConfigCharging;
