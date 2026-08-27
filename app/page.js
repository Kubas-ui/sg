'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const MODULES = [
  {
    href: '/quiz',
    cat: 'WIEDZA OGÓLNA',
    code: 'WO-01',
    title: 'Test wiedzy ogólnej',
    desc: 'Losowany zestaw 20 pytań z bazy 241 zagadnień obowiązujących na etapie weryfikacji kandydatów do Straży Granicznej.',
    meta: '241 pytań · losowe 20 na test',
    accent: '#c0392b',
    accentDim: 'rgba(192,57,43,0.08)',
  },
  {
    href: '/sprawnosc',
    cat: 'SPRAWNOŚĆ FIZYCZNA',
    code: 'SF-02',
    title: 'Przygotowanie do testów sprawnościowych',
    desc: 'Zasady testu, opisy ćwiczeń z filmami instruktażowymi oraz tabele norm dla obu grup wiekowych i płci.',
    meta: '6 ćwiczeń · normy wg rozporządzenia SG',
    accent: '#1a6fa8',
    accentDim: 'rgba(26,111,168,0.08)',
  },
]



export default function Hub() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0e1117',
      color: '#e6edf3',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>

      {/* Pasek górny */}
      <div style={{
        borderBottom: '1px solid #21262d',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 52,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, background: '#c0392b', borderRadius: '50%' }} />
          <span style={{ fontSize: 12, color: '#8b949e', letterSpacing: 0.3 }}>
            PLATFORMA PRZYGOTOWANIA DO REKRUTACJI SG
          </span>
        </div>
        <Link href="/admin" style={{ fontSize: 11, color: '#484f58', textDecoration: 'none' }}>
          panel
        </Link>
      </div>

      {/* Główna zawartość */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* Nagłówek */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontSize: 11,
            color: '#8b949e',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}>
            Etapy rekrutacji — moduły szkoleniowe
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 800,
            color: '#e6edf3',
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: -0.5,
          }}>
            Przygotuj się<br />
            <span style={{ color: '#8b949e', fontWeight: 400 }}>do każdego etapu.</span>
          </h1>
        </div>

        {/* Aktywne moduły */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 40 }}>
          {MODULES.map((mod) => (
            <Link key={mod.href} href={mod.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#161b22',
                  border: '1px solid #21262d',
                  borderLeft: `3px solid ${mod.accent}`,
                  borderRadius: 6,
                  padding: '24px 28px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: 24,
                  transition: 'background 0.12s, border-color 0.12s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = mod.accentDim
                  e.currentTarget.style.borderColor = mod.accent
                  e.currentTarget.style.borderLeftColor = mod.accent
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#161b22'
                  e.currentTarget.style.borderColor = '#21262d'
                  e.currentTarget.style.borderLeftColor = mod.accent
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: mod.accent,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                    }}>{mod.cat}</span>
                    <span style={{ fontSize: 10, color: '#484f58' }}>{mod.code}</span>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#e6edf3', marginBottom: 8 }}>
                    {mod.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.6, maxWidth: 520 }}>
                    {mod.desc}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: '#484f58', marginBottom: 12, whiteSpace: 'nowrap' }}>
                    {mod.meta}
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: mod.accent,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '7px 16px',
                    borderRadius: 4,
                  }}>
                    Rozpocznij <span style={{ fontSize: 14 }}>→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>



      </div>
    </div>
  )
}
