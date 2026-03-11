import { useState, useEffect, useCallback } from 'react'
import { writeLocation } from '../lib/firebase'

const PIN = import.meta.env.VITE_LOCATE_PIN || '1234'

export default function LocateAdmin() {
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [tracking, setTracking] = useState(false)
  const [message, setMessage] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)

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
            onKeyDown={(e) => e.key === 'Enter' && pin === PIN && setAuthed(true)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-white/30"
          />
          <button
            onClick={() => pin === PIN ? setAuthed(true) : setError('Wrong PIN')}
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
