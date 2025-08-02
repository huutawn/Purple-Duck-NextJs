import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LayoutWrapper from './LayoutWrapper' // Import component con

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PurpleDuck - Premium E-commerce',
  description: 'Your premium destination for quality products and exceptional shopping experience.',
  keywords: 'ecommerce, shopping, premium products, online store',
  authors: [{ name: 'PurpleDuck Team' }],
  openGraph: {
    title: 'PurpleDuck - Premium E-commerce',
    description: 'Your premium destination for quality products and exceptional shopping experience.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}