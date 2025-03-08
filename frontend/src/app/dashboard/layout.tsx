'use client';

import { NavBar } from '@/components/ui/nav-bar';
import { AuthGuard } from '@/components/ui/auth-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen">
        <NavBar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}