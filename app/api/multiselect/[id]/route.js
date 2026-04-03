import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function checkAuth(request) {
  return request.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

export async function PUT(request, { params }) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
  const body = await request.json()
  const { data, error } = await supabase.from('multiselect_questions').update(body).eq('id', params.id).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}

export async function DELETE(request, { params }) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
  const { error } = await supabase.from('multiselect_questions').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
