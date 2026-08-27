import { NextResponse } from 'next/server'

// Proxy wideo: pobiera plik ze źródłowego serwera (http) i podaje go dalej
// przez własną domenę (https), żeby przeglądarka nie blokowała "mixed content"
// przy odtwarzaniu w <video> na telefonie. Dodatkowo wymusza streaming
// z obsługą zakresów (Range), więc telefon nie ściąga całego pliku naraz.

export const runtime = 'nodejs'

// Dozwolone hosty źródłowe — żeby proxy nie stało się otwartą furtką
// do pobierania dowolnych adresów (SSRF).
const ALLOWED_HOSTS = new Set(['strazgraniczna.pl', 'www.strazgraniczna.pl'])

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const src = searchParams.get('src')

  if (!src) {
    return NextResponse.json({ error: 'Brak parametru src' }, { status: 400 })
  }

  let target
  try {
    target = new URL(src)
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowy adres źródłowy' }, { status: 400 })
  }

  if (!ALLOWED_HOSTS.has(target.hostname)) {
    return NextResponse.json({ error: 'Niedozwolone źródło' }, { status: 403 })
  }

  // Serwer źródłowy nie obsługuje https — pobieramy po http po stronie
  // serwera (to nie jest "mixed content", bo dzieje się na backendzie,
  // nie w przeglądarce użytkownika).
  target.protocol = 'http:'

  const range = request.headers.get('range')

  let upstream
  try {
    upstream = await fetch(target.toString(), {
      headers: range ? { Range: range } : {},
      cache: 'no-store',
    })
  } catch (err) {
    return NextResponse.json({ error: 'Nie udało się połączyć ze źródłem filmu' }, { status: 502 })
  }

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json({ error: 'Nie udało się pobrać filmu' }, { status: upstream.status || 502 })
  }

  const headers = new Headers()
  headers.set('Content-Type', upstream.headers.get('content-type') || 'video/mp4')
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Cache-Control', 'public, max-age=86400')

  const contentLength = upstream.headers.get('content-length')
  if (contentLength) headers.set('Content-Length', contentLength)

  const contentRange = upstream.headers.get('content-range')
  if (contentRange) headers.set('Content-Range', contentRange)

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  })
}
