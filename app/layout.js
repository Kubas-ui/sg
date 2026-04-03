export const metadata = {
  title: 'TEST WIEDZY SG',
  description: 'TEST WIEDZY SG',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  )
}
