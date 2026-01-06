import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/Logo-1.png"; // replace with your logo path

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "16px", color: "#fff", background: "#303030", minHeight: "100vh" }}>
      {/* Back button */}
      <button 
        style={{ marginBottom: "20px", background: "none", border: "none", color: "#fff", cursor: "pointer" }}
        onClick={() => navigate(-1)}
      >
        &#8592; Back
      </button>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <img src={Logo} alt="Bentork Logo" style={{ height: "60px" }} />
      </div>

      {/* Terms & Conditions content */}
      <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
        <h2>Terms & Conditions</h2>

        <ol>
          <li>
            <strong>Acceptance of Terms</strong><br />
            By accessing, registering, scanning a QR code, or using this EV Charging Platform ("Platform"), the user ("Vehicle Owner/User") agrees to be bound by these Terms & Conditions. If the user does not agree, they must immediately discontinue use of the Platform and charging services.
          </li>

          <li>
            <strong>Nature of Service (Platform Role)</strong><br />
            The Platform acts solely as a technology facilitator enabling access to EV charging infrastructure. The Platform does not guarantee uninterrupted charging, power availability, charging speed, or vehicle performance.
          </li>

          <li>
            <strong>User Eligibility</strong>
            <ul>
              <li>User must be 18 years or older</li>
              <li>User must be the vehicle owner or an authorized driver</li>
              <li>All registration and vehicle details must be accurate and valid</li>
            </ul>
            The Platform reserves the right to suspend or terminate access for incorrect or fraudulent information.
          </li>

          <li>
            <strong>Charging Equipment & OEM Compatibility</strong>
            <ul>
              <li>Users must ensure their vehicle, battery, and connector are OEM-approved and compatible with the charger.</li>
              <li>Charging shall be done strictly as per vehicle OEM guidelines and charger instructions.</li>
              <li>The Platform is not responsible for damage caused due to:
                <ul>
                  <li>Non-standard connectors</li>
                  <li>Aftermarket modifications</li>
                  <li>Battery defects or ageing</li>
                  <li>Software or BMS incompatibility</li>
                </ul>
              </li>
            </ul>
          </li>

          <li>
            <strong>Tariffs, Billing & Payments</strong>
            <ul>
              <li>Tariffs are displayed on the Platform and may vary by location, charger type, and duration</li>
              <li>Payment must be completed through approved digital payment modes</li>
              <li>The Platform is not liable for payment failures caused by banks, UPI providers, or gateways</li>
              <li>Idle fees, overstay charges, or penalties may apply where displayed</li>
            </ul>
          </li>

          <li>
            <strong>User Responsibilities</strong>
            <ul>
              <li>Follow all safety instructions displayed on the charger and app</li>
              <li>Ensure proper use of the charging service</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default TermsPage;
