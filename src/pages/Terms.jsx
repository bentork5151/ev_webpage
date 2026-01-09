import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "../assets/styles/global.css";

const TermsPage = () => {
  const navigate = useNavigate();
  const [hasAccepted, setHasAccepted] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('terms_accepted') === 'true';
    setHasAccepted(accepted);
  }, []);

  const handleAccept = () => {
    if (isChecked) {
      localStorage.setItem('terms_accepted', 'true');
      setHasAccepted(true);
      navigate('/config-charging', { replace: true });
    }
  };

  return (
    <div className="legal-page">
      {/* HEADER: Show Back Button ONLY if previously accepted */}
      <div className="legal-header">
        {hasAccepted && (
          <div className="back-btn" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon className="back-icon" />
          </div>
        )}
      </div>

      {/* PAGE TITLE */}
      <div className="page-title-container">
        <h1>Terms & Conditions</h1>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="legal-content">
        <div className="section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing, registering, scanning a QR code, or using this EV Charging Platform (“Platform”), the user (“Vehicle Owner/User”) agrees to be bound by these Terms & Conditions. If the user does not agree, they must immediately discontinue use of the Platform and charging services.
          </p>
        </div>

        <div className="section">
          <h2>2. Nature of Service (Platform Role)</h2>
          <p>
            The Platform acts solely as a technology facilitator enabling access to EV charging infrastructure. The Platform does not guarantee uninterrupted charging, power availability, charging speed, or vehicle performance.
          </p>
        </div>

        <div className="section">
          <h2>3. User Eligibility</h2>
          <ul>
            <li>User must be 18 years or older</li>
            <li>User must be the vehicle owner or an authorized driver</li>
            <li>All registration and vehicle details must be accurate and valid</li>
          </ul>
          <p>The Platform reserves the right to suspend or terminate access for incorrect or fraudulent information.</p>
        </div>

        <div className="section">
          <h2>4. Charging Equipment & OEM Compatibility</h2>
          <ul>
            <li>Users must ensure their vehicle, battery, and connector are OEM-approved and compatible with the charger</li>
            <li>Charging shall be done strictly as per vehicle OEM guidelines and charger instructions</li>
            <li>The Platform is not responsible for damage caused due to:
              <ul>
                <li>Non-standard connectors</li>
                <li>Aftermarket modifications</li>
                <li>Battery defects or ageing</li>
                <li>Software or BMS incompatibility</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="section">
          <h2>5. Tariffs, Billing & Payments</h2>
          <ul>
            <li>Tariffs are displayed on the Platform and may vary by location, charger type, and duration</li>
            <li>Payment must be completed through approved digital payment modes</li>
            <li>The Platform is not liable for payment failures caused by banks, UPI providers, or gateways</li>
            <li>Idle fees, overstay charges, or penalties may apply where displayed</li>
          </ul>
        </div>

        <div className="section">
          <h2>6. User Responsibilities</h2>
          <p>The user agrees to:</p>
          <ul>
            <li>Follow all safety instructions displayed on the charger and app</li>
            <li>Handle connectors and cables carefully</li>
            <li>Vacate the charging bay immediately after session completion</li>
            <li>Not tamper with, misuse, or damage charging infrastructure</li>
          </ul>
          <p>Failure may result in penalties, suspension, or permanent ban.</p>
        </div>

        <div className="section">
          <h2>7. ACCIDENT, DAMAGE & LIABILITY DISCLAIMER</h2>
          <p>The user expressly agrees that:</p>
          <ul>
            <li>Any accident, injury, fire, explosion, electric shock, short circuit, vehicle damage, battery failure, or loss occurring at or around the charging station during or after charging shall be the sole responsibility of the vehicle owner/user</li>
            <li>The Platform, charging station owner, operator, landlord, OEM, manufacturer, or technology provider shall not be liable for any direct or indirect losses arising from:
              <ul>
                <li>User negligence or improper usage</li>
                <li>Incompatible or defective vehicles or batteries</li>
                <li>Power fluctuations or grid failures</li>
                <li>Environmental or third-party factors</li>
              </ul>
            </li>
          </ul>
          <p>Charging is undertaken entirely at the user’s own risk.</p>
        </div>

        <div className="section">
          <h2>8. INDEMNITY & WAIVER</h2>
          <p>
            The user agrees to fully indemnify, defend, and hold harmless the Platform, charging station owner, operators, affiliates, directors, employees, and partners against:
          </p>
          <ul>
            <li>Any claims, damages, losses, legal costs, injuries, or liabilities</li>
            <li>Arising out of user actions, misuse, negligence, accidents, or vehicle-related issues</li>
            <li>Including third-party claims, insurance claims, or regulatory actions</li>
          </ul>
          <p>The user waives all rights to initiate any legal, civil, or criminal claims against the Platform for such incidents.</p>
        </div>

        <div className="section">
          <h2>9. Insurance Alignment Clause</h2>
          <ul>
            <li>The Platform does not provide vehicle, battery, or personal insurance</li>
            <li>Users are advised to maintain valid motor insurance and OEM warranty</li>
            <li>Any claim must be raised with the user’s insurer or vehicle manufacturer</li>
            <li>The Platform shall not be responsible for claim rejection by insurers or OEMs</li>
          </ul>
        </div>

        <div className="section">
          <h2>10. Service Availability</h2>
          <p>Charging services may be unavailable due to:</p>
          <ul>
            <li>Maintenance</li>
            <li>Power outages</li>
            <li>Network or software issues</li>
            <li>Force majeure events</li>
          </ul>
          <p>No compensation shall be payable for such interruptions.</p>
        </div>

        <div className="section">
          <h2>11. Data & Privacy</h2>
          <ul>
            <li>Charging data, usage history, and transactions may be recorded</li>
            <li>Data is used for operational, compliance, and analytical purposes</li>
            <li>Personal data will not be sold, except where legally required</li>
          </ul>
        </div>

        <div className="section">
          <h2>12. Account Suspension & Termination</h2>
          <p>The Platform may suspend or terminate access without notice for:</p>
          <ul>
            <li>Safety violations</li>
            <li>Fraudulent activity</li>
            <li>Repeated misuse</li>
            <li>Legal or regulatory requirements</li>
          </ul>
        </div>

        <div className="section">
          <h2>13. Governing Law & Jurisdiction</h2>
          <p>
            This Terms & Conditions shall be governed by and interpreted in accordance with the laws of India, and the courts located in Pune, Maharashtra shall have exclusive jurisdiction over all matters arising out of or relating to this Policy.
          </p>
        </div>

        <div className="section">
          <h2>14. Customer Support & Assistance</h2>
          <p>The Platform provides customer support to assist users with:</p>
          <ul>
            <li>Charging session initiation or termination issues</li>
            <li>Billing or transaction-related queries</li>
            <li>Charger status or visibility concerns</li>
          </ul>
          <p>
            Customer support may be accessed through the in-app support feature, helpline number, or email, as displayed on the Platform.
          </p>
          <p>
            While the Platform will make reasonable efforts to assist users, resolution timelines may vary depending on the nature of the issue, charger ownership, or third-party dependencies.
          </p>
        </div>

        <div className="section">
          <h2>15. Failed Charging Sessions & Refund Handling</h2>
          <p>A charging session may be considered a failed or incomplete session if:</p>
          <ul>
            <li>Charging does not start after successful payment</li>
            <li>Charging stops unexpectedly due to charger or system malfunction</li>
            <li>Power or network failure occurs at the charging station</li>
          </ul>

          <p className="sub-title">Refund Policy:</p>
          <ul>
            <li>Users may raise a support request for failed sessions through the Platform</li>
            <li>Refunds, if applicable, shall be processed as per the Platform’s internal refund policy</li>
            <li>Refund eligibility may be limited to the unused or undelivered charging amount</li>
            <li>Processing timelines may vary based on payment gateway or bank procedures</li>
          </ul>

          <p className="sub-title">No refund shall be applicable for:</p>
          <ul>
            <li>User-initiated session termination</li>
            <li>Vehicle or battery-related issues</li>
            <li>Incompatible vehicle or connector usage</li>
          </ul>
        </div>

        <div className="section">
          <h2>16. Safety Assistance & Escalation</h2>
          <p>The Platform prioritizes user safety and may provide:</p>
          <ul>
            <li>Safety instructions displayed on the app or charging station</li>
            <li>Emergency contact details where applicable</li>
            <li>Basic escalation guidance in case of charger malfunction</li>
          </ul>
          <p>However, the user acknowledges that:</p>
          <ul>
            <li>The Platform does not provide on-site supervision or emergency services</li>
            <li>The Platform shall not be liable for accidents, injuries, or damages</li>
            <li>In case of emergency, users must immediately contact local emergency services</li>
          </ul>
          <p>
            Any assistance provided by the Platform shall be considered good-faith support and shall not be construed as acceptance of liability.
          </p>
        </div>

        <div className="section">
          <h2>17. CHARGER-TYPE SPECIFIC CLAUSES</h2>

          <p className="sub-title">A. Public Charging Stations</p>
          <ul>
            <li>Open to general public</li>
            <li>Users must follow parking rules and local regulations</li>
            <li>Platform not responsible for vehicle theft or vandalism</li>
          </ul>

          <p className="sub-title">B. Highway / Fast Charging Stations</p>
          <ul>
            <li>High-voltage & fast charging involved</li>
            <li>Users must remain alert and follow safety signage</li>
            <li>Platform not responsible for emergency situations or towing</li>
          </ul>

          <p className="sub-title">C. Residential Charging (Society / Apartment)</p>
          <ul>
            <li>Charging subject to society rules and power allocation</li>
            <li>Platform not liable for internal wiring, load issues, or society disputes</li>
          </ul>

          <p className="sub-title">D. Commercial / Workplace Charging</p>
          <ul>
            <li>Charging access governed by property owner policies</li>
            <li>Platform not responsible for employment or access-related disputes</li>
          </ul>
        </div>

        {/* CONDITIONALLY RENDER ACCEPT BUTTON */}
        {!hasAccepted && (
          <div className="action-footer" style={{ flexDirection: 'column', display: 'flex', gap: '16px' }}>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="terms-check"
                className="custom-checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label htmlFor="terms-check" className="checkbox-label">
                I agree to the Terms & Conditions
              </label>
            </div>
            <button
              className={`accept-btn ${!isChecked ? 'disabled-btn' : ''}`}
              onClick={handleAccept}
              disabled={!isChecked}
            >
              Accept & Continue
            </button>
          </div>
        )}
      </div>

      <style>{`
        /* ===== PAGE LAYOUT ===== */
        .legal-page {
          display: flex;
          flex-direction: column;
          height: 100vh; /* Fallback */
          height: 100dvh;
          width: 100%;
          max-width: 100vw;
          background: var(--color-matte-black);
          color: var(--color-white);
          font-family: var(--font-primary);
          overflow: hidden;
          animation: fadeIn 0.4s ease-out;
          box-sizing: border-box;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ===== HEADER ===== */
        .legal-header {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          padding: 24px 24px 16px 24px;
          padding-top: calc(24px + env(safe-area-inset-top));
          padding-left: calc(24px + env(safe-area-inset-left));
          padding-right: calc(24px + env(safe-area-inset-right));
          background: transparent;
          z-index: 10;
          min-height: 80px; 
        }

        .back-btn {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0; /* Prevent squishing */
        }
        
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
        }

        .back-icon {
          font-size: 24px !important;
          color: var(--color-white);
        }

        /* ===== TITLE ===== */
        .page-title-container {
          padding: 0 24px 10px;
          padding-left: calc(24px + env(safe-area-inset-left));
          padding-right: calc(24px + env(safe-area-inset-right));
          flex: 0 0 auto;
          width: 100%;
        }

        .page-title-container h1 {
          font-size: clamp(24px, 5vw, 32px);
          font-weight: var(--font-weight-bold);
          color: var(--color-primary-container);
          margin: 0;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 10px rgba(57, 226, 155, 0.1);
          line-height: 1.2;
        }

        /* ===== SCROLLABLE CONTENT ===== */
        .legal-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 0 24px 40px;
          padding-left: calc(24px + env(safe-area-inset-left));
          padding-right: calc(24px + env(safe-area-inset-right));
          padding-bottom: calc(40px + env(safe-area-inset-bottom));
          font-size: 14px;
          line-height: 1.6;
          opacity: 0.9;
          width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word; /* Crucial for preventing overflow */
        }

        .section {
          margin-bottom: 24px;
          max-width: 100%;
        }

        .legal-content h2 {
          font-size: clamp(16px, 4vw, 18px);
          margin-bottom: 12px;
          color: var(--color-white);
          font-weight: var(--font-weight-semibold);
          border-left: 3px solid var(--color-primary-container);
          padding-left: 12px;
          line-height: 1.4;
        }
        
        .sub-title {
          font-weight: var(--font-weight-medium);
          color: var(--color-white);
          margin-top: 12px;
          margin-bottom: 4px !important;
          font-size: 15px;
        }

        .legal-content p {
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.75);
          font-weight: var(--font-weight-light);
          max-width: 100%;
        }

        .legal-content ul {
          padding-left: 20px;
          margin: 8px 0;
          color: rgba(255, 255, 255, 0.75);
        }

        .legal-content li {
          margin-bottom: 6px;
        }
        
        .legal-content ul ul {
            margin-top: 4px;
            margin-bottom: 4px;
        }

        /* ===== FOOTER ACTION (Custom) ===== */
        .action-footer {
          margin-top: 32px;
          margin-bottom: 16px;
          width: 100%;
        }

        .checkbox-container {
            display: flex;
            align-items: flex-start; /* Align top for multiple lines */
            gap: 12px;
            padding: 12px;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.1);
            width: 100%;
        }
        
        .custom-checkbox {
            width: 18px;
            height: 18px;
            min-width: 18px; /* Prevent squishing */
            margin-top: 2px;
            accent-color: var(--color-primary-container);
            cursor: pointer;
        }

        .checkbox-label {
            font-size: 14px;
            color: #fff;
            cursor: pointer;
            font-weight: 500;
            line-height: 1.4;
        }
        
        .accept-btn {
          width: 100%;
          padding: 14px;
          border: none;
          outline: none;
          background: var(--color-primary-container);
          color: var(--color-on-primary-container);
          font-size: 16px;
          font-weight: var(--font-weight-semibold);
          border-radius: var(--radius-outer);
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px; /* Ensure spacing if wrap somehow fails */
        }
        
        .accept-btn:active {
            transform: scale(0.98);
        }

        .disabled-btn {
            opacity: 0.5;
            cursor: not-allowed;
            background: #444;
            color: #888;
        }

        /* ===== SCROLLBAR STYLING ===== */
        .legal-content::-webkit-scrollbar {
          width: 4px;
        }
        .legal-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .legal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        /* ===== RESPONSIVE STYLES ===== */
        @media (max-width: 480px) {
          .legal-header {
            padding: 16px 16px 10px 16px;
            padding-top: calc(16px + env(safe-area-inset-top));
            padding-left: calc(16px + env(safe-area-inset-left));
            padding-right: calc(16px + env(safe-area-inset-right));
          }
          .page-title-container {
            padding: 0 16px 10px;
            padding-left: calc(16px + env(safe-area-inset-left));
            padding-right: calc(16px + env(safe-area-inset-right));
          }
          .legal-content {
            padding: 0 16px 30px;
            padding-left: calc(16px + env(safe-area-inset-left));
            padding-right: calc(16px + env(safe-area-inset-right));
            padding-bottom: calc(30px + env(safe-area-inset-bottom));
          }
          .checkbox-container {
             padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default TermsPage;
