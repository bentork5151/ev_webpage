import React from "react";
import { useNavigate } from "react-router-dom";
import StationImg from "../assets/images/station-img.png";

const OnboardingOne = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="onboarding-page page-enter-anim">
        <style>{`
        /* ===== PAGE LAYOUT ===== */
        .onboarding-page {
          height: 100vh;
          width: 100vw;
          position: relative;
          background: var(--color-matte-black);
          color: var(--color-white);
          overflow-y: auto;
          overflow-x: hidden;
          font-family: var(--font-primary);
          display: flex;
          flex-direction: column;
        }

        /* ===== BACKGROUND BLOBS ===== */
        .blob-container {
          position: fixed;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 80vh;
          z-index: 0;
          pointer-events: none;
          opacity: 0.6;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .blob-layer {
          transform-origin: center;
        }
        .blob-dark { fill: #082f20; animation: rotate 30s linear infinite; }
        .blob-green { fill: #008f45; animation: rotate 25s linear infinite reverse; opacity: 0.6; }

        /* ===== CONTENT CONTAINER ===== */
        .content-container {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          flex: 1;
          max-width: 600px;
          margin: 0 auto;
          padding: 24px;
          padding-bottom: 40px;
          width: 100%;
          min-height: 100%;
        }

        /* ===== HEADER ===== */
        .header-section {
          text-align: center;
          margin-bottom: 32px;
          margin-top: 10px;
        }

        .header-section h2 {
          font-size: 28px;
          font-weight: var(--font-weight-bold);
          margin: 0 0 8px;
          line-height: 1.2;
        }

        .header-section p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        /* ===== STEPS GRID ===== */
        .steps-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        /* ===== STEP ITEM ===== */
        .step-item {
          background: rgba(48, 48, 48, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 12px;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
          text-align: left;
          position: relative;
          transition: transform 0.2s;
        }

        .step-item:active {
            transform: scale(0.98);
        }

        .image-wrapper {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          border-radius: 14px;
          overflow: hidden;
          background: rgba(0,0,0,0.2);
        }

        .image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.9;
        }

        .step-badge {
          width: 24px;
          height: 24px;
          background: var(--color-primary-container);
          color: var(--color-on-primary-container);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          position: absolute;
          top: -8px;
          left: -8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          z-index: 2;
        }
        
        .step-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .step-item h4 {
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .step-item p {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.4;
        }

        /* ===== BOTTOM ACTIONS ===== */
        .action-container {
          margin-top: auto;
          padding-bottom: 28px;
          display: flex;
          gap: 16px;
        }

        .btn {
          flex: 1;
          padding: 16px;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        
        .btn:active { transform: scale(0.97); }

        .btn-skip {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .btn-next {
          background: var(--color-primary-container);
          color: var(--color-on-primary-container);
          box-shadow: 0 4px 20px rgba(57, 226, 155, 0.3);
        }
      `}</style>

        {/* ===== BACKGROUND BLOBS ===== */}
        <div className="blob-container">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path className="blob-layer blob-dark" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.9,32.3C59.6,43.1,48.3,51.8,36.5,58.8C24.7,65.8,12.4,71.1,-0.6,72.1C-13.6,73.1,-27.2,69.8,-39.6,62.8C-52,55.8,-63.2,45.1,-71.3,32.2C-79.4,19.3,-84.4,4.2,-81.8,-9.4C-79.2,-23,-69,-35.1,-57.4,-43.8C-45.8,-52.5,-32.8,-57.8,-19.9,-65.4C-7,-73,8.9,-82.9,25.4,-84.2C41.9,-85.5,59,-78.2,44.7,-76.4Z" transform="translate(100 100)" />
            <path className="blob-layer blob-green" d="M41.3,-72.6C53.4,-65.3,63.2,-54.6,70.4,-42.1C77.6,-29.6,82.2,-15.3,81.3,-1.4C80.4,12.5,74,26,64.8,37.3C55.6,48.6,43.6,57.7,30.8,63.2C18,68.7,4.4,70.6,-8.3,69.7C-21,68.8,-32.8,65.1,-43.2,58.3C-53.6,51.5,-62.6,41.6,-68.9,30.1C-75.2,18.6,-78.8,5.5,-75.9,-6.2C-73,-17.9,-63.6,-28.2,-53.4,-36.5C-43.2,-44.8,-32.2,-51.1,-20.9,-58.5C-9.6,-65.9,2,-74.4,14.5,-76.6C27,-78.8,40.4,-74.7,41.3,-72.6Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="content-container">
          <div className="header-section">
            <h2>Connect Your<br />Charger</h2>
            <p>Follow these simple steps to start</p>
          </div>

          <div className="steps-grid">
            {/* Step 1 */}
            <div className="step-item">
              <div className="step-badge">1</div>
              <div className="image-wrapper">
                <img src={StationImg} alt="Locate Port" />
              </div>
              <div className="step-content">
                <h4>Locate Port</h4>
                <p>Find charging port behind vehicle flap</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="step-item">
              <div className="step-badge">2</div>
              <div className="image-wrapper">
                <img src={StationImg} alt="Take Cable" />
              </div>
              <div className="step-content">
                <h4>Take Cable</h4>
                <p>Remove cable from station holder</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="step-item">
              <div className="step-badge">3</div>
              <div className="image-wrapper">
                <img src={StationImg} alt="Connect Cable" />
              </div>
              <div className="step-content">
                <h4>Connect Cable</h4>
                <p>Connect firmly to vehicle port</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="step-item">
              <div className="step-badge">4</div>
              <div className="image-wrapper">
                <img src={StationImg} alt="Check Indicator" />
              </div>
              <div className="step-content">
                <h4>Check Status</h4>
                <p>Check indicator light is green</p>
              </div>
            </div>
          </div>

          <div className="action-container">
            <button className="btn btn-skip" onClick={() => navigate("/config-charging")}>
              Skip
            </button>
            <button className="btn btn-next" onClick={() => navigate("/onboarding-2")}>
              Next Step
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingOne;
