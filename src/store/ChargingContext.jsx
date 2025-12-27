import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import ApiService from "../services/api.service";
import API_CONFIG from "../config/api.config";
import CacheService from "../services/cache.service";
import SessionService from "../services/session.service";

const ChargingContext = createContext(null)

export const useCharging = () => {
    const context = useContext(ChargingContext)
    if (!context) {
        throw new Error('useCharging must be used within CharginProvider')
    }

    return context
}

export const ChargingProvider = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, chargerData, updatedWalletBalance, updateChargerData} = useAuth()

    const [plans, setPlans] = useState([])
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [powerValue, setPowerValue] = useState(0.1)
    const [loading, setLoading] = useState(false)
    const [plansLoading, setPlansLoading] = useState(true)
    const [error, setError] = useState('')

    const isReceiptOpen = location.pathname === '/config-charging/receipt'

    const isChargerUnavailable = useMemo(() => {
        return chargerData?.status === 'offline' || chargerData?.status === 'busy'
    }, [chargerData?.status])

    const pricing = useMemo(() => {
        const baseAmount = Number(selectedPlan?.walletDeduction || 0)
        const totalAmount = baseAmount

        return {
            baseAmount,
            totalAmount,
            formattedBaseAmount: baseAmount.toFixed(2),
            formattedTotalAmount: totalAmount.toFixed(2)
        }
    }, [selectedPlan?.walletDeduction])

    const hasInsufficientBalance = useMemo(() => {
        console.log('check wallet balance')
        console.log((user?.walletBalance || 0) < pricing.totalAmount)
        return (user?.walletBalance || 0) < pricing.totalAmount
    }, [user?.walletBalance, pricing.totalAmount])

    useEffect(() => {
        fetchPlans()
    }, [chargerData?.chargerType])

    useEffect(() => {
        if (plans.length && !selectedPlan) {
            console.log('plan set 0')
            setSelectedPlan(plans[0])
        }
    }, [plans, selectedPlan])

    useEffect(() => {
        if (error) {
            setError('')
        }
    }, [selectedPlan?.id])

    const fetchPlans = useCallback(async () => {
        setPlansLoading(true)
        try {
            const response = await ApiService.get(API_CONFIG.ENDPOINTS.GET_ALL_PLANS)
            const filtered = chargerData?.chargerType
                ? response.filter((p) => p.chargerType === chargerData?.chargerType)
                : response
            setPlans(filtered)
        } catch (error) {
            console.error('Failed to fetch Plans: ',error)
            setError('Failed to fetch Plans')
        } finally {
            setPlansLoading(false)
        }
    }, [chargerData?.chargerType])

    const selectPlan = useCallback((plan) => {
        console.log('plan set choosen')
        console.log(plan)
        setSelectedPlan(plan)
        setError('')
    }, [])

    const updatePowerValue = useCallback((value) => {
        setPowerValue(value)
        setError('')
    }, [])

    const openReceipt = useCallback(() => {
        if (!selectedPlan) {
            console.error('Plan not selected, PLease select a plan')
            setError('Please select a plan')
        }
        navigate('receipt')
    }, [selectedPlan, navigate])

    const closeReceipt = useCallback(() => {
        navigate('/config-charging', {replace: true})
        setError('')
    }, [navigate])

    const processPayment = useCallback(async () => {

        if (!selectedPlan) {
            setError('Please select a plan')
            return { success: false}
        }

        if (hasInsufficientBalance) {
            setError('Insufficient wallet balance')
            return { success: false}
        }

        setLoading(true)
        setError('')
        try {
            const updatedPlan = {
                ...selectedPlan,
                walletDeduction : Number(pricing.formattedTotalAmount)
            }
            CacheService.savePlanData(updatedPlan)

            const chargerResponse = await ApiService.get(
                        API_CONFIG.ENDPOINTS.GET_CHARGER(chargerData?.ocppId))
            console.info('Charger Data:', chargerResponse)
            updateChargerData(chargerResponse)
            console.log('ischargerunavailable: ',isChargerUnavailable)
            console.log('charger data 2: ',chargerData)

            if (isChargerUnavailable) {
                setError('Charger is unavailable')
                return { success: false}
            }

            const result = await SessionService.startSession(
                chargerData?.id,
                selectedPlan?.id,
                chargerData?.ocppId
            )

            console.log('result: ',result)

            if (result?.session?.status === 'FAILED') {
                setError('Charging failed to start')
                return { success : false}
            }

            if (!result.success) {
                setError(result.error || 'Failed to start charging session')
                CacheService.clearPlanData()
                CacheService.clearSessionData()
                return { success: false, error: result.error }
            }

            const sessionStatus = String(result.session?.status || '').toUpperCase()
            if (sessionStatus === 'FAILED') {
                setError('Charging session failed to start. Please try again.')
                CacheService.clearPlanData()
                CacheService.clearSessionData()
                return { success: false, error: 'Session failed to start' }
            }

            const newBalance = Number(user?.walletBalance || 0) - pricing.totalAmount
            updatedWalletBalance(newBalance)

            navigate('/charging-session', { replace: true })
            return { success: true }
        } catch (error) {
            console.error('Payment process error: ',error)
            const errMsg = error?.message || 'Something went wrong, please try again later'
            setError(errMsg)
            return { success: false, message: errMsg}
        } finally {
            setLoading(false)
        }
    }, [
        selectedPlan,
        chargerData?.id,
        pricing,
        hasInsufficientBalance,
        isChargerUnavailable,
        user?.walletBalance,
        updatedWalletBalance,
        navigate
    ])

    const resetChargingState = useCallback(() => {
        setLoading(false)
        setError('')
        setSelectedPlan(null)
    }, [])

    const value = useMemo(() => ({

        plans,
        selectedPlan,
        loading,
        plansLoading,
        error,
        isReceiptOpen,
        isChargerUnavailable,
        hasInsufficientBalance,
        chargerData,
        pricing,
        userWalletBalance: Number(user?.walletBalance ?? 0),
        selectPlan,
        updatePowerValue,
        openReceipt,
        closeReceipt,
        processPayment,
        resetChargingState,
        fetchPlans,
        setError
    }), [
        plans,
        selectedPlan,
        loading,
        plansLoading,
        error,
        isReceiptOpen,
        isChargerUnavailable,
        hasInsufficientBalance,
        chargerData,
        pricing,
        user?.walletBalance,
        selectPlan,
        updatePowerValue,
        openReceipt,
        closeReceipt,
        processPayment,
        resetChargingState,
        fetchPlans,
    ])

    return (
        <ChargingContext.Provider value={value}>
            {children}
        </ChargingContext.Provider>
    )
}

export default ChargingContext