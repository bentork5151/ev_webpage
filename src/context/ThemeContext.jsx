import React, { createContext, useContext, useState, useEffect } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '../assets/styles/theme.light.css'
import '../assets/styles/theme.dark.css'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

const getVar = (name, fallback) =>
getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

const createM3Theme = (mode) =>
createTheme({
palette: {
mode,
primary: {
main: getVar('--md-sys-color-primary', mode === 'dark' ? '#ffb5a0' : '#8f4c38'),
contrastText: getVar('--md-sys-color-on-primary', mode === 'dark' ? '#561f0f' : '#ffffff'),
},
background: {
default: getVar('--md-sys-color-background', mode === 'dark' ? '#1a110f' : '#fff8f6'),
paper: getVar('--md-sys-color-surface', mode === 'dark' ? '#1a110f' : '#fff8f6'),
},
text: {
primary: getVar('--md-sys-color-on-background', mode === 'dark' ? '#f1dfda' : '#231917'),
secondary: getVar('--md-sys-color-on-surface-variant', mode === 'dark' ? '#d8c2bc' : '#53433f'),
},
},
shape: { borderRadius: 16 },
components: {
MuiLinearProgress: {
styleOverrides: {
root: {
height: 4,
borderRadius: 2,
backgroundColor: getVar('--md-sys-color-surface-variant', '#e7e0ec'),
},
bar: {
borderRadius: 2,
backgroundColor: getVar('--md-sys-color-primary', '#6750a4'),
},
},
},
},
})

export const ThemeProvider = ({ children }) => {
const [mode, setMode] = useState('light')

useEffect(() => {
const mq = window.matchMedia('(prefers-color-scheme: dark)')
const apply = (isDark) => {
const m = isDark ? 'dark' : 'light'
setMode(m)
document.documentElement.className = m // applies your CSS variables
}
apply(mq.matches)
mq.addEventListener('change', (e) => apply(e.matches))
return () => mq.removeEventListener('change', (e) => apply(e.matches))
}, [])

const theme = createM3Theme(mode)

return (
<ThemeContext.Provider value={{ mode, setMode }}>
<MuiThemeProvider theme={theme}>
<CssBaseline />
{children}
</MuiThemeProvider>
</ThemeContext.Provider>
)
}