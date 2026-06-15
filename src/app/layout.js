import './globals.css'

export const metadata = {
  title: 'Academic Performance Calculator',
  description: 'Premium University GPA Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  )
}
