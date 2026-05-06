import { createContext, useContext } from 'react'
import { useLoadScript } from '@react-google-maps/api'

const GoogleMapsContext = createContext(null)

const MAPS_LIBRARIES = ['places']

export function GoogleMapsProvider({ children }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: MAPS_LIBRARIES,
  })

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  )
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext)
  if (!context) {
    throw new Error('useGoogleMaps must be used within GoogleMapsProvider')
  }
  return context
}
