# 🎓 Test Wiedzy — Instrukcja uruchomienia (krok po kroku)

Aplikacja składa się z:
- **Testu** (strona główna `/`) — publiczna, dostępna dla wszystkich
- **Panelu admina** (`/admin`) — chroniony hasłem, do zarządzania pytaniami

---

## ✅ KROK 1 — Zainstaluj Node.js

1. Wejdź na stronę: **https://nodejs.org**
2. Kliknij duży zielony przycisk **"LTS"** (np. "20.x.x LTS")
3. Pobierz plik `.msi` (Windows) lub `.pkg` (Mac)
4. Uruchom instalator i klikaj **Next / Continue** — wszystko zostaw domyślnie
5. Po instalacji **zrestartuj komputer**

**Jak sprawdzić czy działa?**
Otwórz terminal:
- Windows: naciśnij `Win + R`, wpisz `cmd`, Enter
- Mac: Spotlight → `Terminal`

Wpisz:
```
node --version
```
Powinno pokazać np. `v20.11.0`

---

## ✅ KROK 2 — Wypakuj projekt

1. Wypakuj pobrany plik `quiz-app.zip` w dowolne miejsce, np. na Pulpicie
2. Będziesz miał folder `quiz-app`

---

## ✅ KROK 3 — Załóż konto Supabase (darmowe)

> Supabase to darmowa baza danych w chmurze — tutaj będą przechowywane pytania.

1. Wejdź na **https://supabase.com**
2. Kliknij **"Start your project"** → zaloguj się przez GitHub lub e-mail
3. Kliknij **"New project"**
4. Wypełnij:
   - **Organization**: zostaw domyślnie
   - **Name**: np. `quiz-app`
   - **Database Password**: wymyśl i **zapisz** — będzie potrzebne
   - **Region**: wybierz `Central EU (Frankfurt)`
5. Kliknij **"Create new project"** — poczekaj ~1 minutę

### Utwórz tabelę pytań

1. W menu po lewej kliknij **"SQL Editor"**
2. Kliknij **"New query"**
3. Wklej poniższy kod i kliknij **"Run"** (zielony przycisk):

```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Powinieneś zobaczyć: `Success. No rows returned`

### Wyłącz Row Level Security (RLS)

W tym samym SQL Editor wklej i uruchom:

```sql
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
```

### Pobierz klucze API

1. W menu po lewej kliknij **"Project Settings"** (ikona koła zębatego)
2. Kliknij **"API"**
3. Zapisz sobie dwie wartości:
   - **Project URL** — wygląda tak: `https://abcdefgh.supabase.co`
   - **anon public** (w sekcji "Project API keys") — długi ciąg znaków

---

## ✅ KROK 4 — Skonfiguruj projekt

1. Wejdź do folderu `quiz-app`
2. Znajdź plik `.env.local.example`
3. **Skopiuj** go i nazwij kopię `.env.local` (bez `.example`)
4. Otwórz `.env.local` w Notatniku (klik prawym → Otwórz za pomocą → Notatnik)
5. Uzupełnij:

```
NEXT_PUBLIC_SUPABASE_URL=https://TWOJ_PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TWOJ_ANON_KEY_Z_SUPABASE
ADMIN_PASSWORD=wymysl_swoje_haslo
```

Zastąp wartości swoimi danymi z Supabase. `ADMIN_PASSWORD` to hasło do panelu admina — wymyśl własne.

6. Zapisz plik

---

## ✅ KROK 5 — Uruchom aplikację lokalnie (test)

1. Otwórz terminal (cmd / Terminal)
2. Przejdź do folderu projektu. Np:
   ```
   cd Desktop\quiz-app
   ```
   (Mac: `cd ~/Desktop/quiz-app`)

3. Zainstaluj zależności (tylko raz):
   ```
   npm install
   ```
   Poczekaj ~1-2 minuty.

4. Uruchom aplikację:
   ```
   npm run dev
   ```

5. Otwórz przeglądarkę i wejdź na: **http://localhost:3000**

---

## ✅ KROK 6 — Zaimportuj pytania

1. Wejdź na: **http://localhost:3000/admin**
2. Zaloguj się hasłem które wpisałeś w `.env.local`
3. Kliknij przycisk **"📥 Import 241 pytań"**
4. Poczekaj kilka sekund — pojawi się komunikat `✅ Zaimportowano 241 pytań!`

Od tej chwili pytania są w bazie danych Supabase.

---

## ✅ KROK 7 — Wdróż na Vercel (publiczny dostęp)

> Vercel to darmowy hosting dla aplikacji Next.js.

### Przygotuj kod na GitHub

1. Załóż konto na **https://github.com** jeśli nie masz
2. Kliknij **"New repository"** → nazwa np. `quiz-app` → **"Create repository"**
3. Postępuj zgodnie z instrukcją na GitHub żeby wgrać folder `quiz-app`

Najprostszy sposób przez terminal:
```
cd Desktop\quiz-app
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TWOJA_NAZWA/quiz-app.git
git push -u origin main
```

### Wdróż na Vercel

1. Wejdź na **https://vercel.com**
2. Zaloguj się przez GitHub
3. Kliknij **"Add New Project"**
4. Wybierz repozytorium `quiz-app`
5. Kliknij **"Deploy"**

### Dodaj zmienne środowiskowe na Vercel

1. Po deploy wejdź w ustawienia projektu → **"Environment Variables"**
2. Dodaj trzy zmienne (tak samo jak w `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL` = Twój URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Twój klucz
   - `ADMIN_PASSWORD` = Twoje hasło admina
3. Kliknij **"Redeploy"**

Gotowe! Aplikacja będzie dostępna pod adresem np.: `https://quiz-app-twoja-nazwa.vercel.app`

---

## 📋 Panel admina — co można robić

| Akcja | Opis |
|-------|------|
| **Dodaj pytanie** | Formularz z polami na pytanie, 4 opcje i zaznaczenie prawidłowej |
| **Edytuj pytanie** | Zmień treść pytania lub odpowiedzi |
| **Usuń pytanie** | Z potwierdzeniem — nie można cofnąć |
| **Szukaj** | Filtrowanie listy pytań po treści |
| **Import** | Wgrywa 241 pytań z pliku Excel (usuwa poprzednie!) |

---

## 🆘 Najczęstsze problemy

**`npm install` daje błędy**
→ Sprawdź czy Node.js jest zainstalowany: `node --version`

**Strona pokazuje błąd połączenia z bazą**
→ Sprawdź czy `.env.local` ma poprawne wartości z Supabase

**Nie mogę się zalogować do panelu admina**
→ Sprawdź czy `ADMIN_PASSWORD` w `.env.local` zgadza się z tym co wpisujesz

**Na Vercel błąd po deploy**
→ Sprawdź czy wszystkie 3 zmienne środowiskowe są dodane w Vercel i kliknij Redeploy
