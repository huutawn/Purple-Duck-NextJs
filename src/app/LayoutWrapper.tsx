"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Danh sách các đường dẫn bị loại trừ (full path hoặc prefix)
  const excludedPaths = [
    '/authentication',
    '/accounts',
    '/seller',
    '/admin',
    '/checkouts',
  ];

  // Kiểm tra xem pathname có thuộc excludedPaths không
  const isExcludedPage = pathname ? excludedPaths.some((path) => pathname.startsWith(path)) : false;

  // Nếu là page bị loại trừ, chỉ trả về children mà không dùng layout chung
  if (isExcludedPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}