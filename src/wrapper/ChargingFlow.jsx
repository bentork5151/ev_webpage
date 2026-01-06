import React from 'react'
import { ChargingProvider } from "../store/ChargingContext"
import ConfigCharging from '../pages/ConfigCharging'

const ChargingFlow = () => {
    return (
        <ChargingProvider>
            <ConfigCharging/>
        </ChargingProvider>
    )
}

export default ChargingFlow