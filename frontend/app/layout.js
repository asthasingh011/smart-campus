import './globals.css'

export const metadata = {
  title: 'Smart Campus Resource Allocation',
  description: 'Manage campus resources efficiently',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-campus-bg text-campus-text antialiased" style={{
        '--font-display': "'Syne'",
        '--font-body': "'DM Sans'",
        '--font-mono': "'DM Mono'",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {children}
      </body>
    </html>
  )
}