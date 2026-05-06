import { stationKey } from '../../utils/helpers.js'

const markerPositions = [
  { left: 18, top: 24 },
  { left: 70, top: 18 },
  { left: 34, top: 58 },
  { left: 76, top: 66 },
  { left: 52, top: 36 },
]

export default function MapView({ stations, selectedStation, onSelectStation }) {
  const visibleStations = stations.slice(0, markerPositions.length)

  return (
    <section className="map-view">
      <div className="map-view__header">
        <div>
          <p className="eyebrow">Route sketch</p>
          <h3 className="section-title">Stations plotted like a clean transit map.</h3>
        </div>
        <span className="quick-pill">{stations.length} pins</span>
      </div>

      <div className="map-canvas" aria-label="Station map preview">
        <div className="map-hub">EV</div>
        {visibleStations.map((station, index) => {
          const position = markerPositions[index]
          const isActive = stationKey(station) === stationKey(selectedStation || {})

          return (
            <button
              key={stationKey(station)}
              type="button"
              className={`map-pin ${isActive ? 'is-active' : ''}`}
              style={{ left: `${position.left}%`, top: `${position.top}%` }}
              onClick={() => onSelectStation?.(station)}
              title={station.name}
            >
              {index + 1}
            </button>
          )
        })}
      </div>

      <div className="map-view__footer">
        <span className="status-pill">Live nearby results</span>
        <span className="muted-text">Tap any pin or card to inspect the station.</span>
      </div>
    </section>
  )
}