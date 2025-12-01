import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import {
  Box, 
  Container,
  Grid,
  Card,
  CardContent,
  Paper, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle,
  DialogContent, 
  DialogActions, 
  TextField, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  AccountBalanceWallet, Email, Person, CreditCard, History
} from '@mui/icons-material'
import { useAuth } from '../store/AuthContext'
import AuthService from '../services/auth.service'
import PaymentService from '../services/payment.service'

const Dashboard  = () => {
  const navigate = useNavigate()
  const { user, transactionData } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rechargeDialog, setRechargeDialog] = useState(false)
  const [rechargeAmount, setRechargeAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    loadInitialData()
  }, [])

  const loadInitialData = () => {
    if (Array.isArray(transactionData)) {
      setTransactions(transactionData)
    } else {
      setTransactions([])
    }
  }

  const handleRecharge = async () => {
    if(!rechargeAmount || parseFloat(rechargeAmount) <= 0){
      setError('Please enter a valid amount')
      return
    }

    const amount = parseFloat(rechargeAmount)
    
    if (amount < 1) {
      setError('Minimum recharge amount is ₹1')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try{
      console.log('Creating order for amount:', amount)
      const orderResult = await PaymentService.createOrder(amount)

      if (!orderResult.success) {
        setError(orderResult.error || 'Failed to create payment order')
        setLoading(false)
        return
      }

      console.log('Order created:', orderResult)

      PaymentService.processPayment(
        orderResult,
        user,
        handleRechargeSuccess,
        handleRechargeFailure
      )

    } catch(error){
      console.error('Recharge error:', error)
      setError('Failed to process recharge')
      setLoading(false)
    }
  }

  const handleRechargeSuccess = async (response) => {
    console.log('Payment successful:', response)

    setSuccess('Payment successful! Wallet updated.')
    setRechargeAmount('')
    setLoading(false)

    try{
      const updatedUser = await AuthService.login(user.email)

      if (updatedUser.success) {
        const transactions = await AuthService.loadTransaction(user.id, 10)
        setTransactions(transactions)

        setTimeout(() => {
          setRechargeDialog(false)
          setSuccess('')
          window.location.reload() // Refresh to show updated balance
        }, 2000)
      }
    } catch (error){
      console.error('Failed to refresh user data')

      setTimeout(() => {
        setRechargeDialog(false)
        window.location.reload()
      }, 2000);
    }
  }

  const handleRechargeFailure = (error) => {
    console.error('Payment failed:', error)
    setError(error || 'Recharge failed')
    setLoading(false)
  }

  const handleCloseDialog = () => {
    if (!loading) {
      setRechargeDialog(false)
      setRechargeAmount('')
      setError('')
      setSuccess('')
    }
  }

  const loadAllTransactions = async () => {
    setLoading(true)
    try{
      const allTransaction = await AuthService.loadTransaction(user.id, 'all')
      setTransactions(allTransaction)
      setShowAllTransactions(true)
    } catch(error){
      console.error('Failed to load all transaction: ', error)
    }

    setLoading(false)
  }

  const formatTransaction = (transaction) =>{
    const isCredit = transaction.type === 'credit'
    return {
      text: `${isCredit ? '+' : '-'} ₹${transaction.amount}`,
      color: isCredit ? 'success.main' : 'error.main',
      date: new Date(transaction.createdAt).toLocaleDateString(),
      method: transaction.method || 'wallet'
    }
  }

  return(
    <Container maxWidth="lg" sx={{ py: 4, pb: 12 }}>
      {/* User Info Card */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Person sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">{user?.name || 'User'}</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Email fontSize="small" />
                    <Typography variant="body2">{user?.email}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <AccountBalanceWallet sx={{ fontSize: 40, color: 'success.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Wallet Balance
                    </Typography>
                    <Typography variant="h5">
                      ₹{user?.walletBalance || '0.00'}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<CreditCard />}
                  onClick={() => setRechargeDialog(true)}
                >
                  Recharge
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Transactions */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <History />
          <Typography variant="h6">Transaction History</Typography>
        </Box>
        
        <List>
          {transactions.length === 0 ? (
            <ListItem>
              <ListItemText primary="No transactions found" />
            </ListItem>
          ) : (
            transactions.map((transaction, index) => {
              const formatted = formatTransaction(transaction)
              return (
                <React.Fragment key={transaction.id || index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography sx={{ color: formatted.color }}>
                            {formatted.text}
                          </Typography>
                          <Typography variant="body2">
                            {formatted.method}
                          </Typography>
                        </Box>
                      }
                      secondary={formatted.date}
                    />
                  </ListItem>
                  {index < transactions.length - 1 && <Divider />}
                </React.Fragment>
              )
            })
          )}
        </List>
        
        {!showAllTransactions && transactions.length >= 10 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button onClick={loadAllTransactions} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'View More'}
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Start Charging Button */}
      <Box position="fixed" bottom={24} left={0} right={0} px={3}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={() => navigate('/config-charging')}
          sx={{ maxWidth: 600, mx: 'auto', display: 'block' }}
        >
          Start Charging
        </Button>
      </Box>
      
      {/* Recharge Dialog */}
      <Dialog open={rechargeDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Recharge Wallet</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <TextField
            autoFocus
            margin="dense"
            label="Amount (₹)"
            type="number"
            fullWidth
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value)}
            disabled={loading}
            inputProps={{ min: 1, step: 1 }}
            helperText="Minimum amount: ₹1"
          />
          
          {/* Quick amount buttons */}
          <Box display="flex" gap={1} mt={2} flexWrap="wrap">
            {[100, 200, 500, 1000].map((amount) => (
              <Button
                key={amount}
                variant="outlined"
                size="small"
                onClick={() => setRechargeAmount(amount.toString())}
                disabled={loading}
              >
                ₹{amount}
              </Button>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleRecharge} 
            variant="contained" 
            disabled={loading || !rechargeAmount}
          >
            {loading ? <CircularProgress size={20} /> : `Pay ₹${rechargeAmount || 0}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Dashboard 