import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const faqData = [
  {
    q: "What is an EV charging station?",
    a: "An EV charging station supplies electric energy to recharge electric vehicles such as cars, scooters, and bikes."
  },
  {
    q: "How do I start charging my vehicle?",
    a: "Select a charger, choose a plan or custom power, connect your vehicle, and tap Start Charging from the app."
  },
  {
    q: "What types of chargers are available?",
    a: "We offer AC chargers for regular charging and DC fast chargers for quicker charging."
  },
  {
    q: "How is charging cost calculated?",
    a: "Charging cost is calculated based on energy consumed (kWh) multiplied by the rate per kWh."
  },
  {
    q: "Can I choose custom charging power?",
    a: "Yes, you can select a custom power (kW) depending on charger availability and your vehicle compatibility."
  },
  {
    q: "What payment methods are supported?",
    a: "You can pay using wallet balance, UPI, debit/credit cards, and net banking."
  },
  {
    q: "Is GST included in the charging amount?",
    a: "Yes, GST is included in the final payable amount shown before starting the session."
  },
  {
    q: "Will I receive an invoice after charging?",
    a: "Yes, a detailed invoice is automatically sent to your registered email after the charging session completes."
  },
  {
    q: "What happens if charging is interrupted?",
    a: "If charging stops due to power or network issues, billing will be calculated only for the energy consumed."
  },
  {
    q: "Can I stop charging anytime?",
    a: "Yes, you can stop charging at any time from the app. Charges apply only for the energy used."
  },
  {
    q: "What should I do if the charger is unavailable?",
    a: "If a charger is busy or offline, please try another nearby charger or check again after some time."
  },
  {
    q: "Who can I contact for support?",
    a: "You can contact our support team from the Help section or email us at support@bentork.com."
  }
];

const Faq = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#fff", padding: "20px" }}>
      
      {/* 🔙 TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}
        >
          <ArrowBackIcon />
        </button>

        <h2 style={{ margin: 0, color: "#12d61f" }}>EV Charging – FAQs</h2>
      </div>

      {/* FAQ LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {faqData.map((item, index) => (
          <details
            key={index}
            style={{
              background: "#1f1f1f",
              borderRadius: "12px",
              padding: "14px 16px",
              cursor: "pointer"
            }}
          >
            <summary
              style={{
                fontSize: "15px",
                fontWeight: "600",
                outline: "none"
              }}
            >
              {item.q}
            </summary>
            <p
              style={{
                marginTop: "10px",
                fontSize: "14px",
                color: "#ccc",
                lineHeight: "1.6"
              }}
            >
              {item.a}
            </p>
          </details>
        ))}
      </div>

      {/* FOOTER */}
      <p
        style={{
          marginTop: "32px",
          fontSize: "12px",
          color: "#777",
          textAlign: "center"
        }}
      >
        Still have questions?
        <br />
        Contact us at{" "}
        <a
          href="mailto:support@bentork.com"
          style={{ color: "#fff", textDecoration: "underline" }}
        >
          support@bentork.com
        </a>
      </p>
    </div>
  );
};

export default Faq;
