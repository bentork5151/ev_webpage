import React from "react";
import { useNavigate } from 'react-router-dom'
import {
  Box, 
  Paper, 
  Typography, 
  Button, 
  IconButton, 
  Dialog, 
  DialogTitle,
  DialogContent, 
  DialogActions, 
  TextField, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon, 
  Tooltip, 
  CircularProgress
} from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const Balance = () => {
  const navigate = useNavigate()

  return(
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--md-sys-color-background)', pb: 10 }}>
      {/* Header / Balance card */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Paper elevation={1} sx={{ p: 2, borderRadius: 3, background: 'var(--md-sys-color-surface)' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <AccountBalanceWalletIcon sx={{ color: 'var(--md-sys-color-primary)' }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Wallet Balance
              </Typography>
              <Typography variant="h4" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
                ₹{walletBalance.toFixed(2)}
              </Typography>
            </Box>
            <Box flexGrow={1} />
            <Button variant="contained" onClick={() => setRechargeOpen(true)}>
              Recharge
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Transactions */}
      <Box sx={{ px: 2, mt: 3 }}>
        <Typography variant="h6" sx={{ color: 'var(--md-sys-color-on-surface)', mb: 1 }}>
          Transactions
        </Typography>

        <Paper elevation={0} sx={{
          borderRadius: 3,
          background: 'var(--md-sys-color-surface)',
          border: '1px solid var(--md-sys-color-surface-variant)',
          maxHeight: showAll ? 420 : 320,
          overflow: 'auto'
        }}>
          {loadingTxns ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={6}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <>
              <List dense>
                {txns.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No transactions found" />
                  </ListItem>
                )}

                {txns.map((t) => {
                  const isCredit = (t.type || '').toLowerCase() === 'credit'
                  return (
                    <ListItem key={t.id || `${t.transactionRef}-${t.amount}`}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {isCredit ? (
                          <Tooltip title="Credit">
                            <TrendingUpIcon color="success" />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Debit">
                            <TrendingDownIcon color="error" />
                          </Tooltip>
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={`₹${Number(t.amount || 0).toFixed(2)} • ${t.method || '—'}`}
                        secondary={`${(t.status || 'success').toUpperCase()} • ${new Date(t.createdAt || t.date || Date.now()).toLocaleString()}`}
                      />
                      {t.transactionRef && (
                        <Tooltip title={`Ref: ${t.transactionRef}`}>
                          <IconButton size="small">
                            <ArrowForwardIosIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </ListItem>
                  )
                })}
              </List>

              <Divider />
              <Box display="flex" justifyContent="center" py={1}>
                <Button
                  size="small"
                  endIcon={<ExpandMoreIcon sx={{ transform: showAll ? 'rotate(180deg)' : 'none' }} />}
                  onClick={async () => {
                    const next = !showAll
                    setShowAll(next)
                    await loadTransactions(next)
                  }}
                >
                  {showAll ? 'Show less' : 'Show all'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>

      {/* Footer CTA */}
      <Box sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        borderTop: '1px solid var(--md-sys-color-surface-variant)',
        background: 'var(--md-sys-color-surface)',
        p: 2
      }}>
        <Button fullWidth variant="contained" size="large" onClick={() => navigate('/config-charging')}>
          Start Charging
        </Button>
      </Box>

      {/* Recharge dialog */}
      <Dialog open={rechargeOpen} onClose={() => !paying && setRechargeOpen(false)}>
        <DialogTitle>Recharge Wallet</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            label="Amount (₹)"
            type="number"
            fullWidth
            margin="dense"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={paying}
            inputProps={{ min: 1, step: '0.01' }}
            error={!!error}
            helperText={error || 'Enter the amount you want to add to your wallet'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRechargeOpen(false)} disabled={paying}>Cancel</Button>
          <Button onClick={handleRecharge} variant="contained" disabled={paying}>
            {paying ? <CircularProgress size={20} /> : 'Pay'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Balance