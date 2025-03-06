'use client';

import { NavBar } from '@/components/ui/nav-bar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <NavBar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}