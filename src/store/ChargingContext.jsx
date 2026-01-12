import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import ApiService from "../services/api.service";
import API_CONFIG from "../config/api.config";
import CacheService from "../services/cache.service";
import SessionService from "../services/session.service";
import NotificationService from "../services/notification.service";
import { logError } from "../config/errors.config";

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
    const { user, chargerData, updatedWalletBalance, updateChargerData } = useAuth()

    const [plans, setPlans] = useState([])
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [powerValue, setPowerValue] = useState(0.1)
    const [loading, setLoading] = useState(false)
    const [plansLoading, setPlansLoading] = useState(true)
    const [error, setError] = useState('')
    const [notificationStatus, setNotificationStatus] = useState('default')

    const isReceiptOpen = location.pathname === '/config-charging/receipt'

    const isChargerUnavailable = useMemo(() => {
        if (!chargerData?.status) return true;
        const s = chargerData.status.toLowerCase();
        return s === 'offline' || s === 'busy' || s === 'charging' || s === 'preparing' || s === 'active' || s === 'finishing' || s === 'suspendedev' || s === 'suspendedevse' || s === 'reserved' || s === 'unavailable' || s === 'faulted';
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
        console.log('check wallet balance', (user?.walletBalance || 0) < pricing.totalAmount)
        return (user?.walletBalance || 0) < pricing.totalAmount
    }, [user?.walletBalance, pricing.totalAmount])

    useEffect(() => {
        if (NotificationService.isSupported) {
            setNotificationStatus(Notification.permission)
        }
    }, [])

    useEffect(() => {
        fetchPlans()
    }, [chargerData?.chargerType])

    //     useEffect(() => {
    //         if (plans.length && !selectedPlan) {
    //             console.log('plan set 0')
    //             setSelectedPlan(plans[0])
    //         }
    //     }, [plans, selectedPlan])

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
                ? response.filter((p) =>
                    p.chargerType?.toLowerCase() === chargerData?.chargerType?.toLowerCase())
                : response
            setPlans(filtered)
        } catch (error) {
            console.error('Failed to fetch Plans: ', error)
            setError('Failed to fetch Plans')
        } finally {
            setPlansLoading(false)
        }
    }, [chargerData?.chargerType])

    const fetchChargerStatus = useCallback(async () => {
        if (!chargerData?.ocppId) return
        try {
            const response = await ApiService.get(API_CONFIG.ENDPOINTS.GET_CHARGER(chargerData.ocppId))
            if (response) {
                updateChargerData(response)
            }
        } catch (err) {
            console.error('Failed to fetch charger status:', err)
        }
    }, [chargerData?.ocppId, updateChargerData])

    useEffect(() => {
        if (chargerData?.ocppId) {
            fetchChargerStatus()
        }
    }, [chargerData?.ocppId])

    const selectPlan = useCallback((plan) => {
        console.log('plan set choosen', plan)
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
            return
        }
        navigate('receipt')
    }, [selectedPlan, navigate])

    const closeReceipt = useCallback(() => {
        navigate('/config-charging', { replace: true })
        setError('')
    }, [navigate])

    const requestNotificationPermission = useCallback(async () => {
        if (!NotificationService.isSupported) {
            return { granted: false, status: 'unsupported' }
        }

        const currentPermission = Notification.permission

        if (currentPermission === 'granted') {
            return { granted: true, status: 'granted' }
        }

        if (currentPermission === 'denied') {
            return { granted: false, status: 'denied' }
        }

        const granted = await NotificationService.requestPermission()
        const newStatus = Notification.permission
        setNotificationStatus(newStatus)
        return { granted, status: newStatus }
    }, [])

    const processPayment = useCallback(async () => {

        if (!selectedPlan) {
            setError(logError('PLAN_NOT_SELECTED'))
            return { success: false }
        }

        if (hasInsufficientBalance) {
            setError(logError('WALLET_INSUFFICIENT'))
            return { success: false }
        }

        setLoading(true)
        setError('')
        try {
            console.log('Requesting notification permission...')
            const { granted, status } = await requestNotificationPermission()
            console.log('Notification permission result:', { granted, status })
            CacheService.saveNotificationPreference(granted)

            const updatedPlan = {
                ...selectedPlan,
                walletDeduction: Number(pricing.formattedTotalAmount)
            }
            CacheService.savePlanData(updatedPlan)

            const chargerResponse = await ApiService.get(
                API_CONFIG.ENDPOINTS.GET_CHARGER(chargerData?.ocppId))
            console.info('Charger Data:', chargerResponse)
            updateChargerData(chargerResponse)

            // Check status directly from fresh response
            const currentStatus = chargerResponse?.status?.toLowerCase() || 'offline'
            // Check comprehensive busy list
            const busyStatuses = ['offline', 'busy', 'charging', 'active', 'preparing', 'finishing', 'suspendedev', 'suspendedevse', 'reserved', 'unavailable', 'faulted'];
            const isUnavailable = busyStatuses.includes(currentStatus);

            if (isUnavailable) {
                setError(logError('CHARGER_UNAVAILABLE'))
                return { success: false }
            }

            const result = await SessionService.startSession(
                chargerData?.id,
                selectedPlan?.id,
                chargerData?.ocppId,
                selectedPlan?.kw || null
            )

            console.log('result: ', result)

            if (result?.session?.status === 'FAILED') {
                setError(logError('SESSION_START_FAILED'))
                return { success: false }
            }

            if (!result.success) {
                setError(result.error || logError('SESSION_START_FAILED'))
                CacheService.clearPlanData()
                CacheService.clearSessionData()
                return { success: false, error: result.error }
            }

            const sessionStatus = String(result.session?.status || '').toUpperCase()
            if (sessionStatus === 'FAILED') {
                setError(logError('SESSION_START_FAILED'))
                CacheService.clearPlanData()
                CacheService.clearSessionData()
                return { success: false, error: 'Session failed to start' }
            }

            const newBalance = Number(user?.walletBalance || 0) - pricing.totalAmount
            updatedWalletBalance(newBalance)

            navigate('/charging-session', { replace: true })
            return { success: true }
        } catch (error) {
            const errMsg = logError('GENERIC_ERROR', error)
            setError(errMsg)
            return { success: false, message: errMsg }
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
        requestNotificationPermission,
        updateChargerData,
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
        powerValue,
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
        powerValue,
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