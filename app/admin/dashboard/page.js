'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

const EMPTY_QUIZ = { question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: '' }
const EMPTY_MS   = { text: '', key: 'tak' }

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState('quiz') // 'quiz' | 'multiselect'

  // ── Quiz state ───────────────────────────────────────────
  const [questions, setQuestions]       = useState([])
  const [qLoading, setQLoading]         = useState(true)
  const [qSearch, setQSearch]           = useState('')
  const [qModal, setQModal]             = useState(null)
  const [qForm, setQForm]               = useState(EMPTY_QUIZ)
  const [qEditId, setQEditId]           = useState(null)
  const [qSaving, setQSaving]           = useState(false)
  const [qDelConfirm, setQDelConfirm]   = useState(null)
  const [qImporting, setQImporting]     = useState(false)
  const [qImportMsg, setQImportMsg]     = useState('')

  // ── Multiselect state ────────────────────────────────────
  const [msItems, setMsItems]           = useState([])
  const [msLoading, setMsLoading]       = useState(true)
  const [msSearch, setMsSearch]         = useState('')
  const [msModal, setMsModal]           = useState(null)
  const [msForm, setMsForm]             = useState(EMPTY_MS)
  const [msEditId, setMsEditId]         = useState(null)
  const [msSaving, setMsSaving]         = useState(false)
  const [msDelConfirm, setMsDelConfirm] = useState(null)
  const [msImporting, setMsImporting]   = useState(false)
  const [msImportMsg, setMsImportMsg]   = useState('')

  const [toast, setToast] = useState('')

  useEffect(() => {
    const t = sessionStorage.getItem('adminToken')
    if (!t) { router.push('/admin'); return }
    loadQuestions()
    loadMs()
  }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const authHeader = () => ({ 'x-admin-key': sessionStorage.getItem('adminToken') || '' })

  // ════════════════════════════════════════════════════════
  // QUIZ — funkcje
  // ════════════════════════════════════════════════════════

  const loadQuestions = async () => {
    setQLoading(true)
    const { data } = await supabase.from('questions').select('*').order('id')
    setQuestions(data || [])
    setQLoading(false)
  }

  const qOpenAdd  = () => { setQForm(EMPTY_QUIZ); setQEditId(null); setQModal('add') }
  const qOpenEdit = (q) => {
    setQForm({ question: q.question, option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d, correct_answer: q.correct_answer })
    setQEditId(q.id); setQModal('edit')
  }
  const qCloseModal = () => { setQModal(null); setQForm(EMPTY_QUIZ) }

  const qHandleSave = async () => {
    if (!qForm.question || !qForm.option_a || !qForm.option_b || !qForm.option_c || !qForm.option_d || !qForm.correct_answer) {
      alert('Uzupełnij wszystkie pola!'); return
    }
    if (![qForm.option_a, qForm.option_b, qForm.option_c, qForm.option_d].includes(qForm.correct_answer)) {
      alert('Prawidłowa odpowiedź musi być jedną z opcji A-D!'); return
    }
    setQSaving(true)
    const url    = qModal === 'edit' ? `/api/questions/${qEditId}` : '/api/questions'
    const method = qModal === 'edit' ? 'PUT' : 'POST'
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(qForm) })
    const data   = await res.json()
    if (data.error) { alert('Błąd: ' + data.error); setQSaving(false); return }
    await loadQuestions(); qCloseModal(); setQSaving(false)
    showToast(qModal === 'edit' ? '✅ Pytanie zaktualizowane!' : '✅ Pytanie dodane!')
  }

  const qHandleDelete = async (id) => {
    const res  = await fetch(`/api/questions/${id}`, { method: 'DELETE', headers: authHeader() })
    const data = await res.json()
    if (data.error) { alert('Błąd: ' + data.error); return }
    setQDelConfirm(null); await loadQuestions()
    showToast('🗑️ Pytanie usunięte.')
  }

  const qHandleImport = async () => {
    setQImporting(true); setQImportMsg('')
    const res  = await fetch('/api/import', { method: 'POST', headers: authHeader() })
    const data = await res.json()
    if (data.error) setQImportMsg('Błąd: ' + data.error)
    else { setQImportMsg(`✅ Zaimportowano ${data.count} pytań!`); await loadQuestions() }
    setQImporting(false)
  }

  // ════════════════════════════════════════════════════════
  // MULTISELECT — funkcje
  // ════════════════════════════════════════════════════════

  const loadMs = async () => {
    setMsLoading(true)
    const { data } = await supabase.from('multiselect_questions').select('*').order('id')
    setMsItems(data || [])
    setMsLoading(false)
  }

  const msOpenAdd  = () => { setMsForm(EMPTY_MS); setMsEditId(null); setMsModal('add') }
  const msOpenEdit = (q) => { setMsForm({ text: q.text, key: q.key }); setMsEditId(q.id); setMsModal('edit') }
  const msCloseModal = () => { setMsModal(null); setMsForm(EMPTY_MS) }

  const msHandleSave = async () => {
    if (!msForm.text.trim()) { alert('Uzupełnij treść stwierdzenia!'); return }
    setMsSaving(true)
    const url    = msModal === 'edit' ? `/api/multiselect/${msEditId}` : '/api/multiselect'
    const method = msModal === 'edit' ? 'PUT' : 'POST'
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(msForm) })
    const data   = await res.json()
    if (data.error) { alert('Błąd: ' + data.error); setMsSaving(false); return }
    await loadMs(); msCloseModal(); setMsSaving(false)
    showToast(msModal === 'edit' ? '✅ Stwierdzenie zaktualizowane!' : '✅ Stwierdzenie dodane!')
  }

  const msHandleDelete = async (id) => {
    const res  = await fetch(`/api/multiselect/${id}`, { method: 'DELETE', headers: authHeader() })
    const data = await res.json()
    if (data.error) { alert('Błąd: ' + data.error); return }
    setMsDelConfirm(null); await loadMs()
    showToast('🗑️ Stwierdzenie usunięte.')
  }

  const msHandleImport = async () => {
    setMsImporting(true); setMsImportMsg('')
    const res  = await fetch('/api/multiselect-import', { method: 'POST', headers: authHeader() })
    const data = await res.json()
    if (data.error) setMsImportMsg('Błąd: ' + data.error)
    else { setMsImportMsg(`✅ Zaimportowano ${data.count} stwierdzeń!`); await loadMs() }
    setMsImporting(false)
  }

  // ════════════════════════════════════════════════════════
  // Style
  // ════════════════════════════════════════════════════════

  const S = {
    page:  { minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', fontFamily: "'Georgia', serif", color: '#e8e0f0' },
    header:{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
    container: { maxWidth: 1100, margin: '0 auto', padding: '28px 24px' },
    btn: (color) => ({ background: color, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5 }),
    input: { width: '100%', padding: '11px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 14 },
  }

  const qFiltered = questions.filter(q => q.question?.toLowerCase().includes(qSearch.toLowerCase()))
  const msFiltered = msItems.filter(q => q.text?.toLowerCase().includes(msSearch.toLowerCase()))

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════

  return (
    <div style={S.page}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#4ade80', padding: '12px 20px', borderRadius: 12, zIndex: 9999, fontSize: 14, fontWeight: 600 }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#a78bfa', textTransform: 'uppercase', marginBottom: 4 }}>Panel Administratora</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Zarządzanie testami</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={{ ...S.btn('rgba(255,255,255,0.08)'), textDecoration: 'none', display: 'inline-block' }}>← Strona główna</a>
          <button onClick={() => { sessionStorage.removeItem('adminToken'); router.push('/admin') }} style={S.btn('rgba(239,68,68,0.2)')}>Wyloguj</button>
        </div>
      </div>

      <div style={S.container}>

        {/* Zakładki */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4, width: 'fit-content' }}>
          {[
            { id: 'quiz',        label: '📋 Test Wiedzy',          count: questions.length },
            { id: 'multiselect', label: '🧠 Kwestionariusz',       count: msItems.length },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? 'linear-gradient(135deg,#a78bfa,#7c3aed)' : 'transparent',
              color: tab === t.id ? '#fff' : '#8878aa',
              border: 'none', borderRadius: 10,
              padding: '10px 22px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', letterSpacing: 0.5, whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}>
              {t.label}
              <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.7 }}>({t.count})</span>
            </button>
          ))}
        </div>

        {/* ══ TAB: QUIZ ══════════════════════════════════════ */}
        {tab === 'quiz' && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <input placeholder="🔍 Szukaj pytań..." value={qSearch} onChange={e => setQSearch(e.target.value)}
                style={{ ...S.input, width: 280, marginBottom: 0 }} />
              <button onClick={qOpenAdd} style={S.btn('linear-gradient(135deg,#a78bfa,#7c3aed)')}>+ Dodaj pytanie</button>
              <button onClick={qHandleImport} disabled={qImporting} style={S.btn('rgba(167,139,250,0.2)')}>
                {qImporting ? '⏳ Importuję...' : '📥 Import 241 pytań'}
              </button>
              {qImportMsg && <span style={{ fontSize: 13, color: qImportMsg.startsWith('✅') ? '#4ade80' : '#f87171' }}>{qImportMsg}</span>}
            </div>

            {qLoading ? (
              <div style={{ textAlign: 'center', color: '#a78bfa', padding: 60 }}>Ładowanie...</div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 200px 100px', background: 'rgba(167,139,250,0.1)', padding: '12px 20px', fontSize: 11, letterSpacing: 2, color: '#a78bfa', textTransform: 'uppercase', fontWeight: 700 }}>
                  <span>Nr</span><span>Pytanie</span><span>Prawidłowa</span><span style={{ textAlign: 'right' }}>Akcje</span>
                </div>
                {qFiltered.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#8b7cf8', padding: 40 }}>Brak pytań{qSearch ? ' pasujących do wyszukiwania' : ''}.</div>
                )}
                {qFiltered.map(q => (
                  <div key={q.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 200px 100px', padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ fontSize: 13, color: '#6b5fa5' }}>#{q.id}</span>
                    <span style={{ fontSize: 14, color: '#e8e0f0', paddingRight: 20 }}>{q.question}</span>
                    <span style={{ fontSize: 12, color: '#4ade80', paddingRight: 16 }}>{q.correct_answer}</span>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => qOpenEdit(q)} style={{ background: 'rgba(96,165,250,0.2)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Edytuj</button>
                      <button onClick={() => setQDelConfirm(q.id)} style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Usuń</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══ TAB: MULTISELECT ═══════════════════════════════ */}
        {tab === 'multiselect' && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <input placeholder="🔍 Szukaj stwierdzeń..." value={msSearch} onChange={e => setMsSearch(e.target.value)}
                style={{ ...S.input, width: 280, marginBottom: 0 }} />
              <button onClick={msOpenAdd} style={S.btn('linear-gradient(135deg,#3eb489,#2a8060)')}>+ Dodaj stwierdzenie</button>
              <button onClick={msHandleImport} disabled={msImporting} style={S.btn('rgba(62,180,137,0.2)')}>
                {msImporting ? '⏳ Importuję...' : '📥 Import 508 stwierdzeń'}
              </button>
              {msImportMsg && <span style={{ fontSize: 13, color: msImportMsg.startsWith('✅') ? '#4ade80' : '#f87171' }}>{msImportMsg}</span>}
            </div>

            {msLoading ? (
              <div style={{ textAlign: 'center', color: '#3eb489', padding: 60 }}>Ładowanie...</div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px 100px', background: 'rgba(62,180,137,0.1)', padding: '12px 20px', fontSize: 11, letterSpacing: 2, color: '#3eb489', textTransform: 'uppercase', fontWeight: 700 }}>
                  <span>Nr</span><span>Stwierdzenie</span><span>Klucz</span><span style={{ textAlign: 'right' }}>Akcje</span>
                </div>
                {msFiltered.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#3eb489', padding: 40 }}>
                    {msItems.length === 0
                      ? 'Baza pusta — kliknij "Import 508 stwierdzeń" aby załadować dane.'
                      : 'Brak stwierdzeń pasujących do wyszukiwania.'}
                  </div>
                )}
                {msFiltered.map(q => (
                  <div key={q.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px 100px', padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ fontSize: 13, color: '#2a8060' }}>#{q.id}</span>
                    <span style={{ fontSize: 14, color: '#e8e0f0', paddingRight: 20 }}>{q.text}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: q.key === 'tak' ? '#4ade80' : '#f87171', fontFamily: 'monospace', letterSpacing: 1 }}>
                      {q.key?.toUpperCase()}
                    </span>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => msOpenEdit(q)} style={{ background: 'rgba(96,165,250,0.2)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Edytuj</button>
                      <button onClick={() => setMsDelConfirm(q.id)} style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Usuń</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ══ MODAL: QUIZ ADD/EDIT ═══════════════════════════ */}
      {qModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#1e1b3a', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 20, padding: 36, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 24 }}>
              {qModal === 'add' ? '➕ Dodaj pytanie' : '✏️ Edytuj pytanie'}
            </div>

            <label style={{ fontSize: 12, color: '#a78bfa', letterSpacing: 1, textTransform: 'uppercase' }}>Pytanie</label>
            <textarea value={qForm.question} onChange={e => setQForm(f => ({ ...f, question: e.target.value }))} rows={3}
              style={{ ...S.input, resize: 'vertical', fontFamily: 'inherit' }} placeholder="Treść pytania..." />

            {['option_a', 'option_b', 'option_c', 'option_d'].map((key, i) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: '#a78bfa', letterSpacing: 1, textTransform: 'uppercase' }}>Odpowiedź {['A','B','C','D'][i]}</label>
                <input value={qForm[key]} onChange={e => setQForm(f => ({ ...f, [key]: e.target.value }))} style={S.input} placeholder={`Opcja ${['A','B','C','D'][i]}...`} />
              </div>
            ))}

            <label style={{ fontSize: 12, color: '#4ade80', letterSpacing: 1, textTransform: 'uppercase' }}>Prawidłowa odpowiedź</label>
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <div onClick={() => setQForm(f => ({ ...f, _open: !f._open }))}
                style={{ ...S.input, marginBottom: 0, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none', color: qForm.correct_answer ? '#fff' : '#888' }}>
                <span>
                  {qForm.correct_answer
                    ? (() => { const idx = [qForm.option_a, qForm.option_b, qForm.option_c, qForm.option_d].indexOf(qForm.correct_answer); return `${['A','B','C','D'][idx]}: ${qForm.correct_answer}` })()
                    : '-- Wybierz prawidłową odpowiedź --'}
                </span>
                <span style={{ fontSize: 10, color: '#a78bfa' }}>{qForm._open ? '▲' : '▼'}</span>
              </div>
              {qForm._open && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1e1b3a', border: '1px solid rgba(167,139,250,0.4)', borderRadius: 10, zIndex: 200, overflow: 'hidden', marginTop: 4 }}>
                  {[qForm.option_a, qForm.option_b, qForm.option_c, qForm.option_d].filter(Boolean).map((opt, i) => (
                    <div key={i} onClick={() => setQForm(f => ({ ...f, correct_answer: opt, _open: false }))}
                      style={{ padding: '12px 16px', cursor: 'pointer', color: qForm.correct_answer === opt ? '#4ade80' : '#e8e0f0', background: qForm.correct_answer === opt ? 'rgba(34,197,94,0.12)' : 'transparent', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', fontSize: 14 }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(167,139,250,0.15)'}
                      onMouseOut={e => e.currentTarget.style.background = qForm.correct_answer === opt ? 'rgba(34,197,94,0.12)' : 'transparent'}>
                      <span style={{ color: '#a78bfa', fontWeight: 700, marginRight: 8 }}>{['A','B','C','D'][i]}:</span>{opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={qCloseModal} style={S.btn('rgba(255,255,255,0.1)')}>Anuluj</button>
              <button onClick={qHandleSave} disabled={qSaving} style={S.btn('linear-gradient(135deg,#a78bfa,#7c3aed)')}>
                {qSaving ? 'Zapisuję...' : 'Zapisz'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: MULTISELECT ADD/EDIT ═══════════════════ */}
      {msModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#1e1b3a', border: '1px solid rgba(62,180,137,0.3)', borderRadius: 20, padding: 36, width: '100%', maxWidth: 560 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 24 }}>
              {msModal === 'add' ? '➕ Dodaj stwierdzenie' : '✏️ Edytuj stwierdzenie'}
            </div>

            <label style={{ fontSize: 12, color: '#3eb489', letterSpacing: 1, textTransform: 'uppercase' }}>Treść stwierdzenia</label>
            <textarea value={msForm.text} onChange={e => setMsForm(f => ({ ...f, text: e.target.value }))} rows={3}
              style={{ ...S.input, resize: 'vertical', fontFamily: 'inherit', borderColor: 'rgba(62,180,137,0.3)' }} placeholder="Treść stwierdzenia..." />

            <label style={{ fontSize: 12, color: '#3eb489', letterSpacing: 1, textTransform: 'uppercase' }}>Klucz odpowiedzi</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {['tak', 'nie'].map(val => (
                <button key={val} onClick={() => setMsForm(f => ({ ...f, key: val }))} style={{
                  background: msForm.key === val
                    ? val === 'tak' ? 'rgba(62,180,137,0.3)' : 'rgba(239,68,68,0.3)'
                    : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${msForm.key === val ? (val === 'tak' ? '#3eb489' : '#ef4444') : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 10, padding: '14px', cursor: 'pointer',
                  color: msForm.key === val ? '#fff' : '#888',
                  fontSize: 15, fontWeight: 700, fontFamily: 'monospace', letterSpacing: 3,
                }}>
                  {val === 'tak' ? '✓ TAK' : '✗ NIE'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={msCloseModal} style={S.btn('rgba(255,255,255,0.1)')}>Anuluj</button>
              <button onClick={msHandleSave} disabled={msSaving} style={S.btn('linear-gradient(135deg,#3eb489,#2a8060)')}>
                {msSaving ? 'Zapisuję...' : 'Zapisz'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM: QUIZ ══════════════════════════ */}
      {qDelConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e1b3a', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: 36, maxWidth: 380, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🗑️</div>
            <div style={{ fontSize: 16, color: '#fff', marginBottom: 8 }}>Usunąć to pytanie?</div>
            <div style={{ fontSize: 13, color: '#8b7cf8', marginBottom: 28 }}>Tej operacji nie można cofnąć.</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setQDelConfirm(null)} style={S.btn('rgba(255,255,255,0.1)')}>Anuluj</button>
              <button onClick={() => qHandleDelete(qDelConfirm)} style={S.btn('linear-gradient(135deg,#ef4444,#dc2626)')}>Usuń</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM: MULTISELECT ═══════════════════ */}
      {msDelConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e1b3a', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: 36, maxWidth: 380, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🗑️</div>
            <div style={{ fontSize: 16, color: '#fff', marginBottom: 8 }}>Usunąć to stwierdzenie?</div>
            <div style={{ fontSize: 13, color: '#8b7cf8', marginBottom: 28 }}>Tej operacji nie można cofnąć.</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setMsDelConfirm(null)} style={S.btn('rgba(255,255,255,0.1)')}>Anuluj</button>
              <button onClick={() => msHandleDelete(msDelConfirm)} style={S.btn('linear-gradient(135deg,#ef4444,#dc2626)')}>Usuń</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
