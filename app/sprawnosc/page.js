'use client'
import { useState } from 'react'
import Link from 'next/link'

const ZASADY = [
  'Kandydat musi posiadać kartę sprawności fizycznej z wpisem lekarza dopuszczającym do udziału w teście w danym dniu.',
  'Test przeprowadzany jest w hali sportowej; bieg na 1000 m i 600 m może być przeprowadzany na bieżni stadionu.',
  'Test wykonuje się w stroju sportowym.',
  'Kolejność wykonywanych elementów testu określają tabele norm sprawnościowych.',
  'Wyniki ocenia się zgodnie z normami zawartymi w tabelach norm sprawnościowych.',
  'Rozpoczęcie testu poprzedza kilkuminutowa indywidualna rozgrzewka.',
]

const CWICZENIA = [
  {
    nazwa: 'Uginanie i prostowanie ramion w podporze leżąc przodem',
    opis: 'Z podporu leżąc przodem ugina ramiona tak, aby barki, łopatki i łokcie znalazły się w jednej płaszczyźnie (tułów wyprostowany), następnie prostuje do pozycji wyjściowej. Nie wolno dotykać podłoża inną częścią ciała niż palce stóp i wewnętrzne powierzchnie dłoni ani wykonywać przerw odpoczynkowych. Liczy się ilość prawidłowo wykonanych cykli.',
    filmy: {
      m: 'http://strazgraniczna.pl/download/1/9636/uginanieramion.mp4',
      k: 'http://strazgraniczna.pl/download/1/9654/uginanieiprostowanieramionwpodporzewlezeniuprzodem.mp4',
    },
    jednostka: 'powtórzenia',
    normy: {
      k: [
        { wiek: 'do 30 lat', bdb: '20', db: '18', dst: '14' },
        { wiek: 'od 31 lat', bdb: '18', db: '16', dst: '12' },
      ],
      m: [
        { wiek: 'do 30 lat', bdb: '35', db: '30', dst: '25' },
        { wiek: 'od 31 lat', bdb: '31', db: '26', dst: '21' },
      ],
    },
  },
  {
    nazwa: 'Bieg koperta',
    opis: 'Na prostokącie 300×500 cm rozmieszczono 5 chorągiewek (4 narożniki + środek). Trasa: A→B→C→D→B→E→A — pokonywana trzykrotnie. Chorągiewki A, C, D, E omija lewym barkiem, B — prawym. Dotykanie chorągiewki skutkuje powtórzeniem próby; kolejne — niezaliczeniem. Czas mierzy się z dokładnością do 0,1 s.',
    filmy: {
      m: 'http://strazgraniczna.pl/download/1/9629/biegkoperta.mp4',
      k: 'http://strazgraniczna.pl/download/1/9648/biegkoperta.mp4',
    },
    jednostka: 'sekundy',
    info: 'Niższy wynik = lepszy',
    normy: {
      k: [
        { wiek: 'do 30 lat', bdb: '26,4', db: '27,1', dst: '27,8' },
        { wiek: 'od 31 lat', bdb: '27,1', db: '27,8', dst: '28,5' },
      ],
      m: [
        { wiek: 'do 30 lat', bdb: '25,0', db: '25,8', dst: '26,4' },
        { wiek: 'od 31 lat', bdb: '26,1', db: '26,9', dst: '27,5' },
      ],
    },
  },
  {
    nazwa: 'Skok w dal z miejsca obunóż',
    opis: 'Kandydat staje 50 cm od materaca, wykonuje zamach rękami i odbija się jednocześnie obiema stopami. Próba powtarzana trzykrotnie — oceniany jest najdłuższy skok mierzony od miejsca odbicia do najbliższego punktu kontaktu z materacem.',
    filmy: {
      m: 'http://strazgraniczna.pl/download/1/9633/skokwdalzmiejscaobunoz.mp4',
      k: 'http://strazgraniczna.pl/download/1/9652/skokwdalzmiejscaobunoz.mp4',
    },
    jednostka: 'centymetry',
    normy: {
      k: [
        { wiek: 'do 30 lat', bdb: '190', db: '175', dst: '160' },
        { wiek: 'od 31 lat', bdb: '180', db: '165', dst: '150' },
      ],
      m: [
        { wiek: 'do 30 lat', bdb: '235', db: '215', dst: '195' },
        { wiek: 'od 31 lat', bdb: '225', db: '205', dst: '185' },
      ],
    },
  },
  {
    nazwa: 'Skrętoskłony w czasie jednej minuty',
    opis: 'Z pozycji leżącej tyłem, dłonie splecione na karku, nogi zgięte oparte o szczebel drabinek. Uniesienie tułowia z jednoczesnym skrętem — prawy łokieć do lewego kolana, powrót, lewy łokieć do prawego kolana. Jeden cykl = wznos + dotknięcie + powrót do leżenia z łopatkami na podłożu.',
    filmy: {
      m: 'http://strazgraniczna.pl/download/1/9634/skretosklonywczasiejednejminuty.mp4',
      k: 'http://strazgraniczna.pl/download/1/9653/skretosklonywczasiejednejminuty.mp4',
    },
    jednostka: 'powtórzenia',
    normy: {
      k: [
        { wiek: 'do 30 lat', bdb: '41', db: '38', dst: '34' },
        { wiek: 'od 31 lat', bdb: '39', db: '36', dst: '32' },
      ],
      m: [
        { wiek: 'do 30 lat', bdb: '43', db: '40', dst: '36' },
        { wiek: 'od 31 lat', bdb: '40', db: '37', dst: '33' },
      ],
    },
  },
  {
    nazwa: 'Skłon w przód',
    opis: 'Kandydat staje wyprostowany, nie zginając nóg w kolanach i nie odrywając stóp, wykonuje ruchem ciągłym skłon w przód do maksymalnej głębokości, którą utrzymuje przez 3 sekundy.',
    filmy: {
      m: 'http://strazgraniczna.pl/download/1/9632/sklonwprzod.mp4',
      k: 'http://strazgraniczna.pl/download/1/9650/sklonwprzod.mp4',
    },
    jednostka: 'opis',
    normy: {
      k: [
        { wiek: 'do 30 lat', bdb: 'Dotknąć głową kolan', db: 'Oprzeć się całymi dłońmi o podłoże', dst: 'Palcami obu rąk dotknąć podłoża' },
        { wiek: 'od 31 lat', bdb: 'Oprzeć się całymi dłońmi o podłoże', db: 'Palcami obu rąk dotknąć podłoża', dst: 'Palcami obu rąk dotknąć palców stóp' },
      ],
      m: [
        { wiek: 'do 30 lat', bdb: 'Oprzeć się całymi dłońmi o podłoże', db: 'Palcami obu rąk dotknąć podłoża', dst: 'Palcami obu rąk dotknąć palców stóp' },
        { wiek: 'od 31 lat', bdb: 'Palcami obu rąk dotknąć podłoża', db: 'Palcami obu rąk dotknąć palców stóp', dst: 'Chwycić oburącz kostki' },
      ],
    },
  },
  {
    nazwa: 'Bieg na dystansie',
    opis: 'Na komendę „Na miejsca" kandydat podchodzi do linii startu, na „Gotów" przyjmuje pozycję startową wykroczną (start wysoki). Na „Start" lub sygnał dźwiękowy rozpoczyna bieg. Czas mierzy się z dokładnością do 1 sekundy. Kobiety biegną 600 m, mężczyźni 1000 m.',
    filmy: {
      m: 'http://strazgraniczna.pl/download/1/9630/biegnadystansie1000m.mp4',
      k: 'http://strazgraniczna.pl/download/1/9649/biegnadystansie600m.mp4',
    },
    jednostka: 'minuty',
    info: 'Niższy wynik = lepszy',
    normy: {
      k: [
        { wiek: 'do 30 lat (600 m)', bdb: '2:35', db: '2:50', dst: '3:00' },
        { wiek: 'od 31 lat (600 m)', bdb: '2:40', db: '2:55', dst: '3:05' },
      ],
      m: [
        { wiek: 'do 30 lat (1000 m)', bdb: '4:10', db: '4:25', dst: '4:40' },
        { wiek: 'od 31 lat (1000 m)', bdb: '4:20', db: '4:35', dst: '4:50' },
      ],
    },
  },
]

export default function SprawnoscPage() {
  const [plec, setPlec] = useState('m') // 'm' | 'k'

  const S = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      fontFamily: "'Georgia', serif",
      color: '#e8e0f0',
      paddingBottom: 60,
    },
    header: {
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    container: { maxWidth: 860, margin: '0 auto', padding: '36px 20px' },
    section: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: '24px 28px',
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 10,
      letterSpacing: 3,
      color: '#f59e0b',
      textTransform: 'uppercase',
      fontFamily: 'monospace',
      marginBottom: 16,
    },
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <Link href="/" style={{ fontSize: 18, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>←</Link>
        <div>
          <div style={{ fontSize: 10, color: '#f59e0b', fontFamily: 'monospace', letterSpacing: 2 }}>STRAŻ GRANICZNA</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Przygotowanie do testów sprawnościowych</div>
        </div>
      </div>

      <div style={S.container}>

        {/* Film YouTube */}
        <div style={{ ...S.section, padding: 0, overflow: 'hidden', borderColor: 'rgba(245,158,11,0.3)' }}>
          <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={S.sectionTitle}>▶ film instruktażowy</div>
            <div style={{ fontSize: 14, color: '#e8e0f0' }}>Przegląd wszystkich ćwiczeń wchodzących w skład testu sprawnościowego SG</div>
          </div>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src="https://www.youtube.com/embed/9_2B88BKxd8"
              title="Test sprawności fizycznej SG"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>

        {/* Zasady */}
        <div style={S.section}>
          <div style={S.sectionTitle}>§ warunki przeprowadzania testu</div>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            {ZASADY.map((z, i) => (
              <li key={i} style={{ fontSize: 13, color: '#c4b5fd', lineHeight: 1.8, marginBottom: 6 }}>{z}</li>
            ))}
          </ol>
        </div>

        {/* Przełącznik płeć */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4, width: 'fit-content' }}>
          {[
            { id: 'm', label: '♂ Mężczyźni' },
            { id: 'k', label: '♀ Kobiety' },
          ].map(p => (
            <button key={p.id} onClick={() => setPlec(p.id)} style={{
              background: plec === p.id ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'transparent',
              color: plec === p.id ? '#fff' : '#8878aa',
              border: 'none', borderRadius: 10,
              padding: '10px 28px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', letterSpacing: 0.5, transition: 'all 0.15s',
            }}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Ćwiczenia */}
        {CWICZENIA.map((cw, idx) => (
          <div key={idx} style={{ ...S.section, borderColor: 'rgba(245,158,11,0.15)' }}>

            {/* Nagłówek ćwiczenia */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 10, color: '#f59e0b', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 6 }}>ĆWICZENIE {idx + 1}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{cw.nazwa}</div>
              </div>
              {/* Link do filmu */}
              <a
                href={plec === 'm' ? cw.filmy.m : cw.filmy.k}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.35)',
                  color: '#f59e0b', borderRadius: 8, padding: '7px 14px',
                  fontSize: 12, fontFamily: 'monospace', letterSpacing: 1,
                  textDecoration: 'none', whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                ▶ film — {plec === 'm' ? 'mężczyźni' : 'kobiety'}
              </a>
            </div>

            {/* Opis */}
            <div style={{ fontSize: 13, color: '#b8aed4', lineHeight: 1.75, marginBottom: 18 }}>{cw.opis}</div>

            {/* Tabela norm */}
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>
              Normy — {cw.jednostka !== 'minuty' && cw.jednostka !== 'sekundy' ? cw.jednostka : `czas (${cw.jednostka})`}
              {cw.info && <span style={{ marginLeft: 10, color: '#f59e0b' }}>↓ {cw.info}</span>}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(245,158,11,0.08)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', color: '#f59e0b', fontFamily: 'monospace', fontSize: 10, letterSpacing: 1, fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>WIEK</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', color: '#4ade80', fontFamily: 'monospace', fontSize: 10, letterSpacing: 1, fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>BDB (5)</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', color: '#60a5fa', fontFamily: 'monospace', fontSize: 10, letterSpacing: 1, fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>DB (4)</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', color: '#f59e0b', fontFamily: 'monospace', fontSize: 10, letterSpacing: 1, fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>DST (3)</th>
                  </tr>
                </thead>
                <tbody>
                  {cw.normy[plec].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 14px', color: '#a78bfa', fontFamily: 'monospace', fontSize: 12 }}>{row.wiek}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', color: '#4ade80', fontWeight: 700 }}>{row.bdb}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', color: '#93c5fd' }}>{row.db}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', color: '#fbbf24' }}>{row.dst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}
