# wieedze.eth — Web3 Portfolio

Personal portfolio with on-chain connections, live ENS resolution, project showcase, and real-time location sharing for conferences.

**Live:** [wieedze.github.io/Web3_Portfolio](https://wieedze.github.io/Web3_Portfolio/)

## Features

- **On-chain Connection** — Visitors scan a QR code and connect their wallet (WalletConnect or manual input) to receive on-chain proof they met wieedze.eth at EthCC, via the Intuition protocol
- **ENS Profile** — Resolves `wieedze.eth` avatar and name dynamically via ensdata.net
- **Project Showcase** — Glassmorphism cards with favicons, links, and tags
- **Live Location** — Real-time map (Firebase + Leaflet) showing GPS position at conferences
- **QR Code Page** — Fullscreen QR code to display on your phone for easy scanning
- **Animated Background** — Three.js pixel blast effect
- **Fully Responsive** — Mobile-first design

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 19, TypeScript, Vite 7 |
| Styling | Tailwind CSS 4, Framer Motion |
| Wallet | WalletConnect, ethers.js v6 |
| 3D | Three.js, Postprocessing |
| Maps | Leaflet, React Leaflet |
| Backend | Firebase (Realtime DB + Cloud Functions) |
| On-chain | Intuition Protocol (SofiaFeeProxy) |
| Deploy | GitHub Pages (Actions) |

## Getting Started

```bash
pnpm install
cp .env.example .env   # fill in your keys
pnpm dev
```

## On-chain Connection

Visitors at EthCC can connect with you on-chain:

1. You show the QR code page (`#qr`) on your phone
2. They scan it → opens `#connect` on their phone
3. WalletConnect auto-triggers (or they paste their address manually)
4. A Firebase Cloud Function deposits into the Intuition triple vault on their behalf
5. They receive on-chain shares proving they met wieedze.eth

### Setup

1. Get a WalletConnect Project ID at [cloud.reown.com](https://cloud.reown.com)
2. Deploy the Firebase Cloud Function in `functions/`
3. Add all secrets to `.env` (see below)

## Live Location

1. Visitors click **"Meet me at EthCC"** → a map modal shows your live position
2. You open `#locate` on your phone → enter PIN → start GPS tracking
3. Your position is broadcast in real-time via Firebase

## Deployment

Deployed automatically via GitHub Actions on push to `master`.

### GitHub Secrets required

| Secret | Description |
|--------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_DATABASE_URL` | Realtime Database URL |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_LOCATE_PIN` | Admin PIN for location tracking |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID from cloud.reown.com |

Set them in **Settings → Secrets and variables → Actions**.

## Project Structure

```
src/
├── components/
│   ├── Background/PixelBlast.tsx    # Three.js animated background
│   ├── Hero/Hero.tsx                # ENS card + EthCC button
│   ├── LiveLocation/                # Map modal with real-time tracking
│   ├── Projects/                    # Project cards grid
│   └── Footer/Footer.tsx            # Contact section
├── data/projects.ts                 # Project definitions
├── hooks/useENS.ts                  # ENS resolution hook
├── lib/firebase.ts                  # Firebase config + helpers
├── lib/walletconnect.ts             # WalletConnect provider init
├── pages/
│   ├── ConnectPage.tsx              # Wallet connection + on-chain claim
│   ├── LocateAdmin.tsx              # Phone GPS tracker (admin)
│   └── QRPage.tsx                   # Fullscreen QR code display
functions/
└── src/index.ts                     # Cloud Function: claimConnection
```

## License

MIT
