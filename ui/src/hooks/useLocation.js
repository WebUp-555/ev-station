import { useState } from 'react'

export function useLocation(defaultLocation = { label: 'Bengaluru', lat: 12.9716, lng: 77.5946 }) {
	const [location, setLocation] = useState(defaultLocation)
	const [status, setStatus] = useState('idle')
	const [error, setError] = useState('')

	const setPresetLocation = (nextLocation) => {
		setLocation(nextLocation)
		setError('')
		setStatus('idle')
	}

	const requestCurrentLocation = async () => {
		if (!navigator.geolocation) {
			const message = 'Geolocation is not available in this browser.'
			setError(message)
			setStatus('error')
			return null
		}

		setStatus('loading')
		setError('')

		return new Promise((resolve) => {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const nextLocation = {
						label: 'Your current area',
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					}

					setLocation(nextLocation)
					setStatus('idle')
					resolve(nextLocation)
				},
				() => {
					const message = 'Location access was denied. Showing the default city instead.'
					setError(message)
					setStatus('error')
					resolve(null)
				},
			)
		})
	}

	return {
		location,
		setLocation: setPresetLocation,
		requestCurrentLocation,
		status,
		error,
	}
}
