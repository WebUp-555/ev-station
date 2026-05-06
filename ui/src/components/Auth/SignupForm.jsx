import { useState } from 'react'

export default function SignupForm({ onSubmit, busy = false }) {
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
          <p className="eyebrow">New account</p>
          <h3 className="auth-title">Create profile</h3>
        </div>
        <span className="quick-pill">One step</span>
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
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
        />
      </label>

      <button className="pill-button pill-button--dark" type="submit" disabled={busy}>
        {busy ? 'Creating...' : 'Create account'}
      </button>
    </form>
  )
}