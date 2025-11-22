import { useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemedImage({ lightSrc, darkSrc, alt = '', ...props }) {
    const { mode } = useTheme()
    const [src, setSrc] = useState(mode === 'dark' ? darkSrc : lightSrc)

    useEffect(() => {
    setSrc(mode === 'dark' ? darkSrc : lightSrc)
    }, [mode, lightSrc, darkSrc])

    return <img src={src} alt={alt} {...props} />
}