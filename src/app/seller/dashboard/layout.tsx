"use client"; // Thêm dòng này để biến layout thành client component

import Sidebar from '@/app/seller/dashboard/Sidebar';
import Header from '@/app/seller/Header';
import { useState } from 'react';

// Định nghĩa PageType ngay trong layout
export type PageType = 'dashboard' | 'orders' | 'products' | 'analytics' | 'revenue' | 'customers' | 'notifications' | 'settings';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}