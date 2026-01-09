
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
    setError
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
      <div className="loading">
        <CircularProgress />
        <p>Loading session...</p>
        <style>{`
          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
            gap: 10px;
          }
        `}</style>
      </div>
    )
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        bgcolor: "#212121",
      }}
    >

      {isInitializing && (
        <div className="init-overlay">
          <div className="init-popup">
            <div className="init-spinner">
              <CircularProgress
                size={80}
                thickness={4}
                sx={{ color: "#ffffffff" }}
              />
              <Bolt className="init-bolt-icon" />
            </div>

            <h2 className="init-title">Starting Your Session</h2>
            <p className="init-message">{loadingMessage}</p>

            <div className="init-dots">
              {loadingMessages.slice(0, 4).map((_, idx) => (
                <span
                  key={idx}
                  className={`init-dot ${idx <= messageIndex ? 'active' : ''}`}
                />
              ))}
            </div>

            <p className="init-hint">
              Please ensure your vehicle is connected
            </p>
          </div>
        </div>
      )}

      <Paper
        elevation={0}
        square
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 0,
          background: "transparent",
          filter: isInitializing ? "blur(8px)" : "none",
          transition: "filter 0.3s ease",
          pointerEvents: isInitializing ? "none" : "auto",
        }}
        className="main-card"
      >
        {/* SCROLLABLE CONTENT AREA */}
        <div className="content-scroll">

          {/* HEADER */}
          <div className="header">
            <img
              src={BentorkLogo}
              alt="BENTORK Logo"
              className="logo"
            />
          </div>

          {/* CIRCLE */}
          <div className="circle-container">
            <CircularProgress variant="determinate" value={100} size={220} thickness={4} className="circle-bg" />
            <CircularProgress variant="determinate" value={chargingData.percentage} size={220} thickness={4} className="circle-progress" />
            <div className="circle-text">
              <Bolt className="bolt-icon" />
              <h1>+{Math.round(chargingData.percentage)}%</h1>
              <p>Charged</p>
            </div>
          </div>



          {/* STATS */}
          <div className="stats">
            <div className="stat-box">
              {/* <Bolt className="bolt-icon" /> */}
              <div>
                <center>
                  <h3>{Number(chargingData.energyUsed || 0).toFixed(2)} kWh</h3>
                  <p> Energy Delivered</p>
                </center>
              </div>
            </div>
            {/* RATE & TIME */}
            <div className="time-center">
              <h3 className="time-1">{(remainingTime === '--:--' || !remainingTime) ? '00:00' : remainingTime}</h3>
              <p className="time-text">Time Left</p>
            </div>
          </div>

          {/* NOTIFY */}
          <div className="notify">
            <div className="notify-left">
              <img src={notifyIcon} alt="Notify" className="notify-icon" />
              <span>
                Notify when complete
                {isNotificationDisabled && (
                  <span style={{ fontSize: '8px', color: '#999', display: 'block' }}>
                    (Permission denied in browser)
                  </span>
                )}
              </span>
            </div>
            <Switch
              className="custom-switch"
              checked={notifyOnComplete}
              onChange={toggleNotification}
              disabled={isNotificationDisabled}
            />
          </div>

        </div>

        {/* ALERTS OVERLAY */}
        <div className="alert-overlay">
          {error && (
            <Alert
              severity="error"
              onClose={() => setError('')}
              className="alert-item"
            >
              {error}
            </Alert>
          )}
          {isCompleted && (
            <Alert severity="success" className="alert-item">
              Session Complete! Redirecting to invoice...
            </Alert>
          )}
        </div>

        {/* FIXED FOOTER */}
        <div className="footer-fixed">
          {/* ACTION BUTTONS */}
          <div className="actions">
            <Button className="btn cafe">
              <img
                src={Flag}
                alt="report"
                className="btn-icon"
                onClick={handleStopClick}
              />
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="error"
              className="stop-btn"
              onClick={handleStopClick}
              disabled={isStopping || isCompleted || !isSessionActive || isInitializing}
            >
              {isStopping ? "Stopping..." : "Stop Charging"}
            </Button>
          </div>

          {/* STATION ID */}
          <p className="station-id">Station ID: {session?.sessionId || session?.id || 'N/A'}</p>
        </div>

        <Dialog className="dialogContainer" open={stopDialog} onClose={() => !isStopping && setStopDialog(false)}>
          <DialogTitle className="dialog-title">
            Warning!
          </DialogTitle>

          <DialogContent className="dialog-content">
            Are you sure want to Stop the Charging?
            <p>Time elapsed: {formatTime(chargingData.timeElapsed)}</p>
            <p>Energy used: {Number(chargingData.energyUsed || 0).toFixed(2)} kWh</p>
          </DialogContent>

          <DialogActions className="dialog-actions-custom">
            <button
              className="back-btn"
              onClick={() => setStopDialog(false)}
              disabled={isStopping}>
              Back
            </button>
            <button
              className="stop-btn-dark"
              onClick={handleStopConfirm}
              disabled={isStopping}>
              {isStopping ? 'Stopping...' : 'Stop'}
            </button>
          </DialogActions>
        </Dialog>


        {/* INTERNAL CSS */}
        <style>{`
        html, body {
           height: 100%;
           height: 100dvh;
           margin: 0;
           background: #1c1c1c;  
           color: #ffffffff;
           overflow: hidden;
        }

          .init-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .init-popup {
            background: var(--color-matte-black);
            border-radius: 28px;
            padding: 48px 36px;
            text-align: center;
            max-width: 360px;
            width: 90%;
            animation: slideUp 0.4s ease;
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
          }

          @keyframes slideUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          /* ... (init spinner/text styles remain same) ... */
          .init-spinner { position: relative; width: 80px; height: 80px; margin: 0 auto 28px; stroke-linecap: round; }
          .init-bolt-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 36px; color: var(--color-primary-container); animation: pulse 1.5s ease infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.85); } }
          .init-title { font-size: 18px; font-weight: 700; margin: 0 0 8px; color: var(--color-white); }
          .init-message { font-size: 12px; color: var(--color-white); margin: 0 0 14px; min-height: 22px; transition: opacity 0.3s ease; }
          .init-dots { display: flex; justify-content: center; gap: 10px; margin-bottom: 24px; }
          .init-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--color-white); transition: all 0.3s ease; }
          .init-dot.active { background: var(--color-primary-container); transform: scale(1.3); }
          .init-hint { font-size: 10px; color: #888; margin: 0; padding-top: 12px; border-top: 1px solid #888; }


.main-card {
  height: 100vh;
  height: 100dvh; /* For mobile browsers */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 100vw;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Distribute space */
}

.footer-fixed {
  width: 100%;
  background: transparent;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding-bottom: env(safe-area-inset-bottom); /* Safe area */
  flex-shrink: 0;
}

/* HEADER */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0px;
  flex-shrink: 0;
  position: relative;
  z-index: 5; /* Ensure it stays above other elements */
}
.logo {
  height: auto;
  object-fit: contain;
  width: clamp(160px, 45vw, 260px); /* Increased size */
  max-width: 80%;
  margin-top: 10px;
}

/* CIRCLE */
.circle-container {
  position: relative;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  margin-top: 72px;
}

.circle-bg { position: absolute; color: #2e2e2e !important; z-index: 1; }
.circle-progress { position: absolute; color: #ffffff; z-index: 2; }
.circle-progress .MuiCircularProgress-circle { stroke-linecap: round; transition: stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1); }

.circle-text {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

.bolt-icon { font-size: 34px; color: #ffffff; }
.circle-text h1 { font-size: 42px; margin: 6px 0 0; font-weight: 700; color: #ffffff; }
.circle-text p { margin: 0; color: #bdbdbd; font-size: 14px; }

/* STATS */
.stats {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  gap: 16px; 
  padding: 42px 24px;
}

.stat-box { display: flex; align-items: center; gap: 8px; }
.stat-box h3 { margin: 0; font-size: 18px; font-weight: 700; color: #ffffff; padding-left: 0; }
.stat-box p { margin: 0; font-size: 12px; font-weight: 400; color: #9e9e9e; padding-left: 0;}

/* RATE & TIME */
.time-center .time-text{ color: #9e9e9e; font-size: 12px; }
.time-center .time-1{ color: var(--color-white); margin: 0; font-size: 18px; font-weight: 700;}

/* NOTIFY */
.notify {
  width: 100%;
  margin: 0;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 18px;
  background-color:#303030;
  box-sizing: border-box;
}

.alert-overlay {
  position: absolute;
  bottom: 110px; /* Above footer */
  left: 0;
  right: 0;
  z-index: 20;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none; /* Let clicks pass through if empty */
}

.alert-item {
font-size: 12px;
  pointer-events: auto; /* Re-enable pointer events for alerts */
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.notify-left { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: var(--font-weight-regular); color: #ffffff; }
.notify-icon { width: 20px; height: 20px; }
.custom-switch .MuiSwitch-track { background-color: #4a4a4a; opacity: 1; border-radius: 20px; }
.custom-switch.Mui-checked .MuiSwitch-thumb { background-color: #ffffff; }
.custom-switch .MuiSwitch-switchBase.Mui-checked { color: #ffffff; }

/* ACTION BUTTONS */
.actions {
  padding: 12px 2px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  height: 48px;
  padding: 0;
  border: 1px solid #3a3a3a;
  border-radius: 12px !important;
  background: #303030 !important;
  min-width: 48px;
  width: 48px;
}

.report { height: 44px; background: #252726ff !important; color: #ffffffff !important; }

/* STOP BUTTON */
.stop-btn {
  border-radius: 12px !important;
  height: 48px;
  flex: 1;
  font-size: 12px !important;
  font-weight: var(--font-weight-medium);
  color: #ffffffff !important;
  background:#FF4213 !important;
}

/* STATION ID */
.station-id { text-align: center; margin: 0 0 10px 0; color: #FFFFFF80; font-size: 10px; font-weight: 400; }

/* DIALOG */
.MuiDialog-paper { background-color: #212121 !important; color: #ffffff !important; border-radius: 20px !important; width: 90%; margin: 16px; }
.dialog-title { text-align: left; font-size: 20px; font-weight: 700; padding-top: 24px !important; }
.dialog-content { text-align: left; color: #cccccc !important; font-size: 14px; line-height: 1.6; padding-top: 8px !important; padding-bottom: 8px !important; }
.dialog-content p { margin: 4px 0; font-weight: 500; color: #ffffff; }
.dialog-actions-custom { background-color: #212121; display: flex; gap: 12px; padding: 16px 24px 24px !important; }
.back-btn { padding: 12px; border-radius: 12px; border: 1px solid #ffffff40; background: transparent; color: #ffffff; font-size: 14px; font-weight: 500; cursor: pointer; flex: 1; }
.stop-btn-dark { padding: 12px; border-radius: 12px; background: #C62828; border: none; color: white; font-size: 14px; font-weight: 600; cursor: pointer; flex: 1;}

/* Responsive Media Queries for Small Screens */
@media (max-width: 380px) { 
  .logo { width: 180px; margin-top: 5px; }
  .bolt-icon { font-size: 28px; }
  .circle-text h1 { font-size: 32px; }
  .stat-box h3 { font-size: 16px; }
  .time-center .time-1 { font-size: 18px; }
}

@media (max-height: 700px) {
  .logo { margin-top: 5px; width: clamp(130px, 30vw, 180px);}
  .stats { margin: 5px 0; padding: 5px 16px; }
  .notify { margin: 5px auto; padding: 6px 10px; }
  .circle-container { min-height: 180px; margin: 5px auto;}
  .btn, .stop-btn { height: 42px; }
  .actions { padding: 8px 2px; }
}
        

        `}</style>
      </Paper>
    </Container>
  )
}

export default ChargingSession