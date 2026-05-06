import { useMemo, useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import { useGoogleMaps } from '../context/GoogleMapsContext.jsx'
import { formatDistance, stationKey } from '../utils/helpers.js'
import StationList from '../components/Sidebar/StationList.jsx'
import GoogleMapComponent from '../components/GoogleMapComponent.jsx'

export default function SearchPage() {
  const { location, stations, selectedStation, setSelectedStation, favorites, saveFavorite, setLocation } = useAppContext()
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [placeSuggestions, setPlaceSuggestions] = useState([])

  const { isLoaded: mapsLoaded, loadError } = useGoogleMaps()

  useEffect(() => {
    let acService
    if (!mapsLoaded || !query || query.trim().length < 3) {
      setPlaceSuggestions([])
      return
    }

    if (window.google && window.google.maps && window.google.maps.places) {
      acService = new window.google.maps.places.AutocompleteService()
      acService.getPlacePredictions({ input: query, types: ['(regions)'] }, (preds, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && preds) {
          setPlaceSuggestions(preds.slice(0, 6))
        } else {
          setPlaceSuggestions([])
        }
      })
    }

    return () => {
      setPlaceSuggestions([])
    }
  }, [mapsLoaded, query])

  const favoriteKeys = new Set(favorites.map((fav) => stationKey(fav)))

  const filteredStations = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = stations

    if (q) {
      list = list.filter((s) => (`${s.name} ${s.address}`.toLowerCase().includes(q)))
    }

    if (filter === 'Saved') {
      list = list.filter((station) => favoriteKeys.has(stationKey(station)))
    } else if (filter === 'Closest') {
      list = [...list].slice(0, 5)
    }

    return list
  }, [stations, query, filter, favoriteKeys])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return stations
      .filter((s) => (`${s.name} ${s.address}`.toLowerCase().includes(q)))
      .slice(0, 6)
  }, [stations, query])

  return (
    <div className="page-search">
      <section className="search-section">
        <div className="search-grid">
          <div className="search-panel">
            {/* Search header */}
            <div className="search-panel__header">
              <div>
                <p className="eyebrow">Search & filter</p>
                <h2 className="section-title">Browse all stations, save the best ones.</h2>
              </div>
              <span className="quick-pill">{filteredStations.length} results</span>
            </div>

            {/* Search input */}
            <div className="search-input__wrapper">
              <input
                type="text"
                placeholder="Search by name or address..."
                className="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search stations"
              />
              <button
                type="button"
                className="search-icon"
                onClick={() => {
                  // if there are suggestions, choose the first; otherwise do nothing
                  if (suggestions.length) {
                    setSelectedStation(suggestions[0])
                    setQuery(suggestions[0].name)
                  }
                }}
                aria-label="Execute search"
              >
                🔍
              </button>

              {(suggestions.length > 0 || placeSuggestions.length > 0) && (
                <div className="search-suggestions" role="listbox">
                  {placeSuggestions.length > 0 && (
                    <div className="suggestions-group">
                      <div className="suggestions-group__title">Places</div>
                      {placeSuggestions.map((p) => (
                        <button
                          key={p.place_id}
                          type="button"
                          className="search-suggestion"
                          onClick={() => {
                            // resolve place details and update global location
                            if (!mapsLoaded) return
                            const ps = new window.google.maps.places.PlacesService(document.createElement('div'))
                            ps.getDetails({ placeId: p.place_id, fields: ['geometry', 'name', 'formatted_address'] }, (place, status) => {
                              if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
                                setSelectedStation(null)
                                setQuery('')
                                setPlaceSuggestions([])
                                // set global location via AppContext
                                try {
                                  // use AppContext.setLocation if available
                                  if (typeof setLocation === 'function') {
                                    setLocation({ label: p.description, lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
                                  }
                                } catch (err) {
                                  // ignore
                                }
                              }
                            })
                          }}
                        >
                          <div className="suggestion-title">{p.structured_formatting.main_text}</div>
                          <div className="suggestion-sub">{p.structured_formatting.secondary_text}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {suggestions.map((s, idx) => (
                    <button
                      key={`${s.lat}-${s.lng}-${idx}`}
                      type="button"
                      className="search-suggestion"
                      onClick={() => {
                        setQuery(s.name)
                        setSelectedStation(s)
                      }}
                    >
                      <div className="suggestion-title">{s.name}</div>
                      <div className="suggestion-sub">{s.address}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter tabs */}
            <div className="filter-row">
              {['All', 'Closest', 'Saved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`filter-chip ${filter === f ? 'is-active' : ''}`}
                >
                  {f === 'All' ? 'All stations' : f === 'Closest' ? 'Closest 5' : 'Your saved'}
                </button>
              ))}
            </div>

            {/* Station list */}
            <StationList
              stations={filteredStations}
              selectedStation={selectedStation}
              savedKeys={favoriteKeys}
              onSelectStation={setSelectedStation}
              onSaveStation={saveFavorite}
              formatDistance={formatDistance}
            />
          </div>

          {/* Map side */}
          <div className="search-side">
            <GoogleMapComponent
              stations={filteredStations}
              selectedStation={selectedStation}
              onSelectStation={setSelectedStation}
              center={{ lat: location.lat, lng: location.lng }}
              zoom={13}
            />

            {/* Info card */}
            {selectedStation && (
              <div className="station-info-card surface-card">
                <div className="info-header">
                  <h4 className="info-title">{selectedStation.name}</h4>
                  <span className="distance-pill">{formatDistance(selectedStation.distance)}</span>
                </div>
                <p className="info-address">{selectedStation.address}</p>
                <div className="info-details">
                  <span className="info-detail">
                    📍 {selectedStation.lat.toFixed(4)}, {selectedStation.lng.toFixed(4)}
                  </span>
                  <button onClick={() => saveFavorite(selectedStation)} className="pill-button is-small">
                    {favoriteKeys.has(stationKey(selectedStation)) ? '❤️ Saved' : '🤍 Save'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
