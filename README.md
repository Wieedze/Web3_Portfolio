# wieedze.eth — Web3 Portfolio

Personal portfolio with live ENS resolution, project showcase, and real-time location sharing for conferences.

**Live:** [wieedze.github.io/Web3_Portfolio](https://wieedze.github.io/Web3_Portfolio/)

## Features

- **ENS Profile** — Resolves `wieedze.eth` avatar and name dynamically via ensdata.net
- **Project Showcase** — Glassmorphism cards with favicons, links, and tags
- **Live Location** — "Meet me at EthCC" button opens a real-time map (Firebase + Leaflet) showing your GPS position at the conference
- **Animated Background** — Three.js pixel blast effect
- **Fully Responsive** — Mobile-first design

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 19, TypeScript, Vite 7 |
| Styling | Tailwind CSS 4, Framer Motion |
| 3D | Three.js, Postprocessing |
| Maps | Leaflet, React Leaflet |
| Backend | Firebase Realtime Database |
| Deploy | GitHub Pages (Actions) |

## Getting Started

```bash
pnpm install
cp .env.example .env   # fill in your Firebase keys
pnpm dev
```

## Live Location

The portfolio includes a real-time location feature for conferences:

1. Visitors click **"Meet me at EthCC"** → a map modal shows your live position
2. You open `yoursite.com/#locate` on your phone → enter your PIN → start GPS tracking
3. Your position is broadcast in real-time via Firebase to all visitors

### Setup

1. Create a Firebase project with Realtime Database
2. Add your Firebase config to `.env` (see `.env.example`)
3. Set a secret `VITE_LOCATE_PIN` for the admin page

## Deployment

Deployed automatically via GitHub Actions on push to `master`.

### GitHub Secrets required

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_LOCATE_PIN`

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
└── pages/LocateAdmin.tsx            # Phone GPS tracker (admin)
```

## License

MIT