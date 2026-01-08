import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      {/* HEADER */}
      <div className="legal-header">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon fontSize="small" />
        </div>
        <h1>Privacy Policy</h1>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="legal-content">
        <h2>1. Purpose & Commitment</h2>
        <p>
          This Privacy Policy describes how the EV Charging Platform (“Platform”, “Company”, “We”) collects, uses, stores, and protects personal and operational data of users (“User”, “Vehicle Owner”).
        </p>
        <ul>
          <li>Protecting user privacy</li>
          <li>Using data responsibly and lawfully</li>
          <li>Maintaining transparency and trust</li>
        </ul>

        <h2>2. Information We Collect</h2>
        <p><strong>a) User Information</strong></p>
        <ul>
          <li>Name</li>
          <li>Mobile number</li>
          <li>Email address</li>
        </ul>

        <p><strong>b) Vehicle & Charging Information</strong></p>
        <ul>
          <li>Vehicle category and connector type</li>
          <li>Charging station location</li>
          <li>Charging session duration and energy consumption</li>
          <li>Session status and charger ID</li>
        </ul>

        <p><strong>c) Payment & Transaction Data</strong></p>
        <ul>
          <li>Transaction reference numbers</li>
          <li>Payment status and timestamps</li>
        </ul>

        <p>
          <strong>Note:</strong> The Platform does not store credit/debit card details, UPI IDs, PINs, or bank account information.
        </p>

        <h2>3. Lawful Purpose of Data Use</h2>
        <ul>
          <li>Enabling charging sessions and access control</li>
          <li>Processing payments and refunds</li>
          <li>Providing customer support</li>
          <li>Monitoring charger safety and performance</li>
          <li>Preventing fraud and misuse</li>
        </ul>

        <h2>4. Data Sharing & Limited Disclosure</h2>
        <ul>
          <li>Charging station operators (operational support)</li>
          <li>Payment gateways (transactions only)</li>
          <li>Technology and cloud service providers</li>
          <li>Government or regulatory authorities when required</li>
        </ul>

        <h2>5. Data Security & Safeguards</h2>
        <p>
          The Company implements reasonable technical and organizational measures to protect user data from unauthorized access, loss, misuse, or disclosure.
        </p>

        <h2>6. Data Retention & Minimization</h2>
        <p>
          Data is retained only as long as necessary for operational, legal, or regulatory purposes and is securely deleted thereafter.
        </p>

        <h2>7. User Rights & Control</h2>
        <ul>
          <li>Request access to personal data</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion where legally permissible</li>
        </ul>
      </div>

      <style>{`
        /* ===== PAGE LAYOUT ===== */
        .legal-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #212121;
          color: #ffffff;
          font-family: 'Roboto', sans-serif;
        }

        /* ===== HEADER ===== */
        .legal-header {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #212121;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          z-index: 10;
        }

        .back-btn {
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .legal-header h1 {
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        /* ===== SCROLLABLE CONTENT ===== */
        .legal-content {
          flex: 1 1 auto;
          overflow-y: auto;
          padding: 16px;
          font-size: 13px;
          line-height: 1.6;
          opacity: 0.9;
        }

        .legal-content h2 {
          font-size: 14px;
          margin-top: 22px;
          margin-bottom: 6px;
          font-weight: 600;
        }

        .legal-content ul {
          padding-left: 18px;
          margin: 6px 0;
        }

        .legal-content li {
          margin-bottom: 4px;
        }

        /* ===== SCROLLBAR STYLING ===== */
        .legal-content::-webkit-scrollbar {
          width: 6px;
        }
        .legal-content::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 3px;
        }
        .legal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        /* ===== RESPONSIVE STYLES ===== */
        @media (max-width: 768px) {
          .legal-header h1 {
            font-size: 14px;
          }
          .legal-content {
            font-size: 12px;
            padding: 12px;
          }
          .legal-content h2 {
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .legal-header {
            padding: 12px;
          }
          .back-btn svg {
            font-size: 18px;
          }
          .legal-content {
            font-size: 11px;
            padding: 10px;
          }
          .legal-content h2 {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Privacy;
