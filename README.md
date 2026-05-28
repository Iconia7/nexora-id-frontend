# Nexora ID — Frontend App

The client portal interface for the Nexora centralized Identity Provider, built with **Next.js (App Router)** and **TypeScript**.

## Developer Setup

### 1. Configure Environments
Create a `.env.local` file in the root directory:
```ini
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Start the Development Server
Install dependencies and run the local hot-reloaded development portal:
```bash
npm install
npm run dev
```

The portal runs at `http://localhost:3000`.

---

## Technical & Architecture Documentation
For comprehensive details on:
- OAuth 2.0 Integration Flows (Client Setup)
- Session Management & Security Matrix
- 2FA & OTP Configurations
- Database Schema & Data Models
- VPS Production Deployments

Please see the [Central System & Developer Documentation](../nexora-id/NEXORA_ID_DOCUMENTATION.md).

