'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const TOTAL = 40

const RANGES = [
  {
    min: 0, max: 8,
    label: 'Efekt "Lustra"',
    sublabel: 'Próba wypadnięcia zbyt dobrze',
    color: '#4a9eff',
    glow: 'rgba(74,158,255,0.2)',
    border: 'rgba(74,158,255,0.4)',
    desc: 'Twój wynik sugeruje, że podczas wypełniania testu zadziałał silny mechanizm obronny. Starasz się zaprezentować jako osoba niemal pozbawiona wad, co w psychologii służb określa się jako wysoką skalę aprobaty społecznej. Paradoksalnie, im bardziej starasz się być „idealny", tym mniej wiarygodny stajesz się dla rekrutera. Na prawdziwym badaniu psycholog może drążyć Twoją szczerość i autentyczność.',
  },
  {
    min: 9, max: 18,
    label: 'Profil zachowawczy',
    sublabel: 'Dystans',
    color: '#3eb489',
    glow: 'rgba(62,180,137,0.2)',
    border: 'rgba(62,180,137,0.4)',
    desc: 'Twoje odpowiedzi wskazują na dużą ostrożność. Wybierasz warianty bezpieczne, ale nie do końca spójne z dynamicznym profilem funkcjonariusza. Jest to sygnał, że być może jeszcze nie do końca czujesz specyfikę pytań w tym formacie. To dobry moment, by popracować nad pewnością siebie i zrozumieniem, że w tej pracy nie szuka się ludzi „przeciętnych", ale stabilnych emocjonalnie.',
  },
  {
    min: 19, max: 28,
    label: 'Wynik optymalny',
    sublabel: 'Równowaga',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.2)',
    border: 'rgba(167,139,250,0.4)',
    desc: 'Uzyskany rezultat świadczy o zdrowym balansie. Nie boisz się przyznać do drobnych słabości (co podnosi Twoją wiarygodność), a jednocześnie Twoje główne cechy charakteru dobrze rokują pod kątem przyszłej służby. To poziom, który zazwyczaj otwiera drogę do dalszych etapów, bo sugeruje osobę stabilną, która zna swoje mocne strony, ale nie próbuje oszukiwać systemu.',
  },
  {
    min: 29, max: 36,
    label: 'Wysoka świadomość profilu',
    sublabel: '',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.2)',
    border: 'rgba(245,158,11,0.4)',
    desc: 'Wykazujesz bardzo wysoką orientację w tym, jakie cechy są pożądane w formacjach mundurowych. Twoje wybory są konkretne i zdecydowane. Musisz jednak uważać, by na rozmowie z psychologiem potrafić uargumentować te postawy własnymi doświadczeniami z życia — sam suchy wynik to tylko połowa sukcesu, liczy się jeszcze spójność Twojej historii z tym, co zaznaczyłeś.',
  },
  {
    min: 37, max: 40,
    label: 'Pułapka "Klucza"',
    sublabel: 'Ryzyko braku autentyczności',
    color: '#e05555',
    glow: 'rgba(224,85,85,0.2)',
    border: 'rgba(224,85,85,0.4)',
    desc: 'Osiągnąłeś wynik niemal identyczny z teoretycznym kluczem. Choć merytorycznie jesteś świetnie przygotowany, pamiętaj o wspomnianym paradoksie: zbyt idealny profil bywa dla psychologa sygnałem ostrzegawczym. Może to sugerować, że znasz testy na pamięć. Warto na tym etapie skupić się na tym, by Twoje odpowiedzi były naturalne — czasem drobna niedoskonałość czyni kandydata znacznie bardziej ludzkim i godnym zaufania.',
  },
]

function getRange(score) {
  return RANGES.find(r => score >= r.min && score <= r.max) || RANGES[RANGES.length - 1]
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MultiselectPage() {
  const [allQuestions, setAllQuestions] = useState([])
  const [questions, setQuestions]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [answers, setAnswers]           = useState({})
  const [current, setCurrent]           = useState(0)
  const [submitted, setSubmitted]       = useState(false)
  const [showResult, setShowResult]     = useState(false)
  const topRef = useRef(null)

  const loadFromApi = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/multiselect')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      if (!data || data.length === 0) throw new Error('Brak stwierdzeń w bazie danych.')
      setAllQuestions(data)
      setQuestions(shuffle(data).slice(0, TOTAL))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadFromApi() }, [])

  const q = questions[current]
  const answered = answers[current] !== undefined
  const answeredCount = Object.keys(answers).length
  const progress = Math.round((answeredCount / TOTAL) * 100)

  const handleAnswer = (val) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [current]: val }))
  }

  const goNext = () => {
    if (current < TOTAL - 1) {
      setCurrent(c => c + 1)
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      setSubmitted(true)
      setShowResult(true)
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const goPrev = () => {
    if (current > 0) {
      setCurrent(c => c - 1)
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleRestart = () => {
    setQuestions(shuffle(allQuestions).slice(0, TOTAL))
    setAnswers({})
    setCurrent(0)
    setSubmitted(false)
    setShowResult(false)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const score = submitted
    ? questions.reduce((sum, q, i) => sum + (answers[i] === q.key ? 1 : 0), 0)
    : 0
  const range = submitted ? getRange(score) : null

  const S = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', fontFamily: "'Georgia', serif", color: '#e8e0f0', paddingBottom: 60 },
    header: { background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
    container: { maxWidth: 680, margin: '0 auto', padding: '36px 20px' },
  }

  // ── Loading ──────────────────────────────────────────────
  if (loading) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
        <div style={{ color: '#3eb489', fontSize: 16, letterSpacing: 2, fontFamily: 'monospace' }}>ŁADOWANIE STWIERDZEŃ...</div>
      </div>
    </div>
  )

  // ── Error ────────────────────────────────────────────────
  if (error) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 16, padding: 40, maxWidth: 400 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
        <div style={{ color: '#f87171', marginBottom: 20 }}>{error}</div>
        <div style={{ fontSize: 12, color: '#8b7cf8', marginBottom: 20 }}>
          Upewnij się że tabela <code>multiselect_questions</code> istnieje w Supabase i zawiera dane (użyj importu w panelu admina).
        </div>
        <button onClick={loadFromApi} style={{ background: 'rgba(62,180,137,0.2)', color: '#3eb489', border: '1px solid rgba(62,180,137,0.4)', padding: '10px 24px', borderRadius: 40, cursor: 'pointer', fontSize: 14 }}>
          Spróbuj ponownie
        </button>
      </div>
    </div>
  )

  // ── Wyniki ───────────────────────────────────────────────
  if (showResult) return (
    <div style={S.page} ref={topRef}>
      <div style={S.header}>
        <Link href="/" style={{ fontSize: 18, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>←</Link>
        <span style={{ fontSize: 13, color: '#3eb489', fontFamily: 'monospace', letterSpacing: 2 }}>KWESTIONARIUSZ — WYNIK</span>
      </div>

      <div style={S.container}>
        <div style={{ background: range.glow, border: `1.5px solid ${range.border}`, borderRadius: 20, padding: '40px 36px', textAlign: 'center', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${range.color}, transparent)` }} />
          <div style={{ fontSize: 11, color: range.color, letterSpacing: 3, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 16 }}>WYNIK KOŃCOWY</div>
          <div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1, color: range.color, marginBottom: 8 }}>{score}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', marginBottom: 24 }}>/ {TOTAL} punktów</div>
          <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ width: `${(score / TOTAL) * 100}%`, height: '100%', background: range.color, borderRadius: 4, transition: 'width 0.8s ease' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{range.label}</div>
          {range.sublabel && (
            <div style={{ fontSize: 12, color: range.color, fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{range.sublabel}</div>
          )}
          <div style={{ fontSize: 14, color: '#b8aed4', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>{range.desc}</div>
        </div>

        {/* Tabela przedziałów */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: 2 }}>TABELA WYNIKÓW</div>
          {RANGES.map((r, i) => {
            const isActive = score >= r.min && score <= r.max
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', borderBottom: i < RANGES.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: isActive ? r.glow : 'transparent', borderLeft: `3px solid ${isActive ? r.color : 'transparent'}` }}>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: r.color, minWidth: 50 }}>{r.min}–{r.max}</div>
                <div style={{ fontSize: 13, color: isActive ? '#fff' : '#8878aa', fontWeight: isActive ? 700 : 400 }}>{r.label}{r.sublabel ? <span style={{ fontSize: 11, color: isActive ? r.color : '#6b5fa5', marginLeft: 8 }}>— {r.sublabel}</span> : ''}</div>
                {isActive && <div style={{ marginLeft: 'auto', fontSize: 10, color: r.color, fontFamily: 'monospace', letterSpacing: 1 }}>← TWÓJ WYNIK</div>}
              </div>
            )
          })}
        </div>

        {/* Statystyki */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Zgodne z kluczem',    val: score,        color: '#3eb489' },
            { label: 'Niezgodne z kluczem', val: TOTAL - score, color: '#e05555' },
            { label: 'Pytań łącznie',        val: TOTAL,        color: '#a78bfa' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color, marginBottom: 6 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleRestart} style={{ background: 'linear-gradient(135deg, #3eb489, #2a8060)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 50, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>
            ↺ Nowy test
          </button>
        </div>
      </div>
    </div>
  )

  // ── Pytanie ──────────────────────────────────────────────
  return (
    <div style={S.page}>
      <div style={S.header} ref={topRef}>
        <Link href="/" style={{ fontSize: 18, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>←</Link>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, color: '#3eb489', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 6 }}>
            STWIERDZENIE {current + 1} / {TOTAL}
          </div>
          <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #3eb489, #4a9eff)', borderRadius: 2, transition: 'width 0.4s ease' }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          {answeredCount} / {TOTAL} udzielonych
        </div>
      </div>

      <div style={S.container}>
        {/* Karta stwierdzenia */}
        <div style={{ background: 'rgba(62,180,137,0.06)', border: '1px solid rgba(62,180,137,0.2)', borderRadius: 16, padding: '32px 28px', marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: '#3eb489', fontFamily: 'monospace', letterSpacing: 3, marginBottom: 18, textTransform: 'uppercase' }}>
            Czy to prawda w stosunku do Ciebie?
          </div>
          <div style={{ fontSize: 18, lineHeight: 1.7, color: '#fff', fontWeight: 500 }}>{q?.text}</div>
        </div>

        {/* TAK / NIE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 36 }}>
          {['tak', 'nie'].map(val => {
            const isSelected = answers[current] === val
            const c = {
              tak: { base: 'rgba(62,180,137,0.15)', sel: 'rgba(62,180,137,0.3)', border: 'rgba(62,180,137,0.6)', text: '#3eb489' },
              nie: { base: 'rgba(224,85,85,0.12)',  sel: 'rgba(224,85,85,0.28)',  border: 'rgba(224,85,85,0.6)',  text: '#e05555' },
            }[val]
            return (
              <button key={val} onClick={() => handleAnswer(val)} style={{
                background: isSelected ? c.sel : c.base,
                border: `2px solid ${isSelected ? c.border : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 14, padding: '22px 16px', cursor: 'pointer',
                color: isSelected ? c.text : 'rgba(255,255,255,0.5)',
                fontSize: 18, fontWeight: 700, fontFamily: 'monospace', letterSpacing: 4,
                textTransform: 'uppercase', transition: 'all 0.15s ease',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}>
                {val === 'tak' ? '✓ TAK' : '✗ NIE'}
              </button>
            )
          })}
        </div>

        {/* Nawigacja */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
          <button onClick={goPrev} disabled={current === 0} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: current === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)', padding: '12px 24px', borderRadius: 50, fontSize: 13, fontFamily: 'monospace', letterSpacing: 1, cursor: current === 0 ? 'default' : 'pointer' }}>
            ← Wstecz
          </button>
          <button onClick={goNext} disabled={!answered} style={{ background: answered ? 'linear-gradient(135deg, #3eb489, #2a8060)' : 'rgba(255,255,255,0.06)', border: 'none', color: answered ? '#fff' : 'rgba(255,255,255,0.2)', padding: '12px 32px', borderRadius: 50, fontSize: 13, fontWeight: 700, fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase', cursor: answered ? 'pointer' : 'default', transition: 'all 0.2s ease' }}>
            {current === TOTAL - 1 ? 'Zakończ →' : 'Dalej →'}
          </button>
        </div>

        {/* Mini-mapa */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 36, justifyContent: 'center' }}>
          {Array.from({ length: TOTAL }, (_, i) => (
            <div key={i} onClick={() => setCurrent(i)} title={`Stwierdzenie ${i + 1}`} style={{
              width: 10, height: 10, borderRadius: '50%', cursor: 'pointer',
              background: i === current ? '#3eb489' : answers[i] !== undefined ? 'rgba(62,180,137,0.45)' : 'rgba(255,255,255,0.1)',
              transition: 'background 0.15s',
              transform: i === current ? 'scale(1.4)' : 'scale(1)',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}
