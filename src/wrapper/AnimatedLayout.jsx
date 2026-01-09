import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const AnimatedLayout = () => {
    const location = useLocation()

    // Use the first path segment as the key (e.g., 'dashboard', 'config-charging', 'login')
    // This ensures transitions occur between top-level pages
    const pageKey = location.pathname.split('/')[1] || 'root'

    return (
        <AnimatePresence mode="wait">
            <motion.div
            // key={pageKey}
            // initial={{
            //     opacity: 0,
            //     x: 180,
            //     scale: 0.95,
            //     filter: 'blur(8px)'
            // }}
            // animate={{
            //     opacity: 1,
            //     x: 0,
            //     scale: 1,
            //     filter: 'blur(0px)'
            // }}
            // exit={{
            //     opacity: 0,
            //     x: -180,
            //     scale: 0.97,
            //     filter: 'blur(6px)'
            // }}
            // transition={{
            //     duration: 0.25,
            //     ease: [0.16, 1, 0.3, 1]
            // }}
            // style={{ width: '100%', minHeight: '100vh' }}
            >
                <Outlet />
            </motion.div>
        </AnimatePresence>
    )
}

export default AnimatedLayout
