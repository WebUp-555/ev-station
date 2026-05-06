import { useState } from 'react'

export default function LoginForm({ onSubmit, busy = false }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit({ email, password })
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-head">
        <div>
          <p className="eyebrow">Existing account</p>
          <h3 className="auth-title">Sign in</h3>
        </div>
        <span className="quick-pill">Secure</span>
      </div>

      <label className="form-label">
        Email
        <input
          className="field-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@domain.com"
          autoComplete="email"
          required
        />
      </label>

      <label className="form-label">
        Password
        <input
          className="field-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
          required
        />
      </label>

      <button className="pill-button pill-button--dark" type="submit" disabled={busy}>
        {busy ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}