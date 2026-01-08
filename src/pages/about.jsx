import React from "react";
import AboutImg from "../assets/images/about.png"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const About = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "20px",
        color: "#fff",
        backgroundColor: "#111",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <ArrowBackIcon
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        <h2
          style={{
            marginLeft: "10px",
            fontSize: "1.5rem",
          }}
        >
          About Us
        </h2>
      </div>

      {/* Image */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <img
          src={AboutImg}
          alt="About Us"
          style={{
            maxWidth: "100%",
            width: "382px",
            height: "215px",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Text Content */}
      <div
        style={{
          lineHeight: "1.8",
          fontSize: "clamp(14px, 1.2vw, 18px)", // responsive font
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <p>
          Bentork Industries is a leading manufacturer of Lithium-ion and LFP
          battery packs in India with over five years of experience delivering
          safe, high-performance, and long-lasting energy solutions for EVs,
          solar, industrial, and other applications.
        </p>

        <p>
          Building on this expertise, we are expanding into EV charging
          infrastructure, providing safe, reliable, and user-friendly charging
          experiences with smart technology, real-time monitoring, and seamless
          digital payments.
        </p>

        <p>
          Our commitment: “Connecting to the Modern World” through innovation,
          quality, and accessible energy solutions for businesses and everyday
          users.
        </p>
      </div>
    </div>
  );
};

export default About;
