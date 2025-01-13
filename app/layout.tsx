import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'AeroLuxe - Авиабилеты онлайн',
    template: '%s | AeroLuxe'
  },
  description: 'Бронирование авиабилетов онлайн. Поиск дешевых авиабилетов, акции и спецпредложения.',
  keywords: ['авиабилеты', 'бронирование', 'полеты', 'авиакомпания', 'путешествия'],
  authors: [{ name: 'AeroLuxe' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://aeroluxe.com',
    title: 'AeroLuxe - Авиабилеты онлайн',
    description: 'Бронирование авиабилетов онлайн. Поиск дешевых авиабилетов, акции и спецпредложения.',
    siteName: 'AeroLuxe',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="border-b bg-background">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-2xl font-semibold text-rose-600">
                  AeroLuxe
                </Link>
                <nav className="flex items-center gap-6">
                  <Link href="/book/search" className="text-foreground/80 hover:text-rose-600">
                    Купить билет
                  </Link>
                  <Link href="/board" className="text-foreground/80 hover:text-rose-600">
                    Табло рейсов
                  </Link>
                  <Link href="/profile" className="text-foreground/80 hover:text-rose-600">
                    Профиль
                  </Link>
                  <ThemeToggle />
                </nav>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t bg-background py-8">
            <div className="container mx-auto px-4">
              <div className="text-foreground/80">
                <h3 className="font-semibold mb-2">Справочная служба</h3>
                <p>+375 17 220 25 55</p>
                <p>106 (Белтелеком, МТС, A1, Life)</p>
                <p>ОАО «Авиакомпания «AeroLuxe»</p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

