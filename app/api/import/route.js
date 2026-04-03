import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import questions from '../../../data/questions.json'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function checkAuth(request) {
  const key = request.headers.get('x-admin-key')
  return key === process.env.ADMIN_PASSWORD
}

export async function POST(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })

  // Delete existing questions
  await supabase.from('questions').delete().neq('id', 0)

  // Insert all questions in batches of 50
  let inserted = 0
  const batchSize = 50
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize)
    const { error } = await supabase.from('questions').insert(batch)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    inserted += batch.length
  }

  return NextResponse.json({ success: true, count: inserted })
}
