  import React from "react";
import { useNavigate } from "react-router-dom";

// ✅ Import 4 DIFFERENT images manually
import StepImg1 from "../assets/images/onboarding-step-5.png";
import StepImg2 from "../assets/images/onboarding-step-6.png";
import StepImg3 from "../assets/images/onboarding-step-7.png";
import StepImg4 from "../assets/images/onboarding-step-8.png";

const OnboardingTwo = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ✅ Internal CSS */}
      <style>
        {`
        .onboarding-two {
          min-height: 100vh;
          background: #fff;
          padding-bottom: 24px;
        }

        .onboarding-header {
          background: #1c1c1c;
          color: #fff;
          padding: 28px 24px;
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

        .step-card {
          text-align: center;
        }

        .step-card img {
          width: 100%;
          border-radius: 16px;
        }

        .step-number {
          width: 30px;
          height: 30px;
          background: #000;
          color: #fff;
          border-radius: 50%;
          margin: 10px auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-card h4 {
          margin: 6px 0 4px;
        }

        .step-card p {
          font-size: 13px;
          color: #666;
        }

        .cta-container {
          padding: 0 20px;
          margin-top: 20px;
        }

        .cta-btn {
          width: 100%;
          background: #1c1c1c;
          color: #fff;
          padding: 16px;
          border-radius: 30px;
          font-size: 16px;
          border: none;
        }
        `}
      </style>

      <div className="onboarding-two">
        {/* Header */}
        <div className="onboarding-header">
          <h2>Start Charging</h2>
          <p>Begin your session</p>
        </div>

        {/* Steps */}
        <div className="steps-grid">
          <div className="step-card">
            <img src={StepImg1} alt="Open App" />
            <div className="step-number">1</div>
            <h4>Open App</h4>
            <p>Launch charging app or website</p>
          </div>

          <div className="step-card">
            <img src={StepImg2} alt="Select Station" />
            <div className="step-number">2</div>
            <h4>Select Station OR Scan QR</h4>
            <p>Choose your charging station</p>
          </div>

          <div className="step-card">
            <img src={StepImg3} alt="Start Session" />
            <div className="step-number">3</div>
            <h4>Start Session</h4>
            <p>Tap ‘Start Charging’ button</p>
          </div>

          <div className="step-card">
            <img src={StepImg4} alt="Monitor Charging" />
            <div className="step-number">4</div>
            <h4>Monitor</h4>
            <p>Track status in real-time</p>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-container">
          <button
            className="cta-btn"
            onClick={() => navigate("/ConfigCharging")}
          >
            Get Started!
          </button>
        </div>
      </div>
    </>
  );
};

export default OnboardingTwo;
