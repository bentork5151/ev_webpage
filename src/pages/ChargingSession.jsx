import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
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
import {
  BatteryChargingFull,
  Bolt,
  NotificationsNone,
  ReportProblemRounded,
  LocalCafeRounded
} from "@mui/icons-material"    

import SessionService from "../services/session.service"
import CacheService from "../services/cache.service"
import energyIcon from "../assets/images/energy.svg";
import batteryIcon from "../assets/images/battery.svg";
import notifyIcon from "../assets/images/notify.svg"

const ChargingSession = () => {
  const navigate = useNavigate()

  const intervalRef = useRef(null)
  const energyIntervalRef = useRef(null)

  const [selectedPlan, setSelectedPlan] = useState(null)
  const [session, setSession] = useState(null)
  const [chargingData, setChargingData] = useState({
    energyUsed: 0,
    timeElapsed: 0,
    percentage: 0,
    status: "ACTIVE"
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stopDialog, setStopDialog] = useState(false)
  const [stopping, setStopping] = useState(false)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [notifyOnComplete, setNotifyOnComplete] = useState(true)
const getBatteryHealth = () => {
  const p = chargingData.percentage

  if (p >= 80) return "Excellent"
  if (p >= 55) return "Good"
  if (p >= 30) return "Average"
  return "Low"
}

  useEffect(() => {
    initializeSession()
    return () => {
      clearInterval(intervalRef.current)
      clearInterval(energyIntervalRef.current)
    }
  }, [])

  const initializeSession = async () => {
    try {
      const activeSession =
        CacheService.getSessionData() || (await SessionService.getActiveSession?.())
      const plan = CacheService.getPlanData?.()

      if (!activeSession || !(activeSession.sessionId || activeSession.id)) {
        navigate("/config-charging")
        return
      }

      setSession(activeSession)
      setSelectedPlan(plan)

      if (plan?.durationMin) startTimer(plan.durationMin)
      startEnergyMonitoring(activeSession.sessionId || activeSession.id)
      setLoading(false)
    } catch {
      setError("Failed to load charging session")
      setLoading(false)
    }
  }

  const startTimer = (durationMinutes) => {
    const totalSeconds = durationMinutes * 60
    intervalRef.current = setInterval(() => {
      setChargingData((prev) => {
        const newElapsed = prev.timeElapsed + 1
        const percentage = (newElapsed / totalSeconds) * 100

        if (newElapsed >= totalSeconds) {
          clearInterval(intervalRef.current)
          handleSessionComplete({ status: "COMPLETED" })
        }

        return { ...prev, timeElapsed: newElapsed, percentage: Math.min(100, percentage) }
      })
    }, 1000)
  }

  const startEnergyMonitoring = async (sessionId) => {
    const checkEnergy = async () => {
      try {
        const status = await SessionService.getSessionStatus(sessionId)
        console.log("Server Status:", status);
        const kwh = await SessionService.getKwhUsed(sessionId)
        console.log("Server Status:", status);
        setChargingData((prev) => ({
          ...prev,
          energyUsed: kwh || 0,
          status: (status || "ACTIVE").toUpperCase()
        }))
        if ((status || "").toUpperCase() === "COMPLETED") handleSessionComplete({ status: "COMPLETED" })
      } catch (err) {
        console.error("Energy error:", err)
      }
    }
    checkEnergy()
    energyIntervalRef.current = setInterval(checkEnergy, 10000)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getRemainingTime = () => {
    if (!selectedPlan?.durationMin) return "--:--"
    const total = selectedPlan.durationMin * 60
    return formatTime(Math.max(0, total - chargingData.timeElapsed))
  }

  const handleStopSession = async () => {
    if (stopping) return
    setStopDialog(false)
    setStopping(true)
    setError("")
    try {
      const sessionId = session?.sessionId || session?.id
      console.log("Stopping session:", sessionId)
      await SessionService.stopSession(sessionId)
      handleSessionComplete({ status: "STOPPED" })
    } catch (err) {
      console.error(err)
      setError("Failed to stop charging session")
    }
    setStopping(false)
  }

  const handleSessionComplete = (data) => {
    // clearInterval(intervalRef.current)
    // clearInterval(energyIntervalRef.current)
    setChargingData((prev) => ({ ...prev, status: data.status }))
    setSessionCompleted(true)
    setTimeout(() => navigate("/invoice"), 1500)
  }

  if (loading) return (
    <div className="loading"><CircularProgress /><p>Loading session...</p></div>
  )

  const isSessionActive = (chargingData.status || "").toUpperCase() === "ACTIVE"

  return (
    <Container maxWidth="sm">
      <Paper className="main-card">

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

        {error && <Alert severity="error">{error}</Alert>}
        {sessionCompleted && <Alert severity="success">Completed! Redirecting...</Alert>}

        {/* RATE & TIME */}
        <div className="rate-time">
          <div><h2>{selectedPlan?.rate || 20} kW/h</h2><p>Charging Rate</p></div>
          <div className="right"><h2>{getRemainingTime()}</h2><p>Time Left</p></div>
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
      <h3>{getBatteryHealth()}</h3>
      <p>Battery Health</p>
    </div>
  </div>

</div>

        {/* NOTIFY */}
        <div className="notify">
          {/* <div className="notify-left"><NotificationsNone /><span>Notify when complete</span></div> */}
          <div className="notify-left"> <img src={notifyIcon} alt="Notify" className="notify-icon" /> <span>Notify when complete</span></div>
          <Switch checked={notifyOnComplete} onChange={() => setNotifyOnComplete(!notifyOnComplete)} />
        </div>

        {/* ACTIONS */}
        <div className="actions">
          <Button fullWidth startIcon={<LocalCafeRounded />} className="btn cafe">Nearby Cafe</Button>
          <Button fullWidth startIcon={<ReportProblemRounded />} className="btn report">Report</Button>
        </div>

        {/* STOP BUTTON */}
        <Button
          fullWidth
          variant="contained"
          color="error"
          className="stop-btn"
          onClick={() => setStopDialog(true)}
          disabled={stopping || sessionCompleted || !isSessionActive}
        >
          {stopping ? "Stopping..." : "Stop Charging"}
        </Button>

        <p className="station-id">Station ID: {session?.stationId || session?.sessionId || session?.id}</p>

        <Dialog open={stopDialog} onClose={() => setStopDialog(false)}>
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
        </Dialog>

        <Dialog open={stopDialog} onClose={() => setStopDialog(false)}>
  <DialogTitle style={{ fontWeight: "700", fontSize: "22px" }}>
    Warning!
  </DialogTitle>

  <DialogContent>
    Are you sure want to Stop the Charging?
   <p>Time elapsed: {formatTime(chargingData.timeElapsed)}</p>
            <p>Energy used: {chargingData.energyUsed.toFixed(2)} kWh</p>
  </DialogContent>

  <DialogActions className="dialog-actions-custom">
    <button className="back-btn" onClick={() => setStopDialog(false)}>Back</button>
    <button className="stop-btn-dark" onClick={handleStopSession}>Stop</button>
  </DialogActions>
</Dialog>


        {/* INTERNAL CSS */}
        <style>{`
          .main-card { padding: 20px; border-radius: 20px; width: 100%; box-sizing: border-box; }
          .header { text-align: center; }
          .logo { width: 40%; max-width: 160px; display: block; margin: 0 auto 8px; }
          .circle-container { position: relative; width: 80%; max-width: 260px; height: auto; margin: 30px auto; }
          .circle-bg { color: #C0EFB0 !important; }
          .circle-progress { position: absolute; left: 0; top: 0; color: #6DB85B !important; }
          .circle-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; }
          .bolt-icon { color: #6DB85B; font-size: 32px; }
          .rate-time { display: flex; justify-content: space-between; flex-wrap: wrap; }
          .right { text-align: right; } 
          .stats { display: flex; justify-content: space-between; margin: 20px 0; flex-wrap: wrap; gap: 200px; }
       
          .stat-box { display: flex; align-items: center; gap: 12px;}
.stat-icon {
  width: 32px;
  height: 32px;
}
.notify-icon {
  width: 24px;
  height: 24px;
}

          .notify { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
          .notify-left { display: flex; align-items: center; gap: 5px; }
          .actions { display: flex; gap: 10px; margin: 15px 0; flex-wrap: wrap; }
          .btn { border-radius: 12px !important; font-weight: bold !important; flex: 1; min-width: 140px; }
          .cafe { background: #ffe0c2 !important; color: #a84310 !important; }
          .report { background: #d9f3df !important; color: #2e7d32 !important; }
          .stop-btn { border-radius: 16px !important; margin-top: 15px !important; }
          .station-id { text-align: center; margin-top: 20px; color: gray; font-size: 14px; }
          .loading { display: flex; justify-content: center; align-items: center; gap: 10px; height: 70vh; flex-direction: column; }
          .DialogActions_button{ gap: 100px; justify-content: space-between ; display: flex;}


          .dialog-actions-custom {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px !important;
}

.back-btn {
  min-width: 120px;
  padding: 12px 26px;
  border-radius: 25px;
  border: 2px solid #000;
  background: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.stop-btn-dark {
  min-width: 120px;
  padding: 12px 26px;
  border-radius: 25px;
  border: none;
  background: #1c1c1c;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.stop-btn-dark:hover {
  background: #000;
}

.back-btn:hover {
  background: #f5f5f5;
}

        `}</style>
      </Paper>
    </Container>
  )
}

export default ChargingSession