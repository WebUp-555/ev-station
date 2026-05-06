import { formatCoords, formatDistance, stationKey } from '../utils/helpers.js'

export default function Details({
  id,
  selectedStation,
  favorites,
  savedKeys,
  onSelectStation,
  onSaveStation,
  formatDistance: distanceFormatter = formatDistance,
}) {
  const favoritePreview = favorites.slice(0, 4)

  return (
    <section id={id} className="details-section">
      <div className="details-grid">
        <div className="details-panel surface-card">
          <div className="details-head">
            <div>
              <p className="eyebrow">Selected stop</p>
              <h2 className="detail-title">Station details at a glance.</h2>
              <p className="detail-copy">Choose any station from the list or map to inspect its coordinates, distance, and saved-state.</p>
            </div>
            <span className="quick-pill">{selectedStation ? 'Active' : 'None selected'}</span>
          </div>

          {selectedStation ? (
            <div className="detail-spot">
              <div className="detail-meta">
                <div>
                  <p className="eyebrow">Station</p>
                  <h3>{selectedStation.name}</h3>
                  <p className="muted-text">{selectedStation.address}</p>
                </div>
                <span className="distance-pill">{distanceFormatter(selectedStation.distance)}</span>
              </div>

              <div className="detail-metrics">
                <div className="mini-stat">
                  <label>Coordinates</label>
                  <strong>{formatCoords(selectedStation.lat, selectedStation.lng)}</strong>
                </div>
                <div className="mini-stat">
                  <label>Saved status</label>
                  <strong>{savedKeys.has(stationKey(selectedStation)) ? 'Already saved' : 'Available to save'}</strong>
                </div>
              </div>

              <div className="detail-actions">
                <button className="pill-button pill-button--dark" type="button" onClick={() => onSaveStation(selectedStation)}>
                  {savedKeys.has(stationKey(selectedStation)) ? 'Saved' : 'Save station'}
                </button>
                <button className="pill-button pill-button--light" type="button" onClick={() => onSelectStation(selectedStation)}>
                  Keep selected
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">No station selected yet. Pick one from the search list to populate this panel.</div>
          )}
        </div>

        <aside className="favorites-panel surface-card">
          <div className="favorites-head">
            <div>
              <p className="eyebrow">Favorites</p>
              <h3 className="section-title">Saved charging stops.</h3>
            </div>
            <span className="quick-pill">{favorites.length}</span>
          </div>

          {favoritePreview.length ? (
            <ul className="favorite-list">
              {favoritePreview.map((favorite) => (
                <li key={favorite._id || stationKey(favorite)} className="favorite-item">
                  <strong>{favorite.name}</strong>
                  <span className="muted-text">{formatCoords(favorite.lat, favorite.lng)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">Nothing saved yet. Use the black save button on any station card to start a favorites list.</div>
          )}

          <div className="info-card">
            <label>Saved coverage</label>
            <p className="muted-text">The backend stores name and coordinates only, so the UI highlights saved stations by position and title.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}