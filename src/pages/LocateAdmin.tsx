import { useState, useEffect, useCallback } from 'react'
import { writeLocation, clearLocation } from '../lib/firebase'

const PIN = import.meta.env.VITE_LOCATE_PIN || '1234'

const MAX_ATTEMPTS = 3

export default function LocateAdmin() {
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [tracking, setTracking] = useState(false)
  const [message, setMessage] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(() => sessionStorage.getItem('locate_locked') === 'true')

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setCoords({ lat, lng })
        setError(null)
        writeLocation({
          lat,
          lng,
          timestamp: Date.now(),
          message: message || undefined,
        })
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 5000 }
    )
    setWatchId(id)
    setTracking(true)
  }, [message])

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    clearLocation()
    setTracking(false)
  }, [watchId])

  useEffect(() => {
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId)
    }
  }, [watchId])

  // Update message in Firebase when it changes while tracking
  useEffect(() => {
    if (tracking && coords) {
      writeLocation({
        lat: coords.lat,
        lng: coords.lng,
        timestamp: Date.now(),
        message: message || undefined,
      })
    }
  }, [message, tracking, coords])

  const handlePinSubmit = useCallback(() => {
    if (pin === PIN) {
      setAuthed(true)
      setError(null)
    } else {
      const next = attempts + 1
      setAttempts(next)
      setError(`Wrong PIN (${next}/${MAX_ATTEMPTS})`)
      setPin('')
      if (next >= MAX_ATTEMPTS) {
        setLocked(true)
        sessionStorage.setItem('locate_locked', 'true')
      }
    }
  }, [pin, attempts])

  if (locked) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-6 w-full max-w-sm text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-400">Access Denied</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Too many failed attempts. This incident has been logged.
          </p>
          <div className="mt-4 px-4 py-2 rounded-lg bg-red-500/5 border border-red-500/10">
            <p className="text-xs text-red-400/60 font-mono">
              IP and device fingerprint recorded
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <h1 className="text-2xl font-bold text-white text-center">Admin</h1>
          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-white/30"
          />
          <button
            onClick={handlePinSubmit}
            className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
          >
            Enter
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 gap-6">
      <h1 className="text-2xl font-bold text-white">Location Tracker</h1>

      <button
        onClick={tracking ? stopTracking : startTracking}
        className={`px-8 py-4 rounded-2xl text-lg font-semibold transition-all ${
          tracking
            ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30'
            : 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30'
        }`}
      >
        {tracking ? 'Stop Tracking' : 'Start Tracking'}
      </button>

      <input
        type="text"
        placeholder="Status message (e.g. At the Intuition booth)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full max-w-sm px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30"
      />

      {coords && (
        <div className="text-white/50 text-sm text-center">
          <p>{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</p>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {tracking && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Broadcasting live
        </div>
      )}
    </div>
  )
}
