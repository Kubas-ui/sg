import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import questions from '../../../data/multiselect.json'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function checkAuth(request) {
  return request.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

export async function POST(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })

  // Usuń wszystkie istniejące
  const { error: delError } = await supabase.from('multiselect_questions').delete().neq('id', 0)
  if (delError) return NextResponse.json({ error: delError.message }, { status: 500 })

  // Wgraj z JSON — pola: text, key
  const rows = questions.map(q => ({ text: q.text, key: q.key }))
  const { error } = await supabase.from('multiselect_questions').insert(rows)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ count: rows.length })
}
