import MapView from '../components/Map/MapView.jsx'

export default function Home({
  id,
  location,
  statusMessage,
  busy,
  nearbyCount,
  visibleCount,
  savedCount,
  selectedStation,
  presets,
  onPresetSelect,
  onUseCurrentLocation,
  onOpenAccount,
  stations,
}) {
  return (
    <section id={id} className="hero-section">
      <div className="hero-grid">
        <div className="hero-copy surface-card">
          <p className="eyebrow">Electric mobility, refined</p>
          <h2 className="hero-title">Find, compare, and save EV charging stops in one clean flow.</h2>
          <p>
            The interface stays black, white, and direct. Switch cities, use your live location, and keep the best charging points in one saved list.
          </p>

          <div className="hero-actions">
            <button className="pill-button pill-button--dark" type="button" onClick={onUseCurrentLocation}>
              {busy ? 'Refreshing...' : 'Use current location'}
            </button>
            <button className="pill-button pill-button--light" type="button" onClick={onOpenAccount}>
              Open account
            </button>
          </div>

          <div className="status-banner">
            <span className="status-dot" />
            <div>
              <strong>{statusMessage}</strong>
              <div className="status-note">Current location: {location.label}</div>
            </div>
          </div>

          <div className="mini-stat-grid">
            <div className="mini-stat">
              <label>Nearby stations</label>
              <strong>{nearbyCount}</strong>
            </div>
            <div className="mini-stat">
              <label>Visible results</label>
              <strong>{visibleCount}</strong>
            </div>
            <div className="mini-stat">
              <label>Saved places</label>
              <strong>{savedCount}</strong>
            </div>
          </div>

          <div>
            <p className="eyebrow">City presets</p>
            <div className="chip-row">
              {presets.map((preset) => (
                <button key={preset.label} className={`pill-chip ${location.label === preset.label ? 'is-active' : ''}`} type="button" onClick={() => onPresetSelect(preset)}>
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-grid">
              <div className="visual-tile">
                <div>
                  <p className="eyebrow">Fast lane</p>
                  <strong>Shortest route</strong>
                </div>
                <div className="utility-note">Optimized for quick scanning and immediate action.</div>
              </div>
              <div className="visual-tile">
                <div>
                  <p className="eyebrow">Saved stops</p>
                  <strong>{savedCount} favorites</strong>
                </div>
                <div className="utility-note">Everything you trust stays one tap away.</div>
              </div>
            </div>
          </div>

          <MapView stations={stations} selectedStation={selectedStation} />
        </div>
      </div>
    </section>
  )
}