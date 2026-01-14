import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/styles/global.css";
import "./Faq.css";

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
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page page-enter-anim">
      {/* ===== BLOBS BACKGROUND ===== */}
      <div className="blob-container">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path className="blob-layer blob-dark" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.9,32.3C59.6,43.1,48.3,51.8,36.5,58.8C24.7,65.8,12.4,71.1,-0.6,72.1C-13.6,73.1,-27.2,69.8,-39.6,62.8C-52,55.8,-63.2,45.1,-71.3,32.2C-79.4,19.3,-84.4,4.2,-81.8,-9.4C-79.2,-23,-69,-35.1,-57.4,-43.8C-45.8,-52.5,-32.8,-57.8,-19.9,-65.4C-7,-73,8.9,-82.9,25.4,-84.2C41.9,-85.5,59,-78.2,44.7,-76.4Z" transform="translate(100 100)" />
          <path className="blob-layer blob-green" d="M41.3,-72.6C53.4,-65.3,63.2,-54.6,70.4,-42.1C77.6,-29.6,82.2,-15.3,81.3,-1.4C80.4,12.5,74,26,64.8,37.3C55.6,48.6,43.6,57.7,30.8,63.2C18,68.7,4.4,70.6,-8.3,69.7C-21,68.8,-32.8,65.1,-43.2,58.3C-53.6,51.5,-62.6,41.6,-68.9,30.1C-75.2,18.6,-78.8,5.5,-75.9,-6.2C-73,-17.9,-63.6,-28.2,-53.4,-36.5C-43.2,-44.8,-32.2,-51.1,-20.9,-58.5C-9.6,-65.9,2,-74.4,14.5,-76.6C27,-78.8,40.4,-74.7,41.3,-72.6Z" transform="translate(100 100)" />
          <path className="blob-layer blob-light" d="M35.6,-62.3C46.5,-55.8,55.9,-47.5,63.1,-37.2C70.3,-26.9,75.3,-14.6,74.7,-2.6C74.1,9.4,67.9,21.1,60.1,31.8C52.3,42.5,42.9,52.2,31.7,58.5C20.5,64.8,7.5,67.7,-4.8,67.3C-17.1,66.9,-32.7,63.2,-45.3,55.8C-57.9,48.4,-67.5,37.3,-72.8,24.6C-78.1,11.9,-79.1,-2.4,-75.3,-15.8C-71.5,-29.2,-62.9,-41.7,-51.5,-49.6C-40.1,-57.5,-25.9,-60.8,-11.8,-62.8C2.3,-64.8,16.4,-65.5,29.3,-62.9C42.2,-60.3,54,-54.4,35.6,-62.3Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* HEADER */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon className="back-icon" />
        </button>
      </div>

      {/* TITLE */}
      <div className="page-title-container">
        <h1>FAQs</h1>
        <p className="subtitle">Everything you need to know</p>
      </div>

      {/* FAQ LIST */}
      <div className="faq-list-container">
        {faqData.map((item, index) => (
          <motion.div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={() => toggleFaq(index)}
          >
            <div className="faq-question">
              <span>{item.q}</span>
              <ExpandMoreIcon className={`expand-icon ${activeIndex === index ? "rotate" : ""}`} />
            </div>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="faq-answer-wrapper"
                >
                  <p className="faq-answer">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* FOOTER */}
        <div className="faq-footer">
          <p>
            Still have questions?
            <br />
            <a href="mailto:support@bentork.com">support@bentork.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Faq;
