import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import "../assets/styles/global.css";

// CSS styles moved into the component
const homeStyles = `
/* =====================================================
   Home Page Styles
   Matching the 'ConfigCharging' premium dark theme
   ===================================================== */

.home-page {
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--color-matte-black, #111);
    color: #fff;
    font-family: var(--font-primary, Roboto, sans-serif);
    position: relative;
    overflow-x: hidden;
    padding-bottom: 100px;
    width: 100%;
    box-sizing: border-box;
}

.home-page * {
    box-sizing: border-box;
}

/* ===== BACKGROUND BLOBS ===== */
.blob-container-home {
    position: fixed;
    top: -60vmin;
    right: -40vmin;
    width: 140vmin;
    height: 140vmin;
    z-index: 0;
    pointer-events: none;
    opacity: 0.45;
}

.blob-container-home svg {
    width: 100%;
    height: 100%;
    filter: blur(50px);
}

/* Use global animations if available, otherwise define simpler ones here handled by global.css usually */

/* ===== TOP BAR ===== */
.home-topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 82px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px;
    z-index: 100;
    background: transparent;
}

.home-topbar::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
    -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
    pointer-events: none;
}

.topbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.menu-icon {
    font-size: 28px !important;
    cursor: pointer;
    color: #fff;
}

.top-logo {
    height: 50px;
    width: auto;
}

.wallet-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.wallet-pill:active {
    background: rgba(255, 255, 255, 0.2);
}

.wallet-pill img {
    width: 16px;
    height: 16px;
}

/* ===== CONTENT ===== */
.home-content {
    position: relative;
    z-index: 10;
    padding: 100px 20px 20px;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
}

/* WELCOME */
.welcome-section {
    margin-bottom: 24px;
}

.greeting {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 4px;
}

.main-heading {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin: 0;
    background: linear-gradient(90deg, #fff, #b3b3b3);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* SCAN CARD */
.scan-card {
    background: linear-gradient(135deg, rgba(57, 226, 155, 0.15), rgba(57, 226, 155, 0.05));
    border: 1px solid rgba(57, 226, 155, 0.3);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 8px 32px rgba(57, 226, 155, 0.1);
}

.scan-card:active {
    transform: scale(0.98);
}

.scan-content {
    display: flex;
    align-items: center;
    gap: 16px;
}

.scan-icon-wrapper {
    width: 48px;
    height: 48px;
    background: #39E29B;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
}

.scan-icon {
    font-size: 28px !important;
}

.scan-text h2 {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 4px;
    color: #fff;
}

.scan-text p {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
}

.scan-arrow {
    font-size: 24px;
    color: #39E29B;
    font-weight: 300;
}

/* SEARCH BAR */
.search-bar {
    position: relative;
    margin-bottom: 32px;
}

.search-bar input {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: 14px 14px 14px 44px;
    color: #fff;
    font-size: 14px;
    outline: none;
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.5);
    font-size: 20px !important;
}

/* LIST HEADER */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.section-header h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #fff;
}

.see-all {
    font-size: 12px;
    color: #39E29B;
    cursor: pointer;
}

/* STATION ITEM */
.stations-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.station-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: background 0.2s;
}

.station-card:hover {
    background: rgba(255, 255, 255, 0.06);
}

.station-icon-box {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.8);
}

.station-info {
    flex: 1;
}

.station-info h4 {
    font-size: 15px;
    font-weight: 500;
    margin: 0 0 4px;
    color: #fff;
}

.station-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
}

.meta-icon {
    font-size: 12px !important;
    vertical-align: middle;
}

.status-text.available {
    color: #39E29B;
}

.status-text.busy {
    color: #ffa726;
}

.power-badge {
    font-size: 11px;
    color: #39E29B;
    background: rgba(57, 226, 155, 0.1);
    padding: 4px 8px;
    border-radius: 6px;
    font-weight: 500;
}

/* ===== DRAWER CSS FROM CONFIG SCREEN ===== */
/* ===== OVERLAY ===== */
.drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    pointer-events: none;
    transition: 0.3s;
    z-index: 102;
    /* Higher than topbar */
}

.drawer-overlay.show {
    opacity: 1;
    pointer-events: all;
}

/* ===== DRAWER ===== */
.drawer-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 16px;
    background: rgba(33, 33, 33, 0.03);
    /* Subtle internal background */
    border-radius: 22px;
    overflow: hidden;
    /* Prevent internal spill */
}

.side-drawer {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    height: 100dvh;
    width: 85vw;
    max-width: 340px;
    background: rgba(33, 33, 33, 0.95);
    /* High opacity for legibility */
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    transform: translateX(-100%);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 105;
    /* Highest z-index */
    border-radius: 0 28px 28px 0;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.5);
    /* Add shadow for depth */
}

.side-drawer hr {
    border: none;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 10px 0;
    width: 100%;
}

/* OPEN STATE */
.side-drawer.open {
    transform: translateX(0%);
}


/* ===== HEADER ===== */
.drawer-header {
    padding: 20px 16px 10px;
    /* Adjusted padding */
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

.user-info {
    display: flex;
    gap: 12px;
    align-items: center;
    overflow: hidden;
    /* Protect text overflow */
}

.avatar {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.user-text-container {
    min-width: 0;
    /* Important for text-overflow to work in flex */
    display: flex;
    flex-direction: column;
}

.user-info p {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    opacity: 0.6;
    margin: 0;
}

/* ===== MENU ===== */
.drawer-menu {
    flex: 1;
    /* Take up remaining space */
    overflow-y: auto;
    /* Scroll if menu is too long */
    padding: 0 16px;
}

.drawer-menu .item {
    padding: 12px 0;
    /* More vertically spacing for touch */
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 16px;
    color: #fff;
    cursor: pointer;
}

.drawer-menu .item:active {
    opacity: 0.7;
}

.drawer-menu .item svg {
    font-size: 20px;
    opacity: 0.85;
}

.avatar svg {
    border-radius: 25%;
    font-size: 42px;
    opacity: 0.9;
}

/* ===== LOGOUT ===== */
.logout-btn {
    margin: 16px;
    /* Margin around button */
    margin-top: auto;
    /* Push to bottom if space permits */
    padding: 14px;
    background: #ff3131;
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    flex-shrink: 0;
    /* Don't shrink */
}
`;

import Logo from "../assets/images/logo-1.png";
import WalletIcon from "../assets/images/wallet.svg";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from '@mui/icons-material/Search';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BoltIcon from '@mui/icons-material/Bolt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const sidebarConfig = {
    user: {
        name: "Ricard Joseph",
        email: "richard@bentork.com",
        avatar: <AccountCircleIcon fontSize="large" />
    },
    menu: [
        {
            section: "primary",
            items: [
                { label: "My Wallet", icon: <AccountBalanceWalletIcon />, path: "/dashboard" },
            ]
        },
        {
            section: "support",
            items: [
                { label: "Help", icon: <HelpOutlineIcon /> },
                { label: "FAQ", icon: <QuizIcon />, path: "/faq" },
                { label: "Tutorial", icon: <SchoolIcon />, path: "/onboarding-1" },
                { label: "Download App", icon: <DownloadIcon /> }
            ]
        },

        {
            section: "legal",
            items: [
                { label: "Terms & Conditions", icon: <DescriptionIcon />, path: "/terms" },
                { label: "Privacy Policy", icon: <PrivacyTipIcon /> },
                { label: "About Us", icon: <InfoOutlinedIcon /> }
            ]
        }
    ]
};

import ApiService from "../services/api.service";
import API_CONFIG from "../config/api.config";

const Home = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Stations State
    const [stations, setStations] = useState([
        { id: "OCPPCHG-1123-0116", name: "BENTORK PLUS-16", distance: "0.5 km", status: "Loading...", type: "AC Type 2", power: "1kW" },
        { id: "OCPPCHG-1123-0117", name: "BENTORK PLUS-17", distance: "0.5 km", status: "Loading...", type: "AC Type 2", power: "1kW" },
        { id: "OCPP-100", name: "BENTORK PRO-100", distance: "0.5 km", status: "Loading...", type: "DC Fast", power: "10kW" },
    ]);

    // Fetch Stations Status
    React.useEffect(() => {
        const fetchStatuses = async () => {
            const updated = await Promise.all(stations.map(async (station) => {
                try {
                    const response = await ApiService.get(API_CONFIG.ENDPOINTS.GET_CHARGER(station.id));
                    // Assuming response has a 'status' field
                    return {
                        ...station,
                        status: response?.status || "Offline"
                    };
                } catch (err) {
                    console.error(`Failed to fetch status for ${station.id}`, err);
                    return { ...station, status: "Offline" }; // Fallback
                }
            }));
            setStations(updated);
        };

        fetchStatuses();

        // Optional: Poll every 10 seconds?
        const interval = setInterval(fetchStatuses, 10000);
        return () => clearInterval(interval);
    }, []);

    // Reset imgError when user picture changes
    React.useEffect(() => {
        setImgError(false);
    }, [user?.picture]);

    // Drawer Drag Logic
    const [drawerStartX, setDrawerStartX] = useState(0);
    const [drawerDragOffset, setDrawerDragOffset] = useState(0);
    const [isDrawerDragging, setIsDrawerDragging] = useState(false);

    const onDrawerTouchStart = (e) => {
        setDrawerStartX(e.touches[0].clientX);
        setIsDrawerDragging(true);
    };

    const onDrawerTouchMove = (e) => {
        if (!isDrawerDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - drawerStartX;
        // Drawer coming from left (0). Dragging left (negative) closes it.
        if (diff < 0) {
            setDrawerDragOffset(diff);
        }
    };

    const onDrawerTouchEnd = () => {
        setIsDrawerDragging(false);
        if (drawerDragOffset < -75) { // Threshold to close
            setDrawerOpen(false);
        }
        setDrawerDragOffset(0);
    };



    return (
        <div className="home-page">
            <style>{homeStyles}</style>
            {/* ===== BACKGROUND BLOBS ===== */}
            <div className="blob-container-home">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path className="blob-layer blob-dark" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.9,32.3C59.6,43.1,48.3,51.8,36.5,58.8C24.7,65.8,12.4,71.1,-0.6,72.1C-13.6,73.1,-27.2,69.8,-39.6,62.8C-52,55.8,-63.2,45.1,-71.3,32.2C-79.4,19.3,-84.4,4.2,-81.8,-9.4C-79.2,-23,-69,-35.1,-57.4,-43.8C-45.8,-52.5,-32.8,-57.8,-19.9,-65.4C-7,-73,8.9,-82.9,25.4,-84.2C41.9,-85.5,59,-78.2,44.7,-76.4Z" transform="translate(100 100)" />
                    <path className="blob-layer blob-green" d="M41.3,-72.6C53.4,-65.3,63.2,-54.6,70.4,-42.1C77.6,-29.6,82.2,-15.3,81.3,-1.4C80.4,12.5,74,26,64.8,37.3C55.6,48.6,43.6,57.7,30.8,63.2C18,68.7,4.4,70.6,-8.3,69.7C-21,68.8,-32.8,65.1,-43.2,58.3C-53.6,51.5,-62.6,41.6,-68.9,30.1C-75.2,18.6,-78.8,5.5,-75.9,-6.2C-73,-17.9,-63.6,-28.2,-53.4,-36.5C-43.2,-44.8,-32.2,-51.1,-20.9,-58.5C-9.6,-65.9,2,-74.4,14.5,-76.6C27,-78.8,40.4,-74.7,41.3,-72.6Z" transform="translate(100 100)" />
                    <path className="blob-layer blob-light" d="M35.6,-62.3C46.5,-55.8,55.9,-47.5,63.1,-37.2C70.3,-26.9,75.3,-14.6,74.7,-2.6C74.1,9.4,67.9,21.1,60.1,31.8C52.3,42.5,42.9,52.2,31.7,58.5C20.5,64.8,7.5,67.7,-4.8,67.3C-17.1,66.9,-32.7,63.2,-45.3,55.8C-57.9,48.4,-67.5,37.3,-72.8,24.6C-78.1,11.9,-79.1,-2.4,-75.3,-15.8C-71.5,-29.2,-62.9,-41.7,-51.5,-49.6C-40.1,-57.5,-25.9,-60.8,-11.8,-62.8C2.3,-64.8,16.4,-65.5,29.3,-62.9C42.2,-60.3,54,-54.4,35.6,-62.3Z" transform="translate(100 100)" />
                </svg>
            </div>



            {/* ===== OVERLAY ===== */}
            <div
                className={`drawer-overlay ${drawerOpen ? "show" : ""}`}
                onClick={() => setDrawerOpen(false)}
            />

            {/* ===== SIDE DRAWER ===== */}
            <div
                className={`side-drawer ${drawerOpen ? "open" : ""}`}
                style={{
                    transform: isDrawerDragging
                        ? `translateX(${drawerDragOffset}px)`
                        : (drawerOpen ? 'translateX(0)' : 'translateX(-100%)'),
                    transition: isDrawerDragging ? 'none' : 'transform 0.35s ease'
                }}
                onTouchStart={onDrawerTouchStart}
                onTouchMove={onDrawerTouchMove}
                onTouchEnd={onDrawerTouchEnd}
            >
                <div className="drawer-box" onClick={(e) => e.stopPropagation()}>
                    {/* USER HEADER */}
                    <div className="drawer-header">
                        <div className="user-info">
                            <div className="avatar">
                                {user?.picture && !imgError ? (
                                    <img
                                        src={user.picture}
                                        alt="avatar"
                                        referrerPolicy="no-referrer"
                                        onError={() => setImgError(true)}
                                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                                    />
                                ) : (
                                    sidebarConfig.user.avatar
                                )}
                            </div>
                            <div className="user-text-container">
                                <strong style={{ fontSize: '15px', fontWeight: '600' }}>{user?.name || sidebarConfig.user.name}</strong>
                                <p style={{ fontSize: '13px', opacity: 0.7 }}>{user?.email || sidebarConfig.user.email}</p>
                            </div>
                        </div>
                    </div>

                    <hr />

                    {/* MENU ITEMS */}
                    <div className="drawer-menu">
                        {sidebarConfig.menu.map((section, idx) => (
                            <React.Fragment key={idx}>
                                {section.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="item"
                                        onClick={() => {
                                            if (item.path) {
                                                navigate(item.path);
                                            }
                                        }}
                                    >
                                        {item.icon}
                                        <span style={{ flex: 1 }}>{item.label}</span>
                                        <ChevronRightIcon style={{ fontSize: '20px', opacity: 0.3 }} />
                                    </div>
                                ))}
                                {idx < sidebarConfig.menu.length - 1 && <hr />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* LOGOUT */}
                    <button
                        className="logout-btn"
                        onClick={() => {
                            logout();
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </div>

            {/* ===== HEADER ===== */}
            <div className="home-topbar">
                <div className="topbar-left">
                    <MenuIcon className="menu-icon" onClick={() => setDrawerOpen(true)} />
                    <img src={Logo} className="top-logo" alt="Bentork" />
                </div>
                <button className="wallet-pill" onClick={() => navigate("/dashboard")}>
                    <img src={WalletIcon} alt="Wallet" />
                    ₹{Number(user?.walletBalance ?? 0).toLocaleString("en-IN")}
                </button>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="home-content page-enter-anim">

                {/* WELCOME SECTION */}
                <div className="welcome-section">
                    <p className="greeting">Hello, {user?.name?.split(' ')[0] || "Driver"} 👋</p>
                    <h1 className="main-heading">Ready to charge?</h1>
                </div>

                {/* SCAN CARD */}
                <div className="scan-card" onClick={() => navigate('/config-charging')}>
                    <div className="scan-content">
                        <div className="scan-icon-wrapper">
                            <QrCodeScannerIcon className="scan-icon" />
                        </div>
                        <div className="scan-text">
                            <h2>Scan QR Code</h2>
                            <p>Scan the code on the charger to start</p>
                        </div>
                    </div>
                    <div className="scan-arrow">→</div>
                </div>

                {/* NEARBY STATIONS */}
                <div className="section-header">
                    <h3>Recent</h3>
                </div>

                <div className="stations-list">
                    {stations.map((station) => (
                        <div
                            key={station.id}
                            className="station-card"
                            onClick={() => navigate(`/config-charging?ocppid=${station.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="station-icon-box">
                                <BoltIcon className="station-icon" />
                            </div>
                            <div className="station-info">
                                <h4>{station.name}</h4>
                                <div className="station-meta">
                                    <span className="meta-item"><LocationOnIcon className="meta-icon" /> {station.distance}</span>
                                    <span className="meta-item">•</span>
                                    <span className={`status-text ${station.status.toLowerCase()}`}>{station.status}</span>
                                </div>
                            </div>
                            <div className="station-action">
                                <div className="power-badge">{station.power}</div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div >
    );
};

export default Home;
