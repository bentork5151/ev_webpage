
export const ERROR_MESSAGES = {
    // Authentication
    AUTH_INVALID_CREDS: {
        user: "We couldn't verify your credentials. Please try signing in again.",
        dev: "Authentication failed: Invalid credentials or token."
    },
    AUTH_SESSION_EXPIRED: {
        user: "Your session has expired. Please log in again to continue.",
        dev: "Token expired or refresh failed. Clearing cache."
    },
    AUTH_USER_NOT_FOUND: {
        user: "We couldn't find an account linked to this email. Please contact support.",
        dev: "User not found in database for provided email/ID."
    },
    AUTH_GOOGLE_FAILED: {
        user: "Sign-in with Google failed. Please try again or use a different method.",
        dev: "Google OAuth process returned error or invalid token."
    },
    AUTH_NO_EMAIL: {
        user: "Your account info is incomplete. Please contact support.",
        dev: "User profile missing email address."
    },

    // Charging Session
    SESSION_START_FAILED: {
        user: "Unable to start charging. Please verify the charger connection and try again.",
        dev: "Session start API returned 'FAILED' status."
    },
    SESSION_STOP_FAILED: {
        user: "We couldn't stop the session remotely. Please use the emergency stop button on the charger.",
        dev: "Session stop API failed or timed out."
    },
    SESSION_INIT_ERROR: {
        user: "We are having trouble connecting to your active session. Retrying...",
        dev: "Exception during session initialization sequence."
    },
    CHARGER_OFFLINE: {
        user: "This charger is currently offline. Please try another station.",
        dev: "Charger status is 'offline'."
    },
    CHARGER_BUSY: {
        user: "This charger is currently in use. Please wait for it to become available.",
        dev: "Charger status is 'busy'."
    },
    CHARGER_UNAVAILABLE: {
        user: "This charger is temporarily unavailable due to maintenance.",
        dev: "Charger status is 'faulted' or unavailable."
    },

    // Wallet & Payment
    WALLET_INSUFFICIENT: {
        user: "Insufficient wallet balance. Please add funds to start this charging session.",
        dev: "Wallet balance less than plan amount."
    },
    PAYMENT_FAILED: {
        user: "Payment processing failed. No funds were deducted. Please try again.",
        dev: "Payment gateway verification failed."
    },
    PLAN_NOT_SELECTED: {
        user: "Please select a charging plan to proceed.",
        dev: "Attempted to start session without selecting a plan."
    },
    INVOICE_SEND_FAIL: {
        user: "We couldn't email your invoice, but your charging session is recorded successfully.",
        dev: "EmailJS failed to send invoice."
    },

    // Network & System
    NET_OFFLINE: {
        user: "No internet connection. Please check your network settings.",
        dev: "Navigator indicates offline status."
    },
    NET_TIMEOUT: {
        user: "The server is taking too long to respond. Please try again later.",
        dev: "API request timeout exceeded."
    },
    SERVER_ERROR: {
        user: "We are experiencing a temporary system issue. We are working on it!",
        dev: "Server returned 5xx status code."
    },
    GENERIC_ERROR: {
        user: "Something went wrong. Please restart the app or try again.",
        dev: "Unhandled exception occurred."
    }
};

export const getError = (key) => {
    return ERROR_MESSAGES[key] || ERROR_MESSAGES.GENERIC_ERROR;
};

export const logError = (key, errorDetails = null) => {
    const msg = getError(key);
    if (import.meta.env.DEV) {
        console.error(`[App Error] ${msg.dev}`, errorDetails || '');
    }
    return msg.user;
};

