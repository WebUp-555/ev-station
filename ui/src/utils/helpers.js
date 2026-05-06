export function decodeToken(token) {
	if (!token) {
		return null
	}

	try {
		const payload = token.split('.')[1]

		if (!payload) {
			return null
		}

		const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
		const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
		const parsed = atob(padded)
		const payloadData = JSON.parse(parsed)

		// Treat expired JWTs as invalid so the UI can fall back to guest mode.
		if (payloadData?.exp && Date.now() >= payloadData.exp * 1000) {
			return null
		}

		return payloadData
	} catch {
		return null
	}
}

export function stationKey(station) {
	return `${station.name || ''}|${station.lat || ''}|${station.lng || ''}`
}

export function formatDistance(distance) {
	const value = Number(distance)

	if (!Number.isFinite(value)) {
		return 'Live pin'
	}

	if (value < 1) {
		return `${Math.max(1, Math.round(value * 1000))} m`
	}

	return `${value.toFixed(1)} km`
}

export function formatCoords(lat, lng) {
	const latitude = Number(lat)
	const longitude = Number(lng)

	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
		return 'Coordinates unavailable'
	}

	return `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`
}
