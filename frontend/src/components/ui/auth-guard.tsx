'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/api/auth';

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 認証状態をチェック
    const checkAuth = () => {
      // 認証済みかどうかをチェック
      const authenticated = isAuthenticated();

      // 認証が必要なルートで認証されていない場合はログインページへリダイレクト
      if (!authenticated && !pathname?.includes('/login') && !pathname?.includes('/register')) {
        router.push('/login');
      } else if (authenticated && (pathname === '/login' || pathname === '/register')) {
        // 既に認証済みでログインページにいる場合はダッシュボードへリダイレクト
        router.push('/dashboard/chat');
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  // 認証チェック中はローディング表示
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 認証チェック後、子コンポーネントをレンダリング
  return <>{children}</>;
}