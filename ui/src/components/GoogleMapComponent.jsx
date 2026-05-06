import { GoogleMap, Marker } from '@react-google-maps/api'
import { useMemo } from 'react'
import { useGoogleMaps } from '../context/GoogleMapsContext.jsx'

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '20px',
}

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  fullscreenControl: true,
  streetViewControl: false,
}

export default function GoogleMapComponent({ stations, selectedStation, onSelectStation, center = { lat: 12.9716, lng: 77.5946 }, zoom = 13 }) {
  const { isLoaded, loadError } = useGoogleMaps()

  const mapCenter = useMemo(() => center || { lat: 12.9716, lng: 77.5946 }, [center])

  if (loadError) {
    return <div className="empty-state">Error loading Google Maps. Check your API key.</div>
  }

  if (!isLoaded) {
    return <div className="empty-state">Loading map...</div>
  }

  return (
    <div className="map-view">
      <div className="map-view__header">
        <div>
          <p className="eyebrow">Live map</p>
          <h3 className="section-title">EV stations on an interactive map.</h3>
        </div>
        <span className="quick-pill">{stations.length} pins</span>
      </div>

      <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={zoom} options={options}>
        <Marker position={mapCenter} title="Your location" icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />

        {stations.map((station) => (
          <Marker
            key={`${station.lat}-${station.lng}`}
            position={{ lat: station.lat, lng: station.lng }}
            title={station.name}
            onClick={() => onSelectStation?.(station)}
            icon={selectedStation?.lat === station.lat && selectedStation?.lng === station.lng ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'}
          />
        ))}
      </GoogleMap>

      <div className="map-view__footer">
        <span className="status-pill">Live interactive map</span>
        <span className="muted-text">Tap any marker to select the station.</span>
      </div>
    </div>
  )
}
