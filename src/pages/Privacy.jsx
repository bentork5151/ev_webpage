import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "../assets/styles/global.css";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      {/* HEADER (NAVBAR) */}
      <div className="legal-header">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon className="back-icon" />
        </div>
      </div>

      {/* PAGE TITLE */}
      <div className="page-title-container">
        <h1>Privacy Policy</h1>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="legal-content">
        <div className="section">
          <h2>1. Purpose & Commitment</h2>
          <p>
            This Privacy Policy describes how the EV Charging Platform (“Platform”, “Company”, “We”) collects, uses, stores, and protects personal and operational data of users (“User”, “Vehicle Owner”).
          </p>
          <ul>
            <li>Protecting user privacy</li>
            <li>Using data responsibly and lawfully</li>
            <li>Maintaining transparency and trust</li>
          </ul>
        </div>

        {/* ... (rest of content remains same, implicit in replace if range allows, but I need to be careful with large replacements. I will target the header and the start of style) */
          /* Actually, to safely replace the ICON and add CSS, I should split this or encompass the changes.
             The icon is at line 14.
             The CSS starts at line 91.
             Multi-replace is safer or two calls.
             I will use multi_replace? No, tool is replace_file_content.
             I will use replace_file_content for the icon first, then for the CSS.
          */
        }

        <div className="section">
          <h2>2. Information We Collect</h2>
          <p><strong>a) User Information</strong></p>
          <ul>
            <li>Name, Mobile number, Email address</li>
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

          <p className="note">
            <strong>Note:</strong> The Platform does not store credit/debit card details, UPI IDs, PINs, or bank account information.
          </p>
        </div>

        <div className="section">
          <h2>3. Lawful Purpose of Data Use</h2>
          <ul>
            <li>Enabling charging sessions and access control</li>
            <li>Processing payments and refunds</li>
            <li>Providing customer support</li>
            <li>Monitoring charger safety and performance</li>
            <li>Preventing fraud and misuse</li>
          </ul>
        </div>

        <div className="section">
          <h2>4. Data Sharing & Limited Disclosure</h2>
          <ul>
            <li>Charging station operators (operational support)</li>
            <li>Payment gateways (transactions only)</li>
            <li>Technology and cloud service providers</li>
            <li>Government or regulatory authorities when required</li>
          </ul>
        </div>

        <div className="section">
          <h2>5. Data Security & Safeguards</h2>
          <p>
            The Company implements reasonable technical and organizational measures to protect user data from unauthorized access, loss, misuse, or disclosure.
          </p>
        </div>

        <div className="section">
          <h2>6. Data Retention & Minimization</h2>
          <p>
            Data is retained only as long as necessary for operational, legal, or regulatory purposes and is securely deleted thereafter.
          </p>
        </div>

        <div className="section">
          <h2>7. User Rights & Control</h2>
          <ul>
            <li>Request access to personal data</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion where legally permissible</li>
          </ul>
        </div>
      </div>

      <style>{`
        /* ===== PAGE LAYOUT ===== */
        .legal-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--color-matte-black);
          color: var(--color-white);
          font-family: var(--font-primary);
          overflow: hidden;
          animation: fadeIn 0.4s ease-out;
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
          padding: 24px;
          background: transparent;
          z-index: 10;
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
          flex: 0 0 auto;
        }

        .page-title-container h1 {
          font-size: 32px;
          font-weight: var(--font-weight-bold);
          color: var(--color-primary-container);
          margin: 0;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 10px rgba(57, 226, 155, 0.1);
        }

        /* ===== SCROLLABLE CONTENT ===== */
        .legal-content {
          flex: 1;
          overflow-y: auto;
          padding: 0 24px 40px;
          font-size: 14px;
          line-height: 1.6;
          opacity: 0.9;
        }

        .section {
          margin-bottom: 24px;
        }

        .legal-content h2 {
          font-size: 18px;
          margin-bottom: 12px;
          color: var(--color-white);
          font-weight: var(--font-weight-semibold);
          border-left: 3px solid var(--color-primary-container);
          padding-left: 12px;
        }

        .legal-content p {
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.75);
          font-weight: var(--font-weight-light);
        }

        .legal-content ul {
          padding-left: 20px;
          margin: 8px 0;
          color: rgba(255, 255, 255, 0.75);
        }

        .legal-content li {
          margin-bottom: 6px;
        }

        .note {
          background: rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 8px;
          margin-top: 10px;
          font-size: 13px;
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
            padding: 16px;
          }
          .page-title-container h1 {
            font-size: 28px;
          }
          .legal-content {
            padding: 0 16px 30px;
          }
          .legal-content h2 {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Privacy;
