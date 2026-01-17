import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/styles/global.css";

const faqData = [

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
  "q": "What payment methods are supported?",
  "a": "You can only pay using your wallet balance."
},
 {
  "q": "Is GST included in the charging amount?",
  "a": "GST is not added separately to the charging amount; it is deducted from your TopPop wallet balance."
},

  {
  "q": "Will I receive an invoice after charging?",
  "a": "The charging invoice is only shown , while the TopPop wallet invoice is automatically sent to your registered email."
},

  {
    q: "What happens if charging is interrupted?",
    a: "If charging stops due to power or network issues, billing will be calculated only for the energy consumed."
  },
  {
  "q": "Can I stop charging anytime?",
  "a": "Yes, you can stop charging at any time from the app. Charges apply only for the energy used. An emergency stop button is also available at the charging station."
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
      <style>{`
/* =====================================================
   FAQ Page Styles
   Premium animated list with "blob" backgrounds
   ===================================================== */

/* ===== PAGE LAYOUT ===== */
.faq-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    /* Removed max-width: 100vw to prevent scrollbar-induced horizontal scroll */
    background: var(--color-matte-black, #111);
    color: var(--color-white, #fff);
    font-family: var(--font-primary, Roboto, sans-serif);
    position: relative;
    padding-bottom: env(safe-area-inset-bottom);
    overflow-x: hidden;
    /* Critical for controlling spillover */
    box-sizing: border-box;
}

/* ===== BACKGROUND BLOBS ===== */
.blob-container {
    position: fixed;
    /* Fixed so it doesn't scroll with content */
    top: -60vmin;
    right: -50vmin;
    width: 140vmin;
    height: 140vmin;
    z-index: 0;
    pointer-events: none;
    opacity: 0.45;
}

.blob-container svg {
    width: 100%;
    height: 100%;
    filter: blur(50px);
}

.blob-layer {
    transform-origin: center;
    opacity: 0.7;
}

.blob-dark {
    fill: #082f20;
    animation: spin-slow 22s linear infinite;
    opacity: 0.9;
}

.blob-green {
    fill: #008f45;
    animation: spin-medium 18s linear infinite reverse;
    opacity: 0.7;
}

.blob-light {
    fill: #80e8b1;
    animation: pulse-spin 14s ease-in-out infinite;
    opacity: 0.4;
}

/* Animations */
@keyframes spin-slow {
    0% {
        transform: rotate(0deg) scale(1.5);
    }

    50% {
        transform: rotate(180deg) scale(1.4);
    }

    100% {
        transform: rotate(360deg) scale(1.5);
    }
}

@keyframes spin-medium {
    0% {
        transform: rotate(0deg) scale(1.2);
    }

    50% {
        transform: rotate(-180deg) scale(1.3);
    }

    100% {
        transform: rotate(-360deg) scale(1.2);
    }
}

@keyframes pulse-spin {
    0% {
        transform: rotate(0deg) scale(0.8);
    }

    50% {
        transform: rotate(45deg) scale(1);
    }

    100% {
        transform: rotate(0deg) scale(0.8);
    }
}

/* ===== HEADER ===== */
.page-header {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    padding: 24px 24px 10px 24px;
    padding-top: calc(24px + env(safe-area-inset-top));
    padding-left: calc(24px + env(safe-area-inset-left));
    padding-right: calc(24px + env(safe-area-inset-right));
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
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    flex-shrink: 0;
    outline: none;
}

.back-btn:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
}

.back-icon {
    font-size: 20px !important;
    color: var(--color-white, #fff);
    /* Optical centering for arrow icon */
    transform: translateX(1px);
}

/* ===== TITLE ===== */
.page-title-container {
    flex: 0 0 auto;
    padding: 0 24px 20px;
    padding-left: calc(24px + env(safe-area-inset-left));
    padding-right: calc(24px + env(safe-area-inset-right));
    z-index: 5;
}

.page-title-container h1 {
    font-size: clamp(28px, 6vw, 36px);
    font-weight: 700;
    color: var(--color-primary-container, #39E29B);
    margin: 0;
    letter-spacing: -0.5px;
    text-shadow: 0 4px 20px rgba(57, 226, 155, 0.2);
}

.subtitle {
    margin: 4px 0 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
}

/* ===== FAQ LIST ===== */
.faq-list-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 24px 60px;
    padding-left: calc(24px + env(safe-area-inset-left));
    padding-right: calc(24px + env(safe-area-inset-right));
    padding-bottom: 18px;
    z-index: 5;
}

/* ===== FAQ ITEM ===== */
.faq-item {
    position: relative;
    background: rgba(36, 36, 36, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    overflow: hidden;
    overflow: hidden;
    transition: background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    /* Removed backdrop-filter for performance */
    cursor: pointer;
}

.faq-item:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.15);
}

.faq-item.active {
    background: rgba(57, 226, 155, 0.08);
    border-color: rgba(57, 226, 155, 0.4);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    gap: 12px;
}

.faq-question span {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-white, #fff);
    line-height: 1.4;
}

.expand-icon {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.5);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item.active .expand-icon {
    color: var(--color-primary-container, #39E29B);
}

.expand-icon.rotate {
    transform: rotate(180deg);
}

.faq-answer-wrapper {
    overflow: hidden;
}

.faq-answer {
    margin: 0;
    padding: 0 20px 20px 20px;
    font-size: 14px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 300;
}

/* ===== FOOTER ===== */
.faq-footer {
    margin-top: 24px;
    padding: 20px 0;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.faq-footer p {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.6;
}

.faq-footer a {
    color: var(--color-primary-container, #39E29B);
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
}

.faq-footer a:hover {
    opacity: 0.8;
    text-decoration: underline;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 380px) {
    .page-title-container h1 {
        font-size: 24px;
    }

    .faq-question {
        padding: 12px 16px;
    }

    .faq-answer {
        padding: 0 16px 16px 16px;
    }

    .blob-container {
        opacity: 0.3;
    }
}
            `}</style>
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
            layout
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
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
