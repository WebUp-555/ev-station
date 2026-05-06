import { useLoadScript } from '@react-google-maps/api'

const MAPS_LIBRARIES = ['places']

export function useGoogleMapsLoader() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: MAPS_LIBRARIES,
  })

  return { isLoaded, loadError }
}
