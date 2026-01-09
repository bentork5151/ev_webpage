import React, { useEffect } from 'react';
import { useRouteError, useLocation, useNavigate } from 'react-router-dom';
import { getError } from '../config/errors.config';
import '../assets/styles/ErrorPage.css';
import { Home, ArrowBack, ErrorOutline } from '@mui/icons-material';

const ErrorPage = () => {
    const error = useRouteError();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Detailed logging in console as requested
        console.group('🚨 Application Error Detected');
        console.error('timestamp:', new Date().toISOString());
        console.error('Location:', location.pathname);
        console.error('Search Params:', location.search);

        if (error) {
            console.error('Error Object:', error);
            if (error.status) console.error('Status:', error.status);
            if (error.statusText) console.error('Status Text:', error.statusText);
            if (error.message) console.error('Message:', error.message);
            if (error.data) console.error('Data:', error.data);
            if (error.stack) console.error('Stack Trace:', error.stack);
        } else {
            console.error('Type: 404 Route Not Found (Wildcard Match)');
            console.error('User navigated to an undefined route.');
        }
        console.groupEnd();
    }, [error, location]);

    // Determine error message and title
    let errorMessage = getError('GENERIC_ERROR').user;
    let errorTitle = "Something Went Wrong";
    let statusCode = error?.status;

    if (!statusCode && error) statusCode = 500;
    if (!statusCode && !error) statusCode = 404;

    if (error) {
        if (error.status === 404) {
            errorMessage = getError('ROUTE_NOT_FOUND').user;
            errorTitle = "Page Not Found";
        } else if (error.status === 401) {
            errorMessage = "You are not authorized to view this page.";
            errorTitle = "Access Denied";
        } else if (error.status === 503) {
            errorMessage = "Our service is temporarily unavailable. Please try again later.";
            errorTitle = "Service Unavailable";
        } else {
            // For other errors, we might show a generic message or the specific error message if safe
            errorMessage = "An unexpected error occurred. We've logged the issue.";
            if (process.env.NODE_ENV === 'development' && error.message) {
                errorMessage = error.message;
            }
        }
    } else {
        // Fallback for wildcard route (Not Found)
        errorMessage = getError('ROUTE_NOT_FOUND').user;
        errorTitle = "Page Not Found";
        statusCode = 404;
    }

    const handleGoBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/dashboard');
        }
    };

    const handleGoHome = () => {
        navigate('/config-charging');
    };

    return (
        <div className="error-page-container">
            <div className="error-content">
                <div className="error-icon-wrapper">
                    <div className="error-icon-glow"></div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-primary-container)' }}>
                        <ErrorOutline style={{ fontSize: 60, marginBottom: 10, opacity: 0.8 }} />
                        <h1 style={{ fontSize: '64px', margin: 0, fontWeight: '800', lineHeight: 1 }}>
                            {statusCode}
                        </h1>
                    </div>
                </div>

                <h2 className="error-title">{errorTitle}</h2>
                <p className="error-message">{errorMessage}</p>

                <div className="action-buttons">
                    <button className="back-home-btn" onClick={handleGoBack}>
                        <ArrowBack style={{ fontSize: 18 }} />
                        Go Back
                    </button>
                    <button className="back-home-btn primary" onClick={handleGoHome}>
                        <Home style={{ fontSize: 18 }} />
                        Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
