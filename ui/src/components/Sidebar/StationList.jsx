import StationCard from '../Station/StationCard.jsx'
import { stationKey } from '../../utils/helpers.js'

export default function StationList({ stations, selectedStation, savedKeys, onSelectStation, onSaveStation, formatDistance }) {
  if (!stations.length) {
    return <div className="empty-state">No stations matched the current search or filter.</div>
  }

  return (
    <div className="station-list">
      {stations.map((station) => {
        const key = stationKey(station)

        return (
          <StationCard
            key={key}
            station={station}
            active={stationKey(selectedStation || {}) === key}
            saved={savedKeys.has(key)}
            onSelect={onSelectStation}
            onSave={onSaveStation}
            formatDistance={formatDistance}
          />
        )
      })}
    </div>
  )
}