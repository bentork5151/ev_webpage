import React, { useEffect, useState } from "react";
import AboutImg from "../assets/images/about.png";
import CloseIcon from "@mui/icons-material/Close";
import APP_CONFIG from "../config/app.config";

const About = ({ isOpen, onClose }) => {
  const [render, setRender] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      document.body.style.overflow = "hidden";
      setCurrentY(0); // Reset position on open
    } else {
      setTimeout(() => setRender(false), 300);
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const onTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
    if (!isDragging) return;
    const touchY = e.touches[0].clientY;
    const diff = touchY - startY;
    if (diff > 0) { // Only allow dragging downwards
      setCurrentY(diff);
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    if (currentY > 100) { // Threshold to close
      onClose();
    } else {
      setCurrentY(0); // Snap back
    }
  };

  if (!render && !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          opacity: isOpen ? 1 : 0, transition: '0.3s',
          pointerEvents: isOpen ? 'all' : 'none',
          zIndex: 1000
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0,
          background: '#212121',
          borderRadius: '24px 24px 0 0',
          transform: isOpen ? `translateY(${currentY}px)` : 'translateY(100%)',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          zIndex: 1001,
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          color: '#fff',
          fontFamily: 'Roboto, sans-serif'
        }}
        onClick={e => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px', cursor: 'grab' }}>
          <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '0 24px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>About Us</h2>
          <CloseIcon onClick={onClose} style={{ cursor: 'pointer', opacity: 0.8 }} />
        </div>

        {/* Content - Scrollable */}
        <div style={{ padding: '0 24px 24px', overflowY: 'auto' }}>

          {/* Image */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img
              src={AboutImg}
              alt="About Bentork"
              style={{
                width: '100%',
                height: '200px',
                borderRadius: '16px',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Text */}
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
            <p style={{ marginBottom: '16px' }}>
              Bentork Industries is a leading manufacturer of Lithium-ion and LFP
              battery packs in India with over five years of experience delivering
              safe, high-performance, and long-lasting energy solutions for EVs,
              solar, industrial, and other applications.
            </p>
            <p style={{ marginBottom: '16px' }}>
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


          {/* Version Number */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.4)',
              margin: '0 28px' // 28px margin on each side as requested
            }}>
              Version {APP_CONFIG.VERSION || '1.0.0'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
