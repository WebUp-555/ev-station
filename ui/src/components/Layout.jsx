import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { useAppContext } from '../context/AppContext.jsx'

export default function Layout({ children }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { statusMessage } = useAppContext()

  const isActive = (path) => location.pathname === path

  return (
    <div className="layout">
      <header className="topbar surface-card">
        <div className="brand-lockup">
          <Link to="/" className="brand-mark">
            EV
          </Link>
          <div>
            <p className="eyebrow">Charging intelligence</p>
            <h1 className="brand-title">EV Station</h1>
          </div>
        </div>

        <nav className="topbar-nav" aria-label="Primary">
          <Link to="/" className={`pill-link ${isActive('/') ? 'is-active' : ''}`}>
            Home
          </Link>
          <Link to="/search" className={`pill-link ${isActive('/search') ? 'is-active' : ''}`}>
            Search
          </Link>
          <Link to="/details" className={`pill-link ${isActive('/details') ? 'is-active' : ''}`}>
            Details
          </Link>
        </nav>

        <div className="topbar-actions">
          <Link to="/account" className="pill-link">
            {user ? `Account (${user.email?.split('@')[0]})` : 'Sign In'}
          </Link>
          {user ? (
            <button onClick={logout} className="pill-button pill-button--dark">
              Sign out
            </button>
          ) : null}
        </div>

      </header>

      {/* Global status banner (shows messages from AppContext, e.g. save-required prompts) */}
      <div className={`global-status ${statusMessage ? 'is-visible' : 'is-hidden'}`}>
        <div className="global-status-inner surface-card">
          <strong>{statusMessage}</strong>
        </div>
      </div>

      <main className="page-stack">{children}</main>

      <footer className="footer">
        <p className="footer__text">⚡ EV Station © 2025 — Find and save charging points near you</p>
        <div className="footer__links">
          <a href="#privacy" className="footer-link">
            Privacy
          </a>
          <a href="#terms" className="footer-link">
            Terms
          </a>
          <a href="#contact" className="footer-link">
            Support
          </a>
        </div>
      </footer>
    </div>
  )
}
