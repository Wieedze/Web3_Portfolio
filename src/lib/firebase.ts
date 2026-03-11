import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, set, remove } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export const locationRef = ref(db, 'location')

export interface LocationData {
  lat: number
  lng: number
  timestamp: number
  message?: string
}

export function writeLocation(data: LocationData) {
  const clean = { lat: data.lat, lng: data.lng, timestamp: data.timestamp, ...(data.message ? { message: data.message } : {}) }
  return set(locationRef, clean)
}

export function clearLocation() {
  return remove(locationRef)
}

export function onLocationChange(callback: (data: LocationData | null) => void) {
  return onValue(locationRef, (snapshot) => {
    callback(snapshot.val())
  })
}

// --- Connect on-chain feature ---
import { getFunctions, httpsCallable } from 'firebase/functions'

const functions = getFunctions(app)

interface ClaimResult {
  success: boolean
  alreadyClaimed: boolean
  txHash?: string
}

export async function claimConnection(address: string): Promise<ClaimResult> {
  const claim = httpsCallable<{ address: string }, ClaimResult>(functions, 'claimConnection')
  const result = await claim({ address })
  return result.data
}

export const claimsCountRef = ref(db, 'claimsCount')

export function onClaimCount(callback: (count: number) => void) {
  return onValue(claimsCountRef, (snapshot) => {
    callback(snapshot.val() ?? 0)
  })
}
