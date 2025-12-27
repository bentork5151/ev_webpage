import React, { useEffect } from "react"
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

import energyIcon from "../assets/images/energy.svg";
import batteryIcon from "../assets/images/battery.svg";
import notifyIcon from "../assets/images/notify.svg"
import Flag from "../assets/images/Flag.svg"

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

    remainingTime,
    batteryHealth,

    initializeSession,
    stopSession,
    toggleNotification,
    formatTime,
    setError
  } = useSession()

  const [stopDialog, setStopDialog] = React.useState(false)

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

  if (isLoading) {
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
    bgcolor: "#fdfdfdff",
  }}
>

  {isInitializing && (
    <div className="init-overlay">
      <div className="init-popup">
        <div className="init-spinner">
          <CircularProgress 
            size={80} 
            thickness={4}
            sx={{ color: "#7dbb63" }}
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
            src="https://github.com/bentork5151/assets/blob/main/Logo/logo_transparent.png?raw=true"
            alt="BENTORK Logo"
            className="logo"
          />
         
        </div>

        {/* CIRCLE */}
        <div className="circle-container">
          <CircularProgress variant="determinate" value={100} size={260} thickness={4} className="circle-bg" />
          <CircularProgress variant="determinate" value={chargingData.percentage} size={260} thickness={8} className="circle-progress" />
          <div className="circle-text">
            <Bolt className="bolt-icon" />
            <h1>{Math.round(chargingData.percentage)}%</h1>
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
        
  
   <div className="time-center">
          <h2>{remainingTime}</h2>
          <p>Time Left</p>
        </div>


        {/* ENERGY & HEALTH */}
        {/* <div className="stats">
          <div className="stat-box"><Bolt /><div><h3>{chargingData.energyUsed.toFixed(1)} kWh</h3><p>Energy Delivered</p></div></div>
          <div className="stat-box"><BatteryChargingFull /><div><h3>Good</h3><p>Battery Health</p></div></div>
        </div> */}
<div className="stats">
  
  <div className="stat-box">
    <img
      src={energyIcon}
      alt="Energy"
      style={{ width: "32px", height: "32px" }}
    />
    <div>
      <h3>{chargingData.energyUsed.toFixed(1)} kWh</h3>
      <p>Energy Delivered</p>
    </div>
  </div>

  <div className="stat-box">
    <img
      src={batteryIcon}
      alt="Battery"
      style={{ width: "32px", height: "32px" }}
    />
    <div>
      <h3>{batteryHealth}</h3>
      <p>Battery Health</p>
    </div>
  </div>

</div>

        {/* NOTIFY */}
        <div className="notify">
          {/* <div className="notify-left"><NotificationsNone /><span>Notify when complete</span></div> */}
          <div className="notify-left"> 
            <img src={notifyIcon} alt="Notify" className="notify-icon" /> 
            <span>Notify when complete</span>
          </div>
          <Switch
            className="custom-switch"
            checked={notifyOnComplete}
            onChange={toggleNotification}
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
          disabled={isStopping  || isCompleted  || !isSessionActive}
        >
          {isStopping  ? "Stopping..." : "Stop Charging"}
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
  padding: 22px 18px;
  border-radius: 26px;
  height: 100%;
  max-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* HEADER */
.header {
  text-align: center;
   display: flex;
  justify-content: center;
  align-items: center;
}
.logo {
width: clamp(120px, 30vw, 180px);
  margin: 0 auto 10px;
}

/* CIRCLE */
.circle-container {
  position: relative;
  width: clamp(200px, 60vw, 260px);
  height: clamp(200px, 60vw, 260px);
  margin: 49px 50px;
}

.circle-bg {
  color: #cfeec4 !important;
}

.circle-progress {
  position: absolute;
  left: 0;
  top: 0;
  color: #7dbb63 !important;
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
  color: #7dbb63;
}

.circle-text h1 {
  font-size: 42px;
  margin: 6px 0 0;
  font-weight: 700;
}

.circle-text p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

/* RATE & TIME *
.time-center {
          text-align: center;
            margin-top: 10px;
        }


.time-center h2 {
  font-size: clamp(20px, 6vw, 26px);
  margin: 0;
}

.time-center p {
  font-size: 12px;
  color: #666;
}




/* STATS */
.stats {
  display: flex;
  justify-content: space-between;
  margin: 28px 0;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-box h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.stat-box p {
  margin: 0;
  font-size: 13px;
  color: #777;
}

/* NOTIFY */
.notify {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius:28px;
  border:0.25px solid #00000024;
  background: #F1F1F1;
   margin-left:10px;
  
}

.notify-left {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 12px;
  font-weight: 400;

  
}


.notify-icon {
  width: 16px;
  height: 20px;
  margin-left:20px;
}

/* OFF state track */
.custom-switch .MuiSwitch-track {
  background-color: #ccc;
  opacity: 1;
  border-radius: 20px;
}

/* ON state */
.custom-switch.Mui-checked .MuiSwitch-thumb {
  background-color: #ffffff;
}



/* Focus & hover fix */
.custom-switch .MuiSwitch-switchBase.Mui-checked {
  color: #000000ff;
}


/* ACTION BUTTONS */
.actions {
  display: flex;
  gap: 10px;
  
}

.btn {  
    margin-top: 130px !important;
     border:1px solid #CCCCCC;
     border-radius: 12px !important;
}



.report {
  background: #dff3e5 !important;
  color: #2e7d32 !important;
}

/* STOP BUTTON */
.stop-btn {
  border-radius: 12px !important;
  height: 44px;
  width: 351px;
  font-size: 12px !important;
  margin-top: 130px !important;
   font-weight: 700;
   
      padding: 10px;

}

/* STATION ID */
.station-id {
  text-align: center;
  margin-top: 30px;
  color: #00000080;
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


        `}</style>
      </Paper>
    </Container>
  )
}

export default ChargingSession