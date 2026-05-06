import MapView from '../components/Map/MapView.jsx'
import StationList from '../components/Sidebar/StationList.jsx'

export default function Search({
  id,
  stations,
  selectedStation,
  savedKeys,
  search,
  filterTab,
  filterTabs,
  onSearchChange,
  onFilterChange,
  onSelectStation,
  onSaveStation,
  formatDistance,
  loading,
  location,
}) {
  return (
    <section id={id} className="search-section surface-card search-panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Explore stations</p>
          <h2 className="section-title">Search the live list without clutter.</h2>
          <p className="section-copy">Filter the current city, focus the closest options, and keep the best locations pinned to your favorites list.</p>
        </div>
        <span className="status-pill is-dark">{loading ? 'Updating' : 'Ready'}</span>
      </div>

      <div className="search-grid">
        <div className="search-panel">
          <input
            className="search-input"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={`Search stations near ${location.label}`}
          />

          <div className="filter-row" role="tablist" aria-label="Station filters">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className={`filter-chip ${filterTab === tab ? 'is-active' : ''}`}
                type="button"
                onClick={() => onFilterChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <StationList
            stations={stations}
            selectedStation={selectedStation}
            savedKeys={savedKeys}
            onSelectStation={onSelectStation}
            onSaveStation={onSaveStation}
            formatDistance={formatDistance}
          />
        </div>

        <div className="search-side">
          <MapView stations={stations} selectedStation={selectedStation} onSelectStation={onSelectStation} />
          <div className="info-card">
            <label>Search behavior</label>
            <p className="muted-text">
              The backend returns nearby stations by coordinates. This UI keeps the experience fluid with city presets, current location, and instant local filtering.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}