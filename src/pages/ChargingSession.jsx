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

import energyIcon from "../assets/images/energy.svg";
import batteryIcon from "../assets/images/battery.svg";
import notifyIcon from "../assets/images/notify.svg"
import Flag from "../assets/images/Flag.svg";
import BentorkLogo from "../assets/images/logo-1.png";

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
    batteryHealth,

    initializeSession,
    stopSession,
    toggleNotification,
    formatTime,
    setError
  } = useSession()

  const [stopDialog, setStopDialog] = useState(false)

  useEffect(() => {
    initializeSession()
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
          <CircularProgress variant="determinate" value={100} size={260} thickness={4} className="circle-bg" />
          <CircularProgress variant="determinate" value={15} size={260} thickness={4} className="circle-progress" />
          <div className="circle-text">
            <Bolt className="bolt-icon" />
            <h1>+{Math.round(chargingData.percentage)}%</h1>
            <p>Charged</p>
          </div>
        </div>

        {error && (
          <Alert
            severity="error"
            sx={{ mx: 2, mb: 2 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
        {isCompleted && (
          <Alert severity="success" sx={{ mx: 2, mb: 2 }}>
            Session Complete! Redirecting to invoice...
          </Alert>
        )}

        {/* RATE & TIME */}

        {/*   
   <div className="time-center">
          <h2>{remainingTime}</h2>
          <p>Time Left</p>
        </div> */}


        {/* ENERGY & HEALTH */}
        {/* <div className="stats">
          <div className="stat-box"><Bolt /><div><h3>{chargingData.energyUsed.toFixed(1)} kWh</h3><p>Energy Delivered</p></div></div>
          <div className="stat-box"><BatteryChargingFull /><div><h3>Good</h3><p>Battery Health</p></div></div>
        </div> */}
        <div className="stats">

          <div className="stat-box">

            <div>
              <h3>{chargingData.energyUsed.toFixed(1)} kWh</h3>
              <p>Energy Delivered</p>
            </div>
          </div>
          {/* RATE & TIME */}
          <div className="time-center">
            <h2 className="time-1">{remainingTime}</h2>
            <p className="time-text">Time Left</p>
          </div>

        </div>

        {/* NOTIFY */}
        <div className="notify">
          {/* <div className="notify-left"><NotificationsNone /><span>Notify when complete</span></div> */}
          <div className="notify-left">
            <img src={notifyIcon} alt="Notify" className="notify-icon" />
            <span>
              Notify when complete
              {isNotificationDisabled && (
                <span style={{ fontSize: '10px', color: '#999', display: 'block' }}>
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

        {/* ACTIONS */}
        {/* <div className="actions">
          <Button fullWidth startIcon={<LocalCafeRounded />} className="btn cafe">Nearby Cafe</Button>
          <Button fullWidth startIcon={<ReportProblemRounded />} className="btn report">Report</Button>
        </div> */}

        {/* STOP BUTTON */}
        <div className="actions">
          <Button className="btn cafe">
            <img
              src={Flag}
              alt="report"
              className="btn-icon"
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
        <p className="station-id">Station ID: {session?.sessionId || session?.id || 'N/A'}</p>

        {/* <Dialog open={stopDialog} onClose={() => !isStopping && setStopDialog(false)}>
          <DialogTitle>Warning!</DialogTitle>
          <DialogContent>
            <p>Are you sure want to Stop the Charging?</p>
            <p>Time elapsed: {formatTime(chargingData.timeElapsed)}</p>
            <p>Energy used: {chargingData.energyUsed.toFixed(2)} kWh</p>
          </DialogContent>
          <DialogActions className="DialogActions_button">
            <Button onClick={() => setStopDialog(false)}color="error">Cancel</Button>
            <Button onClick={handleStopSession} color="error" variant="contained">Stop</Button>
          </DialogActions>
        </Dialog> */}

        <Dialog open={stopDialog} onClose={() => !isStopping && setStopDialog(false)}>
          <DialogTitle style={{ fontWeight: "700", fontSize: "22px" }}>
            Warning!
          </DialogTitle>

          <DialogContent>
            Are you sure want to Stop the Charging?
            <p>Time elapsed: {formatTime(chargingData.timeElapsed)}</p>
            <p>Energy used: {chargingData.energyUsed.toFixed(2)} kWh</p>
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
              {isStopping ? 'Stopping...' : 'Stop Session'}
            </button>
          </DialogActions>
        </Dialog>


        {/* INTERNAL CSS */}
        <style>{`

        html, body {
           height: 100%;
  margin: 0;

  background: #1c1c1c;  
    color: #ffffffff;

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
            background: #fff;
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

          .init-spinner {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0 auto 28px;
          }

          .init-bolt-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 36px;
            color: #7dbb63;
            animation: pulse 1.5s ease infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.85); }
          }

          .init-title {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 16px;
            color: #1a1a1a;
          }

          .init-message {
            font-size: 15px;
            color: #555;
            margin: 0 0 24px;
            min-height: 22px;
            transition: opacity 0.3s ease;
          }

          .init-dots {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 24px;
          }

          .init-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #e0e0e0;
            transition: all 0.3s ease;
          }

          .init-dot.active {
            background: #7dbb63;
            transform: scale(1.3);
          }

          .init-hint {
            font-size: 13px;
            color: #888;
            margin: 0;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }


.main-card {
  padding: 24px 8px;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* HEADER */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
}
.logo {

  height: auto;
  object-fit: contain;
  left: 90px;
  width: clamp(120px, 45vw, 220px);

  
  
}

/* CIRCLE */
.circle-container {
  position: relative;
  width: min(260px, 70vw);
  height: min(260px, 70vw);
  margin: 49px auto;
}

.circle-bg {
border-radius: 50%;
  color: #2e2e2e !important;
}
.circle-bg .MuiCircularProgress-circle {
  stroke-linecap: round;
}

.circle-progress {
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-white);
}

.circle-progress .MuiCircularProgress-circle {
  stroke-linecap: round;
}


.circle-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bolt-icon {
  font-size: 34px;
  color: #ffffff; 
}

.circle-text h1 {
  font-size: 42px;
  margin: 6px 0 0;
  font-weight: 700;
  color: #ffffff;
}

.circle-text p {
  margin: 0;
  color: #bdbdbd;
  font-size: 14px;
}



/* STATS */
.stats {
  display: flex;
  justify-content: space-between;
  margin: 28px 0;
  gap: 52px;
  flex-wrap: wrap;
  padding: 10px 28px;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-box h3 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
}

.stat-box p {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #9e9e9e;
  align-items: center;
  padding-left: 8px;
}
/* RATE & TIME */
.time-center .time-text{
color: #9e9e9e;
font-size: 12px;
}
.time-center .time-1{
color: var(--color-white);
}

/* NOTIFY */
.notify {
  width: 100%;
  height: 60px;
  padding: 12px;
  gap:40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 18px;
  opacity: 1;
  background-color:#303030;
  box-sizing: border-box;
  margin-top:10px;
}

.notify-left {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-weight: var(--font-weight-regular);
  color: #ffffff;
}


.notify-icon {
  width: 24px;
  height: 24px;
  margin-left:8px;
}

/* OFF state track */
.custom-switch .MuiSwitch-track {
  background-color: #4a4a4a;
  opacity: 1;
  border-radius: 20px;
}

/* ON state */
.custom-switch.Mui-checked .MuiSwitch-thumb {
  background-color: #ffffff; 
}


/* Focus & hover fix */
.custom-switch .MuiSwitch-switchBase.Mui-checked {
  color: #ffffff;
}


/* ACTION BUTTONS */
.actions {
  padding: 12px 0;
  display: flex;
  gap: 10px;
  width: 100%;
  
}

.btn {
  border: 1px solid #3a3a3a;
  border-radius: 12px !important;
  background: #303030 !important;
  min-width: 48px;
}

.report {
  background: #252726ff !important;
  color: #ffffffff !important;
}

/* STOP BUTTON */
.stop-btn {
  border-radius: 12px !important;
  height: 44px;
  width: 351px;
    flex: 1;
  max-width: none;
  font-size: 12px !important;
  font-weight: 700;
  color: #ffffffff !important;
  background:#FF4213 !important;
  padding: 10px;
}

/* STATION ID */
.station-id {
  text-align: center;
  margin-top: 0px;
  color: #FFFFFF80;
  font-size: 12px;
  font-weight: 400;
}

/* LOADING */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  flex-direction: column;
  gap: 10px;
}

/* DIALOG */
.dialog-actions-custom {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px !important;
}

.back-btn {
  min-width: 120px;
  padding: 12px 26px;
  border-radius: 30px;
  border: 2px solid #000;
  background: white;
  font-size: 15px;
  font-weight: 600;
}

.stop-btn-dark {
  min-width: 120px;
  padding: 12px 26px;
  border-radius: 30px;
  background: #1c1c1c;
  color: white;
  font-size: 15px;
  font-weight: 600;
}
  @media (max-height: 700px) {
  .circle-container {
    width: 220px;
    height: 220px;
  }

  .circle-text h1 {
    font-size: 28px;
  }
}
  


        `}</style>
      </Paper>
    </Container>
  )
}

export default ChargingSession