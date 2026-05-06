import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { stationKey } from '../utils/helpers.js'
import { api } from '../services/api.js'
import { useAuth } from './useAuth.js'
import { useLocation as useLocationHook } from '../hooks/useLocation.js'

export const AppContext = createContext(null)

const fallbackStations = [
  {
    name: 'City Grid Charge Hub',
    address: 'MG Road, Bengaluru',
    lat: 12.9752,
    lng: 77.6033,
    distance: 0.8,
  },
  {
    name: 'Pulse EV Station',
    address: 'Indiranagar 100 Feet Road, Bengaluru',
    lat: 12.9787,
    lng: 77.6408,
    distance: 2.1,
  },
  {
    name: 'Orbit Fast Charge',
    address: 'Koramangala 5th Block, Bengaluru',
    lat: 12.9352,
    lng: 77.6245,
    distance: 3.4,
  },
  {
    name: 'Apex Charging Point',
    address: 'Whitefield Main Road, Bengaluru',
    lat: 12.9698,
    lng: 77.75,
    distance: 8.2,
  },
]

export function AppProvider({ children }) {
  const { token, logout } = useAuth()
  const { location, setLocation, requestCurrentLocation, status: locationStatus, error: locationError } = useLocationHook()
  const [stations, setStations] = useState(fallbackStations)
  const [favorites, setFavorites] = useState([])
  const [selectedStation, setSelectedStation] = useState(fallbackStations[0])
  const [statusMessage, setStatusMessage] = useState('Browse live charging options, then save the ones you trust most.')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let isAlive = true

    const loadFavorites = async () => {
      if (!token) {
        setFavorites([])
        return
      }

      try {
        const data = await api.favorites.list(token)
        if (isAlive) setFavorites(Array.isArray(data) ? data : [])
      } catch (error) {
        if (error.message === 'Invalid token' || error.message === 'No token') {
          logout()
          if (isAlive) setStatusMessage('Your session expired. Please sign in again to view saved stations.')
          return
        }
        if (isAlive) setStatusMessage(error.message || 'Signed in, but favorites could not be loaded yet.')
      }
    }

    loadFavorites()

    return () => {
      isAlive = false
    }
  }, [token, logout])

  const favoriteKeys = useMemo(() => new Set(favorites.map((fav) => stationKey(fav))), [favorites])

  const loadStations = useCallback(
    async (lat, lng, label) => {
      setBusy(true)
      setStatusMessage(`Refreshing stations near ${label}.`)

      try {
        const data = await api.stations.nearby(lat, lng)
        const normalized = data.length > 0 ? data : fallbackStations
        setStations(normalized)
        setSelectedStation((current) => current ?? normalized[0])
        setStatusMessage(data.length > 0 ? `Loaded ${data.length} nearby stations.` : 'No live stations returned yet, so demo results are shown.')
      } catch (error) {
        setStations(fallbackStations)
        setSelectedStation(fallbackStations[0])
        setStatusMessage(error.message || 'Showing demo stations until the backend responds.')
      } finally {
        setBusy(false)
      }
    },
    [],
  )

  // Auto-load stations whenever the global location changes
  useEffect(() => {
    if (!location?.lat || !location?.lng) return
    let isAlive = true

    const doLoad = async () => {
      try {
        await loadStations(location.lat, location.lng, location.label)
      } catch (err) {
        if (isAlive) setStatusMessage(err.message || 'Could not load stations for the selected location.')
      }
    }

    doLoad()

    return () => {
      isAlive = false
    }
  }, [location?.lat, location?.lng, location?.label, loadStations])

  const saveFavorite = useCallback(
    async (station) => {
      if (!token) {
        setStatusMessage('Sign in first to save a charging station.')
        return
      }

      const key = stationKey(station)
      if (favoriteKeys.has(key)) {
        setStatusMessage(`${station.name} is already saved.`)
        return
      }

      try {
        await api.favorites.add(token, station)
        const data = await api.favorites.list(token)
        setFavorites(Array.isArray(data) ? data : [])
        setStatusMessage(`${station.name} was added to your favorites.`)
        return
      } catch (error) {
        if (error.message === 'Invalid token' || error.message === 'No token') {
          logout()
          setStatusMessage('Session expired. Sign in again to save favorites.')
          return
        }

        setStatusMessage(error.message || 'Could not save this station right now.')
      }
    },
    [token, favoriteKeys, logout],
  )

  const value = useMemo(
    () => ({
      location,
      setLocation,
      requestCurrentLocation,
      locationStatus,
      locationError,
      stations,
      favorites,
      selectedStation,
      statusMessage,
      busy,
      favoriteKeys,
      loadStations,
      setSelectedStation,
      setStatusMessage,
      saveFavorite,
    }),
    [stations, favorites, selectedStation, statusMessage, busy, favoriteKeys, loadStations, saveFavorite],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  return useContext(AppContext)
}
