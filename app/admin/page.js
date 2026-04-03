'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!password) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      if (data.success) {
        sessionStorage.setItem('adminToken', password)
        router.push('/admin/dashboard')
      } else {
        setError('Nieprawidłowe hasło. Spróbuj ponownie.')
      }
    } catch {
      setError('Błąd połączenia. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Georgia', serif" }}>
      <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: 24, padding: 48, width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: '#a78bfa', textTransform: 'uppercase', marginBottom: 8 }}>Panel Administratora</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 32 }}>Logowanie</div>

        <input
          type="password"
          placeholder="Hasło administratora"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
        />

        {error && (
          <div style={{ color: '#f87171', fontSize: 13, marginBottom: 16, background: 'rgba(239,68,68,0.1)', padding: '10px 16px', borderRadius: 8 }}>{error}</div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading || !password}
          style={{ width: '100%', background: password ? 'linear-gradient(135deg,#a78bfa,#7c3aed)' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: password ? 'pointer' : 'not-allowed', letterSpacing: 1 }}
        >
          {loading ? 'Sprawdzanie...' : 'Zaloguj się'}
        </button>

        <div style={{ marginTop: 24 }}>
          <a href="/" style={{ color: '#8b7cf8', fontSize: 13, textDecoration: 'none' }}>← Wróć do testu</a>
        </div>
      </div>
    </div>
  )
}
