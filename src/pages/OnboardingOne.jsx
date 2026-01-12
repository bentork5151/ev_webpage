import React from "react";
import { useNavigate } from "react-router-dom";

// ✅ Import your image manually
import StepImg from "../assets/images/onboarding-step.png"; 
// ⬆️ put your screenshot image here (rename if needed)

const OnboardingOne = () => {
  const navigate = useNavigate();

  return (
    <div className="onboarding-page">
      {/* Header */}
      <div className="onboarding-header">
        <h2>Connect Your Charger</h2>
        <p>Follow these simple steps</p>
      </div>

      {/* Steps */}
      <div className="steps-grid">
        {/* Step 1 */}
        <div className="step-card">
          <img src={StepImg} alt="step-1" />
          <div className="step-number">1</div>
          <h4>Locate Port</h4>
          <p>Find charging port behind vehicle flap</p>
        </div>

        {/* Step 2 */}
        <div className="step-card">
          <img src={StepImg} alt="step-2" />
          <div className="step-number">2</div>
          <h4>Take Cable</h4>
          <p>Remove cable from station holder</p>
        </div>

        {/* Step 3 */}
        <div className="step-card">
          <img src={StepImg} alt="step-3" />
          <div className="step-number">3</div>
          <h4>Connect Cable</h4>
          <p>Connect firmly to vehicle port</p>
        </div>

        {/* Step 4 */}
        <div className="step-card">
          <img src={StepImg} alt="step-4" />
          <div className="step-number">4</div>
          <h4>Check Indicator</h4>
          <p>Check indicator light is green</p>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="onboarding-actions">
        <button
          className="skip-btn"
          onClick={() => navigate("/config-charging")}
        >
          Skip Tutorial
        </button>

        <button
          className="next-btn"
          onClick={() => navigate("/onboarding-2")}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OnboardingOne;
