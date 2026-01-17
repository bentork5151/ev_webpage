
import React, { useEffect, useState } from "react"
import {
  Container,
  Paper,
  CircularProgress,
  Button,
  Switch,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material"
import { Bolt } from "@mui/icons-material"
import { useSession } from "../store/SessionContext"
import "../assets/styles/global.css"
import notifyIcon from "../assets/images/notify.svg"
import Flag from "../assets/images/Flag.svg"
import BentorkLogo from "../assets/images/logo-1.png"

const ChargingSession = () => {

  const {
    session,
    chargingData,
    isInitializing,
    loadingMessage,
    messageIndex,
    loadingMessages,
    isLoading,
    error,
    isStopping,
    isCompleted,
    notifyOnComplete,
    isSessionActive,
    isNotificationDisabled,
    remainingTime,
    initializeSession,
    stopSession,
    toggleNotification,
    formatTime,
    setError,
    isCustomSession
  } = useSession()

  const [stopDialog, setStopDialog] = useState(false)

  useEffect(() => {
    initializeSession()
    // eslint-disable-next-line
  }, [])

  const handleStopClick = () => {
    setStopDialog(true)
  }

  const handleStopConfirm = async () => {
    setStopDialog(false)
    await stopSession()
  }

  if (isLoading && !isInitializing) {
    return (
      <div className="loading-screen">
        <CircularProgress size={60} thickness={4} style={{ color: "var(--color-primary-container)" }} />
        <p>Loading session...</p>
        <style>{`
          .loading-screen {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
            gap: 20px;
            background: #111;
            color: white;
            font-family: var(--font-primary);
          }
          .loading-screen p {
            font-size: 14px;
            letter-spacing: 0.5px;
            opacity: 0.7;
          }
        `}</style>
      </div>
    )
  }

  return (
    <Container
      maxWidth="sm"
      className="page-enter-anim"
      sx={{
        height: "100dvh", /* Dynamic viewport height for mobile */
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        padding: "0 !important",
        background: "#000",
        width: "100%"
      }}
    >
      <div className="premium-bg">
        {/* Blob Container */}
        <div className="blob-container-bg">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path className="blob-layer blob-dark" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.9,32.3C59.6,43.1,48.3,51.8,36.5,58.8C24.7,65.8,12.4,71.1,-0.6,72.1C-13.6,73.1,-27.2,69.8,-39.6,62.8C-52,55.8,-63.2,45.1,-71.3,32.2C-79.4,19.3,-84.4,4.2,-81.8,-9.4C-79.2,-23,-69,-35.1,-57.4,-43.8C-45.8,-52.5,-32.8,-57.8,-19.9,-65.4C-7,-73,8.9,-82.9,25.4,-84.2C41.9,-85.5,59,-78.2,44.7,-76.4Z" transform="translate(100 100)" />
            <path className="blob-layer blob-green" d="M41.3,-72.6C53.4,-65.3,63.2,-54.6,70.4,-42.1C77.6,-29.6,82.2,-15.3,81.3,-1.4C80.4,12.5,74,26,64.8,37.3C55.6,48.6,43.6,57.7,30.8,63.2C18,68.7,4.4,70.6,-8.3,69.7C-21,68.8,-32.8,65.1,-43.2,58.3C-53.6,51.5,-62.6,41.6,-68.9,30.1C-75.2,18.6,-78.8,5.5,-75.9,-6.2C-73,-17.9,-63.6,-28.2,-53.4,-36.5C-43.2,-44.8,-32.2,-51.1,-20.9,-58.5C-9.6,-65.9,2,-74.4,14.5,-76.6C27,-78.8,40.4,-74.7,41.3,-72.6Z" transform="translate(100 100)" />
            <path className="blob-layer blob-light" d="M35.6,-62.3C46.5,-55.8,55.9,-47.5,63.1,-37.2C70.3,-26.9,75.3,-14.6,74.7,-2.6C74.1,9.4,67.9,21.1,60.1,31.8C52.3,42.5,42.9,52.2,31.7,58.5C20.5,64.8,7.5,67.7,-4.8,67.3C-17.1,66.9,-32.7,63.2,-45.3,55.8C-57.9,48.4,-67.5,37.3,-72.8,24.6C-78.1,11.9,-79.1,-2.4,-75.3,-15.8C-71.5,-29.2,-62.9,-41.7,-51.5,-49.6C-40.1,-57.5,-25.9,-60.8,-11.8,-62.8C2.3,-64.8,16.4,-65.5,29.3,-62.9C42.2,-60.3,54,-54.4,35.6,-62.3Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      {isInitializing && (
        <div className="overlay-glass">
          <div className="pulse-ring"></div>
          <div className="init-content">
            <div className="bolt-wrapper">
              <Bolt className="init-bolt" />
            </div>
            <h2>Starting Session</h2>
            <p className="status-msg">{loadingMessage}</p>
            <div className="loading-dots">
              {loadingMessages.slice(0, 4).map((_, idx) => (
                <span key={idx} className={`dot ${idx <= messageIndex ? 'active' : ''}`} />
              ))}
            </div>
            <p className="helper-text">Connecting to your vehicle...</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="app-header">
        <img src={BentorkLogo} alt="Bentork" className="brand-logo" />
      </header>

      {/* MAIN CONTENT - FLEXIBLE LAYOUT */}
      <div className="main-layout">

        {/* CHARGING CIRCLE - TAKES AVAILABLE SPACE */}
        <div className="hero-charge-section">
          <div className="circle-container-responsive">
            {/* Glow Effect */}
            <div className="circle-glow"></div>

            {/* Track & Fill - positioned absolute in CSS */}
            <CircularProgress
              variant="determinate"
              value={100}
              thickness={2}
              className="cp-track"
            />
            <CircularProgress
              variant="determinate"
              value={chargingData.percentage || chargingData.Percentage || 0}
              thickness={2}
              className="cp-fill"
              sx={{
                color: 'var(--color-primary-container)',
                '& .MuiCircularProgress-circle': { strokeLinecap: 'round' }
              }}
            />

            <div className="circle-inner">
              <Bolt className="hero-bolt" />
              <h1 className="charge-percent">
                {Math.round(chargingData.percentage || chargingData.Percentage || 0)}<span className="unit">%</span>
              </h1>
              <span className="charge-status">Charged</span>
            </div>
          </div>
        </div>

        {/* LOWER SECTION - COMPACT */}
        <div className="lower-content">
          {/* METRICS GRID */}
          <div className="metrics-grid">
            <div className="glass-card metric-card">
              <span className="metric-label">Energy Delivered</span>
              <div className="metric-value-row">
                <span className="metric-val">{Number(chargingData.energyUsed || 0).toFixed(2)}</span>
                <span className="metric-unit">kWh</span>
              </div>
            </div>

            <div className="glass-card metric-card">
              <span className="metric-label">{(isCustomSession || !session?.planId) ? 'Time Elapsed' : 'Time Left'}</span>
              <div className="metric-value-row">
                <span className="metric-val">{(remainingTime === '--:--' || !remainingTime) ? '00:00' : remainingTime}</span>
              </div>
            </div>
          </div>

          {/* NOTIFICATION TOGGLE */}
          <div className="glass-card notify-row">
            <div className="notify-info">
              <div className="notify-icon-box">
                <img src={notifyIcon} alt="" />
              </div>
              <div className="notify-labels">
                <span className="notify-title">Notify when complete</span>
                {isNotificationDisabled && <span className="notify-warn">Permission denied by browser</span>}
              </div>
            </div>
            <Switch
              checked={notifyOnComplete}
              onChange={toggleNotification}
              disabled={isNotificationDisabled}
              size="small" // Make switch slightly smaller
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'var(--color-primary-container)',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'var(--color-primary-container)',
                },
                '& .MuiSwitch-track': {
                  backgroundColor: '#555'
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* FIXED FOOTER */}
      <div className="fixed-footer">
        <div className="alerts-area">
          {error && (
            <Alert severity="error" onClose={() => setError('')} className="glass-alert error-alert">
              {error}
            </Alert>
          )}
          {isCompleted && (
            <Alert severity="success" className="glass-alert success-alert">
              Session Complete! Redirecting...
            </Alert>
          )}
        </div>

        <div className="action-row">
          <Button className="icon-action-btn glass-btn" onClick={handleStopClick}>
            <img src={Flag} alt="Report" />
          </Button>

          <Button
            variant="contained"
            fullWidth
            className="main-stop-btn"
            onClick={handleStopClick}
            disabled={isStopping || isCompleted || !isSessionActive || isInitializing}
          >
            {isStopping ? "Stopping..." : "Stop Charging"}
          </Button>
        </div>

        <div className="station-info">
          Station ID: {session?.sessionId || session?.id || 'N/A'}
        </div>
      </div>

      {/* STOP DIALOG */}
      <Dialog
        open={stopDialog}
        onClose={() => !isStopping && setStopDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: '#1E1E1E',
            borderRadius: '24px',
            border: '1px solid #333',
            color: 'white',
            minWidth: '300px'
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>Stop Session?</DialogTitle>
        <DialogContent>
          <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '10px' }}>
            Are you sure you want to stop the charging session?
          </div>
          <div className="dialog-stats">
            <div className="d-row"><span>Time Elapsed</span> <b>{formatTime(chargingData.timeElapsed)}</b></div>
            <div className="d-row"><span>Energy Used</span> <b>{Number(chargingData.energyUsed || 0).toFixed(2)} kWh</b></div>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: '20px' }}>
          <button className="dialog-btn cancel" onClick={() => setStopDialog(false)} disabled={isStopping}>
            Cancel
          </button>
          <button className="dialog-btn confirm" onClick={handleStopConfirm} disabled={isStopping}>
            {isStopping ? <CircularProgress size={16} color="inherit" /> : 'Stop Charging'}
          </button>
        </DialogActions>
      </Dialog>

      <style>{`
        /* PREMIUM STYLES */
        .premium-bg {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, #1A1A1A 0%, #000000 100%);
            z-index: 0;
        }

        
        /* HEADER */
        .app-header {
            position: relative;
            z-index: 10;
            display: flex;
            justify-content: center;
            padding: 16px 0 0;
            flex-shrink: 0;
            height: 60px;
        }
        .brand-logo {
            height: 82px;
            width: 100%;
            opacity: 1;
        }

        /* MAIN LAYOUT WRAPPER */
        .main-layout {
            position: relative;
            z-index: 10;
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto; 
            overflow-x: hidden;
            /* Footer Space + Safe Area */
            padding-bottom: calc(120px + env(safe-area-inset-bottom)); 
            scrollbar-width: none; /* Hide scrollbar for cleaner look */
        }
        .main-layout::-webkit-scrollbar { display: none; }

        /* HERO CHARGE SECTION */
        .hero-charge-section {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 200px;
            padding: 10px 0;
        }

        /* Responsive Circle Container */
        .circle-container-responsive {
            position: relative;
            /* Smart scaling: uses smallest of VW or VH to ensure fit */
            width: min(65vw, 32vh);
            height: min(65vw, 32vh);
            min-width: 200px;
            min-height: 200px;
            max-width: 280px;
            max-height: 280px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .circle-glow {
            position: absolute;
            inset: 15px;
            background: var(--color-primary-container);
            filter: blur(60px);
            opacity: 0.0;
            border-radius: 50%;
            // animation: pulse-glow 2s infinite ease-in-out;
        }

        /* Override MUI CircularProgress scaling */
        .cp-track, .cp-fill {
            width: 100% !important;
            height: 100% !important;
            position: absolute !important;
        }
        .cp-track { color: rgba(255,255,255,0.08) !important; z-index: 1; }
        .cp-fill { z-index: 2; filter: drop-shadow(0 0 6px rgba(57,226,155,0.6)); }

        .circle-inner {
            z-index: 5;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-shadow: 0 4px 12px rgba(0,0,0,0.5);
            /* Scale inner content */
            transform: scale(calc(min(65vw, 32vh) / 260)); 
        }
        
        .hero-bolt {
            font-size: 32px;
            margin-bottom: 4px;
            animation: bolt-pulse 2s infinite ease-in-out;
        }

        @keyframes bolt-pulse {
            0% {
                color: #ffffff;
                filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
            }
            50% {
                color: var(--color-primary-container);
                filter: drop-shadow(0 0 15px rgba(57, 226, 155, 0.8));
            }
            100% {
                color: #ffffff;
                filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
            }
        }

        .charge-percent {
            font-size: 64px;
            font-weight: 700;
            margin: 0;
            line-height: 1;
            letter-spacing: -2px;
            white-space: nowrap;
        }
        .charge-percent .unit {
            font-size: 24px;
            font-weight: 400;
            color: #888;
            margin-left: 4px;
            vertical-align: middle;
        }
        .charge-status {
            font-size: 14px;
            color: #AAA;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 6px;
            font-weight: 600;
        }

        /* LOWER CONTENT SECTION */
        .lower-content {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 0 24px 10px;
        }

        /* METRICS */
        .metrics-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(12px);
            border-radius: 20px;
        }
        .metric-card {
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
        }
        .metric-label {
            font-size: 12px;
            color: #888;
            font-weight: 500;
        }
        .metric-value-row {
            font-size: 22px;
            font-weight: 700;
            color: white;
            display: flex;
            align-items: baseline;
            gap: 4px;
        }
        .metric-unit {
            font-size: 13px;
            color: #666;
            font-weight: 500;
        }

        /* NOTIFY ROW */
        .notify-row {
            padding: 12px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .notify-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .notify-icon-box {
            width: 32px;
            height: 32px;
            border-radius: 10px;
            background: rgba(255,255,255,0.05);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .notify-icon-box img {
            width: 16px;
            height: 16px;
            filter: grayscale(1);
        }
        .notify-labels { display: flex; flex-direction: column; }
        .notify-title {
            font-size: 13px;
            font-weight: 600;
            color: #eee;
        }
        .notify-warn {
            font-size: 9px;
            color: #fca5a5;
        }

        /* FIXED FOOTER */
        .fixed-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px 24px;
            padding-bottom: calc(24px + env(safe-area-inset-bottom));
            background: linear-gradient(0deg, #000 60%, rgba(0,0,0,0) 100%);
            z-index: 50;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .station-info {
            text-align: center;
            font-size: 10px;
            color: #444;
            font-family: monospace;
            letter-spacing: 1px;
            margin-bottom: 2px;
        }
        .action-row {
            display: flex;
            gap: 12px;
        }
        .icon-action-btn {
            min-width: 52px !important;
            width: 52px !important;
            height: 52px !important;
            border-radius: 14px !important;
            background: rgba(40, 40, 40, 0.6) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            padding: 0;
        }
        .glass-btn img {
            width: 18px;
            opacity: 0.8;
        }
        .main-stop-btn {
            height: 52px !important;
            border-radius: 14px !important;
            background: #FF4213 !important;
            color: #ffffff !important;
            font-weight: 700 !important;
            font-size: 15px !important;
            text-transform: none !important;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 20px rgba(255, 66, 19, 0.3) !important;
        }
        
        /* Alerts Area */
        .alerts-area {
            position: absolute;
            bottom: 100%;
            left: 24px;
            right: 24px;
            padding-bottom: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            pointer-events: none;
        }
        .glass-alert {
            pointer-events: auto;
            border-radius: 14px !important;
            backdrop-filter: blur(10px);
            font-weight: 500;
            font-size: 12px !important;
        }
        .error-alert { background: rgba(220, 38, 38, 0.2) !important; color: #fca5a5 !important; border: 1px solid rgba(220, 38, 38, 0.3) !important; }
        .success-alert { background: rgba(5, 150, 105, 0.2) !important; color: #6ee7b7 !important; border: 1px solid rgba(5, 150, 105, 0.3) !important; }

        /* KEY ANIMATIONS */
        @keyframes pulse-glow {
            0%, 100% { opacity: 0.15; transform: scale(1); }
            50% { opacity: 0.25; transform: scale(1.05); }
        }

        /* MEDIA QUERIES for Height Constraints */
        @media (max-height: 680px) {
            .app-header { height: 50px; padding-top: 10px; }
            .hero-charge-section { min-height: 160px; }
            .lower-content { padding-bottom: 4px; gap: 8px; }
            .metric-card { padding: 12px; }
            .metric-value-row { font-size: 18px; }
            .charge-percent { font-size: 52px; }
            .fixed-footer { padding-bottom: 16px; }
        }
        
        @media (max-height: 600px) {
            .hero-charge-section { min-height: 140px; }
            .circle-container-responsive { width: 140px; height: 140px; }
        }

        /* ... Dialog styles same as before ... */
        .dialog-stats { background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; margin-top: 12px; }
        .d-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; color: #ddd; }
        .d-row b { color: white; }
        .dialog-btn { padding: 12px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; border: none; transition: all 0.2s; }
        .dialog-btn.cancel { background: transparent; color: #888; }
        .dialog-btn.cancel:hover { color: white; }
        .dialog-btn.confirm { background: #ef4444; color: white; flex: 1; display: flex; justify-content: center; align-items: center; }
        .overlay-glass { position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 1000; display: flex; align-items: center; justify-content: center; flex-direction: column; }
        .init-content { z-index: 2; text-align: center; display: flex; flex-direction: column; align-items: center; animation: slide-up-fade 0.5s ease; }
        .bolt-wrapper { width: 80px; height: 80px; background: rgba(57, 226, 155, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; border: 1px solid rgba(57, 226, 155, 0.2); }
        .init-bolt { font-size: 40px; color: var(--color-primary-container); animation: pulse-op 1.5s infinite; }
        .status-msg { font-size: 14px; color: #ccc; margin-bottom: 20px; height: 20px; }
        .loading-dots { display: flex; gap: 8px; margin-bottom: 20px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #444; transition: all 0.3s; }
        .dot.active { background: var(--color-primary-container); transform: scale(1.2); }
        .helper-text { font-size: 12px; color: #666; font-style: italic; }
        @keyframes pulse-op { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes slide-up-fade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* ENERGY BLOB ANIMATION */
        /* BLOB ANIMATIONS */
        .blob-container-bg {
            position: absolute;
            bottom: -50vh;
            right: -25vh;
            width: 100vh;
            height: 100vh;
            z-index: 1;
            pointer-events: none;
            opacity: 0;
            animation: blob-enter 1.5s ease-out 3s forwards;
        }

        .blob-container-bg svg {
            width: 100%;
            height: 100%;
            filter: blur(25px);
        }

        .blob-layer { transform-origin: center; }
        .blob-dark { fill: #082f20; animation: spin-slow 20s linear infinite; opacity: 0.9; }
        .blob-green { fill: #008f45; animation: spin-medium 15s linear infinite reverse; opacity: 0.2; }
        .blob-light { fill: #80e8b1; animation: pulse-spin 12s ease-in-out infinite; opacity: 0.2; }

        @keyframes spin-slow {
            0% { transform: translate(100px, 100px) rotate(0deg) scale(1.5); }
            50% { transform: translate(100px, 100px) rotate(180deg) scale(1.4); }
            100% { transform: translate(100px, 100px) rotate(360deg) scale(1.5); }
        }
        @keyframes spin-medium {
            0% { transform: translate(100px, 100px) rotate(0deg) scale(1.2); }
            50% { transform: translate(100px, 100px) rotate(-180deg) scale(1.3); }
            100% { transform: translate(100px, 100px) rotate(-360deg) scale(1.2); }
        }
        @keyframes pulse-spin {
            0% { transform: translate(100px, 100px) rotate(0deg) scale(0.8); }
            50% { transform: translate(100px, 100px) rotate(45deg) scale(1); }
            100% { transform: translate(100px, 100px) rotate(0deg) scale(0.8); }
        }

        @keyframes blob-enter {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 0.9; transform: scale(1); }
        }



      `}</style>
    </Container>
  )
}

export default ChargingSession