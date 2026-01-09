class NotificationService {
    static isSupported = typeof window !== 'undefined' && 'Notification' in window


    static async requestPermission() {
        if (!this.isSupported) {
            console.log('Browser notification not supported')
            return false
        }

        if (Notification.permission === 'granted') {
            return true
        }

        if (Notification.permission === 'denied') {
            console.log('Notification permission previously denied')
            return false
        }

        try {
            const permission = await Notification.requestPermission()
            return permission === 'granted'
        } catch (error) {
            console.log('Failed to request for notification permission: ', error)
            return false
        }
    }


    static isPermissionGranted() {
        return this.isSupported && Notification.permission === 'granted'
    }

    static getPermissionStatus() {
        if (!this.isSupported) return 'unsupported'
        return Notification.permission
    }


    static async send(title, options = {}) {
        if (!this.isSupported) {
            console.log('Notification is not supported')
            return null
        }

        if (Notification.permission !== 'granted') {
            const granted = await this.requestPermission()
            if (!granted) {
                console.log('Notification permission request denied')
                return null
            }
        }

        try {
            // Try Service Worker first (Required for Mobile)
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready
                if (registration) {
                    // Mobile & PWA Support
                    await registration.showNotification(title, {
                        icon: '/favicon.ico',
                        badge: '/favicon.ico',
                        vibrate: [200, 100, 200],
                        requireInteraction: false,
                        ...options
                    })
                    return true
                }
            }

            // Fallback to Desktop API
            const notification = new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                vibrate: [200, 100, 200],
                requireInteraction: false,
                ...options
            })

            setTimeout(() => {
                notification.close()
            }, 5000);

            return notification
        } catch (error) {
            console.log('Failed to send notification: ', error)

            // Last Resort Fallback
            try {
                return new Notification(title, options)
            } catch (e) {
                return null
            }
        }
    }


    static async sendSessionCompleted(sessionId, userName = 'User') {
        return this.send(
            '🔋 Charging Complited!',
            {
                body: `Hello ${userName}, your charging session #${sessionId} is successfully completed.`,
                tag: `session-completed-${sessionId}`,
                // icon: '/charging-completed-icon.png',
                data: { sessionId }
            }
        )
    }


    static async sendSessionStarted(sessionId) {
        return this.send(
            '⚡ Charging Started',
            {
                body: `Your charging session #${sessionId} is started.`,
                tag: `session-started-${sessionId}`
            }
        )
    }


    static async sendLowTimeWarning(remainingMinutes) {
        return this.send(
            '⏰ Charging Almost Done',
            {
                body: `Your charging session will be complete in ${remainingMinutes} minute.`,
                tag: 'low-time-warning'
            }
        )
    }
}


export default NotificationService