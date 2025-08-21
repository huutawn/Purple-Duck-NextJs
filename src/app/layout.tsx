import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LayoutWrapper from './LayoutWrapper' // Import component con

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PurpleDuck - Thương mại điện tử cao cấp',
  description: 'Điểm đến cao cấp của bạn cho các sản phẩm chất lượng và trải nghiệm mua sắm đặc biệt.',
  keywords: 'thương mại điện tử, mua sắm, sản phẩm cao cấp, cửa hàng trực tuyến',
  authors: [{ name: 'Đội ngũ PurpleDuck' }],
  openGraph: {
    title: 'PurpleDuck - Thương mại điện tử cao cấp',
    description: 'Điểm đến cao cấp của bạn cho các sản phẩm chất lượng và trải nghiệm mua sắm đặc biệt.',
    type: 'website',
    locale: 'vi_VN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AppProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}