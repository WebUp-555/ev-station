import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'

export default function HomePage() {
  const navigate = useNavigate()
  const { location, setLocation, requestCurrentLocation, statusMessage, busy } = useAppContext()

  const cityPresets = [
    { label: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    { label: 'Delhi', lat: 28.7041, lng: 77.1025 },
    { label: 'Mumbai', lat: 19.076, lng: 72.8776 },
    { label: 'Hyderabad', lat: 17.3667, lng: 78.4734 },
  ]

  const handleCityPreset = (preset) => {
    setLocation({ ...preset, label: preset.label })
  }

  const handleRequestLocation = () => {
    requestCurrentLocation()
  }

  return (
    <div className="page-hero">
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero__left">
            <h1 className="hero-title">Find and save EV charging stations with confidence.</h1>

            <div className="hero__status">
              {busy ? (
                <div className="status-badge is-loading">
                  <span className="status-dot is-loading"></span>
                  Loading...
                </div>
              ) : (
                <div className="status-badge">
                  <span className="status-dot is-active"></span>
                  {statusMessage}
                </div>
              )}
            </div>

            <div className="city-preset__list">
              <p className="eyebrow">Select a city</p>
              {cityPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleCityPreset(preset)}
                  className={`city-preset ${location.label === preset.label ? 'is-active' : ''}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="hero__actions">
              <button onClick={handleRequestLocation} className="pill-button">
                📍 Use my location
              </button>
              <button onClick={() => navigate('/search')} className="pill-button is-primary">
                Start exploring →
              </button>
            </div>
          </div>

          <div className="hero__right">
            <div className="hero-stats">
              <div className="stat-card">
                <p className="stat-number">247+</p>
                <p className="stat-label">Nearby stations</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">12</p>
                <p className="stat-label">Available now</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">9</p>
                <p className="stat-label">Saved favorites</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
