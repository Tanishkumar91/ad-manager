# TikTok Ads Creative Flow Frontend Application

This is a single-page React application that simulates a TikTok Ads creative setup flow. It focuses on demonstrating OAuth integration, API error handling, and conditional validation as specified in the assignment.

## Table of Contents

1.  [Overview](#overview)
2.  [Features Implemented](#features-implemented)
3.  [Tech Stack](#tech-stack)
4.  [How to Run the Project](#how-to-run-the-project)
5.  [OAuth Setup Steps (Real vs. Mocked)](#oauth-setup-steps-real-vs-mocked)
6.  [Key Technical Decisions & Assumptions](#key-technical-decisions--assumptions)
7.  [How to Test Functionality (for Demo Video)](#how-to-test-functionality-for-demo-video)
8.  [UI/UX Enhancements](#uiux-enhancements)
9.  [What Would Be Improved with More Time](#what-would-be-improved-with-more-time)

---

## Overview

This application provides a simulated environment for creating a minimal TikTok ad. It does **not** connect to the live TikTok Ads API, nor does it require a backend. All API interactions are **mocked** to demonstrate frontend logic, error handling, and conditional validation.

## Features Implemented

The application implements all the required features as per the assignment:

*   **TikTok OAuth Integration**:
    *   "Connect TikTok Ads Account" button initiates a **mocked** OAuth flow.
    *   Handles callback with a simulated authorization code.
    *   Exchanges the mock code for a mock `access_token` and stores it in `localStorage`.
    *   Handles various OAuth errors (Invalid client ID/secret, Missing Ads permission scope, Expired/revoked token, Geo-restriction (403)) with clear, user-friendly messages.
*   **Ad Creation Form**:
    *   A single-page form with required fields: Campaign Name, Objective, Ad Text, CTA, Music Option.
    *   Client-side validation for all fields (e.g., min length for Campaign Name, max length for Ad Text, required fields).
*   **Music Selection Logic**:
    *   **Option A: Existing Music ID**: Allows user to input a Music ID. Validated via a mocked API endpoint, showing inline errors if invalid.
    *   **Option B: Upload / Custom Music**: Simulates an upload process, generating a mock Music ID. Includes a **simulated 20% chance of failure** to demonstrate robust error handling for upload validation.
    *   **Option C: No Music**: Conditionally allowed only if "Objective" is "Traffic". If "Objective" is "Conversions" and "No Music" is selected, an inline error prevents submission.
*   **Submission & Error Handling**:
    *   Calls a mocked TikTok Ads API endpoint for ad submission.
    *   Handles various submission errors (Invalid/expired OAuth token, Missing permissions, Invalid music ID, Geo-restriction) with appropriate user feedback (global error banners) and redirection where necessary.
*   **UX Expectations**:
    *   Field-level errors are displayed inline.
    *   System-level issues (API errors) are shown in a global error banner.
    *   Clear guidance is provided on how to fix issues.

## Tech Stack

*   **Framework**: React (using `create-react-app` equivalent setup)
*   **Routing**: `react-router-dom`
*   **State Management**: React's `useState` and `useContext` for local and global state (authentication token).
*   **Styling**: Pure CSS with advanced animations and modern design principles.

## How to Run the Project

1.  **Navigate to the project directory**:
    Open your terminal or command prompt and change to the project directory:
    ```bash
    cd "C:\Users\tanis\OneDrive\Desktop\AD Manager"
    ```
2.  **Install dependencies**:
    Install all required Node.js packages:
    ```bash
    npm install
    ```
3.  **Start the development server**:
    Launch the application in development mode. It will open in your default web browser, usually at `http://localhost:3000`.
    ```bash
    npm start
    ```

## OAuth Setup Steps (Real vs. Mocked)

### Real-world TikTok OAuth (Not Implemented Here)

In a real scenario, you would:

1.  **Create a TikTok Developer Account** and register a new TikTok Ads App.
2.  **Configure OAuth**: Set the `Redirect URI` in your TikTok Ads App settings to `http://localhost:3000/callback` (or your production URL).
3.  **Obtain `client_key` and `client_secret`**.
4.  **Construct Authorization URL**: Redirect the user to TikTok's authorization endpoint, including `client_key`, `redirect_uri`, `scope`, and `response_type=code`.
5.  **Handle Callback**: TikTok redirects the user back to your `redirect_uri` with an authorization `code`.
6.  **Exchange Code for `access_token`**: Make a server-side (or securely client-side in some flows) POST request to TikTok's token endpoint using the `code`, `client_key`, and `client_secret` to get an `access_token`.
7.  **Store `access_token`**: Store this token (e.g., in `localStorage` for this demo's scope).

### Mocked TikTok OAuth (Implemented)

For this assignment, the entire OAuth flow is simulated:

*   The "Connect TikTok Ads Account" button in `src/OAuth.js` directly navigates to `http://localhost:3000/callback?code=mock_auth_code`.
*   The `src/Callback.js` component extracts `mock_auth_code` and simulates exchanging it for a mock access token (`mock_tiktok_access_token`) using the `exchangeCodeForToken` function in `src/api.js`.
*   This mock token is then stored in `localStorage`.

## Key Technical Decisions & Assumptions

*   **Frontend-Only**: No backend services are used. All API interactions are entirely mocked within `src/api.js`.
*   **In-Memory/LocalStorage Token Storage**: The mock `access_token` is stored in `localStorage` for persistence across browser sessions (until manually cleared or disconnected). This is acceptable for the assignment but not suitable for production.
*   **Simplified OAuth Scope**: The mock `TIKTOK_OAUTH_CONFIG.SCOPE` defines `aweme.share,user.info.basic,ads_management.basic`.
*   **Simulated API Errors**: Specific API errors (geo-restriction, invalid token, missing permissions, invalid music ID) are simulated with predefined logic or specific input values to demonstrate robust error handling. Raw API JSON is explicitly not displayed to the user.
*   **Client-Side Geo-Restriction Toggle**: Due to the frontend-only nature, actual user geo-location cannot be detected. A "Toggle Geo-Restriction (Demo)" button is provided on the OAuth page to manually simulate being in a geo-restricted region (like India).
*   **No Real File Upload**: The "Upload / Custom Music" option simulates an upload and generates a mock `musicId`. It includes a random chance of failure to showcase error handling.
*   **No Ad Listing**: The application does not include functionality to view or manage previously created ads, as this was not a requirement and would necessitate a backend.

## How to Test Functionality (for Demo Video)

After running `npm start`, open your browser to `http://localhost:3000`.

### 1. Test OAuth Flow & Geo-Restriction

*   **Geo-Restriction Simulation**:
    *   On the initial "Connect TikTok Ads Account" page, click the **"Toggle Geo-Restriction (Demo)"** button.
    *   Observe: A yellow "Heads Up!" banner appears, and the "Connect TikTok Ads Account" button becomes disabled. An `alert` will confirm geo-restriction if you try to click the disabled button.
    *   Click the toggle again to disable geo-restriction and proceed.
*   **Successful Mock OAuth**:
    *   Ensure geo-restriction is OFF.
    *   Click **"Connect TikTok Ads Account"**.
    *   Observe: Brief "Processing TikTok OAuth..." screen, then an `alert` "OAuth successful!", followed by redirection to the "Create New Ad" form.

### 2. Test Ad Creation Form (On `/ad-form` route)

*   **Field-Level Validation**:
    *   **Campaign Name**: Leave empty or `< 3` chars (e.g., "ab").
        *   _Expected_: Inline error: "Campaign Name is required and must be at least 3 characters."
    *   **Ad Text**: Leave empty or `> 100` chars.
        *   _Expected_: Inline error: "Ad Text is required and must be max 100 characters."
    *   **CTA**: Leave empty.
        *   _Expected_: Inline error: "CTA is required."

*   **Music Selection Logic**:
    *   **Option A: Existing Music ID**:
        *   Select "Existing Music ID".
        *   Empty "Music ID" input: _Expected_: Inline error: "Music ID is required..."
        *   Enter `invalid_music` as ID, then **Submit Ad**. _Expected_: Inline error below Music ID: "Invalid Music ID. Please check and try again."
        *   Enter `valid_music` as ID. _Expected_: Passes validation on submission.
    *   **Option B: Upload / Custom Music**:
        *   Select "Upload / Custom Music". Fill other fields validly, then **Submit Ad**.
        *   _Expected (Success)_: `alert` "Custom music uploaded successfully with ID: mock_music_..."
        *   _Expected (Failure - ~20% chance)_: Inline error below Music Option: "Custom music upload failed during validation. Please try again." The "Loading..." indicator will clear, allowing re-submission.
    *   **Option C: No Music (Conditional)**:
        *   Select "No Music".
        *   Set "Objective" to "Traffic": _Expected_: No error for music option, can submit.
        *   Set "Objective" to "Conversions": _Expected_: Inline error below Music Option: "No Music is not allowed for Conversions objective." (Prevents submission).

*   **Submission API Error Handling (using "Campaign Name" triggers)**:
    *   Fill all fields validly, then:
    *   **Simulate Geo-Restriction Error**: Set "Campaign Name" to `fail_geo`.
        *   _Expected_: Global error banner: "TikTok Ads API is geo-restricted in your region. Access denied."
    *   **Simulate Missing Permissions Error**: Set "Campaign Name" to `fail_permission`.
        *   _Expected_: Global error banner: "Missing required Ads permission scope. Please grant necessary permissions."
    *   **Simulate Expired/Invalid Token Error**: Manually clear `tiktok_access_token` from your browser's `localStorage` (DevTools -> Application -> Local Storage). Then **Submit Ad**.
        *   _Expected_: Global error banner: "Your TikTok session has expired...", then redirection to the OAuth page.
    *   **Successful Ad Submission**:
        *   Fill all fields validly (e.g., Campaign Name "My Ad", Ad Text "Great ad copy", CTA "Buy Now", Music Option "No Music" with Objective "Traffic").
        *   _Expected_: `alert` "Ad created successfully with ID: ad_\[timestamp]". Form fields clear.

## UI/UX Enhancements

Beyond the basic requirements, the application's UI has been significantly enhanced for a professional and engaging experience:

*   **Animated Gradient Background**: A subtle, looping animated gradient provides a modern visual appeal.
*   **Navbar**: A sticky navigation bar at the top with the app title and a "Disconnect TikTok Account" button (visible when authenticated).
*   **Card-like Content Container**: The main form/OAuth content is presented within an elevated, shadowed card with rounded corners.
*   **Interactive Greeting**: On the OAuth page, an animated "Hello there!" message with a waving hand emoji and a pointing arrow visually guides the user to the "Connect" button.
*   **Dynamic Background Elements**: Multiple animated decorative shapes float subtly across the background, adding depth and motion to the page.
*   **Refined Form Elements**: Buttons, input fields, and select boxes have polished hover/focus animations and consistent styling.
*   **Clear Error Display**: Field-level errors are inline, and system-level errors are shown in distinct, user-friendly global banners.

## What Would Be Improved with More Time

*   **Custom Modals/Toasts**: Replacing native `alert()` calls with custom React modals or toast notifications for a more integrated UX.
*   **Robust State Management**: For a larger app, a state management library (e.g., Redux, Zustand) would provide more centralized control and predictability.
*   **Loading Skeletons/Spinners**: More sophisticated loading indicators instead of just "Loading..." text.
*   **Form Library**: Integration with a form library like Formik or React Hook Form for more streamlined form handling and validation.
*   **Accessibility (a11y)**: Further improvements to ARIA attributes and keyboard navigation.
*   **Responsiveness**: Ensuring optimal layout and interaction across a wider range of screen sizes.
*   **Advanced Animations**: Implementing more complex, custom SVG or Lottie animations for the "person walking smiling and saying hi" if desired, using specialized libraries.
*   **Component Library**: Using a UI component library (e.g., Material-UI, Ant Design) for consistent, pre-built components.

