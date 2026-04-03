import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function checkAuth(request) {
  return request.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

export async function GET() {
  const { data, error } = await supabase.from('multiselect_questions').select('*').order('id')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
  const body = await request.json()
  const { data, error } = await supabase.from('multiselect_questions').insert([body]).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}
