import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "../assets/styles/global.css";

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-page">
      <style>{`
      body{
      overflow-y: scroll;}
        .terms-page {
          background: var(--color-matte-black);
          min-height: 100vh;
          color: #fff;
          font-family: 'Roboto', sans-serif;
        }
        .header {
          display: flex;
          padding: 18px;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          position: sticky;
          top: 0;
          background: var(--color-matte-black);
          z-index: 100;
        }
        .back-btn {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }
        .title {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }
        .content {
          padding-top: 0px;
          padding-bottom: 8px;
          padding-left: 16px;
          padding-right: 16px;
          font-size: 14px;
          line-height: 1.6;
          color: #e0e0e0;
        }
        .term-title {
            color: var(--primary-color);
            margin: 0 0 4px 0;
            font-weight: var(--font-weight-medium);
            font-size: 14px;
        }
        ol {
            padding-left: 12px;
            padding-right: 12px;
            text-align: justify;
        }
        li {
            margin-bottom: 20px;
        }
        ul {
            padding-left: 20px;
            margin-top: 8px;
        }
        ul li {
            margin-bottom: 4px;
        }
      `}</style>

      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
        </button>
        <h1 className="title">Terms & Conditions</h1>
      </div>

      <div className="content">
        <ol>
          <li>
            <p className="term-title">Acceptance of Terms</p>
            By accessing, registering, scanning a QR code, or using this EV Charging Platform (“Platform”), the user (“Vehicle Owner/User”) agrees to be bound by these Terms & Conditions. If the user does not agree, they must immediately discontinue use of the Platform and charging services.
          </li>

          <li>
            <p className="term-title">Nature of Service (Platform Role)</p>
            The Platform acts solely as a technology facilitator enabling access to EV charging infrastructure. The Platform does not guarantee uninterrupted charging, power availability, charging speed, or vehicle performance.
          </li>

          <li>
            <p className="term-title">User Eligibility</p>
            <ul>
              <li>User must be 18 years or older</li>
              <li>User must be the vehicle owner or an authorized driver</li>
              <li>All registration and vehicle details must be accurate and valid</li>
            </ul>
            The Platform reserves the right to suspend or terminate access for incorrect or fraudulent information.
          </li>

          <li>
            <p className="term-title">Charging Equipment & OEM Compatibility</p>
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
          </li>

          <li>
            <p className="term-title">Tariffs, Billing & Payments</p>
            <ul>
              <li>Tariffs are displayed on the Platform and may vary by location, charger type, and duration</li>
              <li>Payment must be completed through approved digital payment modes</li>
              <li>The Platform is not liable for payment failures caused by banks, UPI providers, or gateways</li>
              <li>Idle fees, overstay charges, or penalties may apply where displayed</li>
            </ul>
          </li>

          <li>
            <p className="term-title">User Responsibilities</p>
            The user agrees to:
            <ul>
              <li>Follow all safety instructions displayed on the charger and app</li>
              <li>Handle connectors and cables carefully</li>
              <li>Vacate the charging bay immediately after session completion</li>
              <li>Not tamper with, misuse, or damage charging infrastructure</li>
            </ul>
            Failure may result in penalties, suspension, or permanent ban.
          </li>

          <li>
            <p className="term-title">ACCIDENT, DAMAGE & LIABILITY DISCLAIMER</p>
            The user expressly agrees that:
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
            Charging is undertaken entirely at the user’s own risk.
          </li>

          <li>
            <p className="term-title">INDEMNITY & WAIVER</p>
            The user agrees to fully indemnify, defend, and hold harmless the Platform, charging station owner, operators, affiliates, directors, employees, and partners against:
            <ul>
              <li>Any claims, damages, losses, legal costs, injuries, or liabilities</li>
              <li>Arising out of user actions, misuse, negligence, accidents, or vehicle-related issues</li>
              <li>Including third-party claims, insurance claims, or regulatory actions</li>
            </ul>
            The user waives all rights to initiate any legal, civil, or criminal claims against the Platform for such incidents.
          </li>

          <li>
            <p className="term-title">Insurance Alignment Clause</p>
            <ul>
              <li>The Platform does not provide vehicle, battery, or personal insurance</li>
              <li>Users are advised to maintain valid motor insurance and OEM warranty</li>
              <li>Any claim must be raised with the user’s insurer or vehicle manufacturer</li>
              <li>The Platform shall not be responsible for claim rejection by insurers or OEMs</li>
            </ul>
          </li>

          <li>
            <p className="term-title">Service Availability</p>
            Charging services may be unavailable due to:
            <ul>
              <li>Maintenance</li>
              <li>Power outages</li>
              <li>Network or software issues</li>
              <li>Force majeure events</li>
            </ul>
            No compensation shall be payable for such interruptions.
          </li>

          <li>
            <p className="term-title">Data & Privacy</p>
            <ul>
              <li>Charging data, usage history, and transactions may be recorded</li>
              <li>Data is used for operational, compliance, and analytical purposes</li>
              <li>Personal data will not be sold, except where legally required</li>
            </ul>
          </li>

          <li>
            <p className="term-title">Account Suspension & Termination</p>
            The Platform may suspend or terminate access without notice for:
            <ul>
              <li>Safety violations</li>
              <li>Fraudulent activity</li>
              <li>Repeated misuse</li>
              <li>Legal or regulatory requirements</li>
            </ul>
          </li>

          <li>
            <p className="term-title">Governing Law & Jurisdiction</p>
            This Terms & Conditions shall be governed by and interpreted in accordance with the laws of India, and the courts located in Pune, Maharashtra shall have exclusive jurisdiction over all matters arising out of or relating to this Policy.
          </li>

          <li>
            <p className="term-title">Customer Support & Assistance</p>
            The Platform provides customer support to assist users with:
            <ul>
              <li>Charging session initiation or termination issues</li>
              <li>Billing or transaction-related queries</li>
              <li>Charger status or visibility concerns</li>
            </ul>
            Customer support may be accessed through the in-app support feature, helpline number, or email, as displayed on the Platform.
            <br />
            While the Platform will make reasonable efforts to assist users, resolution timelines may vary depending on the nature of the issue, charger ownership, or third-party dependencies.
          </li>

          <li>
            <p className="term-title">Failed Charging Sessions & Refund Handling</p>
            A charging session may be considered a failed or incomplete session if:
            <ul>
              <li>Charging does not start after successful payment</li>
              <li>Charging stops unexpectedly due to charger or system malfunction</li>
              <li>Power or network failure occurs at the charging station</li>
            </ul>
            <p className="term-title">Refund Policy:</p>
            <ul>
              <li>Users may raise a support request for failed sessions through the Platform</li>
              <li>Refunds, if applicable, shall be processed as per the Platform’s internal refund policy</li>
              <li>Refund eligibility may be limited to the unused or undelivered charging amount</li>
              <li>Processing timelines may vary based on payment gateway or bank procedures</li>
            </ul>
            <p className="term-title">No refund shall be applicable for:</p>
            <ul>
              <li>User-initiated session termination</li>
              <li>Vehicle or battery-related issues</li>
              <li>Incompatible vehicle or connector usage</li>
            </ul>
          </li>

          <li>
            <p className="term-title">Safety Assistance & Escalation</p>
            The Platform prioritizes user safety and may provide:
            <ul>
              <li>Safety instructions displayed on the app or charging station</li>
              <li>Emergency contact details where applicable</li>
              <li>Basic escalation guidance in case of charger malfunction</li>
            </ul>
            However, the user acknowledges that:
            <ul>
              <li>The Platform does not provide on-site supervision or emergency services</li>
              <li>The Platform shall not be liable for accidents, injuries, or damages</li>
              <li>In case of emergency, users must immediately contact local emergency services</li>
            </ul>
            Any assistance provided by the Platform shall be considered good-faith support and shall not be construed as acceptance of liability.
          </li>
        </ol>

        <br />
        <p className="term-title">CHARGER-TYPE SPECIFIC CLAUSES</p>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          <li>
            <p className="term-title">A. Public Charging Stations</p>
            <ul>
              <li>Open to general public</li>
              <li>Users must follow parking rules and local regulations</li>
              <li>Platform not responsible for vehicle theft or vandalism</li>
            </ul>
          </li>
          <li style={{ marginTop: '10px' }}>
            <p className="term-title">B. Highway / Fast Charging Stations</p>
            <ul>
              <li>High-voltage & fast charging involved</li>
              <li>Users must remain alert and follow safety signage</li>
              <li>Platform not responsible for emergency situations or towing</li>
            </ul>
          </li>
          <li style={{ marginTop: '10px' }}>
            <p className="term-title">C. Residential Charging (Society / Apartment)</p>
            <ul>
              <li>Charging subject to society rules and power allocation</li>
              <li>Platform not liable for internal wiring, load issues, or society disputes</li>
            </ul>
          </li>
          <li style={{ marginTop: '10px' }}>
            <p className="term-title">D. Commercial / Workplace Charging</p>
            <ul>
              <li>Charging access governed by property owner policies</li>
              <li>Platform not responsible for employment or access-related disputes</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TermsPage;
