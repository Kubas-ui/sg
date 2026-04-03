'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function useIsAndroid() {
  const [isAndroid, setIsAndroid] = useState(false)
  useEffect(() => {
    setIsAndroid(/android/i.test(navigator.userAgent))
  }, [])
  return isAndroid
}

export default function QuizPage() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isAndroid = useIsAndroid()

  // Na Androidzie mocniejsze ramki
  const borderQuestion = isAndroid ? '2px solid rgba(255,255,255,0.55)' : '1px solid rgba(255,255,255,0.25)'
  const borderOption   = isAndroid ? '2px solid rgba(255,255,255,0.50)' : '1px solid rgba(255,255,255,0.25)'
  const bgQuestion     = isAndroid ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'
  const bgOption       = isAndroid ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'
  const bgLetterBox    = isAndroid ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.12)'

  const loadQuestions = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
      if (error) throw error
      if (!data || data.length === 0) throw new Error('Brak pytań w bazie danych.')
      const selected = shuffle(data).slice(0, 20)
      const prepared = selected.map(q => ({
        ...q,
        shuffledOptions: shuffle([q.option_a, q.option_b, q.option_c, q.option_d])
      }))
      setQuestions(prepared)
      setAnswers({})
      setSubmitted(false)
      setShowWarning(false)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadQuestions() }, [])

  const handleAnswer = (qIdx, option) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qIdx]: option }))
    setShowWarning(false)
  }

  const handleSubmit = () => {
    const unanswered = questions.filter((_, i) => !answers[i])
    if (unanswered.length > 0) {
      setShowWarning(true)
      const firstIdx = questions.findIndex((_, i) => !answers[i])
      document.getElementById(`q-${firstIdx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const score = submitted ? questions.filter((q, i) => answers[i] === q.correct_answer).length : 0
  const answeredCount = Object.keys(answers).length
  const progress = Math.round((answeredCount / 20) * 100)

  const S = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', fontFamily: "'Georgia', serif", color: '#e8e0f0', paddingBottom: 60 },
    header: { background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '20px 24px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
    container: { maxWidth: 760, margin: '0 auto', padding: '32px 20px' },
  }

  if (loading) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
        <div style={{ color: '#a78bfa', fontSize: 16, letterSpacing: 2 }}>ŁADOWANIE PYTAŃ...</div>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 16, padding: 40, maxWidth: 400 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
        <div style={{ color: '#f87171', marginBottom: 20 }}>{error}</div>
        <button onClick={loadQuestions} style={{ background: 'rgba(167,139,250,0.2)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.4)', padding: '10px 24px', borderRadius: 40, cursor: 'pointer', fontSize: 14 }}>Spróbuj ponownie</button>
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontSize: 18, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', lineHeight: 1, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
          >←</Link>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>PRZYKŁADOWY TEST WIEDZY OGÓLNEJ SG</div>
        </div>
        {!submitted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#a78bfa', marginBottom: 6 }}>{answeredCount}/20 odpowiedzi</div>
              <div style={{ width: 160, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', borderRadius: 3, transition: 'width 0.4s ease' }} />
              </div>
            </div>
            <button
              onClick={() => {
                if (answeredCount > 0 && !confirm('Masz już zaznaczone odpowiedzi. Losować nowe pytania?')) return
                loadQuestions()
              }}
              style={{ background: 'rgba(167,139,250,0.15)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.35)', padding: '8px 16px', borderRadius: 10, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              🔀 Losuj nowe pytania
            </button>
          </div>
        )}
        {submitted && (
          <div style={{ background: score >= 15 ? 'linear-gradient(135deg,#22c55e,#16a34a)' : score >= 10 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#ef4444,#dc2626)', padding: '8px 20px', borderRadius: 40, fontSize: 18, fontWeight: 700, color: '#fff' }}>
            {score}/20
          </div>
        )}
      </div>

      <div style={S.container}>
        {/* Score summary */}
        {submitted && (
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 20, padding: 32, marginBottom: 36, textAlign: 'center' }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#a78bfa', textTransform: 'uppercase', marginBottom: 12 }}>WYNIK KOŃCOWY</div>
            <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, background: score >= 15 ? 'linear-gradient(135deg,#4ade80,#22c55e)' : score >= 10 ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' : 'linear-gradient(135deg,#f87171,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}>{score}/20</div>
            <div style={{ color: '#c4b5fd', fontSize: 16, marginBottom: 24 }}>
              {score === 20 ? 'Perfekcyjny wynik! 🏆' : score >= 15 ? 'Świetny wynik! 🎉' : score >= 10 ? 'Dobry wynik 👍' : score >= 5 ? 'Warto powtórzyć materiał 📚' : 'Nie poddawaj się, spróbuj ponownie 💪'}
            </div>
            <div style={{ fontSize: 13, color: '#8b7cf8', marginBottom: 24 }}>Poprawne: {score} &nbsp;|&nbsp; Błędne: {20 - score}</div>
            <button onClick={loadQuestions} style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 40, fontSize: 14, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', textTransform: 'uppercase' }}>↺ Nowy test</button>
          </div>
        )}

        {/* Warning */}
        {showWarning && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: '#fca5a5' }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span style={{ fontSize: 14 }}>Odpowiedz na wszystkie pytania przed zakończeniem. Brakujące: <strong>{20 - answeredCount}</strong></span>
          </div>
        )}

        {/* Questions */}
        {questions.map((q, qIdx) => {
          const userAnswer = answers[qIdx]
          const isCorrect = submitted && userAnswer === q.correct_answer
          const isWrong = submitted && userAnswer !== q.correct_answer
          const isUnansweredWarning = showWarning && !userAnswer

          const cardBg = submitted
            ? isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'
            : isUnansweredWarning ? 'rgba(239,68,68,0.06)' : bgQuestion

          const cardBorder = submitted
            ? isCorrect ? '2px solid rgba(34,197,94,0.6)' : '2px solid rgba(239,68,68,0.6)'
            : isUnansweredWarning ? '2px solid rgba(239,68,68,0.5)' : borderQuestion

          return (
            <div key={q.id} id={`q-${qIdx}`} style={{ background: cardBg, border: cardBorder, borderRadius: 16, padding: 24, marginBottom: 20, transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
                <div style={{ minWidth: 34, height: 34, borderRadius: '50%', background: submitted ? isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)' : userAnswer ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: submitted ? isCorrect ? '#4ade80' : '#f87171' : userAnswer ? '#c4b5fd' : '#8b7cf8', flexShrink: 0 }}>
                  {submitted ? (isCorrect ? '✓' : '✗') : qIdx + 1}
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: '#e8e0f0', paddingTop: 6 }}>{q.question}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 48 }}>
                {q.shuffledOptions.map((opt, oIdx) => {
                  const isSelected = userAnswer === opt
                  const isCorrectOpt = opt === q.correct_answer
                  const letters = ['A', 'B', 'C', 'D']

                  let bg = bgOption
                  let border = borderOption
                  let textColor = '#d4c8f0'
                  let letterBg = bgLetterBox
                  let letterColor = '#a78bfa'

                  if (!submitted && isSelected) {
                    bg = 'rgba(167,139,250,0.25)'
                    border = isAndroid ? '2px solid rgba(167,139,250,0.9)' : '1px solid rgba(167,139,250,0.7)'
                    textColor = '#fff'
                    letterBg = 'rgba(167,139,250,0.5)'
                    letterColor = '#fff'
                  } else if (submitted && isCorrectOpt) {
                    bg = 'rgba(34,197,94,0.15)'
                    border = isAndroid ? '2px solid rgba(34,197,94,0.8)' : '1px solid rgba(34,197,94,0.6)'
                    textColor = '#4ade80'
                    letterBg = 'rgba(34,197,94,0.35)'
                    letterColor = '#4ade80'
                  } else if (submitted && isSelected && !isCorrectOpt) {
                    bg = 'rgba(239,68,68,0.15)'
                    border = isAndroid ? '2px solid rgba(239,68,68,0.8)' : '1px solid rgba(239,68,68,0.6)'
                    textColor = '#f87171'
                    letterBg = 'rgba(239,68,68,0.35)'
                    letterColor = '#f87171'
                  }

                  return (
                    <div key={oIdx} onClick={() => handleAnswer(qIdx, opt)} style={{ background: bg, border, borderRadius: 10, padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: submitted ? 'default' : 'pointer', transition: 'all 0.2s ease' }}>
                      <div style={{ width: 26, height: 26, borderRadius: 6, background: letterBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: letterColor, flexShrink: 0 }}>{letters[oIdx]}</div>
                      <span style={{ fontSize: 14, color: textColor, lineHeight: 1.4 }}>{opt}</span>
                    </div>
                  )
                })}
              </div>
              {submitted && isWrong && (
                <div style={{ marginTop: 12, paddingLeft: 48, fontSize: 13, color: '#86efac', display: 'flex', gap: 6 }}>
                  <span>✓</span><span>Prawidłowa: <strong>{q.correct_answer}</strong></span>
                </div>
              )}
            </div>
          )
        })}

        {!submitted && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: '#fff', border: 'none', padding: '16px 56px', borderRadius: 50, fontSize: 15, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}>
              Zakończ test
            </button>
          </div>
        )}

        {submitted && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <button onClick={loadQuestions} style={{ background: 'transparent', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.4)', padding: '14px 40px', borderRadius: 50, fontSize: 14, fontWeight: 700, letterSpacing: 2, cursor: 'pointer', textTransform: 'uppercase' }}>↺ Nowy test</button>
          </div>
        )}
      </div>
    </div>
  )
}
