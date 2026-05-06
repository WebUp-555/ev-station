import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'
import { formatDistance } from '../utils/helpers.js'

export default function DetailsPage() {
  const navigate = useNavigate()
  const { selectedStation, favorites, saveFavorite } = useAppContext()

  const favoriteKeys = new Set(favorites.map((fav) => `${fav.name}|${fav.lat}|${fav.lng}`))
  const isSaved = selectedStation && favoriteKeys.has(`${selectedStation.name}|${selectedStation.lat}|${selectedStation.lng}`)

  return (
    <div className="page-details">
      <section className="details-section">
        <div className="details-grid">
          {/* Main details panel */}
          <div className="details-panel">
            {selectedStation ? (
              <>
                <div className="details-header">
                  <div>
                    <p className="eyebrow">Station details</p>
                    <h2 className="section-title">{selectedStation.name}</h2>
                  </div>
                  <button onClick={() => navigate('/search')} className="pill-button is-secondary">
                    ← Back to map
                  </button>
                </div>

                <div className="station-detail-card surface-card">
                  <div className="detail-row">
                    <span className="detail-label">📍 Address</span>
                    <span className="detail-value">{selectedStation.address}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">🧭 Coordinates</span>
                    <span className="detail-value">
                      {selectedStation.lat.toFixed(6)}, {selectedStation.lng.toFixed(6)}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">📏 Distance</span>
                    <span className="detail-value">{formatDistance(selectedStation.distance)}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">
                      <span className="status-dot is-active"></span>
                      Available now
                    </span>
                  </div>

                  <div className="detail-actions">
                    <button
                      onClick={() => saveFavorite(selectedStation)}
                      className={`pill-button ${isSaved ? 'is-saved' : ''}`}
                    >
                      {isSaved ? '❤️ Save to favorites' : '🤍 Add to favorites'}
                    </button>
                    <button onClick={() => navigate('/search')} className="pill-button is-secondary">
                      📍 Show on map
                    </button>
                  </div>
                </div>

                <div className="detail-info-section">
                  <p className="eyebrow">Amenities</p>
                  <div className="amenity-grid">
                    <div className="amenity-card">
                      <span className="amenity-icon">🔌</span>
                      <span className="amenity-label">Fast Charging</span>
                    </div>
                    <div className="amenity-card">
                      <span className="amenity-icon">☕</span>
                      <span className="amenity-label">Café Nearby</span>
                    </div>
                    <div className="amenity-card">
                      <span className="amenity-icon">🅿️</span>
                      <span className="amenity-label">Parking</span>
                    </div>
                    <div className="amenity-card">
                      <span className="amenity-icon">📱</span>
                      <span className="amenity-label">WiFi</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p className="empty-state__title">No station selected</p>
                <p className="empty-state__subtitle">Go to the search page and tap a station to view details.</p>
                <button onClick={() => navigate('/search')} className="pill-button is-primary">
                  Go to search →
                </button>
              </div>
            )}
          </div>

          {/* Favorites sidebar */}
          <div className="favorites-panel">
            <div className="favorites-header">
              <p className="eyebrow">Your saved</p>
              <h3 className="section-title">Favorites ({favorites.length})</h3>
            </div>

            {favorites.length > 0 ? (
              <div className="favorites-list">
                {favorites.slice(0, 4).map((fav, idx) => (
                  <button
                    key={idx}
                    onClick={() => {}}
                    className={`favorite-card surface-card ${isSaved && selectedStation?.lat === fav.lat && selectedStation?.lng === fav.lng ? 'is-active' : ''}`}
                  >
                    <p className="favorite-name">{fav.name}</p>
                    <p className="favorite-address">{fav.address}</p>
                    <span className="favorite-distance">{formatDistance(fav.distance)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-favorites">
                <p className="empty-state__subtitle">Sign in and save stations to see them here.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
