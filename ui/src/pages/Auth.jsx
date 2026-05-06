import LoginForm from '../components/Auth/LoginForm.jsx'
import SignupForm from '../components/Auth/SignupForm.jsx'

export default function Auth({
  id,
  user,
  isAuthenticated,
  statusMessage,
  locationError,
  onLogin,
  onSignup,
  onLogout,
  onFocusExplore,
}) {
  return (
    <section id={id} className="auth-section">
      <div className="auth-grid">
        <div className="auth-panel surface-card">
          <div className="auth-head">
            <div>
              <p className="eyebrow">Account access</p>
              <h2 className="auth-title">Keep stations in sync across sessions.</h2>
              <p className="auth-copy">Sign in to save favorites. New users can create an account immediately using the matching form beside it.</p>
            </div>
            <span className={`status-pill ${isAuthenticated ? 'is-dark' : ''}`}>{isAuthenticated ? 'Signed in' : 'Guest'}</span>
          </div>

          <div className="status-banner">
            <span className="status-dot" />
            <div>
              <strong>{statusMessage}</strong>
              {locationError ? <div className="status-note">{locationError}</div> : null}
            </div>
          </div>

          {isAuthenticated ? (
            <div className="info-card">
              <label>Current session</label>
              <p className="muted-text">Signed in as {user?.email || 'a verified user'}.</p>
              <div className="auth-actions">
                <button className="pill-button pill-button--dark" type="button" onClick={onLogout}>
                  Sign out
                </button>
                <button className="pill-button pill-button--light" type="button" onClick={onFocusExplore}>
                  Back to stations
                </button>
              </div>
            </div>
          ) : (
            <div className="info-card">
              <label>Why sign in</label>
              <p className="muted-text">Your favorites live on the backend and are restored whenever you return with the same token.</p>
            </div>
          )}
        </div>

        <div className="auth-panel surface-card">
          <div className="form-grid">
            <LoginForm onSubmit={onLogin} />
            <SignupForm onSubmit={onSignup} />
          </div>
        </div>
      </div>
    </section>
  )
}