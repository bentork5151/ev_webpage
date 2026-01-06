import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import CacheService from "../services/cache.service";

const TransactionContext = createContext(null)

export const useTransaction = () => {
    const context = useContext(TransactionContext)
    if (!context) {
        throw new Error('useTransaction must be used within ChargingPovider')
    }
    return context
}

export const UserTransaction = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [transactionData, setTransactionData] = useState([])

    const fetchTransaction = useCallback(async () => {
        setLoading(true)
        setError('')
        try{
            const transactions = await AuthService.loadTransaction(loginResult.user.id, 10)
            if (transactions) {
                transactionHistory(transactions)
                setTransactionData(transactions)                                                                                                                                                                                                                                                                                                                                                                                                                                    setTransactionData(transactions)
            }
        } catch (error) {
            console.log('Failed to fetch transaction')
            setError('Failed to fetch plan')
        } finally {
            setLoading(false)
        }
    })

    const transactionHistory = (data) => {
        setTransactionData(data || [])
        CacheService.saveTransactionHistory(data || [])
    }

    const value = useMemo (() => ({
        transactionData,
        loading,
        error,

        fetchTransaction,
        transactionHistory
    }), [
        transactionData,
        loading,
        error,
        fetchTransaction,
        transactionHistory
    ])

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    )

}