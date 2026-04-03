'use client'
import Link from 'next/link'

export default function MatrycePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1117',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Minimalistyczny pasek z powrotem */}
      <div style={{
        background: '#161b26',
        borderBottom: '1px solid #252d40',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexShrink: 0,
        zIndex: 10,
      }}>
        <Link href="/" style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.3)',
          textDecoration: 'none',
          fontFamily: 'monospace',
          letterSpacing: 1,
          transition: 'color 0.15s',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#4a9eff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          ← POWRÓT
        </Link>
      </div>

      {/* Iframe z pełnym plikiem matryc */}
      <iframe
        src="/matryce-app.html"
        style={{
          flex: 1,
          border: 'none',
          width: '100%',
          minHeight: 'calc(100vh - 41px)',
        }}
        title="Matryce Progresywne Ravena"
      />
    </div>
  )
}
