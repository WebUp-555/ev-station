import { formatCoords, formatDistance, stationKey } from '../../utils/helpers.js'

export default function StationCard({ station, active = false, saved = false, onSelect, onSave, formatDistance: distanceFormatter = formatDistance }) {
  const key = stationKey(station)

  return (
    <article className={`station-card ${active ? 'is-active' : ''}`}>
      <div className="station-card__header">
        <div>
          <p className="eyebrow">{saved ? 'Saved stop' : 'Nearby charger'}</p>
          <h3>{station.name}</h3>
          <p className="station-subtext">{station.address}</p>
        </div>
        <span className="distance-pill">{distanceFormatter(station.distance)}</span>
      </div>

      <div className="station-card__meta">
        <span className="meta-line">{formatCoords(station.lat, station.lng)}</span>
        <span className="meta-line">{saved ? 'In favorites' : 'Available to save'}</span>
      </div>

      <div className="station-card__footer">
        <button className="pill-button pill-button--light" type="button" onClick={() => onSelect?.(station)}>
          Details
        </button>
        <button className="pill-button pill-button--dark" type="button" onClick={() => onSave?.(station)} disabled={saved} data-key={key}>
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </article>
  )
}