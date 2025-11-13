import React, { useEffect, useState } from "react";
import "./../assets/style/Login.css";
import bentork_logo from "../assets/images/bentork_logo.png";
import onboarding from "../assets/images/onboarding.png";

export default function Login() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 200); // Delay before animation starts
  }, []);

  const handleGoogleSignIn = () => {
    alert("Google Sign-In Clicked!");
    // Later: Add Google OAuth logic here
  };

  return (
    <div className={`login-container ${animate ? "fade-in" : ""}`}>
      <img src={bentork_logo} alt="Bentork Logo" className="login-logo" />

      <div className="onboarding-container">
        <img src={onboarding} alt="Onboarding" className="onboarding-img" />
      </div>

      <div className="text-section">
        <h1 className="welcome-text">Welcome</h1>
        <p className="subtitle-text">One-Tap Login</p>
      </div>

      <button className="google-btn" onClick={handleGoogleSignIn}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google Logo"
          className="google-icon"
        />
        Sign in with Google
      </button>
    </div>
  );
}
