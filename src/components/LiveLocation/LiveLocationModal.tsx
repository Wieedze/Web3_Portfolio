import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { onLocationChange, type LocationData } from '../../lib/firebase'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon issue with bundlers
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// EthCC Cannes — Palais des Festivals
const CANNES_CENTER: [number, number] = [43.5513, 7.0170]

function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(position, 17, { duration: 1 })
  }, [map, position])
  return null
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

interface Props {
  onClose: () => void
}

export default function LiveLocationModal({ onClose }: Props) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onLocationChange((data) => {
      setLocation(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const isStale = location ? Date.now() - location.timestamp > 30 * 60 * 1000 : true
  const position: [number, number] = location
    ? [location.lat, location.lng]
    : CANNES_CENTER

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#111111] border border-white/10 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-white">Find me at EthCC</h2>
            {loading ? (
              <span className="text-sm text-white/30">Loading...</span>
            ) : isStale ? (
              <span className="text-sm text-white/30">Currently offline</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-green-400">
                  Live — updated {timeAgo(location!.timestamp)}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map */}
        <div className="h-80 sm:h-96">
          <MapContainer
            center={position}
            zoom={location && !isStale ? 17 : 15}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {location && !isStale && (
              <>
                <MapUpdater position={position} />
                <Marker position={position} icon={markerIcon}>
                  {location.message && (
                    <Popup>
                      <span className="text-sm font-medium">{location.message}</span>
                    </Popup>
                  )}
                </Marker>
              </>
            )}
          </MapContainer>
        </div>

        {/* Status message */}
        {location?.message && !isStale && (
          <div className="px-6 py-3 border-t border-white/10 text-sm text-white/60">
            {location.message}
          </div>
        )}
      </div>
    </div>
  )
}
