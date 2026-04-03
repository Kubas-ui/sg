'use client'
import Link from 'next/link'

const MODULES = [
  {
    href: '/quiz',
    icon: '📋',
    title: 'Test Wiedzy Ogólnej',
    subtitle: 'SG — wiedza ogólna',
    desc: '241 pytań z bazy, losowane zestawy po 20. Sprawdź czy odpiszesz na wszystkie zanim skończysz.',
    meta: '241 pytań · losowe 20',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.18)',
    border: 'rgba(167,139,250,0.35)',
  },
  {
    href: '/matryce',
    icon: '🧩',
    title: 'Matryce Ravena',
    subtitle: 'Myślenie abstrakcyjne',
    desc: '12 zadań z wielokrotnymi regułami jednocześnie. Każde zadanie generowane losowo — nigdy dwa takie same.',
    meta: '12 zadań · timer 90s',
    color: '#4a9eff',
    glow: 'rgba(74,158,255,0.18)',
    border: 'rgba(74,158,255,0.35)',
  },
  {
    href: '/multiselect',
    icon: '🧠',
    title: 'Kwestionariusz Osobowości',
    subtitle: 'Test psychologiczny',
    desc: '40 losowo dobranych stwierdzeń. Odpowiadaj TAK lub NIE zgodnie z tym, jak jest naprawdę. Na końcu otrzymasz wynik z opisem.',
    meta: '508 stwierdzeń · losowe 40',
    color: '#3eb489',
    glow: 'rgba(62,180,137,0.18)',
    border: 'rgba(62,180,137,0.35)',
  },
  {
    href: '/sprawnosc',
    icon: '🏃',
    title: 'Testy Sprawnościowe',
    subtitle: 'Przygotowanie fizyczne',
    desc: 'Zasady testu, opisy ćwiczeń z filmami instruktażowymi oraz tabele norm dla kobiet i mężczyzn w dwóch grupach wiekowych.',
    meta: '6 ćwiczeń · normy SG',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.18)',
    border: 'rgba(245,158,11,0.35)',
  },
]

const COMING_SOON = [
  { icon: '⏱️', title: 'Wkrótce…', desc: 'Kolejny moduł w przygotowaniu.' },
]

export default function Hub() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      fontFamily: "'Georgia', serif",
      color: '#e8e0f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px 60px',
    }}>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 340px))',
        gap: 24,
        justifyContent: 'center',
        width: '100%',
        maxWidth: 760,
        marginBottom: 24,
      }}>
        {MODULES.map(mod => (
          <Link key={mod.href} href={mod.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: mod.glow,
                border: `1.5px solid ${mod.border}`,
                borderRadius: 20,
                padding: '28px 28px 24px',
                cursor: 'pointer',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 16px 48px ${mod.glow}`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16, lineHeight: 1 }}>{mod.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                {mod.title}
              </div>
              <div style={{ fontSize: 11, color: mod.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, fontFamily: 'monospace' }}>
                {mod.subtitle}
              </div>
              <div style={{ fontSize: 13, color: '#b8aed4', lineHeight: 1.65, marginBottom: 20 }}>
                {mod.desc}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: mod.color, fontFamily: 'monospace', letterSpacing: 1 }}>
                  {mod.meta}
                </span>
                <span style={{ fontSize: 20, color: mod.color }}>→</span>
              </div>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, transparent, ${mod.color}, transparent)`,
                borderRadius: '20px 20px 0 0',
              }} />
            </div>
          </Link>
        ))}

        {COMING_SOON.map((mod, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1.5px dashed rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: '28px 28px 24px',
            opacity: 0.5,
          }}>
            <div style={{ fontSize: 40, marginBottom: 16, lineHeight: 1, filter: 'grayscale(1)' }}>{mod.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#888', marginBottom: 14 }}>{mod.title}</div>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{mod.desc}</div>
          </div>
        ))}
      </div>

      <Link href="/admin" style={{
        fontSize: 11,
        color: 'rgba(255,255,255,0.2)',
        fontFamily: 'monospace',
        letterSpacing: 2,
        textDecoration: 'none',
        textTransform: 'uppercase',
      }}>
        ⚙ admin
      </Link>
    </div>
  )
}
