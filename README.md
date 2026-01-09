# EV Weppage - Charging System Frontend

This is the frontend web application for the Bentork EV Charging System. It provides a user-friendly interface for electric vehicle owners to authenticate, configure charging sessions, monitor progress, and view invoices.

## 🚀 Tech Stack

- **Framework:** [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- **Styling:** Material UI (@mui/material), Emotion, Vanilla CSS
- **Routing:** React Router DOM (v6)
- **State Management:** React Context (AuthContext)
- **HTTP Client:** Axios
- **Real-time:** Socket.io-client
- **Animations:** Framer Motion
- **Payments:** Razorpay
- **Utilities:** Day.js, Crypto-js

## 🛠️ Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**

## 📦 Installation & Setup

1.  **Clone the repository** (if applicable) or navigate to the project directory:

    ```bash
    cd ev_webpage
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**

    Create a `.env` file in the root directory. You can copy the keys below and fill in your values:

    ```env
    # API Backend URL
    VITE_API_BASE_URL=http://your-backend-api-url.com

    # EmailJS Configuration (for email notifications)
    VITE_EMAILJS_SERVICE_ID=your_service_id
    VITE_EMAILJS_TEMPLATE_ID=your_template_id
    VITE_EMAILJS_PUBLIC_KEY=your_public_key
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## 📜 Available Scripts

- **`npm run dev`**: Starts the development server with HMR (Hot Module Replacement).
- **`npm run build`**: Builds the app for production to the `dist` folder.
- **`npm run preview`**: Locally preview the production build.
- **`npm run lint`**: Runs ESLint to check for code quality issues.
- **`npm run format`**: Formats code using Prettier.

## 🔄 Application Flow

The application follows a linear user journey designed for ease of use at charging stations.

1.  **Splash Screen** (`/` vs `/splash/:ocppId`)
    -   The entry point of the application.
    -   Optionally accepts an `ocppId` (Charger ID) from the URL (e.g., via QR code scan).

2.  **Login** (`/login`)
    -   Users authenticate using **Google OAuth**.
    -   If an `ocppId` was present, it is preserved through the login process.
    -   Upon success, the app retrieves the user profile and authentication token.

3.  **Terms & Conditions** (`/terms`)
    -   New users or users who haven't accepted the latest terms are redirected here.
    -   Users must scroll to the bottom and accept the terms to proceed.
    -   Acceptance is cached locally to improve User Experience.

4.  **Privacy Policy & About** (`/privacy`, `/about`)
    -   Informational pages accessible from the footer or menu.

5.  **Configuration & Dashboard** (`/config-charging`)
    -   **Protected Route:** Requires login.
    -   Displays the connected charger details (if `ocppId` is provided).
    -   Allows the user to select charging plans (Time-based, Energy-based, or Full Tank).
    -   Integrates with Razorpay for payment processing (if applicable).

6.  **Charging Session** (`/charging-session`)
    -   **Real-time Monitoring:** Displays live data from the ongoing charging session.
    -   Shows metrics like Energy Delivered (kWh), Duration, and Cost.
    -   Users can stop the session from here.

7.  **Invoice** (`/invoice`)
    -   Displayed after a session is successfully completed or stopped.
    -   Shows a summary of the transaction.

8.  **Thank You** (`/thank-you`)
    -   Final farewell screen before redirecting or closing.

## 📂 Project Structure

```
src/
├── assets/         # Images, fonts, and global styles
├── components/     # Reusable UI components
├── config/         # App configuration (API endpoints, errors)
├── guards/         # Route guards (AuthGuard)
├── pages/          # Main page components (Login, Dashboard, etc.)
├── services/       # API services (Auth, Payment, Email, etc.)
├── store/          # Context providers (AuthContext)
├── wrapper/        # Layout wrappers (ChargingFlow, SessionFlow)
└── App.jsx         # Main routing configuration
```
