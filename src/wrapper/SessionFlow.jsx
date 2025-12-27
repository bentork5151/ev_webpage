import React from 'react'
import { SessionProvider } from '../store/SessionContext'
import ChargingSession from '../pages/ChargingSession'

const SessionFlow = () => {
  return (
    <SessionProvider>
      <ChargingSession />
    </SessionProvider>
  )
}

export default SessionFlow