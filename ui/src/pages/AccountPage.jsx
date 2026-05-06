import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import LoginForm from '../components/Auth/LoginForm.jsx'
import SignupForm from '../components/Auth/SignupForm.jsx'

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, login, signup } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (email, password) => {
    try {
      setError('')
      await login(email, password)
      navigate('/search')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSignup = async (email, password) => {
    try {
      setError('')
      await signup(email, password)
      navigate('/search')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page-auth">
      <section className="auth-section">
        <div className="auth-grid">
          {/* Form panel */}
          <div className="auth-panel">
            {user ? (
              <>
                <div className="auth-header">
                  <p className="eyebrow">Account</p>
                  <h2 className="section-title">Welcome back!</h2>
                </div>

                <div className="session-card surface-card">
                  <div className="session-info">
                    <p className="session-label">Signed in as</p>
                    <p className="session-email">{user.email}</p>
                  </div>
                  <div className="session-benefits">
                    <p className="eyebrow">Benefits</p>
                    <ul className="benefits-list">
                      <li className="benefit-item">
                        <span className="benefit-icon">❤️</span>
                        <span>Save your favorite stations</span>
                      </li>
                      <li className="benefit-item">
                        <span className="benefit-icon">⚡</span>
                        <span>Quick access across devices</span>
                      </li>
                      <li className="benefit-item">
                        <span className="benefit-icon">📊</span>
                        <span>View charging history</span>
                      </li>
                      <li className="benefit-item">
                        <span className="benefit-icon">🔔</span>
                        <span>Get availability alerts</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button onClick={() => navigate('/search')} className="pill-button is-primary">
                  Continue to search →
                </button>
              </>
            ) : (
              <>
                <div className="auth-header">
                  <p className="eyebrow">Authentication</p>
                  <h2 className="section-title">{isSignup ? 'Create account' : 'Sign in'}</h2>
                </div>

                {error && (
                  <div className="error-banner">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {isSignup ? (
                  <SignupForm onSubmit={handleSignup} />
                ) : (
                  <LoginForm onSubmit={handleLogin} />
                )}

                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="toggle-form-link"
                >
                  {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
                </button>

                <button onClick={() => navigate('/search')} className="pill-button is-secondary">
                  Continue as guest →
                </button>
              </>
            )}
          </div>

          {/* Info panel */}
          <div className="auth-side">
            <div className="why-signin-card surface-card">
              <p className="eyebrow">Why sign in?</p>
              <h3 className="card-title">Personalize your experience</h3>

              <ul className="why-list">
                <li className="why-item">
                  <span className="why-icon">💾</span>
                  <div>
                    <p className="why-label">Save favorites</p>
                    <p className="why-desc">Keep track of your preferred stations</p>
                  </div>
                </li>
                <li className="why-item">
                  <span className="why-icon">⚡</span>
                  <div>
                    <p className="why-label">Fast access</p>
                    <p className="why-desc">Quick sign-in across all your devices</p>
                  </div>
                </li>
                <li className="why-item">
                  <span className="why-icon">📱</span>
                  <div>
                    <p className="why-label">Cloud sync</p>
                    <p className="why-desc">Your favorites sync automatically</p>
                  </div>
                </li>
                <li className="why-item">
                  <span className="why-icon">🔔</span>
                  <div>
                    <p className="why-label">Stay updated</p>
                    <p className="why-desc">Get alerts for new stations near you</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
