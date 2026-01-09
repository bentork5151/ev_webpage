import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import ChargerImg from "../assets/images/thankyou.png"; // optional image

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/config-charging");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img
          src={ChargerImg}
          alt="Charging Complete"
          style={styles.image}
        />

        <h1 style={styles.title}>Thank You</h1>
        <p style={styles.subtitle}>
          Invoice will be sent on your mail.
        </p>

        <div style={styles.logout}>
          <CircularProgress size={18} sx={{ color: "#aaa" }} />
          <span>Redirecting...</span>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;

/* ================== STYLES ================== */
const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #1e1e1e, #0f0f0f)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  card: {
    width: "90%",
    maxWidth: 420,
    textAlign: "center",
    padding: "40px 24px",
    borderRadius: 20,
    background: "#141414",
    boxShadow: "0 0 0 1px #333",
  },
  image: {
    width: 160,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.75,
    marginBottom: 32,
  },
  logout: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontSize: 13,
    opacity: 0.7,
  },
};
