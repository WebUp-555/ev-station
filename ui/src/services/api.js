const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

async function request(path, { method = 'GET', body, token } = {}) {
	const headers = {}

	if (body !== undefined) {
		headers['Content-Type'] = 'application/json'
	}

	if (token) {
		headers.Authorization = token
	}

	const response = await fetch(`${BASE_URL}${path}`, {
		method,
		headers,
		body: body === undefined ? undefined : JSON.stringify(body),
	})

	const raw = await response.text()
	let data = null

	if (raw) {
		try {
			data = JSON.parse(raw)
		} catch {
			data = raw
		}
	}

	if (!response.ok) {
		const message = data?.msg || data?.message || `Request failed with status ${response.status}`
		throw new Error(message)
	}

	return data
}

export const api = {
	request,
	auth: {
		signup: (email, password) => request('/api/auth/signup', { method: 'POST', body: { email, password } }),
		login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
	},
	stations: {
		nearby: (lat, lng) => request(`/api/stations/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`),
		geocode: (query) => request(`/api/stations/geocode?q=${encodeURIComponent(query)}`),
	},
	favorites: {
		list: (token) => request('/api/favorites', { token }),
		add: (token, payload) => request('/api/favorites', { method: 'POST', token, body: payload }),
		remove: (token, payload) => request('/api/favorites', { method: 'DELETE', token, body: payload }),
	},
}
