import React from "react";
import { useNavigate } from "react-router-dom";
import StationImg from "../assets/images/station-img.png";

const OnboardingOne = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
        .onboarding-page {
          height: 100vh;
          background-color: var(--color-matte-black);
          color: var(--color-white);
          padding-bottom: 80px; /* Space for fixed buttons if needed, or just visual buffer */
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          font-family: var(--font-primary);
        }

        .onboarding-header {
          background-color: var(--color-card-bg);
          padding: 32px 24px 40px;
          border-bottom-left-radius: 32px;
          border-bottom-right-radius: 32px;
          text-align: center;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .onboarding-header h2 {
          margin: 0 0 8px;
          font-weight: 700;
          font-size: 24px;
          letter-spacing: -0.5px;
        }

        .onboarding-header p {
          margin: 0;
          opacity: 0.7;
          font-size: 15px;
        }

        .steps-container {
          padding: 0 20px;
          margin-bottom: 20px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          row-gap: 32px;
        }

        /* Step Item Styling */
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .image-wrapper {
          width: 100%;
          aspect-ratio: 1/1;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 12px;
          background: #333; /* Placeholder color before load */
          position: relative;
        }

        .image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.9;
        }

        .step-badge {
          width: 36px;
          height: 36px;
          background-color: var(--color-white);
          color: var(--color-matte-black);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          margin-top: -30px; /* Half overlap or push up */
          margin-bottom: 12px;
          z-index: 2;
          border: 4px solid var(--color-matte-black); /* Creates a 'cutout' look against the background */
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .step-item h4 {
          margin: 0 0 6px;
          font-size: 16px;
          font-weight: 600;
          color: var(--color-white);
        }

        .step-item p {
          margin: 0;
          font-size: 13px;
          line-height: 1.4;
          color: #bbb;
          max-width: 140px;
        }

        /* Buttons matching the design */
        .action-buttons {
          display: flex;
          gap: 16px;
          padding: 24px;
          margin-top: 10px;
        }

        .btn {
          flex: 1;
          height: 52px;
          border-radius: 26px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
        }

        .btn:active {
          transform: scale(0.98);
        }

        .btn-skip {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: var(--color-white);
        }

        .btn-next {
          background: var(--color-white);
          color: var(--color-matte-black);
        }

        /* Responsive Adjustments */
        @media (max-width: 360px) {
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
           .image-wrapper {
             aspect-ratio: 16/9; /* Widescreen for single column */
           }
           .step-item p {
             max-width: 100%;
           }
        }
        `}
      </style>

      <div className="onboarding-page page-enter-anim">
        <div className="onboarding-header">
          <h2>Connect Your Charger</h2>
          <p>Follow these simple steps</p>
        </div>

        <div className="steps-container">
          <div className="steps-grid">
            {/* Step 1 */}
            <div className="step-item">
              <div className="image-wrapper">
                <img src={StationImg} alt="Locate Port" />
              </div>
              <div className="step-badge">1</div>
              <h4>Locate Port</h4>
              <p>Find charging port behind vehicle flap</p>
            </div>

            {/* Step 2 */}
            <div className="step-item">
              <div className="image-wrapper">
                <img src={StationImg} alt="Take Cable" />
              </div>
              <div className="step-badge">2</div>
              <h4>Take Cable</h4>
              <p>Remove cable from station holder</p>
            </div>

            {/* Step 3 */}
            <div className="step-item">
              <div className="image-wrapper">
                <img src={StationImg} alt="Connect Cable" />
              </div>
              <div className="step-badge">3</div>
              <h4>Connect Cable</h4>
              <p>Connect firmly to vehicle port</p>
            </div>

            {/* Step 4 */}
            <div className="step-item">
              <div className="image-wrapper">
                <img src={StationImg} alt="Check Indicator" />
              </div>
              <div className="step-badge">4</div>
              <h4>Check Status</h4>
              <p>Check indicator light is green</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn btn-skip" onClick={() => navigate("/config-charging")}>
            Skip Tutorial
          </button>
          <button className="btn btn-next" onClick={() => navigate("/onboarding-2")}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default OnboardingOne;
