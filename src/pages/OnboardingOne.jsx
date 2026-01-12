import React from "react";
import { useNavigate } from "react-router-dom";

// ✅ Import DIFFERENT images
import StepImg1 from "../assets/images/connect-step-1.png";
import StepImg2 from "../assets/images/connect-step-2.png";
import StepImg3 from "../assets/images/connect-step-3.png";
import StepImg4 from "../assets/images/connect-step-4.png";

const OnboardingOne = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ✅ Internal CSS */}
      <style>
        {`
        .onboarding-page {
          min-height: 100vh;
          background: #fff;
          padding-bottom: 24px;
        }

        .onboarding-header {
          background: #1c1c1c;
          color: #fff;
          padding: 24px;
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
          text-align: center;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 20px;
        }

        .step-card img {
          width: 100%;
          border-radius: 16px;
        }

        .step-number {
          width: 28px;
          height: 28px;
          background: #000;
          color: #fff;
          border-radius: 50%;
          margin: 8px auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-card h4 {
          text-align: center;
          margin: 6px 0 2px;
        }

        .step-card p {
          text-align: center;
          font-size: 13px;
          color: #555;
        }

        .onboarding-actions {
          display: flex;
          gap: 12px;
          padding: 0 20px;
        }

        .skip-btn {
          flex: 1;
          border: 1px solid #000;
          background: #fff;
          padding: 14px;
          border-radius: 30px;
        }

        .next-btn {
          flex: 1;
          background: #000;
          color: #fff;
          padding: 14px;
          border-radius: 30px;
        }
        `}
      </style>

      <div className="onboarding-page">
        {/* Header */}
        <div className="onboarding-header">
          <h2>Connect Your Charger</h2>
          <p>Follow these simple steps</p>
        </div>

        {/* Steps */}
        <div className="steps-grid">
          <div className="step-card">
            <img src={StepImg1} alt="Locate Port" />
            <div className="step-number">1</div>
            <h4>Locate Port</h4>
            <p>Find charging port behind vehicle flap</p>
          </div>

          <div className="step-card">
            <img src={StepImg2} alt="Take Cable" />
            <div className="step-number">2</div>
            <h4>Take Cable</h4>
            <p>Remove cable from station holder</p>
          </div>

          <div className="step-card">
            <img src={StepImg3} alt="Connect Cable" />
            <div className="step-number">3</div>
            <h4>Connect Cable</h4>
            <p>Connect firmly to vehicle port</p>
          </div>

          <div className="step-card">
            <img src={StepImg4} alt="Check Indicator" />
            <div className="step-number">4</div>
            <h4>Check Indicator</h4>
            <p>Check indicator light is green</p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="onboarding-actions">
          <button
            className="skip-btn"
            onClick={() => navigate("/ConfigCharging")}
          >
            Skip Tutorial
          </button>

          <button
            className="next-btn"
            onClick={() => navigate("/OnboardingTwo")}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default OnboardingOne;
