import React from "react";
import { useNavigate } from "react-router-dom";
import StationImg from "../assets/images/station-img.png";

const OnboardingTwo = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
        .onboarding-page {
          height: 100vh;
          background-color: var(--color-matte-black);
          color: var(--color-white);
          padding-bottom: 80px;
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
          background: #333;
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
          margin-top: -30px;
          margin-bottom: 12px;
          z-index: 2;
          border: 4px solid var(--color-matte-black);
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

        /* Get Started Button */
        .action-container {
          padding: 24px;
          margin-top: 10px;
        }

        .btn-start {
          width: 100%;
          height: 56px;
          background-color: var(--color-white);
          color: var(--color-matte-black);
          border-radius: 28px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .btn-start:active {
           transform: scale(0.98);
        }

        /* Responsive Adjustments */
        @media (max-width: 360px) {
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
           .image-wrapper {
             aspect-ratio: 16/9;
           }
           .step-item p {
             max-width: 100%;
           }
        }
        `}
      </style>

      <div className="onboarding-page page-enter-anim">
        {/* Header */}
        <div className="onboarding-header">
          <h2>Start Charging</h2>
          <p>Begin your session</p>
        </div>

        {/* Steps */}
        <div className="steps-container">
          <div className="steps-grid">
            {/* Step 1 */}
            <div className="step-item">
              <div className="image-wrapper">
                <img src={StationImg} alt="Open App" />
              </div>
              <div className="step-badge">1</div>
              <h4>Open App</h4>
              <p>Launch charging app or website</p>
            </div>

            {/* Step 2 */}
            <div className="step-item">
              <div className="image-wrapper">
                <img src={StationImg} alt="Select Station" />
              </div>
              <div className="step-badge">2</div>
              <h4>Select Station</h4>
              <p>Choose your charging station or Scan QR</p>
            </div>

            {/* Step 3 */}
            <div className="step-item">
              <div className="image-wrapper">
                <img src={StationImg} alt="Start Session" />
              </div>
              <div className="step-badge">3</div>
              <h4>Start Session</h4>
              <p>Tap ‘Start Charging’ button</p>
            </div>

            {/* Step 4 */}
            <div className="step-item">
              <div className="image-wrapper">
                <img src={StationImg} alt="Monitor" />
              </div>
              <div className="step-badge">4</div>
              <h4>Monitor</h4>
              <p>Track status in real-time</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="action-container">
          <button
            className="btn-start"
            onClick={() => navigate("/config-charging")}
          >
            Get Started!
          </button>
        </div>
      </div>
    </>
  );
};

export default OnboardingTwo;
