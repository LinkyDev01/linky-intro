import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google'

import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '700'],
})

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Linky Lounge | 링키라운지',
  description: '링키는 모임이 아니라 밤의 방식이다.',
}

export const viewport: Viewport = {
  themeColor: '#2e1f1a',
  userScalable: false,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} ${notoSerifKR.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
